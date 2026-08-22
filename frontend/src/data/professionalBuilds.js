/**
 * Professional workstations — §9.
 *
 * Same shape as gamingBuilds so every card, grid and spec table is shared
 * between the two pages rather than duplicated (§25). What differs is the
 * content and the accent, not the component tree.
 */
export const professionalBuilds = [
  {
    id: 'pro-office',
    name: 'Office Workstation',
    type: 'professional',
    tier: 1,
    tagline: 'Quiet, reliable, all-day',
    description:
      'For accounts, reception, billing and general office work. Specified for silence and uptime rather than peak numbers, with enough memory that a browser and an ERP client can coexist.',
    bestFor: ['Office and billing', 'Fleet deployment', 'Front desk'],
    image: 'products/office-pc.webp',
    specifications: {
      cpu:         '6-core Intel Core i5 / Ryzen 5',
      gpu:         'Integrated graphics',
      motherboard: 'B-series micro-ATX',
      ram:         '16 GB DDR4 / DDR5',
      storage:     '512 GB NVMe SSD',
      psu:         '450–550 W 80+ Bronze',
      cooling:     'Low-noise air cooler',
      cabinet:     'Compact micro-ATX cabinet',
    },
    performance: [
      { label: 'Office and web',   value: 'Very high', pct: 95 },
      { label: 'Multi-tasking',    value: 'High',      pct: 76 },
      { label: 'Light creative',   value: 'Medium',    pct: 44 },
    ],
    recommendedAccessories: ['office-keyboard', 'wireless-mouse', 'pro-monitor', 'ups', 'surge-protection'],
  },
  {
    id: 'pro-developer',
    name: 'Developer Workstation',
    type: 'professional',
    tier: 2,
    tagline: 'Containers, compilers, many tabs',
    description:
      'Specified around core count and memory rather than graphics. Comfortable with a large codebase, a container stack and a local database running at once, on a dual-monitor desk.',
    bestFor: ['Software development', 'Containers and VMs', 'Dual monitors'],
    image: 'products/laptop-workstation.webp',
    popular: true,
    specifications: {
      cpu:         '8–12 core Ryzen 7/9 or Core i7',
      gpu:         'Entry discrete or integrated',
      motherboard: 'B650 / B760, dual M.2',
      ram:         '32–64 GB DDR5',
      storage:     '1 TB NVMe Gen4 + 2 TB secondary',
      psu:         '650–750 W 80+ Gold',
      cooling:     'Tower air or 240 mm AIO',
      cabinet:     'Sound-damped mid tower',
    },
    performance: [
      { label: 'Compile and build', value: 'Very high', pct: 92 },
      { label: 'Containers / VMs',  value: 'Very high', pct: 90 },
      { label: 'Quiet operation',   value: 'High',      pct: 84 },
    ],
    recommendedAccessories: ['office-keyboard', 'wireless-mouse', 'pro-monitor', 'docking-station', 'webcam', 'ups'],
  },
  {
    id: 'pro-creator',
    name: 'Creator Workstation',
    type: 'professional',
    tier: 3,
    tagline: 'Editing, colour and export',
    description:
      'Built for video, photo and design work: a strong GPU for timeline playback and export, plenty of memory for large projects, and fast scratch storage so the drive is never the bottleneck.',
    bestFor: ['Video editing', 'Photo and design', 'Colour work'],
    image: 'categories/workstation.webp',
    specifications: {
      cpu:         '12–16 core Ryzen 9 / Core i9',
      gpu:         'RTX 4070–4080 class, 12–16 GB',
      motherboard: 'X670 / Z790, PCIe 5.0',
      ram:         '64 GB DDR5',
      storage:     '2 TB NVMe Gen4 OS + 4 TB scratch',
      psu:         '850–1000 W 80+ Gold',
      cooling:     '360 mm liquid AIO',
      cabinet:     'High-airflow mid tower',
    },
    performance: [
      { label: 'Timeline playback', value: 'Very high', pct: 93 },
      { label: 'Export / encode',   value: 'Very high', pct: 91 },
      { label: 'Colour accuracy',   value: 'Panel-led', pct: 80 },
    ],
    recommendedAccessories: ['pro-monitor', 'office-keyboard', 'wireless-mouse', 'usb-microphone', 'desk-speakers', 'ups'],
  },
  {
    id: 'pro-engineering',
    name: 'Engineering Workstation',
    type: 'professional',
    tier: 4,
    tagline: 'CAD, simulation, large assemblies',
    description:
      'For CAD, BIM and simulation. Professional graphics where the software is certified for it, high memory for large assemblies, and storage sized for project archives held locally.',
    bestFor: ['CAD and BIM', 'Simulation', 'Large assemblies'],
    image: 'products/motherboard.webp',
    specifications: {
      cpu:         'High-clock 12–16 core',
      gpu:         'Professional or RTX 4080 class',
      motherboard: 'Workstation chipset, 4 DIMM',
      ram:         '64–128 GB, ECC where supported',
      storage:     '2 TB NVMe + 8 TB project storage',
      psu:         '1000 W 80+ Platinum',
      cooling:     '360 mm AIO or dual-tower air',
      cabinet:     'Full tower, serviceable',
    },
    performance: [
      { label: 'CAD viewport',     value: 'Very high', pct: 92 },
      { label: 'Simulation',       value: 'High',      pct: 86 },
      { label: 'Large assemblies', value: 'Very high', pct: 90 },
    ],
    recommendedAccessories: ['pro-monitor', 'office-keyboard', 'wireless-mouse', 'docking-station', 'ups', 'lan-accessories'],
  },
  {
    id: 'pro-ai',
    name: 'AI / Rendering Workstation',
    type: 'professional',
    tier: 5,
    tagline: 'VRAM-bound work, rendered locally',
    description:
      'For local model work and GPU rendering, where VRAM and sustained power delivery decide what is possible. Specified for continuous full load, not bursts, with cooling and a PSU to match.',
    bestFor: ['Local AI / ML', 'GPU rendering', 'Batch compute'],
    image: 'products/nvidia-rtx.webp',
    specifications: {
      cpu:         '16-core Ryzen 9 / Threadripper',
      gpu:         'RTX 4090 class, 24 GB — multi-GPU on request',
      motherboard: 'Workstation board, multi-slot spacing',
      ram:         '128 GB DDR5',
      storage:     '4 TB NVMe Gen4 + archive',
      psu:         '1200–1600 W 80+ Platinum',
      cooling:     '360 mm AIO, high static-pressure fans',
      cabinet:     'Full tower, maximum airflow',
    },
    performance: [
      { label: 'GPU compute',      value: 'Very high', pct: 96 },
      { label: 'Render throughput', value: 'Very high', pct: 94 },
      { label: 'Sustained load',    value: 'Very high', pct: 92 },
    ],
    recommendedAccessories: ['pro-monitor', 'office-keyboard', 'wireless-mouse', 'ups', 'lan-accessories', 'surge-protection'],
  },
];
