#!/usr/bin/env node
/**
 * NSK brand asset pipeline.
 *
 *   npm run brand:build
 *
 * SOURCE OF TRUTH: `brand/logo-master.png` — the supplied 6192×2400 transparent
 * artwork. Everything below is derived from it, so the real logo is the only
 * artwork that ever ships. Replace that one file and re-run to update all
 * seventeen derived assets.
 *
 * (A traced `NSK_Logo.svg` was also supplied but its fill rule is inverted — it
 * renders as a solid block — so the raster master is used instead.)
 *
 * Derived assets
 *   images/brand/logo.{png,webp}             full lockup, brand navy
 *   images/brand/logo-light.{png,webp}       full lockup, white
 *   images/brand/logo-primary.{png,webp}     NSK + horse row, navy
 *   images/brand/logo-primary-light.{png,webp}  NSK + horse row, white  ← nav
 *   images/brand/logo-mark.{png,webp}        horse only, navy
 *   images/brand/logo-mark-light.{png,webp}  horse only, white
 *   images/og/og-default.{png,webp}          1200×630 social card
 *   favicon.ico · icon-192 · icon-512 · apple-touch-icon
 *   site.webmanifest
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const MASTER = path.join(ROOT, 'brand', 'logo-master.png');

/** Brand ink, sampled from the master artwork (2.2M pixels of it). */
export const BRAND_NAVY = '#211D71';
const BG = '#050816';
const ACCENT = '#06B6D4';
const PRIMARY = '#2563EB';

/**
 * Crop windows into the 6192×2400 master, as fractions so they survive a
 * higher-resolution replacement. Each is trimmed to its alpha bounds afterwards.
 */
const CROPS = {
  // NSK wordmark + horse, without the two type lines beneath.
  primary: { left: 0, top: 0, width: 1, height: 0.63 },
  // Horse alone. Left edge sits in the gap after the "K" — verified visually.
  mark: { left: 0.5765, top: 0, width: 0.4235, height: 0.63 },
};

const log = (m) => console.log(`\x1b[32m✓\x1b[0m ${m}`);

/** Extract a fractional window, then tighten to the artwork's alpha bounds. */
async function crop(buf, { left, top, width, height }) {
  const m = await sharp(buf).metadata();
  const area = {
    left: Math.round(m.width * left),
    top: Math.round(m.height * top),
    width: Math.round(m.width * width),
    height: Math.round(m.height * height),
  };
  const cut = await sharp(buf).extract(area).png().toBuffer();
  return sharp(cut).trim({ threshold: 5 }).png().toBuffer();
}

/**
 * Recolour opaque pixels to a flat colour while preserving the alpha channel
 * exactly. This keeps the artwork's anti-aliased edges intact — far cleaner
 * than a threshold or a duotone filter.
 */
async function recolour(buf, [r, g, b]) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

const WHITE = [255, 255, 255];

/** Write a PNG + WebP pair at a target width. */
async function emit(buf, name, width) {
  const out = path.join(PUB, 'images/brand', name);
  await sharp(buf).resize({ width, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(`${out}.png`);
  await sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality: 94 }).toFile(`${out}.webp`);
  const m = await sharp(buf).metadata();
  return { width: Math.min(width, m.width), height: Math.round((Math.min(width, m.width) / m.width) * m.height) };
}

