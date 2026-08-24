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

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'frontend', 'src');

const { products } = await import(join(src, 'data', 'products.js'));
/* `categories.js` is gone. The catalogue's category vocabulary is now owned by
   hardwareProducts.js, which maps every source key onto an explorer department
   or explicitly onto null — so that map is what referential integrity is
   checked against. */
const { KNOWN_SOURCE_CATEGORIES, categoryCounts } = await import(join(src, 'data', 'hardwareProducts.js'));
const { hardwareCategories, counterDepartments } = await import(join(src, 'data', 'hardwareCategories.js'));
const { accessories } = await import(join(src, 'data', 'accessories.js'));

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
const cats = new Set(KNOWN_SOURCE_CATEGORIES);

for (const p of products) {
  if (!cats.has(p.category)) problems.push(`${p.slug}: category "${p.category}" is not in the map in hardwareProducts.js — map it to a department or to null`);
  for (const r of p.relatedSlugs ?? []) {
    if (!slugs.has(r)) problems.push(`${p.slug}: relatedSlugs → "${r}" does not exist`);
  }
}

const ids = products.map((p) => p.id);
if (ids.length !== new Set(ids).size) problems.push('duplicate product ids');

/* ── 4b. Empty departments ─────────────────────────────────────────────────
 * The hardware page renders a department tile and then the products behind it.
 * A department with nothing mapped to it renders as a promise with nothing
 * underneath, which is exactly the placeholder-shaped failure this file exists
 * to catch.
 */
for (const c of hardwareCategories) {
  if (!categoryCounts[c.id]) {
    problems.push(`department "${c.id}" has no products mapped to it — either map a catalogue category to it in hardwareProducts.js or remove the department`);
  }
}

/* ── 5. Known-mislabelled imagery ──────────────────────────────────────────
 * These files do not depict what their filename says. Documented in
 * docs/18-content-audit.md §8. Remove entries here as the assets are replaced.
 */
const MISLABELLED = {
  'products/pc-case.webp': 'shows a bare hard drive, not a cabinet',
  'products/gaming-headset.webp': 'shows a mouse, not a headset',
  'products/keyboard-office.webp': 'shows an Arduino breadboard kit, not a keyboard',
  'products/ups-power.webp': 'is a screenshot of a Google Search Console dashboard',
  'products/power-supply.webp': 'shows a CPU in a socket, not a power supply',
  'categories/cabinets.webp': 'shows a bare hard drive, not a cabinet',
  'products/office-pc.webp': 'shows a MacBook',
  'products/gaming-pc.webp': 'shows an iMac desktop setup',
  'products/gaming-monitor.webp': 'shows an Apple iMac — an all-in-one computer, not a monitor',
  'products/gaming-pc-apex.webp': 'shows a television running Call of Duty, not a PC',
  'products/intel-core-ultra.webp': 'shows two NVIDIA graphics cards, not a CPU',
  'products/laptop-workstation.webp': 'shows an Alienware desktop with visible branding',
  'categories/workstation.webp': 'shows a laptop, not a workstation desktop',
};

for (const p of products) {
  for (const img of p.images ?? []) {
    if (MISLABELLED[img]) warn.push(`${p.slug}: image "${img}" ${MISLABELLED[img]}`);
  }
}

/* ── 6. Branded imagery on a generic department ────────────────────────────
 * Distinct from §5, and the more damaging of the two. A filename that lies is
 * a maintenance trap; a photograph of a competitor's branded machine on a
 * department tile is a claim about the whole range — "we stock Alienware",
 * "our monitors are iMacs" — that nobody at the shop ever made.
 *
 * Note the deliberate difference: `categories/cabinets.webp` is a hard drive,
 * so it is mislabelled AND it is the correct picture for the Storage
 * department. Wrong filename, right subject. Only branding is disqualifying
 * here. `image: null` renders a designed mark and is always a valid answer.
 */
const BRANDED = {
  'products/gaming-monitor.webp':    'an Apple iMac',
  'products/gaming-pc.webp':         'an Apple iMac',
  'products/office-pc.webp':         'a MacBook',
  'products/laptop-workstation.webp':'an Alienware desktop with visible branding',
  'products/gaming-pc-apex.webp':    'a television running Call of Duty',
};

for (const c of hardwareCategories) {
  if (c.image && BRANDED[c.image]) {
    problems.push(`department "${c.id}": image "${c.image}" is ${BRANDED[c.image]} — a branded machine on a generic department claims a range we do not stock. Use image: null.`);
  }
}

/* Accessory tiles are named for a product type — "Gaming Headset", "UPS" — so
   an image showing something else is a straight contradiction of the label
   next to it, not merely a filename problem. Five of these shipped live: a
   headset card showing a mouse, an office keyboard showing an Arduino kit, and
   a UPS showing a Search Console screenshot. */
for (const a of accessories) {
  if (!a.image) continue;
  if (BRANDED[a.image]) {
    problems.push(`accessory "${a.id}": image "${a.image}" is ${BRANDED[a.image]} — use image: null.`);
  } else if (MISLABELLED[a.image]) {
    problems.push(`accessory "${a.id}": image "${a.image}" ${MISLABELLED[a.image]} — it contradicts the label on the card. Use image: null.`);
  }
}

/* ── 7. Icons that silently fall back ──────────────────────────────────────
 * `getIcon` returns a neutral tick for any name it does not know, so a missing
 * or misspelled icon renders as a valid-looking checkmark rather than an
 * error. That is how five accessory tiles came to show a tick where a monitor,
 * a headset and a UPS should have been: they only ever had photographs, and
 * nulling the wrong photos exposed that none of them had an icon either.
 */
const iconRegistry = readFileSync(join(src, 'utils', 'icons.js'), 'utf8');
const known = new Set(
  (iconRegistry.match(/const REGISTRY = \{([\s\S]*?)\}/)?.[1] ?? '')
    .split(/[,\s]+/)
    .filter(Boolean),
);

const iconed = [
  ...accessories.map((a) => ['accessory', a.id, a.icon]),
  ...hardwareCategories.map((c) => ['department', c.id, c.icon]),
  ...counterDepartments.map((d) => ['counter department', d.id, d.icon]),
];

for (const [kind, id, icon] of iconed) {
  if (!icon) {
    problems.push(`${kind} "${id}": no icon — it will render the neutral fallback tick`);
  } else if (!known.has(icon)) {
    problems.push(`${kind} "${id}": icon "${icon}" is not in the registry in src/utils/icons.js — it will render the neutral fallback tick`);
  }
}

/* ── Report ────────────────────────────────────────────────────────────────── */
console.log(`checked ${products.length} products, ${hardwareCategories.length} departments\n`);

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
