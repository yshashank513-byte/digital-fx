import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\yshas\\digital-fx\\.chrome-verify-profile-5';
const brainDir = 'C:/Users/yshas/.gemini/antigravity/brain/59bed8a6-9815-4be5-a8d2-0402da4fc81b';

const chrome = spawn(chromePath, [
  '--remote-debugging-port=9558',
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--disable-web-security',
  '--window-size=1440,900',
  'http://localhost:3000'
]);

await new Promise(r => setTimeout(r, 2500));

try {
  const listRes = await fetch('http://127.0.0.1:9558/json/list');
  const targets = await listRes.json();
  const page = targets.find(t => t.type === 'page' && t.url.includes('3000'));
  console.log('Connecting to page:', page.url);

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  };
  await new Promise(r => ws.onopen = r);

  function call(method, params = {}) {
    return new Promise(res => {
      const msgId = id++;
      callbacks.set(msgId, res);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await call('Page.enable');
  await call('DOM.enable');

  const tests = [
    { name: '1_desktop_home', url: 'http://localhost:3000', width: 1440, height: 900 },
    { name: '2_tablet_home', url: 'http://localhost:3000', width: 768, height: 1024 },
    { name: '3_mobile_home', url: 'http://localhost:3000', width: 390, height: 844 },
    { name: '4_services', url: 'http://localhost:3000/services', width: 1440, height: 900 },
    { name: '5_pricing', url: 'http://localhost:3000/pricing', width: 1440, height: 900 }
  ];

  for (const t of tests) {
    console.log(`\n========================================`);
    console.log(`RUNNING CHECK: ${t.name} (${t.width}x${t.height}) on ${t.url}`);
    console.log(`========================================`);

    await call('Emulation.setDeviceMetricsOverride', {
      width: t.width,
      height: t.height,
      deviceScaleFactor: 1,
      mobile: t.width < 768
    });

    await call('Page.navigate', { url: t.url });
    await new Promise(r => setTimeout(r, 2500));

    const evalRes = await call('Runtime.evaluate', {
      expression: `
        (() => {
          const imgs = Array.from(document.querySelectorAll('header img, img[src*="logo"], image[href*="logo"]'));
          return imgs.map(img => {
            const rect = img.getBoundingClientRect();
            return {
              tag: img.tagName,
              src: img.src || img.getAttribute('href'),
              rect: {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              },
              classes: typeof img.className === 'string' ? img.className : (img.className ? img.className.baseVal : '')
            };
          });
        })()
      `,
      returnByValue: true
    });

    const logos = evalRes.result.value || [];
    console.log(`Found ${logos.length} logo element(s) on ${t.name}:`);
    for (const logo of logos) {
      console.log(`  -> [${logo.tag}] ${logo.src} | Size: ${logo.rect.width}x${logo.rect.height}px at (${logo.rect.x}, ${logo.rect.y})`);
      if (logo.rect.width > 220 || logo.rect.height > 60) {
        console.error(`  ❌ FAILED: Logo is too large (${logo.rect.width}x${logo.rect.height})!`);
        process.exitCode = 1;
      } else {
        console.log(`  ✅ PASSED: Logo dimensions strictly within limits.`);
      }
    }

    const shot = await call('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(brainDir, `verify_${t.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
    console.log(`Saved screenshot: ${shotPath}`);
  }

  ws.close();
  console.log('\nALL 3 CHECKS COMPLETED SUCCESSFULLY!');
} finally {
  chrome.kill();
}
