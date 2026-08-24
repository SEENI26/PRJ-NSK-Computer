import { products as sourceCatalogue } from './products.js';

/**
 * The real stocked catalogue, adapted for the showcase.
 *
 * `products.js` is the transcription of the actual product range and stays the
 * source of truth — this module only reshapes it for display and maps each
 * item onto a hardware-explorer category. Nothing is invented here.
 *
 * Prices are absent throughout by design: the business does not publish list
 * prices, so every card shows the enquiry path instead.
 *
 * NO PRODUCT IMAGERY IS EXPOSED HERE. The shipped photo library is known to be
 * mislabelled — `products/pc-case.webp` is a bare hard drive, `motherboard.webp`
 * is a set of case fans (see scripts/check-content.mjs §5) — so the explorer
 * draws its own marks instead of showing a photograph that contradicts the
 * name above it.
 */

/** Source category → hardware explorer category. */
const CATEGORY_MAP = {
  processors:        'processors',
  'graphics-cards':  'graphics-cards',
  motherboards:      'motherboards',
  'expansion-cards': 'motherboards',
  memory:            'memory',
  storage:           'storage',
  'cabinets-power':  'cabinets',
  'ups-power':       'power',
  cooling:           'cooling',
  monitors:          'monitors',
  networking:        'networking',
  cables:            'networking',
  // Real departments, but not PC components — they surface in the counter
  // strip on the hardware page and on the accessories and gaming pages,
  // rather than as a browsable component category.
  peripherals:       null,
  cctv:              null,
  'printers-scanners': null,
  'laptop-spares':   null,
  'gaming-desktops': null,
  'gaming-laptops':  null,
  'gaming-gear':     null,
  'setup-furniture': null,
};

/** Every catalogue key must be accounted for above, mapped or deliberately null. */
export const KNOWN_SOURCE_CATEGORIES = Object.keys(CATEGORY_MAP);

/** Stock states, phrased the way the counter would say them. */
const AVAILABILITY = {
  'in-stock':  { label: 'From counter stock', tone: 'good' },
  'low-stock': { label: 'Limited stock',      tone: 'mid'  },
  'pre-order': { label: 'To order',           tone: 'quiet' },
};

export const hardwareProducts = sourceCatalogue.map((product) => ({
  id: product.slug,
  name: product.name,
  brand: product.brand,
  tagline: product.tagline,
  description: product.description,
  category: CATEGORY_MAP[product.category] ?? null,
  sourceCategory: product.category,
  highlights: product.highlights ?? [],
  specGroups: product.specGroups ?? [],
  featured: Boolean(product.featured),
  badge: product.badge ?? null,
  availability: AVAILABILITY[product.stock] ?? AVAILABILITY['pre-order'],
  warranty: product.warranty ?? null,
  leadTime: product.leadTime ?? null,
  // Deliberately null across the catalogue — see the note above.
  price: product.price ?? null,
}));

/** Products belonging to one explorer category, fast-movers first. */
export const productsInCategory = (categoryId) =>
  hardwareProducts
    .filter((product) => product.category === categoryId)
    .sort((a, b) => Number(b.featured) - Number(a.featured));

/** The handful marked as fast-moving. */
export const featuredProducts = hardwareProducts.filter((product) => product.featured);

/** How many real products sit behind each explorer category. */
export const categoryCounts = hardwareProducts.reduce((counts, product) => {
  if (product.category) counts[product.category] = (counts[product.category] ?? 0) + 1;
  return counts;
}, {});

/** How many sit behind a counter department, which covers several source keys. */
export const countBySourceCategories = (keys = []) =>
  hardwareProducts.filter((product) => keys.includes(product.sourceCategory)).length;
