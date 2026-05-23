// One-shot: render CBR brand mark to PNG at 192 and 512.
// Run: node scripts/make-icons.mjs
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const svg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0B0E13"/>
  <g font-family="Georgia, 'Times New Roman', serif" fill="#F7F6F2" text-anchor="middle">
    <text x="256" y="270" font-size="200" font-weight="600" letter-spacing="-8">CBR</text>
    <text x="256" y="360" font-size="58" font-weight="400" fill="#C76B3A" letter-spacing="14">LABS</text>
  </g>
  <circle cx="256" cy="430" r="6" fill="#C76B3A"/>
</svg>`;

await mkdir("public", { recursive: true });
for (const size of [192, 512]) {
  const buf = Buffer.from(svg(size));
  await sharp(buf).resize(size, size).png().toFile(`public/icon-${size}.png`);
  console.log(`✓ public/icon-${size}.png`);
}
// Also write apple-touch-icon (180x180 is iOS standard)
await sharp(Buffer.from(svg(180))).resize(180, 180).png().toFile("public/apple-touch-icon.png");
console.log("✓ public/apple-touch-icon.png");
// And a favicon.ico-ish 32px
await sharp(Buffer.from(svg(32))).resize(32, 32).png().toFile("public/favicon-32.png");
console.log("✓ public/favicon-32.png");
