/**
 * One-shot migration: TypeScript (.ts/.tsx) → plain JavaScript (.js/.jsx).
 *
 * Sucrase strips the types while preserving formatting, comments and blank
 * lines — unlike tsc, which reprints the whole file and would produce an
 * unreviewable diff across 100 files.
 *
 * Two things sucrase leaves behind that we clean up afterwards:
 *   1. Blank lines where a multi-line type annotation used to be.
 *   2. `import type` / `export type` statements become empty imports.
 *
 * Usage:
 *   node scripts/ts-to-jsx.mjs --dry     # report only, writes nothing
 *   node scripts/ts-to-jsx.mjs           # convert, delete originals
 */

import { transform } from 'sucrase';
import { readFileSync, writeFileSync, unlinkSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Recursive walk — node:fs globSync needs Node 22 and this runs on 20. */
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts')) acc.push(full);
  }
  return acc;
}

// fileURLToPath, not .pathname — the project path contains spaces, which
// .pathname would hand back percent-encoded.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DRY = process.argv.includes('--dry');

/** Files that are pure type declarations — they have no runtime output. */
const TYPE_ONLY = ['src/types/index.ts', 'src/next-compat/index.d.ts'];

/** Collapse runs of 3+ blank lines left behind by stripped annotations. */
function tidy(code) {
  return code
    // A destructure followed by orphaned blank lines then `)` — the signature
    // type annotation was here.
    .replace(/\n{3,}(\s*)\)/g, '\n$1)')
    // Any other run of 3+ blank lines collapses to one.
    .replace(/\n{4,}/g, '\n\n\n')
    // Imports emptied by removing type-only specifiers.
    .replace(/^import\s*\{\s*\}\s*from\s*['"][^'"]+['"];?\n/gm, '')
    .replace(/^import\s+['"][^'"]+['"];\n(?=import)/gm, (m) => m)
    // Trailing whitespace.
    .replace(/[ \t]+$/gm, '');
}

const files = walk(join(ROOT, 'src')).map((f) => relative(ROOT, f));

let converted = 0;
let skipped = 0;
const failures = [];

for (const rel of files) {
  const abs = join(ROOT, rel);

  if (TYPE_ONLY.includes(rel)) {
    console.log(`  type-only, will delete: ${rel}`);
    skipped++;
    if (!DRY) unlinkSync(abs);
    continue;
  }

  const source = readFileSync(abs, 'utf8');
  const isTsx = rel.endsWith('.tsx');

  let out;
  try {
    out = transform(source, {
      transforms: ['typescript', ...(isTsx ? ['jsx'] : [])],
      jsxRuntime: 'preserve',
      preserveDynamicImport: true,
      disableESTransforms: true,
      filePath: rel,
    }).code;
  } catch (err) {
    failures.push(`${rel}: ${err.message}`);
    continue;
  }

  const target = abs.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js');

  if (!DRY) {
    writeFileSync(target, tidy(out), 'utf8');
    unlinkSync(abs);
  }

  converted++;
  console.log(`  ${rel} → ${relative(ROOT, target)}`);
}

console.log(`\n${DRY ? '[dry run] ' : ''}converted ${converted}, removed ${skipped} type-only`);
if (failures.length) {
  console.error(`\n${failures.length} FAILED:`);
  failures.forEach((f) => console.error('  ' + f));
  process.exit(1);
}
