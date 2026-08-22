

/**
 * Real catalogue, transcribed from nskcomputerzone.com (July 2026).
 *
 * ── HONESTY NOTES ────────────────────────────────────────────────────────────
 * • `price: null` throughout. NSK publishes no list prices, which is normal for a
 *   wholesale spares business — the UI shows "Price on request" and an enquiry CTA
 *   rather than a figure we would have had to invent.
 * • `rating` is `{ value: 0, count: 0 }`, which the UI reads as "no reviews yet".
 *   No invented star ratings.
 * • Variant lists (brands, capacities, part numbers) are verbatim from the source
 *   pages. Anything not listed there is absent rather than guessed.
 * • `downloads` is empty — the source site publishes no datasheets.
 */
export const products = [
  /* ── Memory ─────────────────────────────────────────────────────────────── */
  {
    id: 1,
    slug: 'ddr4-desktop-memory',
    name: 'DDR4 Desktop Memory',
    sku: 'NSK-RAM-DDR4',
    category: 'memory',
    brand: 'Multi-brand',
    tagline: '4 GB to 16 GB modules from stock, single sticks or matched pairs.',
    description:
      'DDR4 desktop memory across the capacities that actually move — 4 GB for office refreshes, 8 GB as the standard upgrade, 16 GB for gaming and creative work. Stocked from multiple brands so we can match an existing stick when you are adding to a populated board rather than replacing outright.',
    price: null,
    stock: 'in-stock',
    featured: true,
    badge: 'Fast moving',
    images: ['products/ram-ddr5.webp'],
    highlights: [
      '4 GB — Samsung, Hynix, Lexar',
      '8 GB — Micron, Crucial, ANT Esport, Corsair (10-year warranty)',
      '16 GB — ANT Esport, Crucial',
      'Single modules available for mixed-capacity upgrades',
    ],
    specGroups: [
      {
        title: 'Available capacities',
        specs: [
          { label: '4 GB', value: 'Samsung · Hynix · Lexar' },
          { label: '8 GB', value: 'Micron · Crucial · ANT Esport · Corsair' },
          { label: '16 GB', value: 'ANT Esport · Crucial' },
        ],
      },
      {
        title: 'Fitment',
        specs: [
          { label: 'Form factor', value: 'DIMM (desktop) — SODIMM available for laptop' },
          { label: 'Generation', value: 'DDR4' },
          { label: 'Warranty', value: 'Brand warranty; Corsair 8 GB carries 10 years' },
        ],
      },
    ],
    features: [
      { title: 'Tested before it leaves', description: 'Every module is bench-tested in a live board before we hand it over.', icon: 'MemoryStick' },
      { title: 'Matched to your board', description: 'Bring the machine or the existing stick and we will match capacity, speed and rank.', icon: 'ListChecks' },
      { title: 'Trade counter pricing', description: 'Wholesale rates for resellers and service shops — ask for a trade quote.', icon: 'Package' },
      { title: 'Fitted free', description: 'Installed and verified at the counter at no charge.', icon: 'Wrench' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty (varies by module)',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['ddr3-desktop-memory', 'intel-core-i5-processors', 'ddr5-desktop-memory'],
  },
  {
    id: 2,
    slug: 'ddr3-desktop-memory',
    name: 'DDR3 Desktop Memory',
    sku: 'NSK-RAM-DDR3',
    category: 'memory',
    brand: 'Multi-brand',
    tagline: 'Still the right answer for keeping older office fleets alive.',
    description:
      'DDR3 in 2 GB, 4 GB (16 IC) and 8 GB. A large number of working office and shop-floor machines are still on DDR3 boards, and a memory top-up is usually far cheaper than a platform replacement. We hold this stock specifically so those machines do not have to be scrapped.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/ram-ddr5.webp'],
    highlights: [
      '2 GB — Samsung, Hynix, Consistent',
      '4 GB (16 IC) — Samsung, Hynix, Crucial, Frontech',
      '8 GB — Samsung, Hynix',
      'ANT Esport DDR3 also stocked',
    ],
    specGroups: [
      {
        title: 'Available capacities',
        specs: [
          { label: '2 GB', value: 'Samsung · Hynix · Consistent' },
          { label: '4 GB (16 IC)', value: 'Samsung · Hynix · Crucial · Frontech' },
          { label: '8 GB', value: 'Samsung · Hynix' },
          { label: 'Gaming', value: 'ANT Esport DDR3' },
        ],
      },
    ],
    features: [
      { title: '16 IC specified', description: 'The 4 GB modules are 16 IC — important, because some older boards will not post with 8 IC.', icon: 'AlertTriangle' },
      { title: 'Compatibility checked', description: 'DDR3 and DDR3L are not always interchangeable. We verify against your board.', icon: 'ListChecks' },
      { title: 'Cheaper than replacing', description: 'A memory top-up often adds two or three usable years to a working machine.', icon: 'TrendingUp' },
      { title: 'Bulk for fleets', description: 'Quantity pricing when refreshing a whole office at once.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty (varies by module)',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['ddr2-desktop-memory', 'ddr4-desktop-memory', 'intel-core-i3-processors'],
  },
  {
    id: 3,
    slug: 'ddr5-desktop-memory',
    name: 'DDR5 Desktop Memory',
    sku: 'NSK-RAM-DDR5',
    category: 'memory',
    brand: 'Multi-brand',
    tagline: 'For current-generation builds.',
    description:
      'DDR5 modules for new builds on current Intel platforms. Stocked to order in most capacities — tell us the board and the target speed and we will confirm availability and a price the same day.',
    price: null,
    stock: 'pre-order',
    featured: false,
    images: ['products/ram-ddr5.webp'],
    highlights: ['Current-generation platforms', 'Capacities to order', 'Board compatibility confirmed before supply', 'Trade pricing available'],
    specGroups: [
      { title: 'Fitment', specs: [{ label: 'Generation', value: 'DDR5' }, { label: 'Form factor', value: 'DIMM / SODIMM' }] },
    ],
    features: [
      { title: 'Sourced to spec', description: 'Tell us the board and the speed you need; we confirm availability the same day.', icon: 'Search' },
      { title: 'QVL checked', description: 'We verify the kit is on your board qualified vendor list before ordering.', icon: 'ListChecks' },
      { title: 'Honest advice', description: 'If DDR4 is the better buy for your budget and workload, we will say so.', icon: 'MessageSquare' },
      { title: 'Trade supply', description: 'Wholesale rates for resellers.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'To order — usually 2–4 days',
    relatedSlugs: ['ddr4-desktop-memory', 'desktop-motherboards', 'nvme-m2-ssd'],
  },
  {
    id: 4,
    slug: 'ddr2-desktop-memory',
    name: 'DDR2 Desktop Memory',
    sku: 'NSK-RAM-DDR2',
    category: 'memory',
    brand: 'Multi-brand',
    tagline: 'Legacy service stock — hard to find elsewhere.',
    description:
      'DDR2 2 GB modules for legacy machines still in service. Most suppliers dropped this years ago; we keep it because billing counters, industrial terminals and test rigs on DDR2 boards still need spares and cannot simply be replaced.',
    price: null,
    stock: 'low-stock',
    featured: false,
    images: ['products/ram-ddr5.webp'],
    highlights: ['2 GB — Samsung, Hynix, Consistent', 'Legacy platform support', 'Limited stock', 'Ideal for industrial and billing terminals'],
    specGroups: [
      { title: 'Available capacities', specs: [{ label: '2 GB', value: 'Samsung · Hynix · Consistent' }] },
    ],
    features: [
      { title: 'Genuinely scarce', description: 'DDR2 is end-of-life. Stock is finite and not replenishable indefinitely.', icon: 'AlertTriangle' },
      { title: 'Keeps machines running', description: 'For terminals that cannot be replaced, a spare module is the whole solution.', icon: 'Wrench' },
      { title: 'Tested', description: 'Every legacy module is verified in a working board before supply.', icon: 'Activity' },
      { title: 'Reserve ahead', description: 'If you run DDR2 estate, talk to us about holding stock for you.', icon: 'CalendarCheck' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Tested; limited warranty on legacy stock',
    leadTime: 'Limited stock — call to confirm',
    relatedSlugs: ['ddr3-desktop-memory', 'pci-expansion-cards', 'hard-disk-drives'],
  },

  /* ── Processors ─────────────────────────────────────────────────────────── */
  {
    id: 5,
    slug: 'intel-core-i5-processors',
    name: 'Intel Core i5 Processors',
    sku: 'NSK-CPU-I5',
    category: 'processors',
    brand: 'Intel',
    tagline: '2nd through 9th generation, tested and warranted.',
    description:
      'Core i5 processors spanning eight generations. This is the sweet spot for office and general-purpose upgrades: an i5 in place of an i3 on the same board is often the single cheapest way to make a slow machine usable again, with no reinstall and no new platform.',
    price: null,
    stock: 'in-stock',
    featured: true,
    badge: 'Best upgrade value',
    // NOT intel-core-ultra.webp — that asset shows two NVIDIA graphics cards.
    // amd-ryzen.webp is a generic circuit-board macro: silicon, no wrong brand.
    images: ['products/amd-ryzen.webp'],
    highlights: [
      'Generations 2nd, 3rd, 4th, 6th, 7th, 8th and 9th',
      'Drop-in upgrade on a matching socket — no reinstall',
      'Bench-tested before supply',
      'Trade quantities available',
    ],
    specGroups: [
      {
        title: 'Generations stocked',
        specs: [
          { label: 'LGA 1155', value: 'i5 2nd gen · i5 3rd gen' },
          { label: 'LGA 1150', value: 'i5 4th gen' },
          { label: 'LGA 1151', value: 'i5 6th · 7th · 8th · 9th gen' },
        ],
      },
      {
        title: 'Before you buy',
        specs: [
          { label: 'Socket match', value: 'Required — bring the board or its model number' },
          { label: 'BIOS', value: 'Some boards need a BIOS update for newer generations' },
          { label: 'Cooler', value: 'Reused where serviceable; new coolers stocked' },
        ],
      },
    ],
    features: [
      { title: 'Socket verified first', description: 'A generation number is not enough — we confirm the exact socket and BIOS revision.', icon: 'ListChecks' },
      { title: 'Tested under load', description: 'Each processor runs a stability pass on our bench before it is sold.', icon: 'Activity' },
      { title: 'Fitted and repasted', description: 'Installation and fresh thermal paste at no extra charge.', icon: 'Wrench' },
      { title: 'Old CPU taken in', description: 'We accept your existing processor against the price where it has value.', icon: 'ArrowLeftRight' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Tested with warranty — term confirmed at purchase',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['intel-core-i7-processors', 'intel-core-i3-processors', 'desktop-motherboards'],
  },
  {
    id: 6,
    slug: 'intel-core-i7-processors',
    name: 'Intel Core i7 Processors',
    sku: 'NSK-CPU-I7',
    category: 'processors',
    brand: 'Intel',
    tagline: '2nd through 9th generation for heavier workloads.',
    description:
      'Core i7 for machines that do real work — accounting suites with large data files, CAD, video editing and multi-tasking. On an older board an i7 upgrade frequently outperforms a mid-range new machine at a fraction of the cost.',
    price: null,
    stock: 'in-stock',
    featured: true,
    // NOT intel-core-ultra.webp — that asset shows two NVIDIA graphics cards.
    // amd-ryzen.webp is a generic circuit-board macro: silicon, no wrong brand.
    images: ['products/amd-ryzen.webp'],
    highlights: [
      'Generations 2nd, 3rd, 4th, 6th, 7th, 8th and 9th',
      'Higher core and thread counts than the matching i5',
      'Bench-tested before supply',
      'Suits CAD, editing and heavy multi-tasking',
    ],
    specGroups: [
      {
        title: 'Generations stocked',
        specs: [
          { label: 'LGA 1155', value: 'i7 2nd gen · i7 3rd gen' },
          { label: 'LGA 1150', value: 'i7 4th gen' },
          { label: 'LGA 1151', value: 'i7 6th · 7th · 8th · 9th gen' },
        ],
      },
      {
        title: 'Before you buy',
        specs: [
          { label: 'Socket match', value: 'Required' },
          { label: 'Cooling', value: 'Higher TDP than i5 — cooler may need upgrading' },
          { label: 'Power', value: 'Check the existing SMPS has headroom' },
        ],
      },
    ],
    features: [
      { title: 'Cooling assessed', description: 'An i7 in an i3-era cooler will throttle. We check and advise.', icon: 'Thermometer' },
      { title: 'Real gain quantified', description: 'We tell you what to expect before you spend, not after.', icon: 'BarChart3' },
      { title: 'Tested under load', description: 'Stability pass on the bench before supply.', icon: 'Activity' },
      { title: 'Trade supply', description: 'Quantity rates for service shops and resellers.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Tested with warranty — term confirmed at purchase',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['intel-core-i5-processors', 'desktop-motherboards', 'gaming-smps'],
  },
  {
    id: 7,
    slug: 'intel-core-i3-processors',
    name: 'Intel Core i3 Processors',
    sku: 'NSK-CPU-I3',
    category: 'processors',
    brand: 'Intel',
    tagline: '2nd through 12th generation, F and integrated-graphics variants.',
    description:
      'The widest generation spread we carry — i3 from 2nd all the way to 12th, in both F variants (no integrated graphics, needs a display card) and plain variants (integrated graphics included). The plain variants matter for office machines where you do not want to buy a graphics card at all.',
    price: null,
    stock: 'in-stock',
    featured: false,
    // NOT intel-core-ultra.webp — that asset shows two NVIDIA graphics cards.
    // amd-ryzen.webp is a generic circuit-board macro: silicon, no wrong brand.
    images: ['products/amd-ryzen.webp'],
    highlights: [
      'Generations 2nd, 3rd, 4th, 6th, 7th, 8th, 9th, 10th, 11th and 12th',
      'F variants (display card required) and plain (integrated graphics)',
      'Ideal for office and billing machines',
      'Bench-tested before supply',
    ],
    specGroups: [
      {
        title: 'Generations stocked',
        specs: [
          { label: 'Legacy', value: 'i3 2nd · 3rd · 4th · 6th · 7th gen' },
          { label: 'Current-ish', value: 'i3 8th · 9th gen' },
          { label: 'Recent', value: 'i3 10th F & Plain · 11th F & Plain · 12th F & Plain' },
        ],
      },
      {
        title: 'F versus Plain',
        specs: [
          { label: 'F variant', value: 'No integrated graphics — a display card is mandatory' },
          { label: 'Plain variant', value: 'Integrated graphics included — no card needed' },
          { label: 'Which to pick', value: 'Plain for office; F only if you are fitting a GPU anyway' },
        ],
      },
    ],
    features: [
      { title: 'F vs Plain explained', description: 'An F processor with no graphics card will not display at all. We make sure you get the right one.', icon: 'AlertTriangle' },
      { title: 'Office-appropriate', description: 'For billing, browsing and documents an i3 is genuinely sufficient. We will not upsell.', icon: 'MessageSquare' },
      { title: 'Tested', description: 'Stability pass before supply.', icon: 'Activity' },
      { title: 'Fleet quantities', description: 'Bulk rates when refreshing multiple office machines.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Tested with warranty — term confirmed at purchase',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['intel-core-i5-processors', 'ddr4-desktop-memory', 'desktop-motherboards'],
  },

  /* ── Storage ────────────────────────────────────────────────────────────── */
  {
    id: 8,
    slug: 'nvme-m2-ssd',
    name: 'M.2 NVMe SSD',
    sku: 'NSK-SSD-NVME',
    category: 'storage',
    brand: 'Multi-brand',
    tagline: 'The single biggest speed change you can make to an old machine.',
    description:
      'M.2 NVMe drives for desktops and laptops with a compatible slot. If a machine still boots from a mechanical hard disk, moving to NVMe transforms it more than any processor or memory upgrade will — boot times and application launches change from tens of seconds to a few.',
    price: null,
    stock: 'in-stock',
    featured: true,
    badge: 'Biggest impact',
    images: ['products/ssd-nvme.webp'],
    highlights: [
      'Desktop and laptop M.2 2280',
      'Free OS and data migration from your existing drive',
      'Slot compatibility checked before supply',
      'Multiple capacities from stock',
    ],
    specGroups: [
      {
        title: 'Fitment',
        specs: [
          { label: 'Form factor', value: 'M.2 2280' },
          { label: 'Interface', value: 'PCIe NVMe' },
          { label: 'Compatibility', value: 'Board must have an M.2 NVMe slot — we verify' },
        ],
      },
    ],
    features: [
      { title: 'Free cloning', description: 'We migrate Windows, applications and data across at no charge — nothing to reinstall.', icon: 'Copy' },
      { title: 'Slot verified', description: 'Not every M.2 slot is NVMe; some are SATA-only. We check before selling.', icon: 'ListChecks' },
      { title: 'Old drive returned', description: 'Your original disk comes back to you as a backup.', icon: 'HardDrive' },
      { title: 'Honest sizing', description: 'If a SATA SSD does the job for less, that is what we will recommend.', icon: 'MessageSquare' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['sata-ssd', 'hard-disk-drives', 'ddr4-desktop-memory'],
  },
  {
    id: 9,
    slug: 'sata-ssd',
    name: 'SATA SSD',
    sku: 'NSK-SSD-SATA',
    category: 'storage',
    brand: 'Multi-brand',
    tagline: 'For any machine without an M.2 slot.',
    description:
      '2.5-inch SATA solid state drives. Where a board has no M.2 slot — which covers most machines older than a few years — a SATA SSD delivers the great majority of the real-world benefit for less money, and fits anything with a SATA port.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/ssd-sata.webp'],
    highlights: ['2.5-inch, fits desktop and laptop bays', 'Works on any SATA board', 'Free OS and data migration', 'Multiple capacities from stock'],
    specGroups: [
      { title: 'Fitment', specs: [{ label: 'Form factor', value: '2.5-inch' }, { label: 'Interface', value: 'SATA III' }, { label: 'Compatibility', value: 'Any board with a SATA port' }] },
    ],
    features: [
      { title: 'Universal fit', description: 'No M.2 slot needed. If it has SATA, this works.', icon: 'Check' },
      { title: 'Free cloning', description: 'OS and data migrated at no charge.', icon: 'Copy' },
      { title: 'Laptop-friendly', description: 'Direct replacement for a laptop mechanical drive.', icon: 'Laptop' },
      { title: 'Bracket included', description: '2.5-to-3.5 mounting bracket supplied for desktop bays.', icon: 'Wrench' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['nvme-m2-ssd', 'hard-disk-drives', 'laptop-screens-panels'],
  },
  {
    id: 10,
    slug: 'hard-disk-drives',
    name: 'Hard Disk Drives',
    sku: 'NSK-HDD',
    category: 'storage',
    brand: 'Multi-brand',
    tagline: 'Capacity storage for archives, CCTV and backup.',
    description:
      'Mechanical hard disks where cost per gigabyte still matters — bulk archives, backup targets and CCTV recorders. Surveillance recording in particular is a continuous write workload that suits a drive rated for it rather than a desktop disk.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/ssd-sata.webp'],
    highlights: ['Desktop and laptop form factors', 'Suitable capacities for CCTV recording', 'Best cost per gigabyte', 'Health-checked before supply'],
    specGroups: [
      { title: 'Fitment', specs: [{ label: 'Form factors', value: '3.5-inch desktop · 2.5-inch laptop' }, { label: 'Interface', value: 'SATA' }] },
      { title: 'Use cases', specs: [{ label: 'Archive & backup', value: 'Capacity-first, cost-effective' }, { label: 'CCTV', value: 'Continuous-write duty — ask for a surveillance-rated drive' }] },
    ],
    features: [
      { title: 'CCTV-appropriate drives', description: 'Surveillance writes continuously. A desktop drive will fail early at it — we stock the right ones.', icon: 'Video' },
      { title: 'SMART checked', description: 'Health report captured before supply so you have a baseline.', icon: 'Activity' },
      { title: 'Paired with an SSD', description: 'Best setup is usually SSD for the system, HDD for bulk. We will configure it.', icon: 'Layers' },
      { title: 'Trade quantities', description: 'Bulk rates for integrators and resellers.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['cctv-camera-systems', 'sata-ssd', 'nvme-m2-ssd'],
  },

  /* ── Boards, cabinets, power ────────────────────────────────────────────── */
  {
    id: 11,
    slug: 'desktop-motherboards',
    name: 'Desktop Motherboards',
    sku: 'NSK-MB-DESKTOP',
    category: 'motherboards',
    brand: 'Multi-brand',
    tagline: 'Across Intel sockets, new and tested service boards.',
    description:
      'Desktop motherboards covering the Intel sockets our processor stock spans, so a board and CPU can be matched together. Where a board is faulty rather than obsolete we will also quote component-level repair, which is often cheaper than replacement.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/motherboard.webp'],
    highlights: [
      'Matched to our i3, i5 and i7 stock',
      'Component-level repair quoted as an alternative',
      'BIOS updated and tested before supply',
      'Board plus processor bundles available',
    ],
    specGroups: [
      { title: 'Sockets covered', specs: [{ label: 'LGA 1155', value: '2nd / 3rd gen' }, { label: 'LGA 1150', value: '4th gen' }, { label: 'LGA 1151', value: '6th–9th gen' }, { label: 'Current', value: '10th–12th gen boards to order' }] },
    ],
    features: [
      { title: 'Repair before replace', description: 'Many "dead" boards are one failed component. We will assess before selling you a new one.', icon: 'Wrench' },
      { title: 'Bundled with CPU', description: 'Board and processor matched and tested together as a set.', icon: 'Layers' },
      { title: 'BIOS pre-flashed', description: 'Updated and CPU support verified before handover.', icon: 'HardDriveDownload' },
      { title: 'Tested', description: 'POST and stability verified on the bench.', icon: 'Activity' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Warranty confirmed at purchase',
    leadTime: 'Common sockets from stock; current boards to order',
    relatedSlugs: ['intel-core-i5-processors', 'ddr4-desktop-memory', 'gaming-smps'],
  },
  {
    id: 12,
    slug: 'atx-cabinets',
    name: 'ATX Cabinets',
    sku: 'NSK-CAB-ATX',
    category: 'cabinets-power',
    brand: 'Multi-brand',
    tagline: 'Practical cases for office and workshop builds.',
    description:
      'Standard ATX cabinets in a range of layouts. Sturdy, well-ventilated and easy to service — chosen for office deployments and workshop rebuilds where reliability and airflow matter more than appearance.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/pc-case.webp'],
    highlights: ['Full ATX and micro-ATX support', 'Multiple designs stocked', 'Front USB and audio', 'SMPS bundles available'],
    specGroups: [
      { title: 'Fitment', specs: [{ label: 'Board support', value: 'ATX · micro-ATX' }, { label: 'Drive bays', value: '3.5-inch and 2.5-inch' }, { label: 'Front I/O', value: 'USB and audio' }] },
    ],
    features: [
      { title: 'Clearance checked', description: 'Send your parts list and we confirm cooler and card clearance before you buy.', icon: 'Ruler' },
      { title: 'Cabinet + SMPS bundle', description: 'Cheaper bought together, and we make sure the wattage suits the build.', icon: 'Package' },
      { title: 'Assembled free', description: 'Buy the parts here and assembly is included.', icon: 'Wrench' },
      { title: 'Serviceable', description: 'Chosen for easy internal access — these get opened again.', icon: 'Unlock' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['rgb-gaming-cabinets', 'gaming-smps', 'desktop-motherboards'],
  },
  {
    id: 13,
    slug: 'rgb-gaming-cabinets',
    name: 'RGB Gaming Cabinets',
    sku: 'NSK-CAB-RGB',
    category: 'cabinets-power',
    brand: 'Multi-brand',
    tagline: 'Customisable lighting with airflow that actually works.',
    description:
      'Gaming cabinets with configurable RGB lighting and layouts designed around airflow rather than just looks. Tempered glass and mesh options, with fan mounts positioned for genuine front-to-back movement.',
    price: null,
    stock: 'in-stock',
    featured: true,
    badge: 'Popular',
    // NOT products/pc-case.webp — that asset is mislabelled and actually shows a
    // bare hard drive, which made the gaming showcase lead on a storage photo.
    images: ['products/gaming-pc-rgb.webp'],
    highlights: ['Configurable RGB lighting effects', 'Airflow-oriented layouts', 'Tempered glass and mesh options', 'Multiple fan mounting positions'],
    specGroups: [
      { title: 'Fitment', specs: [{ label: 'Board support', value: 'ATX · micro-ATX' }, { label: 'Cooling', value: 'Multiple fan mounts; radiator support on selected models' }, { label: 'Side panel', value: 'Tempered glass or mesh' }] },
    ],
    features: [
      { title: 'Airflow first', description: 'Lighting is easy; airflow is not. We will point you at cases that actually cool.', icon: 'Wind' },
      { title: 'GPU clearance verified', description: 'We check your card length against the case before you buy.', icon: 'Ruler' },
      { title: 'Fans and lighting fitted', description: 'Cabinet fans installed and lighting configured at handover.', icon: 'Sparkles' },
      { title: 'Full build service', description: 'Supply the parts list and we assemble and cable-manage it.', icon: 'Wrench' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['gaming-smps', 'atx-cabinets', 'graphics-cards'],
  },
  {
    id: 14,
    slug: 'gaming-smps',
    name: 'ANT Esport Gaming SMPS',
    sku: 'NSK-SMPS-ANT',
    category: 'cabinets-power',
    brand: 'ANT Esport',
    tagline: '400 W to 750 W — sized to the build, not guessed.',
    description:
      'ANT Esport gaming power supplies across the VS series, from 400 W for a modest build to 750 W where a serious graphics card is involved. Under-specifying the supply is one of the most common causes of instability we diagnose, so we size it against the actual parts list.',
    price: null,
    stock: 'in-stock',
    featured: true,
    images: ['products/power-supply.webp'],
    highlights: [
      'VS400L · VS450L · VS500L · VS600L · VS750L',
      'Sized against your actual component list',
      'Correct connectors verified for your graphics card',
      'Cabinet bundles available',
    ],
    specGroups: [
      {
        title: 'Models stocked',
        specs: [
          { label: 'ANT Esport VS400L', value: '400 W — office and light builds' },
          { label: 'ANT Esport VS450L', value: '450 W — entry gaming' },
          { label: 'ANT Esport VS500L', value: '500 W — mid gaming' },
          { label: 'ANT Esport VS600L', value: '600 W — higher-tier GPU' },
          { label: 'ANT Esport VS750L', value: '750 W — headroom for upgrades' },
        ],
      },
    ],
    features: [
      { title: 'Wattage calculated', description: 'We total your components rather than guessing, and leave headroom for the next GPU.', icon: 'Calculator' },
      { title: 'Connectors checked', description: 'A supply with the wrong PCIe connectors will not power your card. We verify.', icon: 'Cable' },
      { title: 'Do not skimp here', description: 'An underpowered supply causes random shutdowns that look like other faults entirely.', icon: 'AlertTriangle' },
      { title: 'Bundled with cabinet', description: 'Cheaper together, and matched for fit.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['rgb-gaming-cabinets', 'graphics-cards', 'atx-cabinets'],
  },
  {
    id: 15,
    slug: 'graphics-cards',
    name: 'Graphics Cards',
    sku: 'NSK-GPU',
    category: 'graphics-cards',
    brand: 'Multi-brand',
    tagline: 'Display cards through to gaming GPUs.',
    description:
      'Graphics cards from basic display output — which is all an F-variant processor needs to boot — through to gaming GPUs. We check power supply capacity and physical clearance before supply, because both are common causes of a card that cannot be fitted or will not run stably.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/nvidia-rtx.webp'],
    highlights: ['Entry display cards to gaming GPUs', 'Power supply headroom checked', 'Cabinet clearance verified', 'Required for F-variant processors'],
    specGroups: [
      { title: 'Before you buy', specs: [{ label: 'Power', value: 'Existing SMPS wattage and connectors verified' }, { label: 'Clearance', value: 'Card length checked against your cabinet' }, { label: 'Slot', value: 'PCIe x16 required' }] },
    ],
    features: [
      { title: 'Power verified first', description: 'The most common failed GPU upgrade is an underpowered supply. We check first.', icon: 'Zap' },
      { title: 'Clearance measured', description: 'Longer cards do not fit every cabinet. We confirm before ordering.', icon: 'Ruler' },
      { title: 'Fitted and driver-installed', description: 'Installation, drivers and a test pass included.', icon: 'Wrench' },
      { title: 'Matched to your monitor', description: 'No point buying a card your display cannot exploit. We will say so.', icon: 'Monitor' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['gaming-smps', 'intel-core-i3-processors', 'monitors'],
  },

  /* ── Laptop ─────────────────────────────────────────────────────────────── */
  {
    id: 16,
    slug: 'laptop-screens-panels',
    name: 'Laptop Screens & Panels',
    sku: 'NSK-LCD-PANEL',
    category: 'laptop-spares',
    brand: 'Multi-brand',
    tagline: 'Replacement display panels fitted same day where in stock.',
    description:
      'Laptop display panels across common sizes and resolutions. A cracked screen is the most frequent laptop repair we see and almost always worth fixing — the panel is a fraction of the machine value. Bring the laptop and we will identify the exact panel from the model and existing part number.',
    price: null,
    stock: 'in-stock',
    featured: true,
    badge: 'Same-day where stocked',
    // laptop-workstation.webp is an Alienware desktop despite its filename.
    images: ['products/workstation.webp'],
    highlights: [
      'Common sizes and resolutions stocked',
      'Exact panel identified from your model and part number',
      'Same-day fitting where in stock',
      'Uncommon panels sourced in a few days',
    ],
    specGroups: [
      { title: 'Identification', specs: [{ label: 'Required', value: 'Laptop model, or the part number printed on the existing panel' }, { label: 'Varies by', value: 'Size, resolution, connector, mounting and finish' }] },
      { title: 'Service', specs: [{ label: 'In stock', value: 'Fitted the same day' }, { label: 'To order', value: 'Typically a few working days' }] },
    ],
    features: [
      { title: 'Exact match, not close', description: 'Panels differ in connector and mounting even at the same size. We identify precisely.', icon: 'ListChecks' },
      { title: 'Worth repairing', description: 'A panel replacement typically costs a fraction of the machine. We will tell you the number first.', icon: 'Calculator' },
      { title: 'Fitted properly', description: 'ESD-safe bench and correct tooling — no prying with a card.', icon: 'Wrench' },
      { title: 'Old panel returned', description: 'The replaced part comes back to you.', icon: 'Recycle' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Warranty on part and labour — confirmed at purchase',
    leadTime: 'Same day where stocked; a few days to order',
    relatedSlugs: ['laptop-keyboards-spares', 'sata-ssd', 'ups-batteries'],
  },
  {
    id: 17,
    slug: 'laptop-keyboards-spares',
    name: 'Laptop Keyboards & Spares',
    sku: 'NSK-LAP-SPARES',
    category: 'laptop-spares',
    brand: 'Multi-brand',
    tagline: 'Keyboards, hinges, jacks, adapters, PCB and flex cables.',
    description:
      'The parts that actually fail on laptops: keyboards worn or liquid-damaged, cracked hinges, broken DC jacks, failed adapters, and the PCB and flex cables that connect everything. Board-level components for service work too, which many suppliers will not stock.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/keyboard-office.webp'],
    highlights: [
      'Keyboards, hinges and DC jacks',
      'Chargers and adapters',
      'PCB and flex cables',
      'OEM components for board-level repair',
    ],
    specGroups: [
      { title: 'Commonly stocked', specs: [{ label: 'Input', value: 'Keyboards, trackpad assemblies' }, { label: 'Mechanical', value: 'Hinges, screen bezels, casing' }, { label: 'Power', value: 'DC jacks, adapters, chargers' }, { label: 'Interconnect', value: 'PCB cables, flex cables, ribbon' }] },
    ],
    features: [
      { title: 'Board-level parts', description: 'We stock the components most shops will not, so a board can be repaired rather than replaced.', icon: 'Cpu' },
      { title: 'Model matched', description: 'Bring the machine or model number — these parts are rarely universal.', icon: 'ListChecks' },
      { title: 'Fitting available', description: 'Supply only, or supply and fit on our bench.', icon: 'Wrench' },
      { title: 'Trade supply', description: 'Wholesale rates for service shops across Trichy and the region.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Warranty confirmed at purchase',
    leadTime: 'Common parts from stock; others to order',
    relatedSlugs: ['laptop-screens-panels', 'ups-batteries', 'sata-ssd'],
  },

  /* ── Peripherals & power ────────────────────────────────────────────────── */
  {
    id: 18,
    slug: 'monitors',
    name: 'Monitors',
    sku: 'NSK-MONITOR',
    category: 'monitors',
    brand: 'Multi-brand',
    tagline: 'Office displays through to high refresh rate gaming.',
    description:
      'Monitors across sizes and refresh rates. For office use the priorities are resolution and eye comfort over long days; for gaming, refresh rate — but only if the graphics card can actually drive it, which we will check rather than assume.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/gaming-monitor.webp'],
    highlights: ['Office and gaming ranges', 'Refresh rate matched to your graphics card', 'Multiple sizes stocked', 'Mounting and arms available'],
    specGroups: [
      { title: 'Selection', specs: [{ label: 'Office', value: 'Resolution and comfort prioritised' }, { label: 'Gaming', value: 'Refresh rate — verified against your GPU' }, { label: 'Mounting', value: 'Stand or VESA arm' }] },
    ],
    features: [
      { title: 'GPU matched', description: 'A high refresh panel is wasted if the card cannot feed it. We check the pairing.', icon: 'Gauge' },
      { title: 'Cable included', description: 'Correct display cable for your output supplied — not an afterthought.', icon: 'Cable' },
      { title: 'Dual-screen setup', description: 'We will configure a two-monitor setup and the arms to hold it.', icon: 'Monitor' },
      { title: 'Dead pixel checked', description: 'Every panel is powered and inspected before it leaves.', icon: 'Check' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['graphics-cards', 'keyboards-mice', 'laptop-screens-panels'],
  },
  {
    id: 19,
    slug: 'keyboards-mice',
    name: 'Keyboards, Mice & Desk Accessories',
    sku: 'NSK-PERIPH',
    category: 'peripherals',
    brand: 'Multi-brand',
    tagline: 'Compact office boards through to backlit gaming sets.',
    description:
      'Keyboards from slim office boards to feature-rich backlit gaming models, ergonomic and gaming mice, mouse pads, speakers, web cameras and cooling fans. The things people actually touch all day, so they are worth choosing deliberately rather than accepting whatever came in the box.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/gaming-keyboard.webp'],
    highlights: [
      'Office and gaming keyboards',
      'Ergonomic and gaming mice, mouse pads',
      'Speakers and web cameras',
      'Cooling fans',
    ],
    specGroups: [
      { title: 'Range', specs: [{ label: 'Keyboards', value: 'Compact office to backlit gaming' }, { label: 'Mice', value: 'Ergonomic office and gaming sensors' }, { label: 'Audio & video', value: 'Speakers, web cameras' }, { label: 'Cooling', value: 'Case and CPU fans' }] },
    ],
    features: [
      { title: 'Try at the counter', description: 'Keyboards and mice are personal. Come and use them before deciding.', icon: 'Hand' },
      { title: 'Combo pricing', description: 'Keyboard and mouse sets priced better together.', icon: 'Package' },
      { title: 'Office quantities', description: 'Bulk rates when kitting out a whole office.', icon: 'Users' },
      { title: 'Ergonomics matter', description: 'If you type all day, we will steer you toward something that will not hurt.', icon: 'HeartPulse' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['monitors', 'printers-scanners', 'ups-units'],
  },
  {
    id: 20,
    slug: 'ups-units',
    name: 'UPS Units',
    sku: 'NSK-UPS',
    category: 'ups-power',
    brand: 'Multi-brand',
    tagline: 'Frontech, Zebronics and Lapcare — sized to your actual load.',
    description:
      'Uninterruptible power supplies to ride out cuts and protect against surges. Runtime depends entirely on connected load, so we size the unit against what you are actually plugging in rather than quoting an optimistic headline figure.',
    price: null,
    stock: 'in-stock',
    featured: true,
    images: ['products/ups-power.webp'],
    highlights: [
      'Frontech FT2561',
      'Zebronics U735',
      'Lapcare LAPON-750',
      'Runtime calculated against your real load',
    ],
    specGroups: [
      {
        title: 'Models stocked',
        specs: [
          { label: 'Frontech', value: 'FT2561' },
          { label: 'Zebronics', value: 'U735' },
          { label: 'Lapcare', value: 'LAPON-750' },
        ],
      },
      { title: 'Sizing', specs: [{ label: 'Runtime', value: 'Depends on connected load — calculated per site' }, { label: 'Protection', value: 'Power cuts and surge' }] },
    ],
    features: [
      { title: 'Runtime calculated honestly', description: 'We total your actual load. Headline runtime figures assume almost nothing plugged in.', icon: 'Calculator' },
      { title: 'Replaceable batteries', description: 'All units we stock take a serviceable battery — no unit is disposable.', icon: 'BatteryCharging' },
      { title: 'Protects your data', description: 'A sudden cut mid-write can corrupt files, not just interrupt work.', icon: 'ShieldCheck' },
      { title: 'CCTV and billing counters', description: 'Both need to stay up during a cut. We size for continuous operation.', icon: 'Video' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty (battery term differs from unit)',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['ups-batteries', 'cctv-camera-systems', 'keyboards-mice'],
  },
  {
    id: 21,
    slug: 'ups-batteries',
    name: 'UPS Batteries',
    sku: 'NSK-UPS-BATT',
    category: 'ups-power',
    brand: 'Multi-brand',
    tagline: 'Zebion, Zebronics and Lapcare replacements.',
    description:
      'Replacement UPS batteries. A UPS that beeps and cuts out instantly almost always needs a battery, not a new unit — batteries are consumable and typically need replacing every few years, at a fraction of the cost of the UPS itself.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/ups-power.webp'],
    highlights: ['Zebion', 'Zebronics', 'Lapcare', 'Old battery disposed of responsibly'],
    specGroups: [
      { title: 'Brands stocked', specs: [{ label: 'Zebion', value: 'Replacement batteries' }, { label: 'Zebronics', value: 'Replacement batteries' }, { label: 'Lapcare', value: 'Replacement batteries' }] },
    ],
    features: [
      { title: 'Do not replace the whole UPS', description: 'Instant cut-out on a power failure is a battery symptom. Bring it in first.', icon: 'AlertTriangle' },
      { title: 'Fitted and tested', description: 'We fit it and verify the runtime before you leave.', icon: 'Wrench' },
      { title: 'Correct rating matched', description: 'Battery specification matched to your unit — not just physically similar.', icon: 'ListChecks' },
      { title: 'Old battery taken', description: 'Lead-acid batteries need proper disposal. We handle it.', icon: 'Recycle' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['ups-units', 'cctv-camera-systems', 'cables-adapters'],
  },
  {
    id: 22,
    slug: 'pci-expansion-cards',
    name: 'PCI Expansion Cards',
    sku: 'NSK-PCI',
    category: 'expansion-cards',
    brand: 'Multi-brand',
    tagline: 'LAN, USB, serial, LPT, sound and VGA — PCI and PCI-E 1X.',
    description:
      'Expansion cards that add back a port a board has lost or never had. Genuinely useful in industrial and retail settings, where a serial or parallel port is still needed for a scale, printer or controller that works perfectly and is not being replaced.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/motherboard.webp'],
    highlights: [
      'LAN — PCI and PCI-E 1X',
      'Serial and parallel (LPT) — for legacy equipment',
      'USB, sound and VGA',
      'Revives ports on older boards',
    ],
    specGroups: [
      {
        title: 'Cards stocked',
        specs: [
          { label: 'Network', value: 'PCI LAN · PCI-E 1X LAN' },
          { label: 'Serial', value: 'PCI Serial · PCI-E 1X Serial' },
          { label: 'USB', value: 'PCI USB · PCI-E 1X USB' },
          { label: 'Audio', value: 'PCI Sound · PCI-E 1X Sound' },
          { label: 'Parallel', value: 'PCI-E 1X LPT' },
          { label: 'Display', value: 'PCI VGA' },
        ],
      },
    ],
    features: [
      { title: 'Keeps equipment in service', description: 'A ₹500 serial card can keep a working scale or controller running for years.', icon: 'Wrench' },
      { title: 'Slot type matters', description: 'PCI and PCI-E 1X are not interchangeable. We check your board first.', icon: 'ListChecks' },
      { title: 'Cheaper than a new PC', description: 'Adding a port is almost always cheaper than replacing the machine around it.', icon: 'Calculator' },
      { title: 'Drivers supplied', description: 'Installed and tested with the equipment where you bring it in.', icon: 'HardDriveDownload' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Warranty confirmed at purchase',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['ddr2-desktop-memory', 'desktop-motherboards', 'network-switches'],
  },

  /* ── Networking & CCTV ──────────────────────────────────────────────────── */
  {
    id: 23,
    slug: 'network-switches',
    name: 'Network Switches & Extenders',
    sku: 'NSK-NET-SW',
    category: 'networking',
    brand: 'Multi-brand',
    tagline: 'Switches, extenders, jacks and splitters.',
    description:
      'Switches to expand a network beyond the router, extenders to push a run past the 100-metre Ethernet limit, plus RJ45 jacks and splitters for tidy structured installs. Supplied on their own or as part of a full cabling job.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/network-switch.webp'],
    highlights: ['Switches in common port counts', 'Switch extenders for long runs', 'RJ45 jacks and splitters', 'Supplied loose or as a full install'],
    specGroups: [
      { title: 'Range', specs: [{ label: 'Switches', value: 'Multiple port counts' }, { label: 'Extenders', value: 'For runs beyond 100 m' }, { label: 'Termination', value: 'RJ45 jacks, splitters' }] },
    ],
    features: [
      { title: 'Sized to the site', description: 'Port count planned with growth in mind, so you are not re-buying in a year.', icon: 'Calculator' },
      { title: 'Cabling too', description: 'We supply and terminate the CAT6 runs, not just the box.', icon: 'Cable' },
      { title: 'Labelled and documented', description: 'Ports mapped and labelled so the next person can follow it.', icon: 'FileText' },
      { title: 'CCTV-ready', description: 'Network CCTV needs the switch planned around it. We do both.', icon: 'Video' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['cat6-cable', 'wifi-receivers', 'cctv-camera-systems'],
  },
  {
    id: 24,
    slug: 'cat6-cable',
    name: 'CAT6 Cable',
    sku: 'NSK-CAT6',
    category: 'cables',
    brand: 'Multi-brand',
    tagline: 'Reliable gigabit runs for home and office.',
    description:
      'CAT6 network cable for structured cabling. Cable outlives several generations of switch, so it is the wrong place to economise — a poor run costs far more in intermittent fault-finding later than the cable saved. Sold by the box or supplied and terminated.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/network-switch.webp'],
    highlights: ['Gigabit-rated runs', 'Sold by box or supplied and terminated', 'Suits home, office and CCTV', 'Terminated and tested per port on installs'],
    specGroups: [
      { title: 'Specification', specs: [{ label: 'Category', value: 'CAT6' }, { label: 'Use', value: 'Gigabit data, network CCTV, PoE devices' }, { label: 'Supply', value: 'By box, or installed and certified' }] },
    ],
    features: [
      { title: 'Do not economise on cable', description: 'Cable is the longest-lived part of a network and the hardest to replace later.', icon: 'ShieldCheck' },
      { title: 'Terminated properly', description: 'Punched down and tested per port, with results handed over.', icon: 'Check' },
      { title: 'Carries CCTV and power', description: 'The same run serves network cameras and PoE devices.', icon: 'Video' },
      { title: 'Trade quantities', description: 'Box and bulk pricing for installers.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty on cable; workmanship warranted on installs',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['network-switches', 'cctv-camera-systems', 'wifi-receivers'],
  },
  {
    id: 25,
    slug: 'wifi-receivers',
    name: 'WiFi Receivers',
    sku: 'NSK-WIFI-RX',
    category: 'networking',
    brand: 'Multi-brand',
    tagline: 'Add wireless to a desktop, or fix a weak signal.',
    description:
      'WiFi receivers for desktops with no built-in wireless, and for machines sitting in a weak-signal spot. USB and PCI options. Where the real problem is coverage rather than the receiver, we will say so — a better adapter cannot fix a dead zone.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/network-switch.webp'],
    highlights: ['USB and PCI options', 'Adds wireless to any desktop', 'Improves reception in weak spots', 'Coverage assessed honestly'],
    specGroups: [
      { title: 'Options', specs: [{ label: 'USB', value: 'Quickest fit, portable between machines' }, { label: 'PCI / PCI-E', value: 'Internal, usually better antenna' }] },
    ],
    features: [
      { title: 'Honest about dead zones', description: 'If coverage is the problem, an adapter will not fix it. We will recommend cabling instead.', icon: 'MessageSquare' },
      { title: 'Cable beats wireless', description: 'For a fixed desktop, a CAT6 run is faster and more reliable. We will offer both.', icon: 'Cable' },
      { title: 'Drivers installed', description: 'Fitted, driver-installed and connection tested.', icon: 'HardDriveDownload' },
      { title: 'Antenna position matters', description: 'We show you where to place it — it makes a real difference.', icon: 'Radio' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['network-switches', 'cat6-cable', 'pci-expansion-cards'],
  },
  {
    id: 26,
    slug: 'cctv-camera-systems',
    name: 'CCTV Camera Systems',
    sku: 'NSK-CCTV',
    category: 'cctv',
    brand: 'Multi-brand',
    tagline: 'Supplied, installed and supported — home, shop or commercial.',
    description:
      'Complete surveillance systems: cameras, recorder, storage, power and cabling, specified around what you actually need to see. Camera count matters far less than placement — four cameras covering the right sightlines beat eight pointed at walls, which is why we survey the site before quoting.',
    price: null,
    stock: 'in-stock',
    featured: true,
    badge: 'Installation included',
    images: ['products/network-switch.webp'],
    highlights: [
      'Home, shop and commercial installations',
      'Site survey before quoting',
      'Recorder, storage, power and cabling included',
      'Mobile viewing configured at handover',
    ],
    specGroups: [
      {
        title: 'What a system includes',
        specs: [
          { label: 'Cameras', value: 'Indoor and outdoor, specified per sightline' },
          { label: 'Recorder', value: 'Channel count sized to camera count plus growth' },
          { label: 'Storage', value: 'Surveillance-rated drive, sized to retention period' },
          { label: 'Power', value: 'Supply and UPS backup so it stays up during a cut' },
          { label: 'Cabling', value: 'Run, terminated and tested' },
        ],
      },
      {
        title: 'Service',
        specs: [
          { label: 'Survey', value: 'Before quotation' },
          { label: 'Installation', value: 'Included' },
          { label: 'Handover', value: 'Mobile app configured and demonstrated' },
          { label: 'Support', value: 'Troubleshooting and fault-finding' },
        ],
      },
    ],
    features: [
      { title: 'Placement over count', description: 'We survey sightlines first. Fewer cameras in the right places beats more in the wrong ones.', icon: 'Eye' },
      { title: 'Retention calculated', description: 'How many days you keep footage drives the drive size. We work it out with you.', icon: 'Calculator' },
      { title: 'Stays up in a power cut', description: 'A system that dies with the mains is no use. We size UPS backup in.', icon: 'BatteryCharging' },
      { title: 'Shown how to use it', description: 'Mobile viewing set up and demonstrated before we leave, not emailed later.', icon: 'Smartphone' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Equipment brand warranty; installation workmanship warranted',
    leadTime: 'Survey, then installation scheduled',
    relatedSlugs: ['hard-disk-drives', 'ups-units', 'cat6-cable'],
  },

  /* ── Printers & cables ──────────────────────────────────────────────────── */
  {
    id: 27,
    slug: 'printers-scanners',
    name: 'Printers, Scanners & Barcode Scanners',
    sku: 'NSK-PRINT',
    category: 'printers-scanners',
    brand: 'Multi-brand',
    tagline: 'For retail counters and offices.',
    description:
      'Printers, flatbed scanners and barcode scanners. For retail, the barcode scanner and its integration with your billing software matter more than the printer specification, so we test the scanner against your actual software before you commit.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/keyboard-office.webp'],
    highlights: ['Printers for office and retail', 'Flatbed document scanners', 'Barcode scanners for billing counters', 'Tested against your billing software'],
    specGroups: [
      { title: 'Range', specs: [{ label: 'Printers', value: 'Office and retail' }, { label: 'Scanners', value: 'Flatbed document' }, { label: 'Barcode', value: 'Handheld and counter-mount' }] },
    ],
    features: [
      { title: 'Tested with your software', description: 'A scanner that will not talk to your billing package is useless. We test first.', icon: 'ListChecks' },
      { title: 'Consumables considered', description: 'Cartridge cost over a year often exceeds the printer. We factor it in.', icon: 'Calculator' },
      { title: 'Set up on site', description: 'Installed, networked and drivers configured.', icon: 'Wrench' },
      { title: 'Retail counters', description: 'We understand billing counter workflow, not just the spec sheet.', icon: 'Store' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty',
    leadTime: 'Common models from stock; others to order',
    relatedSlugs: ['keyboards-mice', 'cables-adapters', 'monitors'],
  },
  {
    id: 28,
    slug: 'cables-adapters',
    name: 'Cables & Adapters',
    sku: 'NSK-CABLE',
    category: 'cables',
    brand: 'Multi-brand',
    tagline: 'Power, data, display, PCB and flex.',
    description:
      'The cables and adapters that jobs stall on. Power leads, data cables, display cables across connector types, laptop PCB and flex cables, plus the adapters that bridge older equipment to newer ports. Stocked broadly because a missing ₹200 cable can hold up a ₹50,000 machine.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/network-switch.webp'],
    highlights: [
      'Power, data and display cables',
      'Laptop PCB and flex cables',
      'Adapters between connector generations',
      'CAT6 network cable',
    ],
    specGroups: [
      { title: 'Categories', specs: [{ label: 'Power', value: 'Kettle leads, laptop DC, extension' }, { label: 'Data', value: 'USB, SATA, IDE' }, { label: 'Display', value: 'HDMI, VGA, DisplayPort and adapters' }, { label: 'Laptop internal', value: 'PCB cables, flex, ribbon' }] },
    ],
    features: [
      { title: 'Broad stock on purpose', description: 'A missing cable stops a job. We carry more variety than the volume justifies.', icon: 'Package' },
      { title: 'Adapters that work', description: 'Not every display adapter carries audio or high refresh. We know which do.', icon: 'ListChecks' },
      { title: 'Laptop internals', description: 'Flex and PCB cables most shops will not stock.', icon: 'Cpu' },
      { title: 'Tested at the counter', description: 'Bring the device and we will confirm the cable works before you pay.', icon: 'Check' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Replacement on failure — terms at purchase',
    leadTime: 'Available from counter stock',
    relatedSlugs: ['cat6-cable', 'laptop-keyboards-spares', 'monitors'],
  },

  /* ── Gaming ─────────────────────────────────────────────────────────────────
   *
   * Added to the spares catalogue as complete-product lines. Same conventions as
   * everything above: `price: null` because the business quotes rather than
   * lists, `rating: {value: 0, count: 0}` because no review data exists, and
   * `downloads: []` because no datasheets are published.
   *
   * Specific models are named only where they are the ranges actually carried;
   * where a spec would vary by what is on the shelf that week, the entry says
   * so instead of inventing a figure.
   */
  {
    id: 29,
    slug: 'gaming-laptops',
    name: 'Gaming Laptops',
    sku: 'NSK-LAP-GAMING',
    category: 'gaming-laptops',
    brand: 'Multi-brand',
    tagline: 'Configured, tested and supported here — not drop-shipped.',
    description:
      'Gaming laptops from the mainstream ranges, supplied with the setup work done: storage configured, thermals verified under load, and the warranty registered before you leave. The advantage of buying locally is not the price, it is that the machine has been run hard by someone before you rely on it, and that a thermal problem in month eight is a counter visit rather than a courier claim.',
    price: null,
    stock: 'in-stock',
    featured: true,
    badge: 'Popular',
    // NOT products/laptop-workstation.webp — despite the name that asset shows an
    // Alienware DESKTOP with visible branding, i.e. a competitor's product on our
    // laptop page. workstation.webp is an actual, unbranded laptop.
    images: ['products/workstation.webp'],
    highlights: [
      'ASUS TUF and ROG, MSI, Lenovo LOQ and Legion, HP Victus',
      'RTX 40-series and 50-series configurations',
      'Bench-tested under sustained load before handover',
      'Warranty registered at purchase',
    ],
    specGroups: [
      {
        title: 'Typical configurations',
        specs: [
          { label: 'Processor', value: 'Intel Core i5 / i7, AMD Ryzen 5 / 7' },
          { label: 'Graphics', value: 'RTX 4050 through 4070; 50-series as ranges land' },
          { label: 'Memory', value: '16 GB standard — upgradeable at purchase' },
          { label: 'Storage', value: 'NVMe SSD; second slot free on most chassis' },
          { label: 'Display', value: '15.6" or 16", 144 Hz and above' },
        ],
      },
      {
        title: 'What we do before handover',
        specs: [
          { label: 'Thermal check', value: 'Sustained load run, temperatures logged' },
          { label: 'Storage', value: 'Extra NVMe fitted if specified' },
          { label: 'Memory', value: 'Upgraded to 32 GB on request' },
        ],
      },
    ],
    features: [
      { title: 'Tested before you get it', description: 'Every machine runs a sustained load test. A laptop that throttles on the bench goes back, not to you.', icon: 'Cpu' },
      { title: 'Upgraded at purchase', description: 'Adding RAM or a second SSD at the counter costs less than doing it later and keeps the warranty intact.', icon: 'MemoryStick' },
      { title: 'Local warranty support', description: 'We handle the claim. You are not on a helpline explaining a fault to someone reading a script.', icon: 'ShieldCheck' },
      { title: 'Honest fit advice', description: 'If an RTX 4050 does what you need, we will say so rather than sell you the 4070.', icon: 'ListChecks' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Manufacturer warranty — registered at purchase, claims handled here',
    leadTime: 'Popular configurations from stock; others 2–5 days',
    relatedSlugs: ['gaming-peripherals', 'cpu-cooling', 'monitors'],
  },
  {
    id: 30,
    slug: 'cpu-cooling',
    name: 'CPU Cooling & Case Fans',
    sku: 'NSK-COOL',
    category: 'cooling',
    brand: 'Multi-brand',
    tagline: 'Air and liquid, sized to the processor and the cabinet.',
    description:
      'Tower air coolers, AIO liquid coolers and case fans, plus thermal paste. Most builds do not need liquid — a good tower cooler handles a mid-range processor quietly and has nothing to fail. We stock both and will tell you which your build actually calls for, including the cabinet clearance check that decides whether a 240 mm radiator physically fits.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/liquid-cooler.webp'],
    highlights: [
      'Tower air coolers — the right answer for most builds',
      'AIO liquid, 240 mm and 360 mm',
      'ARGB and plain case fans',
      'Thermal paste and reapplication at the counter',
    ],
    specGroups: [
      {
        title: 'Air cooling',
        specs: [
          { label: 'Type', value: 'Single and dual tower' },
          { label: 'Suits', value: 'Office builds through mid-range gaming' },
          { label: 'Clearance', value: 'Checked against your cabinet before purchase' },
        ],
      },
      {
        title: 'Liquid cooling',
        specs: [
          { label: 'Radiator', value: '240 mm and 360 mm AIO' },
          { label: 'Lighting', value: 'ARGB on most units' },
          { label: 'Fitment', value: 'Cabinet must support the radiator — we verify first' },
        ],
      },
    ],
    features: [
      { title: 'Clearance checked first', description: 'A 360 mm radiator that does not fit your cabinet is a returned part and a wasted afternoon. We measure before you buy.', icon: 'ListChecks' },
      { title: 'Air where air is right', description: 'Liquid looks better in a windowed case. For a mid-range CPU a tower cooler is quieter, cheaper and has no pump to fail.', icon: 'Fan' },
      { title: 'Repaste service', description: 'Dried paste is behind most thermal complaints on machines past three years. Bring it in.', icon: 'Wrench' },
      { title: 'Fitted with the build', description: 'Buy the cooler with a custom build and fitting is part of the job.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty; AIO units typically longer — confirmed at purchase',
    leadTime: 'From counter stock',
    relatedSlugs: ['atx-cabinets', 'gaming-smps', 'rgb-gaming-cabinets'],
  },
  {
    id: 31,
    slug: 'gaming-peripherals',
    name: 'Gaming Keyboards, Mice & Headsets',
    sku: 'NSK-GEAR',
    category: 'gaming-gear',
    brand: 'Multi-brand',
    tagline: 'Try the switches at the counter before you commit.',
    description:
      'Mechanical keyboards, gaming mice, headsets and pads — the tier above the office peripherals we stock for volume. Switch feel is personal and unphotographable, so the boards are out on the counter to type on. That is the whole reason to buy these locally rather than online: five minutes on a blue versus a red switch settles a decision no spec sheet will.',
    price: null,
    stock: 'in-stock',
    featured: true,
    badge: 'Try in store',
    images: ['products/gaming-keyboard.webp'],
    highlights: [
      'Mechanical boards — blue, red and brown switches on the counter to try',
      'Wired and wireless gaming mice',
      'Headsets from budget to mid-range',
      'Extended and hard pads',
    ],
    specGroups: [
      {
        title: 'Keyboards',
        specs: [
          { label: 'Switches', value: 'Blue (clicky), red (linear), brown (tactile)' },
          { label: 'Layouts', value: 'Full size, TKL and 60%' },
          { label: 'Backlight', value: 'Single colour and RGB' },
        ],
      },
      {
        title: 'Mice and audio',
        specs: [
          { label: 'Mice', value: 'Wired and wireless, up to 26K DPI sensors' },
          { label: 'Headsets', value: 'Stereo and virtual 7.1, wired and wireless' },
          { label: 'Pads', value: 'Standard, extended and hard surface' },
        ],
      },
    ],
    features: [
      { title: 'Switches on the counter', description: 'Blue sounds satisfying in a video and irritates an open-plan office. Type on all three before deciding.', icon: 'Keyboard' },
      { title: 'Weight matters more than DPI', description: 'Nobody games at 26,000 DPI. Mouse weight and shape decide comfort — hold a few.', icon: 'Mouse' },
      { title: 'Bundled with builds', description: 'Buying a full setup gets the peripherals priced as part of the build.', icon: 'Package' },
      { title: 'Honest about tiers', description: 'The mid-range headset is usually the sweet spot. We will point at it rather than the flagship.', icon: 'Headphones' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Brand warranty — typically 1 to 2 years, confirmed at purchase',
    leadTime: 'From counter stock',
    relatedSlugs: ['gaming-laptops', 'monitors', 'rgb-gaming-cabinets'],
  },
  {
    id: 32,
    slug: 'gaming-desks-chairs',
    name: 'Gaming Desks & Chairs',
    sku: 'NSK-SETUP',
    category: 'setup-furniture',
    brand: 'Multi-brand',
    tagline: 'Assembled and delivered with the build.',
    description:
      'Gaming chairs and desks so the station arrives complete rather than in three deliveries across two weeks. Supplied assembled where we deliver locally. Worth saying plainly: a chair you sit in for eight hours a day matters more to you than most of the components in the machine, and the cheapest ones are cheap in the parts that hold your weight.',
    price: null,
    stock: 'in-stock',
    featured: false,
    images: ['products/gaming-pc-rgb.webp'],
    highlights: [
      'Gaming and ergonomic office chairs',
      'Desks from compact to full battlestation widths',
      'Assembled on local delivery',
      'Supplied together with the build',
    ],
    specGroups: [
      {
        title: 'Chairs',
        specs: [
          { label: 'Types', value: 'Racing-style gaming, mesh ergonomic' },
          { label: 'Adjustment', value: 'Height, recline, armrests — varies by model' },
          { label: 'Try first', value: 'Floor models to sit in before ordering' },
        ],
      },
      {
        title: 'Desks',
        specs: [
          { label: 'Widths', value: '100 cm through 160 cm' },
          { label: 'Surface', value: 'Standard and carbon-texture finishes' },
          { label: 'Cable routing', value: 'Grommets and under-desk trays on most models' },
        ],
      },
    ],
    features: [
      { title: 'Sit in it first', description: 'Chair comfort does not survive a product photo. Floor models are there to be used.', icon: 'Armchair' },
      { title: 'Delivered assembled', description: 'Local delivery includes assembly. No flat-pack evening.', icon: 'Truck' },
      { title: 'Measured to your room', description: 'Tell us the alcove width and we will stop you buying a desk that does not fit.', icon: 'Ruler' },
      { title: 'Priced with the build', description: 'Furniture bought alongside a system is quoted as one job.', icon: 'Package' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Manufacturer warranty — terms vary by model, confirmed at purchase',
    leadTime: 'Common models from stock; others 3–7 days',
    relatedSlugs: ['gaming-peripherals', 'monitors', 'rgb-gaming-cabinets'],
  },

  /* ── Gaming desktops ────────────────────────────────────────────────────────
   *
   * ⚠ NEEDS CONFIRMATION BEFORE PUBLISHING ⚠
   *
   * This is an NSK-assembled build, NOT a resold prebuilt. It was specified from
   * a Desertcart listing the owner supplied, but that page could not be read
   * (HTTP 403) and the URL was truncated at the GPU, so the exact configuration
   * is unknown — search surfaced both RTX 5080 and RTX 5090 variants under the
   * same "Titan" name.
   *
   * VERIFIED (Intel's own product page title + multiple independent listings):
   *   - Core Ultra 9 285K · 24 cores / 24 threads (8 P + 16 E) · 36 MB cache
   *     · up to 5.70 GHz
   *
   * NOT VERIFIED — every value below marked ⚠ is a placeholder taken from a
   * third-party reseller listing, not from a manufacturer source. Intel.com and
   * TechPowerUp both blocked automated reads. Confirm against the parts you
   * actually source, then delete this block and the ⚠ markers.
   */
  {
    id: 33,
    slug: 'nsk-ultra-9-gaming-build',
    name: 'NSK Ultra 9 Gaming Build',
    sku: 'NSK-PC-U9',
    category: 'gaming-desktops',
    brand: 'NSK Computer Zone',
    tagline: 'Core Ultra 9 285K, assembled and load-tested on our bench.',
    description:
      'A flagship build around the Intel Core Ultra 9 285K — 24 cores across eight performance and sixteen efficiency cores, boosting to 5.70 GHz. Assembled here from named components, every one of which is listed on your quotation rather than hidden behind a model number. The machine is run under sustained load before you collect it, and if a part fails inside warranty you bring it to the counter instead of arguing with a courier.',
    price: null,
    stock: 'in-stock',
    featured: true,
    badge: 'Flagship build',
    images: ['products/motherboard.webp'],
    highlights: [
      'Intel Core Ultra 9 285K — 24 cores / 24 threads, up to 5.70 GHz',
      'Built to your specification, not a fixed SKU',
      'Load-tested on the bench before handover',
      'Every component named on the quotation',
    ],
    specGroups: [
      {
        title: 'Processor — confirmed',
        specs: [
          { label: 'CPU', value: 'Intel Core Ultra 9 285K' },
          { label: 'Cores / threads', value: '24 cores (8 P + 16 E) · 24 threads' },
          { label: 'Max boost', value: 'Up to 5.70 GHz' },
          { label: 'Cache', value: '36 MB' },
        ],
      },
      {
        title: 'Configured to order',
        specs: [
          { label: 'Graphics', value: '⚠ CONFIRM — RTX 5080 16 GB or RTX 5090 32 GB' },
          { label: 'Memory', value: '⚠ CONFIRM — 32 GB DDR5' },
          { label: 'Storage', value: '⚠ CONFIRM — 2 TB NVMe SSD' },
          { label: 'Motherboard', value: '⚠ CONFIRM — Z890 chipset board' },
          { label: 'Power supply', value: '⚠ CONFIRM — 1000 W 80+ Gold' },
          { label: 'Cooling', value: '⚠ CONFIRM — 360 mm AIO liquid cooler' },
          { label: 'Cabinet', value: '⚠ CONFIRM — tempered glass, airflow layout' },
        ],
      },
      {
        title: 'Before handover',
        specs: [
          { label: 'Bench test', value: 'Sustained load run, temperatures logged' },
          { label: 'Assembly', value: 'Cable routing and airflow set up in-store' },
          { label: 'Warranty', value: 'Component warranties registered, claims handled here' },
        ],
      },
    ],
    features: [
      { title: 'Specified, not shrink-wrapped', description: 'Tell us the games and the resolution. We size the GPU and the power supply to that, rather than selling a fixed bundle.', icon: 'ListChecks' },
      { title: 'Tested before you take it', description: 'A sustained load run with temperatures logged. A build that throttles on the bench does not leave the shop.', icon: 'Cpu' },
      { title: 'Every part named', description: 'The quotation lists the actual board, PSU and memory. No "550 W PSU" hiding an unbranded unit.', icon: 'Package' },
      { title: 'Serviced where you bought it', description: 'Upgrades, repaste and warranty claims are a counter visit, not a support ticket.', icon: 'Wrench' },
    ],
    downloads: [],
    rating: { value: 0, count: 0 },
    warranty: 'Component warranties registered at purchase — terms confirmed on the quotation',
    leadTime: 'Built to order — typically 2 to 5 days depending on parts',
    relatedSlugs: ['cpu-cooling', 'rgb-gaming-cabinets', 'gaming-peripherals'],
  },
];

/* ── Query helpers (mirrored by the API's index endpoint) ──────────────────── */

export function getProduct(slug) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category) {
  return products.filter((product) => product.category === category);
}

export function getFeaturedProducts(limit = 6) {
  return products.filter((product) => product.featured).slice(0, limit);
}

export function getRelatedProducts(slug, limit = 3) {
  const product = getProduct(slug);
  if (!product) return [];
  const related = product.relatedSlugs.map(getProduct).filter((p) => !!p);
  if (related.length >= limit) return related.slice(0, limit);
  // Backfill from the same category so the rail is never short.
  const fill = products.filter(
    (p) => p.category === product.category && p.slug !== slug && !related.some((r) => r.slug === p.slug)
  );
  return [...related, ...fill].slice(0, limit);
}

/** Brands we actually stock, as named on the source site. */
export const brands = [...new Set(products.map((p) => p.brand))].sort();
