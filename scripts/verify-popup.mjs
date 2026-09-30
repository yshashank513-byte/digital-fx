import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9225;
const URL = "http://localhost:3000/";

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const tempProfile = path.join(process.cwd(), "scripts", ".edge-verify-profile");
  if (fs.existsSync(tempProfile)) fs.rmSync(tempProfile, { recursive: true, force: true });
  fs.mkdirSync(tempProfile, { recursive: true });

  const proc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempProfile}`,
    "--headless=new",
    "--disable-gpu",
    "--window-size=390,844",
    URL,
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
      await sleep(500);
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
        const list = await res.json();
        const page = list.find((p) => p.type === "page");
        if (page?.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch {}
    }

    if (!wsUrl) {
      console.error("Could not get wsUrl");
      return;
    }

    const ws = new WebSocket(wsUrl);
    await new Promise((resolve) => ws.onopen = resolve);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = id++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === curId) {
            ws.removeEventListener("message", handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send("Page.enable");
    await send("Runtime.enable");

    // Wait for the page and popup timer
    console.log("Waiting for popup to appear...");
    let modalFound = false;
    for (let i = 0; i < 20; i++) {
      await sleep(1000);
      const res = await send("Runtime.evaluate", {
        expression: `Boolean(document.querySelector('[aria-label="Digital FX NFC Tag Coming Soon"]'))`,
        returnByValue: true,
      });
      if (res.result?.value) {
        modalFound = true;
        console.log(`Modal found after ${i + 1} seconds!`);
        break;
      }
    }
    const inspectResult = await send("Runtime.evaluate", {
      expression: `
        (() => {
          const header = document.querySelector('header');
          const modal = document.querySelector('[role="dialog"]');
          const heroForm = document.querySelector('form');
          return {
            modalFound: Boolean(modal),
            modalParent: modal ? modal.parentElement.tagName : null,
            modalZ: modal ? window.getComputedStyle(modal).zIndex : null,
            headerZ: header ? window.getComputedStyle(header).zIndex : null,
            heroFormZ: heroForm ? window.getComputedStyle(heroForm).zIndex : null,
            heroParent: heroForm ? heroForm.parentElement.className : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log("DOM INSPECTION:", inspectResult.result?.value);

    // Capture screenshot
    const screenshot = await send("Page.captureScreenshot", { format: "png" });
    const buffer = Buffer.from(screenshot.data, "base64");
    const outPath = path.join(process.cwd(), "scripts", "popup-preview.png");
    fs.writeFileSync(outPath, buffer);
    console.log("Screenshot saved to:", outPath);

    // Test clicking the Close button
    const clickClose = await send("Runtime.evaluate", {
      expression: `
        (() => {
          const btn = document.querySelector('[aria-label="Close Announcement"]');
          if (btn) { btn.click(); return true; }
          return false;
        })()
      `,
      returnByValue: true,
    });
    console.log("Clicked Close Button:", clickClose.result?.value);

    await sleep(600);

    // Check if floating badge is visible now
    const badgeCheck = await send("Runtime.evaluate", {
      expression: `Boolean(document.querySelector('aside'))`,
      returnByValue: true,
    });
    console.log("Floating badge visible after close:", badgeCheck.result?.value);

    // Capture screenshot with floating badge
    const badgeScreenshot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(process.cwd(), "scripts", "badge-preview.png"), Buffer.from(badgeScreenshot.data, "base64"));
    // Test clicking the floating badge to reopen modal
    const clickBadge = await send("Runtime.evaluate", {
      expression: `
        (() => {
          const btn = document.querySelector('aside button');
          if (btn) { btn.click(); return true; }
          return false;
        })()
      `,
      returnByValue: true,
    });
    console.log("Clicked Floating Badge to Re-open:", clickBadge.result?.value);
    await sleep(500);

    const modalReopenCheck = await send("Runtime.evaluate", {
      expression: `Boolean(document.querySelector('[aria-label="Digital FX NFC Tag Coming Soon"]'))`,
      returnByValue: true,
    });
    console.log("Modal re-opened successfully:", modalReopenCheck.result?.value);

    // Test backdrop click to close
    const clickBackdrop = await send("Runtime.evaluate", {
      expression: `
        (() => {
          const backdrop = document.querySelector('[role="dialog"] > div');
          if (backdrop) { backdrop.click(); return true; }
          return false;
        })()
      `,
      returnByValue: true,
    });
    console.log("Clicked Backdrop to close:", clickBackdrop.result?.value);
    await sleep(500);

    const modalClosedAgainCheck = await send("Runtime.evaluate", {
      expression: `Boolean(document.querySelector('[aria-label="Digital FX NFC Tag Coming Soon"]'))`,
      returnByValue: true,
    });
    console.log("Modal closed after backdrop click:", !modalClosedAgainCheck.result?.value);

    ws.close();
  } finally {
    proc.kill();
    await sleep(500);
    if (fs.existsSync(tempProfile)) {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    }
  }
}

run().catch(console.error);
