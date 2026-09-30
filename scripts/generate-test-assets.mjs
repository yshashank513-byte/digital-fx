import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "scripts", "fixtures");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// 1. Small valid PNG (1x1 red pixel)
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
fs.writeFileSync(path.join(dir, "valid-logo.png"), Buffer.from(pngBase64, "base64"));

// 2. Small valid JPG
const jpgBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
fs.writeFileSync(path.join(dir, "valid-logo.jpg"), Buffer.from(jpgBase64, "base64"));

// 3. Small valid SVG
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="#207de9" /><text x="50" y="55" font-size="20" text-anchor="middle" fill="#ffffff">FX</text></svg>`;
fs.writeFileSync(path.join(dir, "valid-logo.svg"), svgContent);

// 4. Invalid file (.txt)
fs.writeFileSync(path.join(dir, "invalid-file.txt"), "This is not an image file.");

// 5. Oversized image (> 2MB, ~2.2MB dummy buffer)
const oversized = Buffer.alloc(2.2 * 1024 * 1024);
// Add fake PNG header so MIME type matches image/png
Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(oversized, 0);
fs.writeFileSync(path.join(dir, "oversized-logo.png"), oversized);

console.log("Test assets generated in scripts/fixtures successfully.");
