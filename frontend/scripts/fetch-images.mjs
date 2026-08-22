#!/usr/bin/env node
/**
 * NSK Computer Zone — image acquisition & optimisation pipeline.
 *
 *   npm run images:fetch            # fetch anything missing (safe, idempotent)
 *   npm run images:fetch -- --force # re-fetch and overwrite everything
 *
 * What it does
 *   1. Downloads each manifest asset from Unsplash at high resolution.
 *   2. Resizes (smart-crop, entropy attention) to the design-system preset.
 *   3. Encodes to .webp — quality 78, effort 6, chroma subsampling on.
 *   4. Generates monochrome brand wordmark placeholders (no trademarked art).
 *   5. Generates the default Open Graph card (webp + png for crawler compat).
 *   6. Emits src/data/generated/image-meta.json  → { path: {w,h,blurDataURL,alt} }
 *      so <SmartImage /> gets real dimensions + blur-up with zero layout shift.
 *   7. Writes public/images/CREDITS.md.
 *
 * Failure is non-fatal: any asset that cannot be downloaded falls back to a
 * generated on-brand gradient tile so the site never renders a broken image.
 */

import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ASSETS, PRESETS } from './image-manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public', 'images');
const GEN_DIR = path.join(ROOT, 'src', 'data', 'generated');

const FORCE = process.argv.includes('--force');
const CONCURRENCY = 6;

// Brand palette (kept in sync with tailwind.config.ts)
const C = {
  bg: '#050816',
  bg2: '#0F172A',
  primary: '#2563EB',
  accent: '#06B6D4',
  light: '#E5E7EB',
};

const exists = (p) => access(p, constants.F_OK).then(() => true).catch(() => false);

function log(status, msg) {
  const tag = { ok: '\x1b[32m✓\x1b[0m', skip: '\x1b[90m•\x1b[0m', warn: '\x1b[33m!\x1b[0m', err: '\x1b[31m✗\x1b[0m' }[status];
  console.log(`${tag} ${msg}`);
}

async function download(url, attempt = 1) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'system-hardware-build-script' },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 600 * attempt));
      return download(url, attempt + 1);
    }
    throw err;
  }
}

/** On-brand fallback tile so a failed download never breaks the UI. */
function fallbackTile(width, height, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${C.bg}"/>
        <stop offset="55%" stop-color="${C.bg2}"/>
        <stop offset="100%" stop-color="#111d3a"/>
      </linearGradient>
      <radialGradient id="glow" cx="30%" cy="25%" r="70%">
        <stop offset="0%" stop-color="${C.primary}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${C.primary}" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="${C.accent}" stroke-opacity="0.09" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="Inter, Helvetica, Arial, sans-serif" font-size="${Math.round(width / 26)}"
      font-weight="600" letter-spacing="2" fill="${C.light}" fill-opacity="0.5">${label}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).webp({ quality: 80 }).toBuffer();
}

/** Encode a source buffer into an optimised, correctly cropped webp. */
async function encode(buf, { width, height }) {
  return sharp(buf)
    .rotate()
    .resize(width, height, { fit: 'cover', position: sharp.strategy.attention, withoutEnlargement: false })
    .webp({ quality: 78, effort: 6, smartSubsample: true })
    .toBuffer();
}

/** 20px LQIP encoded as a base64 webp data URI for blur-up placeholders. */
async function blurDataUri(buf) {
  const tiny = await sharp(buf).resize(20, 20, { fit: 'inside' }).webp({ quality: 28 }).toBuffer();
  return `data:image/webp;base64,${tiny.toString('base64')}`;
}

async function processAsset(asset, meta) {
  const preset = PRESETS[asset.preset];
  const outPath = path.join(IMG_DIR, asset.file);
  const publicPath = `/images/${asset.file}`;

  await mkdir(path.dirname(outPath), { recursive: true });

  if (!FORCE && (await exists(outPath))) {
    // Respect user-supplied replacements — still refresh metadata from the file on disk.
    const existing = await readFile(outPath);
    const { width, height } = await sharp(existing).metadata();
    meta[publicPath] = { width: width ?? preset.width, height: height ?? preset.height, blurDataURL: await blurDataUri(existing), alt: asset.alt };
    log('skip', `${asset.file} (exists)`);
    return;
  }

  let out;
  try {
    const url = `https://images.unsplash.com/photo-${asset.src}?w=${preset.width}&q=85&fm=jpg&fit=max`;
    out = await encode(await download(url), preset);
    log('ok', `${asset.file}  ${preset.width}×${preset.height}  ${(out.length / 1024).toFixed(0)}kb`);
  } catch (err) {
    out = await fallbackTile(preset.width, preset.height, 'SYSTEM HARDWARE');
    log('warn', `${asset.file} — download failed (${err.message}), wrote branded fallback`);
  }

  await writeFile(outPath, out);
  meta[publicPath] = { width: preset.width, height: preset.height, blurDataURL: await blurDataUri(out), alt: asset.alt };
}