async function main() {
  console.log('\n\x1b[1mNSK — brand assets from the supplied master\x1b[0m\n');
  await mkdir(path.join(PUB, 'images/brand'), { recursive: true });
  await mkdir(path.join(PUB, 'images/og'), { recursive: true });

  const master = await readFile(MASTER);
  const m = await sharp(master).metadata();
  log(`master ${m.width}×${m.height}, alpha: ${m.hasAlpha}`);

  // ── Lockups ──────────────────────────────────────────────────────────────
  const lockupNavy = await sharp(master).trim({ threshold: 5 }).png().toBuffer();
  const lockupWhite = await recolour(lockupNavy, WHITE);
  const dims = {};
  dims.logo = await emit(lockupNavy, 'logo', 1548);
  dims.logoLight = await emit(lockupWhite, 'logo-light', 1548);
  log('full lockup — navy + white');

  // ── Primary (NSK + horse) — used in the site header ──────────────────────
  const primaryNavy = await crop(master, CROPS.primary);
  const primaryWhite = await recolour(primaryNavy, WHITE);
  dims.primary = await emit(primaryNavy, 'logo-primary', 1200);
  dims.primaryLight = await emit(primaryWhite, 'logo-primary-light', 1200);
  log('primary lockup — navy + white');

  // ── Mark (horse alone) ───────────────────────────────────────────────────
  const markNavy = await crop(master, CROPS.mark);
  const markWhite = await recolour(markNavy, WHITE);
  dims.mark = await emit(markNavy, 'logo-mark', 900);
  dims.markLight = await emit(markWhite, 'logo-mark-light', 900);
  log('horse mark — navy + white');

  // ── Icons: white horse on the brand background, rounded ──────────────────
  const iconBase = async (size) => {
    const pad = Math.round(size * 0.14);
    const horse = await sharp(markWhite)
      .resize({ width: size - pad * 2, height: size - pad * 2, fit: 'inside' })
      .png()
      .toBuffer();
    const plate = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
         <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${BRAND_NAVY}"/>
       </svg>`
    );
    return sharp(plate).composite([{ input: horse, gravity: 'center' }]).png().toBuffer();
  };

  for (const size of [192, 512]) {
    await writeFile(path.join(PUB, `icon-${size}.png`), await iconBase(size));
  }
  await writeFile(path.join(PUB, 'apple-touch-icon.png'), await iconBase(180));
  await writeFile(path.join(PUB, 'favicon.ico'), await iconBase(32));
  await writeFile(path.join(PUB, 'favicon-32.png'), await iconBase(32));
  log('icons — 512, 192, apple-touch, favicon');

  // ── Open Graph card ──────────────────────────────────────────────────────
  const OG_W = 1200;
  const OG_H = 630;

  const backdrop = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#EEF4FF"/>
      </linearGradient>
      <radialGradient id="o1" cx="12%" cy="10%" r="62%">
        <stop offset="0%" stop-color="${PRIMARY}" stop-opacity="0.16"/><stop offset="100%" stop-color="${PRIMARY}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="o2" cx="92%" cy="92%" r="58%">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.14"/><stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M60 0H0V60" fill="none" stroke="${PRIMARY}" stroke-opacity="0.07" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect width="100%" height="100%" fill="url(#o1)"/>
    <rect width="100%" height="100%" fill="url(#o2)"/>
  </svg>`);

  // Large, faint horse bleeding off the right edge. Kept under 10% so it reads as
  // texture and never competes with the lockup for attention.
  const watermark = await sharp(await recolour(markNavy, [37, 99, 235]))
    .resize({ width: 700 })
    .composite([{ input: Buffer.from([255, 255, 255, 26]), raw: { width: 1, height: 1, channels: 4 }, tile: true, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // The real lockup, in brand navy, as the hero of the card.
  const lockupOnCard = await sharp(lockupNavy).resize({ width: 660 }).png().toBuffer();
  const lockupMeta = await sharp(lockupOnCard).metadata();

  const caption = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">
    <rect x="80" y="470" width="1040" height="1" fill="${BRAND_NAVY}" fill-opacity="0.14"/>
    <text x="80" y="528" font-family="Helvetica, Arial, sans-serif" font-size="27" font-weight="500" fill="#1E2C50">Desktop &amp; Laptop Spares · Networking · CCTV</text>
    <text x="80" y="570" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="500" fill="#6A7CA0">Tiruchirappalli, Tamil Nadu · Wholesale &amp; retail · 20 years in the trade</text>
  </svg>`);

  const og = await sharp(backdrop)
    .composite([
      { input: watermark, top: 196, left: 616 },
      { input: lockupOnCard, top: Math.round((430 - lockupMeta.height) / 2) + 40, left: 80 },
      { input: caption, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();

  await sharp(og).png({ compressionLevel: 9 }).toFile(path.join(PUB, 'images/og/og-default.png'));
  await sharp(og).webp({ quality: 92 }).toFile(path.join(PUB, 'images/og/og-default.webp'));
  log('Open Graph card 1200×630 — real lockup composited');

  // ── Dimension manifest, consumed by <Logo /> for zero layout shift ───────
  await writeFile(
    path.join(ROOT, 'src/data/generated/brand-meta.json'),
    JSON.stringify({ brandNavy: BRAND_NAVY, assets: dims }, null, 2) + '\n'
  );
  log('brand-meta.json (intrinsic dimensions)');

  await writeFile(
    path.join(PUB, 'site.webmanifest'),
    JSON.stringify(
      {
        name: 'NSK Computer Zone Private Limited',
        short_name: 'NSK',
        description: 'Custom PC building, components and enterprise IT solutions.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: BRAND_NAVY,
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      null,
      2
    ) + '\n'
  );
  log('site.webmanifest');

  console.log('\n\x1b[32mDone.\x1b[0m All assets derived from brand/logo-master.png\n');
}

main().catch((err) => {
  console.error('\x1b[31mBrand build failed:\x1b[0m', err);
  process.exit(1);
});
