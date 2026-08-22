/**
 * Convert supplied artwork in /assets to optimised WebP in the public tree.
 *
 *   node scripts/convert-assets.mjs
 *
 * Drop new JPG/PNG files into /assets and re-run. Existing outputs are
 * overwritten, so this is the single source of truth for these images —
 * edit the source file, re-run, done.
 *
 * Filenames are slugified (spaces, ™ and other punctuation removed) because
 * the originals contain characters that are awkward in URLs.
 */

import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// scripts/ lives inside frontend/, so the repo root is two levels up. The
// script must live here rather than in the top-level scripts/ dir because
// sharp is installed in frontend/node_modules.
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(root, 'assets');
const OUT = join(root, 'frontend', 'public', 'images', 'processors');
const DIAGRAM_SRC = join(root, 'assets', 'diagrams');
const DIAGRAM_OUT = join(root, 'frontend', 'public', 'images', 'diagrams');

/**
 * Explicit mapping rather than a blind glob.
 *
 * Every one of these was opened and visually confirmed to show the product its
 * filename claims — this project has already shipped seven images whose
 * contents did not match their names (docs/18-content-audit.md §8), so the
 * check is part of the process now, not an afterthought.
 */
const MAP = [
  { src: 'Intel i9.png', out: 'intel-core-i9.webp', alt: 'Intel Core i9 12th Gen unlocked retail box' },
  { src: 'Intel i7.png', out: 'intel-core-i7.webp', alt: 'Intel Core i7 processor badge' },
  { src: 'Intel i5.png', out: 'intel-core-i5.webp', alt: 'Intel Core i5 retail box' },
  { src: 'AMD Ryzen™ 9 9950X3D2.jpg', out: 'amd-ryzen-9-9950x3d.webp', alt: 'AMD Ryzen 9 9950X3D retail box with 3D V-Cache branding' },
  { src: 'AMD Ryzen 9 9900X Desktop Processor Zen 5.jpg', out: 'amd-ryzen-9-9900x.webp', alt: 'AMD Ryzen 9 9900X 9000 Series retail box' },
  { src: 'AMD Ryzen 7 9700X.jpg', out: 'amd-ryzen-7-9700x.webp', alt: 'AMD Ryzen 7 9700X 9000 Series retail box' },
];

/*
 * Rendered diagrams. Same pipeline as the product art — they must land in the
 * manifest or SmartImage renders nothing, which is exactly what happened when
 * the processor images were first added by hand.
 */
const DIAGRAMS = [
  {
    src: 'build-exploded.png',
    out: 'build-exploded.webp',
    alt: 'Exploded diagram of a desktop PC showing cabinet, motherboard, memory, cooling, graphics card, storage and power supply laid out in assembly order',
    width: 2000,
  },
];

mkdirSync(OUT, { recursive: true });
mkdirSync(DIAGRAM_OUT, { recursive: true });

/*
 * SmartImage resolves dimensions, alt text and the blur placeholder from this
 * manifest. An image on disk but absent from the manifest renders as nothing —
 * which is exactly what happened when these files were first added by hand.
 */
const MANIFEST = join(root, 'frontend', 'src', 'data', 'generated', 'image-meta.json');
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));

const available = new Set(readdirSync(SRC));
const results = [];
let failed = 0;

for (const entry of MAP) {
  if (!available.has(entry.src)) {
    console.error(`  MISSING  ${entry.src}`);
    failed++;
    continue;
  }

  const from = join(SRC, entry.src);
  const to = join(OUT, entry.out);

  // Cap the long edge at 1200px. These render at ~600px wide at most, so
  // anything larger is bytes the visitor pays for and never sees.
  const pipeline = sharp(from).resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true });

  await pipeline.clone().webp({ quality: 82, effort: 5 }).toFile(to);

  // Read the OUTPUT dimensions — the source may have been larger than the cap.
  const out = await sharp(to).metadata();

  // 20px LQIP, same approach as scripts/fetch-images.mjs.
  const lqip = await sharp(from).resize(20).webp({ quality: 40 }).toBuffer();

  manifest[`/images/processors/${entry.out}`] = {
    width: out.width,
    height: out.height,
    blurDataURL: `data:image/webp;base64,${lqip.toString('base64')}`,
    alt: entry.alt,
  };

  const before = statSync(from).size;
  const after = statSync(to).size;
  results.push({ ...entry, before, after });

  console.log(
    `  ${entry.out.padEnd(28)} ${out.width + '×' + out.height}`.padEnd(52) +
      `${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`
  );
}

// ── Diagrams ───────────────────────────────────────────────────────────────
for (const entry of DIAGRAMS) {
  const from = join(DIAGRAM_SRC, entry.src);
  if (!existsSync(from)) {
    console.log(`  skipped (not rendered yet): ${entry.src}`);
    continue;
  }

  const to = join(DIAGRAM_OUT, entry.out);
  await sharp(from)
    .resize({ width: entry.width, withoutEnlargement: true })
    .webp({ quality: 88, effort: 5 })
    .toFile(to);

  const out = await sharp(to).metadata();
  const lqip = await sharp(from).resize(20).webp({ quality: 40 }).toBuffer();

  manifest[`/images/diagrams/${entry.out}`] = {
    width: out.width,
    height: out.height,
    blurDataURL: `data:image/webp;base64,${lqip.toString('base64')}`,
    alt: entry.alt,
  };

  const before = statSync(from).size;
  const after = statSync(to).size;
  console.log(
    `  ${entry.out.padEnd(28)} ${out.width + '×' + out.height}`.padEnd(52) +
      `${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`
  );
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nmanifest updated → ${Object.keys(manifest).length} entries`);

const saved = results.reduce((s, r) => s + (r.before - r.after), 0);
console.log(`\n${results.length} converted → frontend/public/images/processors/`);
console.log(`saved ${(saved / 1024 / 1024).toFixed(2)} MB`);

if (failed) {
  console.error(`\n${failed} source file(s) missing.`);
  process.exit(1);
}
