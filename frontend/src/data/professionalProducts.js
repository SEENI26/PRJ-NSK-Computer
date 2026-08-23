/**
 * The professional catalogue — organised by the work, then by brand.
 *
 * This is a showroom, not a shop: no SKUs, no prices, no invented model
 * numbers. What is listed is the *series family* a dealer actually stocks
 * (Precision, ThinkStation, EliteBook…) and what each family is specified for.
 * Configuration lines are ranges, because that is how these machines are
 * ordered — a Precision is a shape, not a single spec.
 *
 * `image` is a form factor, not a file. Each product is drawn by <DeviceRender>
 * in its brand's colour rather than photographed, so every entry gets its own
 * visual without shipping a fake product shot of someone else's hardware.
 */

/** The work, not the hardware — this is the axis buyers actually shop on. */
export const proRoles = [
  { id: 'office',    label: 'Office & admin',   blurb: 'Billing, ERP, spreadsheets, a long uptime and a quiet desk.' },
  { id: 'developer', label: 'Development',      blurb: 'Compilers, containers, local databases and a lot of tabs.' },
  { id: 'creator',   label: 'Creative',         blurb: 'Timeline playback, colour work, export that finishes on time.' },
  { id: 'engineer',  label: 'Engineering & CAD',blurb: 'Assemblies, simulation and certified drivers that hold up.' },
  { id: 'ai',        label: 'AI & research',    blurb: 'VRAM first, then memory bandwidth, then everything else.' },
  { id: 'field',     label: 'Field & travel',   blurb: 'Weight, battery and a keyboard worth typing on all day.' },
];

/**
 * Brand marks render from `partner-brands.json` (Simple Icons, CC0 — the
 * trademarks remain with their owners). `accent` is each brand's own colour,
 * used only as a hairline and a device tint so the grid stays readable as one
 * system rather than six competing logos.
 */
export const proBrands = [
  { id: 'dell',   name: 'Dell',   accent: '#0076CE' },
  { id: 'hp',     name: 'HP',     accent: '#0096D6' },
  { id: 'lenovo', name: 'Lenovo', accent: '#C8102E' },
  { id: 'asus',   name: 'ASUS',   accent: '#00539B' },
  { id: 'acer',   name: 'Acer',   accent: '#6EA400' },
  { id: 'msi',    name: 'MSI',    accent: '#B3132B' },
];

export const proFormFactors = [
  { id: 'desktop', label: 'Desktops',  blurb: 'Towers and compact desktops that stay on a desk and stay quiet.' },
  { id: 'laptop',  label: 'Laptops',   blurb: 'Business notebooks and mobile workstations that travel.' },
];

/** Device silhouettes <DeviceRender> knows how to draw. */
export const DEVICE_SHAPES = ['tower', 'sff', 'aio', 'ultrabook', 'mobile-workstation'];

