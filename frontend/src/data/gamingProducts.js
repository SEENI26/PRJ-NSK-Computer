/**
 * Gaming laptops and cabinets.
 *
 * Same rules as the professional catalogue: series families, not invented
 * SKUs, and no prices. Stock moves weekly in this trade and a page promising a
 * specific card we cannot source is worse than one describing the tier
 * honestly.
 *
 * `shape` names a <DeviceRender> silhouette rather than an image file, so each
 * entry gets its own visual without shipping a photograph of hardware we do
 * not own.
 */

/** Gaming sub-brands, with the colour each line actually uses on its shroud. */
export const gamingBrands = [
  { id: 'asus',   name: 'ASUS ROG',        mark: 'asus',   accent: '#FF3B5C' },
  { id: 'msi',    name: 'MSI',             mark: 'msi',    accent: '#FF2E2E' },
  { id: 'lenovo', name: 'Lenovo Legion',   mark: 'lenovo', accent: '#00B5E2' },
  { id: 'hp',     name: 'HP OMEN',         mark: 'hp',     accent: '#B14BFF' },
  { id: 'acer',   name: 'Acer Predator',   mark: 'acer',   accent: '#3BE07A' },
  { id: 'dell',   name: 'Dell Alienware',  mark: 'dell',   accent: '#22D3EE' },
];

/** What a player is actually optimising for — the axis this page filters on. */
export const playStyles = [
  { id: 'esports',   label: 'Esports',      blurb: 'Valorant, CS2, Dota. Frames over everything, 144 Hz and up.' },
  { id: 'aaa',       label: 'AAA / single-player', blurb: 'Ray tracing, high settings, 1440p and 4K.' },
  { id: 'streaming', label: 'Streaming',    blurb: 'Encode and play at once without dropping either.' },
  { id: 'creator',   label: 'Content',      blurb: 'Edit the VOD, render the thumbnail, upload tonight.' },
];

export const gamingLaptops = [
  {
    id: 'rog-strix',
    brand: 'asus',
    series: 'ROG Strix',
    name: 'ROG Strix gaming laptop',
    shape: 'gaming-laptop',
    styles: ['esports', 'aaa'],
    headline: 'High-refresh panel, and a chassis that can feed it',
    blurb:
      'The mainstream ROG line: a 165–240 Hz panel with the thermal headroom to actually reach those numbers, rather than a fast screen bolted to a machine that thermal-throttles by round three.',
    config: {
      Graphics:  'RTX 4060 – 4080 laptop',
      Processor: 'Ryzen 9 / Core i9 HX',
      Display:   '16" QHD, 165–240 Hz',
      Memory:    '16–32 GB DDR5',
    },
    highlights: ['Per-key RGB', 'MUX switch', 'Liquid metal on CPU'],
  },
  {
    id: 'msi-raider',
    brand: 'msi',
    series: 'Raider / Katana',
    name: 'MSI Raider gaming laptop',
    shape: 'gaming-laptop',
    styles: ['aaa', 'streaming'],
    headline: 'Desktop-class GPU wattage, and the fans to match',
    blurb:
      'MSI runs its cards near the top of their power envelope, which is why these benchmark above their class and why you will want a headset. The Katana line is the same idea at a student budget.',
    config: {
      Graphics:  'RTX 4070 – 4090 laptop',
      Processor: 'Core i9 HX',
      Display:   '17" QHD+, 240 Hz',
      Memory:    '32–64 GB DDR5',
    },
    highlights: ['High GPU wattage', 'Dual-fan cooling', 'Per-key RGB'],
  },
  {
    id: 'legion-pro',
    brand: 'lenovo',
    series: 'Legion Pro',
    name: 'Legion Pro gaming laptop',
    shape: 'gaming-laptop',
    styles: ['esports', 'aaa', 'creator'],
    headline: 'The quiet one — and still no slower',
    blurb:
      'Legion cools well enough to hold its boost without shouting about it, and the keyboard is the best of any gaming line. The sensible pick if the laptop also has to work in a lecture hall.',
    config: {
      Graphics:  'RTX 4060 – 4080 laptop',
      Processor: 'Ryzen 9 / Core i9 HX',
      Display:   '16" QHD+, 165–240 Hz',
      Memory:    '16–32 GB DDR5',
    },
    highlights: ['Quietest under load', 'Excellent keyboard', 'Long battery for the class'],
  },
  {
    id: 'omen-16',
    brand: 'hp',
    series: 'OMEN / Victus',
    name: 'OMEN gaming laptop',
    shape: 'gaming-laptop',
    styles: ['esports', 'streaming'],
    headline: 'Understated until it is switched on',
    blurb:
      'A gaming laptop that does not announce itself across a meeting room. Victus is the entry point for a first serious machine; OMEN is where the higher-wattage cards live.',
    config: {
      Graphics:  'RTX 4050 – 4070 laptop',
      Processor: 'Ryzen 7 / Core i7',
      Display:   '16" FHD–QHD, 144–240 Hz',
      Memory:    '16–32 GB DDR5',
    },
    highlights: ['Restrained design', 'Good value at entry', 'Tunable fan curve'],
  },
  {
    id: 'predator-helios',
    brand: 'acer',
    series: 'Predator Helios',
    name: 'Predator Helios gaming laptop',
    shape: 'gaming-laptop',
    styles: ['aaa', 'creator'],
    headline: 'Mini-LED panels, at prices the others do not match',
    blurb:
      'Acer puts brighter, higher-contrast panels in this line than the price suggests. Worth it if you play in a lit room, or if the same screen has to grade footage afterwards.',
    config: {
      Graphics:  'RTX 4060 – 4080 laptop',
      Processor: 'Core i9 HX',
      Display:   '16" mini-LED, 240 Hz',
      Memory:    '16–32 GB DDR5',
    },
    highlights: ['Mini-LED option', 'Strong price-to-spec', 'Vapour chamber'],
  },
  {
    id: 'alienware-m',
    brand: 'dell',
    series: 'Alienware m',
    name: 'Alienware gaming laptop',
    shape: 'gaming-laptop',
    styles: ['aaa', 'streaming'],
    headline: 'Built like furniture, cooled like a tower',
    blurb:
      'Heavier than everything else here, and that mass is the cooling system. The choice when the laptop replaces a desktop and rarely leaves the desk.',
    config: {
      Graphics:  'RTX 4070 – 4090 laptop',
      Processor: 'Core i9 HX',
      Display:   '16–18", QHD+, 165–240 Hz',
      Memory:    '32–64 GB DDR5',
    },
    highlights: ['Cryo-tech cooling', 'Desktop replacement', 'AlienFX lighting'],
  },
];

