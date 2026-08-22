/**
 * Content guard — run before publishing.
 *
 *   node scripts/check-content.mjs
 *
 * Fails when the catalogue contains anything that must not reach a customer.
 * This exists because the site has repeatedly shipped placeholder content that
 * looked finished: a hardcoded "4.5/5 · 1K Reviews" on every product page, an
 * "Authorised Distribution" row nobody had verified, and product photos whose
 * filenames did not match their contents.
 *
 * Add a check here whenever a class of mistake is found, not just the instance.
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'frontend', 'src');

const { products } = await import(join(src, 'data', 'products.js'));
const { categories } = await import(join(src, 'data', 'categories.js'));

const problems = [];
const warn = [];

/* ── 1. Unconfirmed specifications ─────────────────────────────────────────
 * A ⚠ CONFIRM marker means a value was taken from a third-party listing and
 * has not been checked against the part actually sourced. Publishing one
 * states a specification the business cannot stand behind.
 */
for (const p of products) {
  const hits = JSON.stringify(p).match(/CONFIRM/g);
  if (hits) problems.push(`${p.slug}: ${hits.length} unconfirmed spec value(s) — verify against the real part, then remove the markers`);
}

/* ── 2. Prices ─────────────────────────────────────────────────────────────
 * The business quotes rather than lists. `null` renders "Price on request";
 * `0` would advertise free stock and breaches Google's structured-data policy.
 */
for (const p of products) {
  if (p.price === 0) problems.push(`${p.slug}: price is 0 — use null for "Price on request"`);
}

/* ── 3. Invented social proof ──────────────────────────────────────────────
 * No review data has ever been collected. A non-zero rating means someone
 * typed a number in.
 */
for (const p of products) {
  if (p.rating?.count > 0 || p.rating?.value > 0) {
    warn.push(`${p.slug}: carries a rating (${p.rating.value}/5 from ${p.rating.count}) — confirm these are real reviews`);
  }
}

/* ── 4. Referential integrity ──────────────────────────────────────────────── */
const slugs = new Set(products.map((p) => p.slug));
const cats = new Set(categories.map((c) => c.slug));

for (const p of products) {
  if (!cats.has(p.category)) problems.push(`${p.slug}: category "${p.category}" does not exist`);
  for (const r of p.relatedSlugs ?? []) {
    if (!slugs.has(r)) problems.push(`${p.slug}: relatedSlugs → "${r}" does not exist`);
  }
}

const ids = products.map((p) => p.id);
if (ids.length !== new Set(ids).size) problems.push('duplicate product ids');

/* ── 5. Known-mislabelled imagery ──────────────────────────────────────────
 * These files do not depict what their filename says. Documented in
 * docs/18-content-audit.md §8. Remove entries here as the assets are replaced.
 */
const MISLABELLED = {
  'products/pc-case.webp': 'shows a bare hard drive, not a cabinet',
  'products/office-pc.webp': 'shows a MacBook',
  'products/gaming-pc.webp': 'shows an iMac desktop setup',
  'products/intel-core-ultra.webp': 'shows two NVIDIA graphics cards, not a CPU',
  'products/laptop-workstation.webp': 'shows an Alienware desktop with visible branding',
};

for (const p of products) {
  for (const img of p.images ?? []) {
    if (MISLABELLED[img]) warn.push(`${p.slug}: image "${img}" ${MISLABELLED[img]}`);
  }
}

/* ── Report ────────────────────────────────────────────────────────────────── */
console.log(`checked ${products.length} products, ${categories.length} categories\n`);

if (warn.length) {
  console.log('WARNINGS');
  warn.forEach((w) => console.log('  ! ' + w));
  console.log('');
}

if (problems.length) {
  console.log('BLOCKING');
  problems.forEach((p) => console.log('  ✗ ' + p));
  console.log(`\n${problems.length} problem(s) must be fixed before publishing.`);
  process.exit(1);
}

console.log('No blocking problems.');
