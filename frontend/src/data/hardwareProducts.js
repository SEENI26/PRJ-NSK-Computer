import { products as sourceCatalogue } from './products.js';

/**
 * The real stocked catalogue, adapted for the showcase.
 *
 * `products.js` is the transcription of the actual product range and stays the
 * source of truth — this module only reshapes it for display and maps each
 * item onto a hardware-explorer category. Nothing is invented here.
 *
 * Prices are absent throughout by design: the business does not publish list
 * prices, so every card shows the enquiry path instead (see priceLabel).
 */

/** Source category → hardware explorer category (§10). */
const CATEGORY_MAP = {
  processors:        'processors',
  'graphics-cards':  'graphics-cards',
  motherboards:      'motherboards',
  memory:            'memory',
  storage:           'storage',
  'cabinets-power':  'cabinets',
  'ups-power':       'power',
  cooling:           'cooling',
  monitors:          'monitors',
  // Everything below has no explorer category of its own — it surfaces under
  // accessories and services rather than the component explorer.
  peripherals:       null,
  networking:        null,
  cables:            null,
  cctv:              null,
  'printers-scanners': null,
  'laptop-spares':   null,
  'gaming-desktops': null,
  'gaming-laptops':  null,
  'gaming-gear':     null,
  'setup-furniture': null,
  'expansion-cards': null,
};

export const hardwareProducts = sourceCatalogue.map((product) => ({
  id: product.slug,
  name: product.name,
  brand: product.brand,
  tagline: product.tagline,
  description: product.description,
  category: CATEGORY_MAP[product.category] ?? null,
  sourceCategory: product.category,
  image: product.images?.[0] ?? null,
  highlights: product.highlights ?? [],
  specGroups: product.specGroups ?? [],
  featured: Boolean(product.featured),
  badge: product.badge ?? null,
  // Deliberately null across the catalogue — see the note above.
  price: product.price ?? null,
}));

/** Products belonging to one explorer category. */
export const productsInCategory = (categoryId) =>
  hardwareProducts.filter((product) => product.category === categoryId);

/** The handful marked as fast-moving, for the home and hardware pages. */
export const featuredProducts = hardwareProducts.filter((product) => product.featured);

/** How many real products sit behind each explorer category. */
export const categoryCounts = hardwareProducts.reduce((counts, product) => {
  if (product.category) counts[product.category] = (counts[product.category] ?? 0) + 1;
  return counts;
}, {});
