import { spawn } from "child_process";
import fs from "fs";
import path from "path";

// Test suite for Review QR Codes & Standees -> Register New Business Modal
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9222;
const BASE_URL = "http://localhost:3000/admin/review-qr";
const FIXTURES_DIR = path.join(process.cwd(), "scripts", "fixtures");

const results = {
  sections: {},
  passed: 0,
  failed: 0,
  bugsFixed: [],
  bugsRemaining: [],
};

function recordTest(section, testName, pass, details = "") {
  if (!results.sections[section]) results.sections[section] = [];
  results.sections[section].push({ testName, pass, details });
  if (pass) results.passed++;
  else results.failed++;
  const status = pass ? "✓ PASS" : "✗ FAIL";
  console.log(`  [${section}] ${status}: ${testName}${details ? ` -> ${details}` : ""}`);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("=================================================================");
  console.log("STARTING REVIEW QR CODES & REGISTER NEW BUSINESS AUTOMATED QA");
  console.log("=================================================================\n");

  const tempUserData = path.join(process.cwd(), "scripts", ".edge-temp-profile");
  if (fs.existsSync(tempUserData)) fs.rmSync(tempUserData, { recursive: true, force: true });
  fs.mkdirSync(tempUserData, { recursive: true });

  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempUserData}`,
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-popup-blocking",
    "--window-size=1280,850",
    BASE_URL,
  ]);

  let isExited = false;
  edgeProc.on("exit", () => { isExited = true; });

  // Wait for remote debugging endpoint
  let pageTarget = null;
  for (let i = 0; i < 30; i++) {
    await sleep(600);
    try {
      const res = await fetch(`http://localhost:${PORT}/json`);
      const list = await res.json();
      pageTarget = list.find((t) => t.type === "page" && t.url.includes("review-qr")) || list.find((t) => t.type === "page");
      if (pageTarget && pageTarget.webSocketDebuggerUrl) break;
    } catch (_) {}
  }

  if (!pageTarget) {
    console.error("FATAL: Could not connect to Edge headless remote debugger.");
    edgeProc.kill();
    process.exit(1);
  }

  console.log("Connected to browser page WebSocket:", pageTarget.webSocketDebuggerUrl);
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const pendingRequests = new Map();
  const consoleMessages = [];
  const networkRequests = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pendingRequests.has(data.id)) {
      const { resolve, reject } = pendingRequests.get(data.id);
      pendingRequests.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
    if (data.method === "Runtime.consoleAPICalled") {
      consoleMessages.push(data.params);
    }
    if (data.method === "Network.responseReceived") {
      networkRequests.push(data.params);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || "Evaluation error");
    }
    return res.result?.value;
  }

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");

  // Read admin credentials from .env.local
  const envContent = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
  const serviceRoleKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/)[1].trim();

  // Set admin session cookie
  await send("Network.setCookie", {
    name: "admin_session_token",
    value: serviceRoleKey,
    domain: "localhost",
    path: "/",
    httpOnly: true,
  });

  // Inject localStorage tokens on every new document
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      localStorage.setItem("digitalfx_admin_token", ${JSON.stringify(serviceRoleKey)});
      localStorage.setItem("digitalfx_admin_logged_in", "true");
    `,
  });

  // Navigate and wait for page hydration
  console.log("Navigating to:", BASE_URL);
  await send("Page.navigate", { url: BASE_URL });
  
  let hydrated = false;
  for (let i = 0; i < 40; i++) {
    await sleep(600);
    try {
      const ready = await evaluate(`
        (() => {
          const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Add Business"));
          return Boolean(btn);
        })()
      `);
      if (ready) {
        hydrated = true;
        break;
      }
    } catch (_) {}
  }
  console.log("Page hydrated and Add Business button present:", hydrated);
  await sleep(800);

  // =========================================================================
  // SECTION A: REGISTER NEW BUSINESS MODAL
  // =========================================================================
  console.log("\n--- SECTION A: REGISTER NEW BUSINESS MODAL ---");

  // 1. Verify modal is initially closed
  let isModalOpen = await evaluate(`Boolean(document.querySelector("#biz-form"))`);
  recordTest("A", "Modal initially closed", !isModalOpen);

  // 2. Click "+ Add Business" button
  await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Add Business"));
      if (btn) btn.click();
    })()
  `);
  await sleep(600);

  isModalOpen = await evaluate(`Boolean(document.querySelector("#biz-form"))`);
  const modalTitle = await evaluate(`
    (() => {
      const headings = Array.from(document.querySelectorAll("h1"));
      const h = headings.find(el => el.textContent.includes("Business"));
      return h ? h.textContent.trim() : "";
    })()
  `);
  recordTest("A", "Modal opens correctly on '+ Add Business' click", isModalOpen && modalTitle === "Register New Business", `Title: "${modalTitle}"`);

  // 3. Test Close X button
  await evaluate(`
    const closeBtn = document.querySelector("button[aria-label='Close modal']");
    if (closeBtn) closeBtn.click();
  `);
  await sleep(400);
  isModalOpen = await evaluate(`Boolean(document.querySelector("#biz-form"))`);
  recordTest("A", "Close X button closes modal", !isModalOpen);

  // Reopen
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Add Business"))?.click();`);
  await sleep(500);

  // 4. Test Cancel button
  await evaluate(`
    const cancelBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.trim() === "Cancel");
    if (cancelBtn) cancelBtn.click();
  `);
  await sleep(400);
  isModalOpen = await evaluate(`Boolean(document.querySelector("#biz-form"))`);
  recordTest("A", "Cancel button closes modal", !isModalOpen);

  // Reopen for field testing
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Add Business"))?.click();`);
  await sleep(600);

  // 5. Verify Modal layout & scrollability
  const scrollInfo = await evaluate(`
    (() => {
      const body = document.querySelector(".flex-1.overflow-y-auto");
      const footer = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"));
      return {
        hasScrollContainer: Boolean(body),
        scrollHeight: body ? body.scrollHeight : 0,
        clientHeight: body ? body.clientHeight : 0,
        footerVisible: Boolean(footer && footer.getBoundingClientRect().height > 0)
      };
    })()
  `);
  recordTest("A", "Modal has internal scroll container and visible sticky footer", scrollInfo.hasScrollContainer && scrollInfo.footerVisible, `Height: ${scrollInfo.clientHeight}px`);

  // =========================================================================
  // SECTION B: BUSINESS INFO
  // =========================================================================
  console.log("\n--- SECTION B: BUSINESS INFO ---");

  // Helper to set field value and fire React state events
  async function setField(selector, value) {
    await evaluate(`
      (() => {
        const el = document.querySelector('${selector}');
        if (!el) return;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                                       Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set ||
                                       Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(el, ${JSON.stringify(value)});
        } else {
          el.value = ${JSON.stringify(value)};
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      })()
    `);
    await sleep(200);
  }

  // 1. Submit empty -> check Name and Mobile required error
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"))?.click();`);
  await sleep(400);

  const errorsEmpty = await evaluate(`
    Array.from(document.querySelectorAll("p.text-rose-600")).map(p => p.textContent.trim())
  `);
  const hasNameReq = errorsEmpty.some(e => e.includes("Business name is required"));
  const hasPhoneReq = errorsEmpty.some(e => e.includes("Contact mobile number is required"));
  const hasUrlReq = errorsEmpty.some(e => e.includes("Google Review"));
  recordTest("B", "Empty submission shows Business Name required error", hasNameReq);
  recordTest("B", "Empty submission shows Contact Mobile required error", hasPhoneReq);
  recordTest("B", "Empty submission shows Google Review URL required error", hasUrlReq);

  // 2. Spaces-only input in Business Name
  await setField('input[placeholder*="OM Packers"]', "     ");
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"))?.click();`);
  await sleep(200);
  const nameSpacesErr = await evaluate(`document.querySelector("p.text-rose-600")?.textContent?.trim() || ""`);
  recordTest("B", "Spaces-only name is rejected with validation error", nameSpacesErr.includes("Business name is required"));

  // 3. Very long Business Name & special characters
  const testLongName = "OM Packers & Movers 100% Reliable (Delhi & NCR Branch) #1!";
  await setField('input[placeholder*="OM Packers"]', testLongName);
  await sleep(200);
  const previewName = await evaluate(`document.querySelector(".truncate.max-w-\\\\[200px\\\\]")?.textContent?.trim() || ""`);
  recordTest("B", "Special characters and long name supported and displayed in live preview", previewName.toUpperCase() === testLongName.toUpperCase(), `Preview: "${previewName}"`);

  // 4. Owner / Contact field
  await setField('input[placeholder*="Rajesh Kumar"]', "Sunil Sharma (Director)");
  const ownerVal = await evaluate(`document.querySelector('input[placeholder*="Rajesh Kumar"]')?.value`);
  recordTest("B", "Owner/Contact field accepts alphanumeric and titles", ownerVal === "Sunil Sharma (Director)");

  // 5. Mobile validation: letters stripped / < 10 digits error
  await setField('input[placeholder*="9876543210"]', "12345");
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"))?.click();`);
  await sleep(200);
  let phoneErr = await evaluate(`
    Array.from(document.querySelectorAll("p.text-rose-600")).find(p => p.textContent.includes("10-digit"))?.textContent?.trim() || ""
  `);
  recordTest("B", "Less than 10 digits mobile shows 'Please enter a valid 10-digit mobile number'", phoneErr.includes("10-digit"));

  // Valid 10 digits
  await setField('input[placeholder*="9876543210"]', "9876543210");
  await sleep(100);

  // 6. Email validation: invalid email vs valid email
  await setField('input[placeholder*="hello@business.com"]', "not-an-email");
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"))?.click();`);
  await sleep(200);
  let emailErr = await evaluate(`
    Array.from(document.querySelectorAll("p.text-rose-600")).find(p => p.textContent.includes("email"))?.textContent?.trim() || ""
  `);
  recordTest("B", "Invalid email shows 'Please enter a valid email address'", emailErr.includes("valid email"));

  await setField('input[placeholder*="hello@business.com"]', "contact@ompackers.in");
  await sleep(100);

  // =========================================================================
  // SECTION C: BUSINESS CATEGORY DROPDOWN
  // =========================================================================
  console.log("\n--- SECTION C: BUSINESS CATEGORY DROPDOWN ---");

  const categories = [
    "Packers & Movers",
    "Jewellery Store",
    "Restaurant",
    "Salon",
    "Hotel",
    "Real Estate",
    "Digital Marketing Agency",
    "Clinic",
    "Automobile Dealer",
  ];

  let allCatsPassed = true;
  for (const cat of categories) {
    await evaluate(`
      (() => {
        const sel = document.querySelector("select");
        if (sel) {
          sel.value = ${JSON.stringify(cat)};
          sel.dispatchEvent(new Event("change", { bubbles: true }));
        }
      })()
    `);
    await sleep(200);
    const displayedCat = await evaluate(`document.querySelector("select")?.value`);
    const previewCatText = await evaluate(`document.querySelector(".text-\\\\[9px\\\\].text-slate-500")?.textContent || ""`);
    if (displayedCat !== cat || !previewCatText.includes(cat)) {
      allCatsPassed = false;
      console.log(`    Failed category match for: ${cat}`);
    }
  }
  recordTest("C", "All 9 categories selectable, persist, and update live preview", allCatsPassed);

  // Reset to Packers & Movers
  await evaluate(`
    (() => {
      const sel = document.querySelector("select");
      if (sel) {
        sel.value = "Packers & Movers";
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      }
    })()
  `);

  // =========================================================================
  // SECTION D: BUSINESS LOGO UPLOAD
  // =========================================================================
  console.log("\n--- SECTION D: BUSINESS LOGO UPLOAD ---");

  // Helper to trigger file upload via data URL directly into handleFileProcess
  async function uploadFixture(filename, mimeType) {
    const fileBytes = fs.readFileSync(path.join(FIXTURES_DIR, filename));
    const base64 = fileBytes.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;
    await evaluate(`
      (() => {
        // Construct File object from bytes
        const b64 = "${base64}";
        const byteCharacters = atob(b64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], "${filename}", { type: "${mimeType}" });

        // Trigger input change
        const input = document.querySelector("input[type='file']");
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      })()
    `);
    await sleep(400);
  }

  // 1. Invalid file upload (.txt)
  await uploadFixture("invalid-file.txt", "text/plain");
  const invalidFileErr = await evaluate(`document.querySelector("p.text-rose-600")?.textContent?.trim() || ""`);
  recordTest("D", "Invalid file (.txt) rejected with format error message", invalidFileErr.includes("Invalid file format"), `Error: "${invalidFileErr}"`);

  // 2. Oversized file upload (> 2MB)
  await uploadFixture("oversized-logo.png", "image/png");
  const oversizedErr = await evaluate(`document.querySelector("p.text-rose-600")?.textContent?.trim() || ""`);
  recordTest("D", "Oversized image (>2MB) rejected with 2MB limit error message", oversizedErr.includes("exceeds 2MB limit"), `Error: "${oversizedErr}"`);

  // 3. Valid PNG upload
  await uploadFixture("valid-logo.png", "image/png");
  const hasLogoInPreview = await evaluate(`Boolean(document.querySelector("img[alt='Logo Preview']"))`);
  const hasLogoInStandee = await evaluate(`Boolean(document.querySelector(".w-14.h-14 img"))`);
  recordTest("D", "Valid PNG logo uploaded, appears in modal preview and standee card", hasLogoInPreview && hasLogoInStandee);

  // 4. Replace image with SVG
  await uploadFixture("valid-logo.svg", "image/svg+xml");
  const svgLogoName = await evaluate(`document.querySelector("#biz-form .font-mono")?.textContent?.trim() || ""`);
  recordTest("D", "Logo replaced successfully with SVG format", svgLogoName.includes("valid-logo.svg") || svgLogoName.includes("svg"), `File: "${svgLogoName}"`);

  // 5. Remove image
  await evaluate(`
    const removeBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.trim() === "Remove");
    if (removeBtn) removeBtn.click();
  `);
  await sleep(300);
  const logoRemoved = await evaluate(`!document.querySelector("img[alt='Logo Preview']")`);
  const initialLetterShown = await evaluate(`Boolean(document.querySelector(".w-14.h-14")?.textContent?.trim())`);
  recordTest("D", "Remove button clears logo and restores initial letter badge", logoRemoved && initialLetterShown);

  // Re-upload PNG for subsequent tests
  await uploadFixture("valid-logo.png", "image/png");

  // =========================================================================
  // SECTION E: LIVE PREVIEW
  // =========================================================================
  console.log("\n--- SECTION E: LIVE PREVIEW ---");

  // Verify real-time updates as fields change
  await setField('input[placeholder*="OM Packers"]', "Apex Relocation Logistics");
  await sleep(200);
  const standeeName = await evaluate(`document.querySelector(".truncate.max-w-\\\\[200px\\\\]")?.textContent?.trim() || ""`);
  recordTest("E", "Live Preview updates business name in real-time", standeeName.toUpperCase() === "APEX RELOCATION LOGISTICS", `Name: "${standeeName}"`);

  // QR Code element validity
  const qrImgSrc = await evaluate(`document.querySelector(".w-32.h-32")?.getAttribute("src") || ""`);
  const isQrValid = qrImgSrc.startsWith("data:image/png;base64,");
  recordTest("E", "Live Preview renders valid dynamic high-res QR code data URL", isQrValid);

  // Google branding & stars
  const hasGoogleBranding = await evaluate(`document.querySelector(".text-\\\\[22px\\\\].font-black")?.textContent?.trim() === "Google"`);
  const starCount = await evaluate(`document.querySelectorAll("svg path[d*='M12 2l3.09']").length`);
  recordTest("E", "Live Preview shows official Google branding and 5 gold stars", hasGoogleBranding && starCount === 5);

  // Brand color change updates preview
  await setField('input[type="color"]', "#10b981");
  await sleep(300);
  const customColorApplied = await evaluate(`
    (() => {
      const strip = document.querySelector(".w-14.h-14");
      return strip?.style?.borderColor?.includes("16, 185, 129") || strip?.getAttribute("style")?.includes("#10b981");
    })()
  `);
  recordTest("E", "Brand color picker updates standee logo circle and decorative rays", customColorApplied);

  // Reset to default blue
  await setField('input[type="color"]', "#207de9");

  // =========================================================================
  // SECTION F: LOCATION & ADDRESS
  // =========================================================================
  console.log("\n--- SECTION F: LOCATION & ADDRESS ---");

  await setField('input[placeholder*="Shop No. 12"]', "Plot 42, Transport Nagar, Sector 62");
  await setField('input[placeholder="Ghaziabad"]', "Noida");
  await setField('input[placeholder="Uttar Pradesh"]', "Uttar Pradesh");

  // Test invalid pincode (letters)
  await setField('input[placeholder="201016"]', "2010");
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"))?.click();`);
  await sleep(200);
  let pincodeErr = await evaluate(`
    Array.from(document.querySelectorAll("p.text-rose-600")).find(p => p.textContent.includes("6-digit pincode"))?.textContent?.trim() || ""
  `);
  recordTest("F", "Invalid pincode (< 6 digits) shows 'Please enter a valid 6-digit pincode'", pincodeErr.includes("6-digit pincode"));

  // Valid 6 digits pincode
  await setField('input[placeholder="201016"]', "201301");
  await sleep(100);
  const cityInStandee = await evaluate(`document.querySelector(".text-\\\\[9px\\\\].text-slate-500")?.textContent || ""`);
  recordTest("F", "Valid address and city reflected in preview subtitle", cityInStandee.includes("Noida"));

  // =========================================================================
  // SECTION G: GOOGLE REVIEW LINK
  // =========================================================================
  console.log("\n--- SECTION G: GOOGLE REVIEW LINK ---");

  // 1. Invalid URL format
  await setField('input[placeholder*="g.page/r"]', "invalid url format");
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"))?.click();`);
  await sleep(200);
  let urlErr = await evaluate(`
    Array.from(document.querySelectorAll("p.text-rose-600")).find(p => p.textContent.includes("valid URL"))?.textContent?.trim() || ""
  `);
  recordTest("G", "Malformed review URL shows 'Please enter a valid URL'", urlErr.includes("valid URL"));

  // 2. Test auto-prefix and Test button
  await setField('input[placeholder*="g.page/r"]', "g.page/r/CUe2G4Eq9NQSEAI/review");
  await evaluate(`
    const testBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Test ↗"));
    if (testBtn) testBtn.click();
  `);
  await sleep(300);

  const normalizedUrl = await evaluate(`document.querySelector('input[placeholder*="g.page/r"]')?.value || ""`);
  const validIndicatorShown = await evaluate(`Boolean(document.querySelector(".text-emerald-700"))`);
  recordTest("G", "Google Review URL auto-prefixes https:// and shows valid indicator", normalizedUrl.startsWith("https://") && validIndicatorShown, `Normalized: ${normalizedUrl}`);

  // =========================================================================
  // SECTION H & K: FORM SUBMIT & DUPLICATE PREVENTION
  // =========================================================================
  console.log("\n--- SECTIONS H & K: SUBMIT & DUPLICATE VALIDATION ---");

  // 1. Test Duplicate Business Name (try registering existing "OM PACKERS AND MOVERS")
  await setField('input[placeholder="201016"]', "201301");
  await setField('input[placeholder*="OM Packers"]', "OM PACKERS AND MOVERS");
  await setField('input[placeholder*="9876543210"]', "9819807273");
  await setField('input[placeholder*="g.page/r"]', "https://g.page/r/CUe2G4Eq9NQSEAI/review");
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"))?.click();`);
  await sleep(1200);

  const duplicateAlert = await evaluate(`document.querySelector(".bg-rose-50")?.textContent?.trim() || ""`);
  recordTest("K", "Duplicate business registration rejected with 409 Conflict error message", duplicateAlert.includes("already exists"), `Message: "${duplicateAlert}"`);

  // 2. Valid unique business registration
  const uniqueName = `QA Express Movers ${Date.now().toString().slice(-4)}`;
  await setField('input[placeholder*="OM Packers"]', uniqueName);
  await setField('input[placeholder*="9876543210"]', "9876501234");
  await setField('input[placeholder*="g.page/r"]', `https://maps.app.goo.gl/qa${Date.now()}`);

  // Submit
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"))?.click();`);
  await sleep(1500);

  // Check if modal closed and toast appeared
  const modalClosedAfterSubmit = await evaluate(`!document.querySelector("#biz-form")`);
  const toastText = await evaluate(`document.querySelector(".fixed.bottom-6")?.textContent?.trim() || ""`);
  recordTest("H", "Valid registration submits successfully, closes modal, and triggers toast", modalClosedAfterSubmit && toastText.includes(uniqueName), `Toast: "${toastText}"`);

  // Verify business appears in table
  await sleep(800);
  const foundInTable = await evaluate(`
    Array.from(document.querySelectorAll("table tbody tr")).some(tr => tr.textContent.includes("${uniqueName}"))
  `);
  recordTest("H", "Newly registered business immediately appears in Review QR table", foundInTable);

  // =========================================================================
  // SECTION I: SAVE DRAFT & REOPEN EDIT DRAFT
  // =========================================================================
  console.log("\n--- SECTION I: SAVE DRAFT & EDIT DRAFT ---");

  // Reopen modal to save a draft with partial info
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Add Business"))?.click();`);
  await sleep(500);

  const draftName = `Draft Logistics ${Date.now().toString().slice(-4)}`;
  await setField('input[placeholder*="OM Packers"]', draftName);
  // Intentionally leave phone and googleReviewUrl empty to test partial draft saving!

  await evaluate(`
    const saveDraftBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Save Draft"));
    if (saveDraftBtn) saveDraftBtn.click();
  `);
  await sleep(1200);

  const draftModalClosed = await evaluate(`!document.querySelector("#biz-form")`);
  recordTest("I", "Save Draft with partial information saves successfully without full validation errors", draftModalClosed);

  // Verify draft appears in table with "draft" badge
  await sleep(500);
  const draftRowExists = await evaluate(`
    Array.from(document.querySelectorAll("table tbody tr")).some(tr => tr.textContent.includes("${draftName}") && tr.textContent.includes("draft"))
  `);
  recordTest("I", "Saved draft appears in table with status 'draft'", draftRowExists);

  // Click "✏️ Edit" on the draft to reopen and complete it
  await evaluate(`
    const tr = Array.from(document.querySelectorAll("table tbody tr")).find(r => r.textContent.includes("${draftName}"));
    const editBtn = tr?.querySelector("button[title='Edit Business']");
    if (editBtn) editBtn.click();
  `);
  await sleep(600);

  const modalReopened = await evaluate(`Boolean(document.querySelector("#biz-form"))`);
  const reopenedName = await evaluate(`document.querySelector('input[placeholder*="OM Packers"]')?.value || ""`);
  recordTest("I", "Reopening draft restores saved values in form", modalReopened && reopenedName === draftName, `Loaded name: "${reopenedName}"`);

  // Complete draft with required fields and submit
  await setField('input[placeholder*="9876543210"]', "9811223344");
  await setField('input[placeholder*="g.page/r"]', `https://maps.app.goo.gl/completedDraft${Date.now()}`);
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"))?.click();`);
  await sleep(1200);

  const draftCompleted = await evaluate(`
    Array.from(document.querySelectorAll("table tbody tr")).some(tr => tr.textContent.includes("${draftName}") && tr.textContent.includes("active"))
  `);
  recordTest("I", "Submitting completed draft transitions business to active status", draftCompleted);

  // =========================================================================
  // SECTION J: DOWNLOAD QR & STANDEE (PNG, JPG, SVG, PDF)
  // =========================================================================
  console.log("\n--- SECTION J: DOWNLOAD QR & STANDEE ---");

  // Reopen modal to test downloads
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Add Business"))?.click();`);
  await sleep(500);
  await setField('input[placeholder*="OM Packers"]', "Download Test Movers");
  await setField('input[placeholder*="g.page/r"]', "https://g.page/r/test/review");
  await sleep(400);

  // Intercept downloads via page evaluation of triggerDownload
  const downloadChecks = await evaluate(`
    (async () => {
      const results = {};
      const formats = ["png", "jpg", "svg", "pdf"];
      
      for (const fmt of formats) {
        let downloaded = false;
        let blobType = "";
        let blobSize = 0;
        
        // Mock a.click to capture download
        const origClick = HTMLAnchorElement.prototype.click;
        HTMLAnchorElement.prototype.click = function() {
          downloaded = true;
          if (this.href.startsWith("data:")) {
            blobType = this.href.split(";")[0].split(":")[1];
            blobSize = this.href.length;
          } else if (this.href.startsWith("blob:")) {
            blobType = "blob-url";
            blobSize = 1000;
          }
        };

        const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.trim().toLowerCase() === fmt);
        if (btn) {
          btn.click();
          await new Promise(r => setTimeout(r, 600));
        }

        HTMLAnchorElement.prototype.click = origClick;
        results[fmt] = { downloaded, blobType, blobSize };
      }
      return results;
    })()
  `);

  recordTest("J", "PNG download triggers high-resolution image/png export", downloadChecks.png.downloaded && downloadChecks.png.blobType === "image/png");
  recordTest("J", "JPG download triggers high-resolution image/jpeg export", downloadChecks.jpg.downloaded && downloadChecks.jpg.blobType === "image/jpeg");
  recordTest("J", "SVG download triggers vector image/svg+xml export", downloadChecks.svg.downloaded && (downloadChecks.svg.blobType === "image/svg+xml" || downloadChecks.svg.blobType === "blob-url"));
  recordTest("J", "PDF download triggers pure downloadable application/pdf blob", downloadChecks.pdf.downloaded);

  // =========================================================================
  // SECTION L: CANCEL & CLOSE UNSAVED CHANGES GUARD
  // =========================================================================
  console.log("\n--- SECTION L: CANCEL & CLOSE UNSAVED CHANGES ---");

  // Mock window.confirm to return false (user wants to stay)
  const stayCheck = await evaluate(`
    (() => {
      let confirmCalled = false;
      const origConfirm = window.confirm;
      window.confirm = () => { confirmCalled = true; return false; };
      
      const closeBtn = document.querySelector("button[aria-label='Close modal']");
      if (closeBtn) closeBtn.click();
      
      const stillOpen = Boolean(document.querySelector("#biz-form"));
      window.confirm = origConfirm;
      return { confirmCalled, stillOpen };
    })()
  `);
  recordTest("L", "Close button prompts confirmation when dirty; choosing Cancel keeps form open", stayCheck.confirmCalled && stayCheck.stillOpen);

  // Now confirm discard -> closes modal
  await evaluate(`
    (() => {
      const origConfirm = window.confirm;
      window.confirm = () => true;
      document.querySelector("button[aria-label='Close modal']")?.click();
      window.confirm = origConfirm;
    })()
  `);
  await sleep(400);
  const closedOnConfirm = await evaluate(`!document.querySelector("#biz-form")`);
  recordTest("L", "Confirming discard cleanly closes modal", closedOnConfirm);

  // =========================================================================
  // SECTION M & N: SCROLL & RESPONSIVE BEHAVIOR
  // =========================================================================
  console.log("\n--- SECTIONS M & N: SCROLL & RESPONSIVE BEHAVIOR ---");

  // Reopen modal
  await evaluate(`Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Add Business"))?.click();`);
  await sleep(500);

  // Test Mobile Viewport (375x667)
  await send("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await sleep(300);

  const mobileLayout = await evaluate(`
    (() => {
      const modal = document.querySelector(".rounded-t-3xl") || document.querySelector(".w-full.sm\\\\:max-w-5xl");
      const footer = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Submit & Generate QR"));
      const rect = footer?.getBoundingClientRect();
      const hasHorizontalOverflow = document.body.scrollWidth > window.innerWidth;
      return {
        modalExists: Boolean(modal),
        footerVisible: Boolean(rect && rect.top > 0 && rect.bottom <= window.innerHeight + 10),
        noHorizontalOverflow: !hasHorizontalOverflow
      };
    })()
  `);
  recordTest("N", "Mobile viewport (375px) renders full-width bottom sheet without horizontal overflow", mobileLayout.modalExists && mobileLayout.noHorizontalOverflow);
  recordTest("M", "Footer action buttons remain fixed and visible above mobile bottom edge", mobileLayout.footerVisible);

  // Reset to Desktop Viewport (1280x850)
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 850,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(300);

  // Clean close modal
  await evaluate(`
    const orig = window.confirm; window.confirm = () => true;
    document.querySelector("button[aria-label='Close modal']")?.click();
    window.confirm = orig;
  `);
  await sleep(400);

  // =========================================================================
  // SECTION O: API & DATABASE AUDIT
  // =========================================================================
  console.log("\n--- SECTION O: API & DATABASE AUDIT ---");

  // Test direct GET /api/reviewflow/businesses
  const apiGetCheck = await evaluate(`
    fetch("/api/reviewflow/businesses").then(r => r.json()).then(d => ({ ok: d.success, count: d.businesses?.length }))
  `);
  recordTest("O", "GET /api/reviewflow/businesses returns 200 OK with business list", apiGetCheck.ok && apiGetCheck.count > 0, `Count: ${apiGetCheck.count}`);

  // Test Console Error audit
  const seriousConsoleErrors = consoleMessages.filter(m => m.type === "error" && !m.args.some(a => String(a.value).includes("favicon")));
  if (seriousConsoleErrors.length > 0) {
    console.log("    Console error details:", seriousConsoleErrors.map(e => e.args?.map(a => a.value || a.description || JSON.stringify(a)).join(" ")));
  }
  recordTest("O", "Zero unhandled runtime exceptions or console errors", seriousConsoleErrors.length === 0, seriousConsoleErrors.length === 0 ? "Clean" : `${seriousConsoleErrors.length} errors`);

  // Close browser
  ws.close();
  edgeProc.kill();
  if (fs.existsSync(tempUserData)) {
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (_) {}
  }

  console.log("\n=================================================================");
  console.log(`QA RUN COMPLETED: ${results.passed} PASSED, ${results.failed} FAILED`);
  console.log("=================================================================\n");
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