/**
 * Cabinets, ordered by what they are actually for. Airflow first: the most
 * common mistake in this category is buying a sealed glass box for a build
 * that needed mesh.
 *
 * Deliberately not brand-attributed. We stock these shapes from several
 * makers and the choice here is the shape, not the badge — putting a
 * manufacturer on a generic mesh tower would claim something untrue. `tint`
 * is the RGB colour the drawing is lit in, nothing more.
 */
export const gamingCabinets = [
  {
    id: 'cab-airflow-mid',
    tint: '#FF3B5C',
    series: 'Mesh airflow',
    name: 'Mesh-front mid tower',
    shape: 'cabinet',
    styles: ['esports', 'aaa'],
    headline: 'The default answer, and usually the right one',
    blurb:
      'A perforated front with three intakes ahead of the drives. Unglamorous and about eight degrees cooler than the sealed-glass alternative, which is the difference between a card holding boost and not.',
    config: {
      Form:     'Mid tower, ATX',
      Airflow:  '3 × 120 mm front intake',
      Radiator: 'Up to 360 mm front / 240 top',
      Panel:    'Mesh front, tempered side',
    },
    highlights: ['Best thermals per rupee', 'Dust filters', 'Cable channel behind tray'],
  },
  {
    id: 'cab-panoramic',
    tint: '#22D3EE',
    series: 'Panoramic glass',
    name: 'Wrap-around glass tower',
    shape: 'cabinet',
    styles: ['aaa', 'streaming'],
    headline: 'For a build meant to be looked at',
    blurb:
      'Two glass faces meeting at a frameless corner. Buy it knowing the trade: it needs bottom and top intakes doing real work, and it rewards tidy cable routing because nothing is hidden.',
    config: {
      Form:     'Mid tower, ATX',
      Airflow:  'Bottom + top intake',
      Radiator: 'Up to 360 mm top',
      Panel:    'Wrap-around tempered glass',
    },
    highlights: ['Frameless corner', 'Vertical GPU ready', 'Shows the whole build'],
  },
  {
    id: 'cab-compact',
    tint: '#3BE07A',
    series: 'Compact',
    name: 'Micro-ATX compact cabinet',
    shape: 'cabinet',
    styles: ['esports'],
    headline: 'A full build that fits on a hostel desk',
    blurb:
      'Micro-ATX with room for a full-length card and a 240 mm radiator. The right shape for a first build, a LAN machine, or any desk where a full tower is not happening.',
    config: {
      Form:     'Compact, micro-ATX',
      Airflow:  '2 × 120 mm front',
      Radiator: 'Up to 240 mm',
      Panel:    'Mesh front, side window',
    },
    highlights: ['Small footprint', 'Takes a full-length GPU', 'LAN portable'],
  },
  {
    id: 'cab-showcase',
    tint: '#A75CFF',
    series: 'Showcase',
    name: 'Full tower showcase',
    shape: 'cabinet',
    styles: ['aaa', 'creator'],
    headline: 'Room for the loop, the drives and the second card',
    blurb:
      'A full tower for custom water, multi-radiator air, or a workstation card next to a gaming one. Also the easiest cabinet to work inside, which matters more than people expect at build time.',
    config: {
      Form:     'Full tower, E-ATX',
      Airflow:  'Up to 10 fan mounts',
      Radiator: '420 mm front + 360 top',
      Panel:    'Tempered glass, hinged',
    },
    highlights: ['Custom-loop ready', 'Hinged door', 'Eight drive bays'],
  },
];

export const gamingCategories = [
  { id: 'rigs',        label: 'Gaming PCs',   blurb: 'Four tiers, built and stress-tested here.' },
  { id: 'laptops',     label: 'Gaming Laptops', blurb: 'When the machine has to travel.' },
  { id: 'cabinets',    label: 'Cabinets',     blurb: 'Airflow first, glass second.' },
  { id: 'accessories', label: 'Accessories',  blurb: 'The panel, switches and audio around it.' },
];

/** Filter helper shared by the laptop and cabinet grids. */
export function byStyle(items, style) {
  return style === 'all' ? items : items.filter((i) => i.styles.includes(style));
}
