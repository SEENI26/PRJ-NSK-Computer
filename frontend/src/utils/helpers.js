import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Conditional className joiner with Tailwind conflict resolution. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * This is a showroom, not a shop: the catalogue carries no list prices, and
 * that is deliberate rather than missing data. Everything user-facing routes
 * through here so a price can never render as "₹0".
 */
export function priceLabel(value) {
  if (value === null || value === undefined) return 'Price on request';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(input) {
  return String(input).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Resolve a catalogue image path to a public URL. */
export function img(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `/images/${String(path).replace(/^\/+/, '').replace(/^images\//, '')}`;
}

/** Look up many records by id, preserving the order of the id list. */
export function byIds(collection, ids = []) {
  const index = new Map(collection.map((item) => [item.id, item]));
  return ids.map((id) => index.get(id)).filter(Boolean);
}

export function groupBy(collection, key) {
  return collection.reduce((acc, item) => {
    const k = typeof key === 'function' ? key(item) : item[key];
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}
