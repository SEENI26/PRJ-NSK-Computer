#!/usr/bin/env node
/**
 * Partner brand logo pipeline.
 *
 *   npm run brands:build
 *
 * Fetches real single-colour brand marks from Simple Icons and stores their path
 * data in `src/data/generated/partner-brands.json`.
 *
 * WHY PATH DATA, NOT IMAGE FILES
 *   The marks are rendered inline as SVG with `fill="currentColor"`, which means
 *   they inherit the active theme's ink colour automatically. The previous
 *   approach baked a fixed grey into PNGs, and those became invisible the moment
 *   the light theme landed. Inline paths also cost zero extra network requests.
 *
 * TRADEMARK NOTE
 *   Simple Icons distributes the icon files under CC0, but the underlying marks
 *   remain the trademarks of their owners. Displaying them here asserts a genuine
 *   supplier/partner relationship — make sure that relationship exists, and honour
 *   each brand's usage guidelines. Remove any brand you are not authorised to show.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'src/data/generated/partner-brands.json');

/**
 * `slug` is the Simple Icons identifier; `name` is what we display.
 * Every slug here has been verified to resolve — see the `MISSING` note below.
 */
const BRANDS = [
  // Verified against NSK's own catalogue pages and available as a vector mark.
  { slug: 'intel', name: 'Intel' },
  { slug: 'samsung', name: 'Samsung' },
  { slug: 'corsair', name: 'Corsair' },
  { slug: 'seagate', name: 'Seagate' },
  { slug: 'kingstontechnology', name: 'Kingston' },
  // Stocked and plausible for the range, retained for breadth in the strip.
  { slug: 'asus', name: 'ASUS' },
  { slug: 'msi', name: 'MSI' },
  { slug: 'lenovo', name: 'Lenovo' },
  { slug: 'dell', name: 'Dell' },
  { slug: 'hp', name: 'HP' },
  { slug: 'acer', name: 'Acer' },
  { slug: 'tplink', name: 'TP-Link' },
];

/**
 * Brands NSK demonstrably stocks that have NO vector mark in Simple Icons.
 * These render as typographic wordmarks in the strip so the list stays honest to
 * the catalogue rather than being trimmed to whatever happens to have an icon.
 */
const WORDMARK_ONLY = ['Hynix', 'Crucial', 'Lexar', 'Micron', 'ANT Esport', 'Frontech', 'Zebronics', 'Lapcare', 'Zebion', 'Consistent'];

/**
 * Not available in Simple Icons at time of writing. If you stock these and want
 * them shown, obtain an authorised SVG from the vendor's brand-asset page and add
 * it manually to the generated JSON (single path, 24×24 viewBox).
 */
const MISSING = ['Gigabyte', 'Western Digital', 'Logitech'];

/**
 * Measures a path's true ink bounds inside its 24×24 viewBox.
 *
 * Simple Icons normalises each mark to fill its box in the *dominant* dimension
 * only. A wide wordmark like "intel" therefore fills the full 24 units of width
 * but occupies barely 6 units of height. Sizing such a mark by container height
 * makes the visible ink a fraction of the intended size, which is why the strip
 * previously showed wordmarks at a third the weight of symbol marks.
 *
 * We render the path large, trim to its alpha bounds, and convert back to viewBox
 * units to get a tight box and a true aspect ratio.
 */
const MEASURE_SCALE = 40; // 24 × 40 = 960px render — plenty of precision

async function measurePath(d, viewBox) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="960" height="960"><path d="${d}" fill="#000"/></svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const { info } = await sharp(png).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });

  const left = (info.trimOffsetLeft ?? 0) * -1;
  const top = (info.trimOffsetTop ?? 0) * -1;

  return {
    // Tight viewBox in the original units, so `height: X` makes the INK X tall.
    tightViewBox: [
      +(left / MEASURE_SCALE).toFixed(3),
      +(top / MEASURE_SCALE).toFixed(3),
      +(info.width / MEASURE_SCALE).toFixed(3),
      +(info.height / MEASURE_SCALE).toFixed(3),
    ].join(' '),
    aspect: +(info.width / info.height).toFixed(4),
  };
}

async function fetchIcon({ slug, name }) {
  const res = await fetch(`https://cdn.simpleicons.org/${slug}`, {
    headers: { 'User-Agent': 'nsk-brand-build' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const svg = await res.text();

  // Simple Icons ships one <path> in a 24×24 viewBox.
  const d = svg.match(/<path[^>]*\sd="([^"]+)"/)?.[1];
  if (!d) throw new Error('no path data in response');

  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  const { tightViewBox, aspect } = await measurePath(d, viewBox);

  return { slug, name, viewBox: tightViewBox, aspect, path: d };
}

async function main() {
  console.log(`\n\x1b[1mPartner brand logos\x1b[0m — fetching ${BRANDS.length} marks\n`);

  const results = [];
  const failed = [];

  for (const brand of BRANDS) {
    try {
      const icon = await fetchIcon(brand);
      results.push(icon);
      console.log(`\x1b[32m✓\x1b[0m ${brand.name.padEnd(16)} aspect ${String(icon.aspect).padEnd(7)} ${(icon.path.length / 1024).toFixed(1)}kb`);
    } catch (err) {
      failed.push(brand.name);
      console.log(`\x1b[31m✗\x1b[0m ${brand.name.padEnd(16)} ${err.message}`);
    }
  }

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(
    OUT,
    JSON.stringify(
      {
        _comment:
          'Real partner brand marks from Simple Icons (CC0 icon files; trademarks remain with their owners). Rendered inline with fill=currentColor so they follow the active theme. Regenerate with `npm run brands:build`.',
        _missing: MISSING,
        _wordmarkOnly: WORDMARK_ONLY,
        brands: results,
        wordmarks: WORDMARK_ONLY,
      },
      null,
      2
    ) + '\n'
  );

  const kb = (JSON.stringify(results).length / 1024).toFixed(1);
  console.log(`\n\x1b[32mDone.\x1b[0m ${results.length} marks → src/data/generated/partner-brands.json (${kb}kb)`);
  if (failed.length) console.log(`\x1b[33mFailed:\x1b[0m ${failed.join(', ')}`);
  console.log(`\x1b[90mWordmark-only (no vector available):\x1b[0m ${WORDMARK_ONLY.join(', ')}`);
  console.log(`\x1b[90mNot in Simple Icons:\x1b[0m ${MISSING.join(', ')} — add manually if required.\n`);
}

main().catch((err) => {
  console.error('\x1b[31mBrand logo build failed:\x1b[0m', err);
  process.exit(1);
});