/** Neutral monochrome wordmark — placeholder for a licensed logo file. */
async function brandWordmark(name, meta) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const file = `brands/${slug}.webp`;
  const outPath = path.join(IMG_DIR, file);
  const publicPath = `/images/${file}`;
  const [width, height] = [420, 140];

  await mkdir(path.dirname(outPath), { recursive: true });
  meta[publicPath] = { width, height, blurDataURL: null, alt: `${name} — authorised partner brand` };

  if (!FORCE && (await exists(outPath))) return log('skip', `${file} (exists)`);

  const size = name.length > 12 ? 34 : name.length > 8 ? 42 : 52;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="none"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
      font-family="Inter, Helvetica, Arial, sans-serif" font-size="${size}" font-weight="700"
      letter-spacing="1.5" fill="${C.light}">${name.toUpperCase()}</text>
  </svg>`;
  await writeFile(outPath, await sharp(Buffer.from(svg)).webp({ quality: 92, alphaQuality: 100 }).toBuffer());
  log('ok', `${file} (generated wordmark)`);
}

/** Default social card. PNG is emitted alongside webp: several crawlers still reject webp OG. */
async function openGraphCard(meta) {
  const [width, height] = [1200, 630];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${C.bg}"/><stop offset="100%" stop-color="${C.bg2}"/>
      </linearGradient>
      <radialGradient id="o1" cx="18%" cy="18%" r="55%">
        <stop offset="0%" stop-color="${C.primary}" stop-opacity="0.55"/><stop offset="100%" stop-color="${C.primary}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="o2" cx="86%" cy="82%" r="52%">
        <stop offset="0%" stop-color="${C.accent}" stop-opacity="0.45"/><stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="txt" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="${C.accent}"/>
      </linearGradient>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M60 0H0V60" fill="none" stroke="${C.accent}" stroke-opacity="0.08" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect width="100%" height="100%" fill="url(#o1)"/>
    <rect width="100%" height="100%" fill="url(#o2)"/>
    <rect x="96" y="150" width="64" height="6" rx="3" fill="${C.accent}"/>
    <text x="96" y="250" font-family="Inter, Helvetica, Arial, sans-serif" font-size="82" font-weight="800" fill="url(#txt)">NSK Computer Zone</text>
    <text x="96" y="330" font-family="Inter, Helvetica, Arial, sans-serif" font-size="42" font-weight="600" fill="${C.light}" fill-opacity="0.82">A click for many solution</text>
    <text x="96" y="470" font-family="Inter, Helvetica, Arial, sans-serif" font-size="26" font-weight="500" fill="${C.light}" fill-opacity="0.55">Custom PC Building · Workstations · Components · IT Solutions</text>
  </svg>`;

  const png = path.join(IMG_DIR, 'og', 'og-default.png');
  const webp = path.join(IMG_DIR, 'og', 'og-default.webp');
  await mkdir(path.dirname(png), { recursive: true });
  meta['/images/og/og-default.png'] = { width, height, blurDataURL: null, alt: 'NSK Computer Zone — A click for many solution' };

  if (!FORCE && (await exists(png))) return log('skip', 'og/og-default.png (exists)');
  const base = sharp(Buffer.from(svg));
  await writeFile(png, await base.clone().png({ compressionLevel: 9 }).toBuffer());
  await writeFile(webp, await base.clone().webp({ quality: 88 }).toBuffer());
  log('ok', 'og/og-default.png + .webp (generated)');
}

/** Simple promise pool so we do not open 100 sockets at once. */
async function pool(items, worker, limit = CONCURRENCY) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) await worker(queue.shift());
  });
  await Promise.all(runners);
}

async function main() {
  console.log(`\n\x1b[1mNSK Computer Zone — image pipeline\x1b[0m  (${ASSETS.length} photos)${FORCE ? '  [FORCE]' : ''}\n`);

  const meta = {};
  await pool(ASSETS, (a) => processAsset(a, meta));
  await openGraphCard(meta);

  await mkdir(GEN_DIR, { recursive: true });
  await writeFile(
    path.join(GEN_DIR, 'image-meta.json'),
    JSON.stringify(Object.fromEntries(Object.entries(meta).sort(([a], [b]) => a.localeCompare(b))), null, 2) + '\n'
  );

  await writeFile(
    path.join(IMG_DIR, 'CREDITS.md'),
    [
      '# Image credits',
      '',
      'Development placeholders sourced from **Unsplash** under the [Unsplash License]',
      '(https://unsplash.com/license) — free for commercial use, no attribution required.',
      'Credits are listed here as good practice and to make replacement auditable.',
      '',
      'Brand wordmarks in `brands/` are **generated monochrome placeholders**, not official logos.',
      'Third-party logos are trademarks; obtain permission and drop licensed files over these',
      'before going to production.',
      '',
      '## Replacing an image',
      '',
      'Drop your own file at the same path with the same name, then run `npm run images:fetch`',
      '(it never overwrites existing files — it only refreshes dimensions and blur data).',
      'No code changes are required.',
      '',
      '| File | Source |',
      '| --- | --- |',
      ...ASSETS.map((a) => `| \`${a.file}\` | https://unsplash.com/photos/${a.src} |`),
      '',
    ].join('\n')
  );

  console.log(`\n\x1b[32mDone.\x1b[0m ${Object.keys(meta).length} assets registered in src/data/generated/image-meta.json\n`);
}

main().catch((err) => {
  console.error('\x1b[31mImage pipeline failed:\x1b[0m', err);
  process.exit(1);
});
