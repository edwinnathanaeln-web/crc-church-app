/**
 * generate-icons.js
 * Run once to produce all PWA icon PNGs from an SVG source.
 *
 * Usage:
 *   node scripts/generate-icons.js
 *
 * Requires:  npm install sharp  (one-time dev dependency)
 * Output:    public/icons/*.png
 */

const sharp  = require('sharp');
const path   = require('path');
const fs     = require('fs');

// ── CRC cross SVG (gold on dark) ─────────────────────────
const SOURCE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="#050506"/>

  <!-- Subtle radial glow -->
  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
    <stop offset="0%"   stop-color="#7C3AED" stop-opacity="0.18"/>
    <stop offset="100%" stop-color="#050506" stop-opacity="0"/>
  </radialGradient>
  <rect width="512" height="512" rx="96" fill="url(#glow)"/>

  <!-- Gold cross -->
  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="#D4AF37"/>
    <stop offset="50%"  stop-color="#F5D479"/>
    <stop offset="100%" stop-color="#B8941F"/>
  </linearGradient>

  <!-- Vertical bar -->
  <rect x="224" y="80" width="64" height="352" rx="32" fill="url(#goldGrad)"/>
  <!-- Horizontal bar -->
  <rect x="112" y="176" width="288" height="64" rx="32" fill="url(#goldGrad)"/>
</svg>`;

const SIZES = [72, 96, 128, 144, 152, 180, 192, 384, 512];

const OUT_DIR = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const svgBuffer = Buffer.from(SOURCE_SVG);

  for (const size of SIZES) {
    const filename = size === 180
      ? 'apple-touch-icon.png'
      : `icon-${size}x${size}.png`;

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(OUT_DIR, filename));

    console.log(`✓  ${filename}`);
  }

  // Extra 32×32 favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(OUT_DIR, 'icon-32x32.png'));
  console.log('✓  icon-32x32.png');

  console.log('\nAll icons generated in public/icons/');
})();