export const professionalProducts = [
  // ── Dell ────────────────────────────────────────────────────────────────
  {
    id: 'dell-precision-tower',
    brand: 'dell',
    series: 'Precision',
    name: 'Precision tower workstation',
    formFactor: 'desktop',
    shape: 'tower',
    roles: ['engineer', 'creator', 'ai'],
    headline: 'Certified for the applications that refuse to be approximated',
    blurb:
      'The machine to reach for when the software vendor publishes a certification list. Workstation graphics, ECC memory as an option, and a chassis built to be opened and upgraded for years.',
    config: {
      Processor: 'Core Ultra 7 / Xeon W, 8–24 cores',
      Graphics:  'NVIDIA RTX professional, 8–24 GB',
      Memory:    '32–128 GB, ECC optional',
      Storage:   '1–4 TB NVMe, multiple bays',
    },
    highlights: ['ISV certified', 'Tool-less service', 'On-site warranty options'],
  },
  {
    id: 'dell-optiplex-sff',
    brand: 'dell',
    series: 'OptiPlex',
    name: 'OptiPlex compact desktop',
    formFactor: 'desktop',
    shape: 'sff',
    roles: ['office'],
    headline: 'The fleet machine — same image on every desk',
    blurb:
      'Small-form-factor desktops for counters, cabins and back offices. Chosen for a long support life and a stable driver image, which is what actually matters when you are buying twenty of them.',
    config: {
      Processor: 'Core i3 / i5 / i7',
      Graphics:  'Integrated',
      Memory:    '8–32 GB',
      Storage:   '256 GB – 1 TB NVMe',
    },
    highlights: ['Fits behind a monitor', 'Fleet imaging', 'Low idle noise'],
  },
  {
    id: 'dell-latitude',
    brand: 'dell',
    series: 'Latitude',
    name: 'Latitude business laptop',
    formFactor: 'laptop',
    shape: 'ultrabook',
    roles: ['office', 'field', 'developer'],
    headline: 'A working laptop that survives the commute',
    blurb:
      'Thin business notebooks with the ports people actually use, a keyboard meant for eight hours, and manageability the IT person will thank you for.',
    config: {
      Processor: 'Core Ultra 5 / 7',
      Display:   '14" or 16", matte',
      Memory:    '16–32 GB',
      Battery:   'Full working day, fast charge',
    },
    highlights: ['Matte panel', 'Thunderbolt dock', 'Spill-resistant keyboard'],
  },

  // ── HP ──────────────────────────────────────────────────────────────────
  {
    id: 'hp-z-tower',
    brand: 'hp',
    series: 'Z',
    name: 'Z tower workstation',
    formFactor: 'desktop',
    shape: 'tower',
    roles: ['creator', 'engineer', 'ai'],
    headline: 'Built around airflow, so it holds its clocks under a long render',
    blurb:
      'A workstation whose cooling was designed before its case. Sustained throughput on hour-long exports and simulations, with a memory ceiling high enough that the project file is never the limit.',
    config: {
      Processor: 'Core Ultra 9 / Xeon W',
      Graphics:  'NVIDIA RTX professional, 12–48 GB',
      Memory:    '64–256 GB',
      Storage:   '2–8 TB NVMe',
    },
    highlights: ['Sustained clocks', 'Very high memory ceiling', 'Serviceable interior'],
  },
  {
    id: 'hp-prodesk',
    brand: 'hp',
    series: 'ProDesk / EliteDesk',
    name: 'ProDesk compact desktop',
    formFactor: 'desktop',
    shape: 'sff',
    roles: ['office'],
    headline: 'Quiet, small and predictable — the three things an office desk needs',
    blurb:
      'Compact business desktops for reception, accounts and shared workstations. Specified for uptime and a tidy desk rather than for a benchmark score.',
    config: {
      Processor: 'Core i3 / i5',
      Graphics:  'Integrated',
      Memory:    '8–16 GB',
      Storage:   '256–512 GB NVMe',
    },
    highlights: ['VESA mountable', 'Low power draw', 'Business warranty'],
  },
  {
    id: 'hp-zbook',
    brand: 'hp',
    series: 'ZBook',
    name: 'ZBook mobile workstation',
    formFactor: 'laptop',
    shape: 'mobile-workstation',
    roles: ['creator', 'engineer', 'field'],
    headline: 'A workstation that closes and comes with you',
    blurb:
      'For the engineer on site and the editor on location: workstation graphics and a colour-accurate panel in a chassis you can carry, with the thermal headroom to actually use them.',
    config: {
      Processor: 'Core Ultra 7 / 9',
      Graphics:  'NVIDIA RTX professional, 8–16 GB',
      Display:   '16", colour-calibrated',
      Memory:    '32–64 GB',
    },
    highlights: ['Calibrated panel', 'ISV certified', 'Full-size ports'],
  },

  // ── Lenovo ──────────────────────────────────────────────────────────────
  {
    id: 'lenovo-thinkstation',
    brand: 'lenovo',
    series: 'ThinkStation',
    name: 'ThinkStation tower',
    formFactor: 'desktop',
    shape: 'tower',
    roles: ['engineer', 'ai', 'developer'],
    headline: 'Cores and memory channels, with room left for the next GPU',
    blurb:
      'A workstation for compute that runs overnight — simulation, batch rendering, model training. Expandable enough that a second card or another 64 GB does not mean a new machine.',
    config: {
      Processor: 'Xeon W / Threadripper class',
      Graphics:  'Single or dual professional GPU',
      Memory:    '64–512 GB',
      Storage:   '2 TB+ NVMe, RAID options',
    },
    highlights: ['Dual-GPU capable', 'Runs unattended', 'Diagnostics on board'],
  },
  {
    id: 'lenovo-thinkcentre',
    brand: 'lenovo',
    series: 'ThinkCentre',
    name: 'ThinkCentre tiny desktop',
    formFactor: 'desktop',
    shape: 'sff',
    roles: ['office'],
    headline: 'A litre of desktop — hides behind the screen entirely',
    blurb:
      'One-litre desktops for counters where there is no room for a tower. Same management tools as the rest of the fleet, none of the footprint.',
    config: {
      Processor: 'Core i3 / i5 / Ryzen',
      Graphics:  'Integrated',
      Memory:    '8–32 GB',
      Storage:   '256 GB – 1 TB NVMe',
    },
    highlights: ['One-litre chassis', 'Mounts behind a monitor', 'Very quiet'],
  },
  {
    id: 'lenovo-thinkpad',
    brand: 'lenovo',
    series: 'ThinkPad',
    name: 'ThinkPad business laptop',
    formFactor: 'laptop',
    shape: 'ultrabook',
    roles: ['developer', 'office', 'field'],
    headline: 'The keyboard people buy the whole laptop for',
    blurb:
      'The default choice for developers and anyone who types for a living. Matte screen, deep key travel, a hinge that lasts, and Linux support that is genuinely tested rather than tolerated.',
    config: {
      Processor: 'Core Ultra 5 / 7, Ryzen Pro',
      Display:   '14", matte, low reflectance',
      Memory:    '16–64 GB',
      Battery:   'Full day, rapid charge',
    },
    highlights: ['Best-in-class keyboard', 'Linux friendly', 'Repairable'],
  },
  {
    id: 'lenovo-thinkpad-p',
    brand: 'lenovo',
    series: 'ThinkPad P',
    name: 'ThinkPad P mobile workstation',
    formFactor: 'laptop',
    shape: 'mobile-workstation',
    roles: ['engineer', 'ai', 'creator'],
    headline: 'CAD on the move, without stepping down to a thin-and-light',
    blurb:
      'Certified mobile workstations for engineering and analysis away from the desk. Heavier than an ultrabook, and that weight is cooling doing its job.',
    config: {
      Processor: 'Core Ultra 9 / Xeon mobile',
      Graphics:  'NVIDIA RTX professional',
      Display:   '16", high gamut',
      Memory:    '32–128 GB',
    },
    highlights: ['ISV certified', 'Two drive bays', 'Sustained performance'],
  },

  // ── ASUS ────────────────────────────────────────────────────────────────
  {
    id: 'asus-expertcenter',
    brand: 'asus',
    series: 'ExpertCenter',
    name: 'ExpertCenter desktop',
    formFactor: 'desktop',
    shape: 'sff',
    roles: ['office', 'developer'],
    headline: 'A business desktop with the ports still on the front',
    blurb:
      'Practical office desktops for firms that want current hardware without a fleet contract. Easy to open, easy to add memory to, and sensible about what it costs to run.',
    config: {
      Processor: 'Core i5 / i7',
      Graphics:  'Integrated or entry discrete',
      Memory:    '16–32 GB',
      Storage:   '512 GB – 2 TB NVMe',
    },
    highlights: ['Front-facing ports', 'Simple upgrades', 'Compact tower'],
  },
  {
    id: 'asus-proart',
    brand: 'asus',
    series: 'ProArt',
    name: 'ProArt creator laptop',
    formFactor: 'laptop',
    shape: 'mobile-workstation',
    roles: ['creator', 'field'],
    headline: 'Colour you can sign off on, on location',
    blurb:
      'Creator notebooks with factory-calibrated panels — the point is that what you grade on site still looks right back at the studio. Enough GPU for a 4K timeline that does not stutter.',
    config: {
      Processor: 'Core Ultra 9 / Ryzen 9',
      Graphics:  'NVIDIA RTX, 8–16 GB',
      Display:   'Calibrated OLED, 100% DCI-P3',
      Memory:    '32–64 GB',
    },
    highlights: ['Factory calibrated', 'Full-size card reader', 'Colour-accurate OLED'],
  },
  {
    id: 'asus-expertbook',
    brand: 'asus',
    series: 'ExpertBook',
    name: 'ExpertBook business laptop',
    formFactor: 'laptop',
    shape: 'ultrabook',
    roles: ['office', 'field'],
    headline: 'Light enough to forget you packed it',
    blurb:
      'Sub-1.3 kg business notebooks for people who are out more than they are in. Long battery, full port set, and a chassis tested well past what a bag will do to it.',
    config: {
      Processor: 'Core Ultra 5 / 7',
      Display:   '14", matte',
      Memory:    '16–32 GB',
      Battery:   'Long-haul, fast charge',
    },
    highlights: ['Around 1.2 kg', 'Military-spec durability', 'HDMI and USB-A retained'],
  },

  // ── Acer ────────────────────────────────────────────────────────────────
  {
    id: 'acer-veriton',
    brand: 'acer',
    series: 'Veriton',
    name: 'Veriton office desktop',
    formFactor: 'desktop',
    shape: 'sff',
    roles: ['office'],
    headline: 'The sensible desktop for a growing office',
    blurb:
      'Straightforward business desktops where the budget has to stretch across a room of them. Current-generation parts, no surprises, and standard components when something needs replacing.',
    config: {
      Processor: 'Core i3 / i5',
      Graphics:  'Integrated',
      Memory:    '8–16 GB',
      Storage:   '256–512 GB NVMe',
    },
    highlights: ['Standard parts', 'Easy to service', 'Low running cost'],
  },
  {
    id: 'acer-travelmate',
    brand: 'acer',
    series: 'TravelMate',
    name: 'TravelMate business laptop',
    formFactor: 'laptop',
    shape: 'ultrabook',
    roles: ['office', 'field'],
    headline: 'A dependable first business laptop',
    blurb:
      'For students moving into work and for offices issuing their first laptops: the essentials done properly — matte screen, real ports, a battery that lasts the day.',
    config: {
      Processor: 'Core i5 / i7',
      Display:   '14" or 15.6", matte',
      Memory:    '8–16 GB',
      Battery:   'Full working day',
    },
    highlights: ['Light chassis', 'Full port set', 'Good value'],
  },

  // ── MSI ─────────────────────────────────────────────────────────────────
  {
    id: 'msi-creator',
    brand: 'msi',
    series: 'Creator',
    name: 'Creator studio laptop',
    formFactor: 'laptop',
    shape: 'mobile-workstation',
    roles: ['creator', 'ai'],
    headline: 'Desktop-class GPU in something that still shuts',
    blurb:
      'For editors and 3D artists who need real GPU throughput away from the studio, and for small models trained locally. Loud under full load, and honest about it.',
    config: {
      Processor: 'Core Ultra 9',
      Graphics:  'NVIDIA RTX, 12–16 GB',
      Display:   '16", high refresh, wide gamut',
      Memory:    '32–96 GB',
    },
    highlights: ['High GPU headroom', 'Large memory ceiling', 'Strong cooling'],
  },
];

/** Products for a form factor, optionally narrowed to one brand and one role. */
export function filterProducts({ formFactor, brand = 'all', role = 'all' }) {
  return professionalProducts.filter(
    (p) =>
      p.formFactor === formFactor &&
      (brand === 'all' || p.brand === brand) &&
      (role === 'all' || p.roles.includes(role)),
  );
}

/** Brands that actually have something in this form factor — no dead filters. */
export function brandsWith(formFactor) {
  const present = new Set(
    professionalProducts.filter((p) => p.formFactor === formFactor).map((p) => p.brand),
  );
  return proBrands.filter((b) => present.has(b.id));
}
