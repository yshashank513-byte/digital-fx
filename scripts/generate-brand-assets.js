const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Load the original SVG from public/logo.svg and clean it
let rawSvg = fs.readFileSync('public/logo.svg', 'utf8');

// Strip metadata and c2pa namespace
rawSvg = rawSvg.replace(/<metadata>[\s\S]*?<\/metadata>/gi, '');
rawSvg = rawSvg.replace(/\s*xmlns:c2pa="[^"]*"/g, '');

// Set optimized tight viewBox (tight bounds around content: x:198, y:118, w:1776, h:490)
rawSvg = rawSvg.replace(/viewBox="[^"]*"/, 'viewBox="198 118 1776 490"');
rawSvg = rawSvg.replace(/width="[^"]*"/, 'width="1776"');
rawSvg = rawSvg.replace(/height="[^"]*"/, 'height="490"');

// Clean master SVG
const masterSvg = rawSvg.trim();
fs.writeFileSync('public/logo.svg', masterSvg);
console.log('Saved tight public/logo.svg');

// 2. Create public/logo-white.svg for dark backgrounds
let whiteSvg = masterSvg.replace(/fill="#2b333d"/g, 'fill="#ffffff"');
fs.writeFileSync('public/logo-white.svg', whiteSvg);
console.log('Saved tight public/logo-white.svg');

// 3. Create icon.svg - The iconic blue FX squircle badge
const s = 1.06246;
const tx = (256 - 1719.2 * s).toFixed(2);
const ty = (256 - 298.5 * s).toFixed(2);

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<defs>
  <linearGradient id="box-icon" x1="0" y1="0" x2="1" y2="0.6">
    <stop offset="0" stop-color="#248cf6"/>
    <stop offset="1" stop-color="#0a4ec9"/>
  </linearGradient>
  <linearGradient id="xo-icon" gradientUnits="userSpaceOnUse" x1="1795.3" y1="276.0" x2="1875.3" y2="406.0">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="1" stop-color="#80b8ff" stop-opacity="0.75"/>
  </linearGradient>
  <clipPath id="xc-icon">
    <path d="M1705.3 196.0L1758.6 196.0L1874.5 401.0L1821.2 401.0ZM1821.2 196.0L1874.5 196.0L1758.6 401.0L1705.3 401.0Z"/>
  </clipPath>
</defs>
<rect width="512" height="512" rx="108" fill="url(#box-icon)"/>
<g transform="translate(${tx}, ${ty}) scale(${s})">
  <path d="M1563.9 196.0L1695.1 196.0L1695.1 239.1L1611.0 239.1L1611.0 278.0L1678.7 278.0L1678.7 319.0L1611.0 319.0L1611.0 401.0L1563.9 401.0Z" fill="#ffffff"/>
  <path d="M1705.3 196.0L1758.6 196.0L1874.5 401.0L1821.2 401.0ZM1821.2 196.0L1874.5 196.0L1758.6 401.0L1705.3 401.0Z" fill="#ffffff"/>
  <rect x="1705.3" y="196.0" width="174.25" height="205" fill="url(#xo-icon)" clip-path="url(#xc-icon)"/>
</g>
</svg>`;

fs.writeFileSync('public/icon.svg', iconSvg);
console.log('Saved public/icon.svg');

async function renderAssets() {
  // 4. Render logo.png (high resolution transparent full logo)
  await sharp(Buffer.from(masterSvg), { density: 300 })
    .resize(1776, 490)
    .png()
    .toFile('public/logo.png');
  console.log('Generated public/logo.png (1776x490)');

  // 5. Render logo-white.png
  await sharp(Buffer.from(whiteSvg), { density: 300 })
    .resize(1776, 490)
    .png()
    .toFile('public/logo-white.png');
  console.log('Generated public/logo-white.png (1776x490)');

  // 6. Render icon.png
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile('public/icon.png');
  console.log('Generated public/icon.png (512x512)');

  fs.copyFileSync('public/icon.png', 'app/icon.png');
  console.log('Copied to app/icon.png');

  // 7. Render apple touch icons (180x180) and android chrome icons
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile('public/apple-icon.png');
  fs.copyFileSync('public/apple-icon.png', 'public/apple-touch-icon.png');
  fs.copyFileSync('public/apple-icon.png', 'app/apple-icon.png');
  console.log('Generated apple icons');

  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toFile('public/android-chrome-192x192.png');
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile('public/android-chrome-512x512.png');
  console.log('Generated android-chrome icons');

  // 8. Render favicon sizes
  const sizes = [16, 32, 48, 96];
  for (const sz of sizes) {
    await sharp(Buffer.from(iconSvg))
      .resize(sz, sz)
      .png()
      .toFile(`public/favicon-${sz}x${sz}.png`);
  }
  console.log('Generated favicon png sizes');

  // 9. Generate favicon.ico (32x32 PNG inside ico container or 32x32 png format recognized by browsers)
  const icoBuf = await sharp(Buffer.from(iconSvg)).resize(32, 32).png().toBuffer();
  fs.writeFileSync('public/favicon.ico', icoBuf);
  fs.writeFileSync('app/favicon.ico', icoBuf);
  console.log('Generated public/favicon.ico and app/favicon.ico');
}

renderAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
