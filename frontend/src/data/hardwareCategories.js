/**
 * Hardware explorer — §10.
 *
 * A browsing structure, not a product list: each category names the families
 * we carry and what actually decides the choice. `items` are sub-families, so
 * the page can render a category and drill into it without a second fetch.
 */
export const hardwareCategories = [
  {
    id: 'processors',
    name: 'Processors',
    blurb: 'Intel and AMD, current generation and service spares.',
    image: 'categories/processors.webp',
    icon: 'Cpu',
    decidingFactor: 'Core count for parallel work, clock speed for single-threaded. The socket then fixes your board choice.',
    items: [
      { name: 'Intel', detail: 'Core i3, i5, i7 and i9 — 2nd generation through current, including service spares.' },
      { name: 'AMD',   detail: 'Ryzen 3, 5, 7 and 9 on AM4 and AM5, plus Threadripper on request.' },
    ],
  },
  {
    id: 'graphics-cards',
    name: 'Graphics Cards',
    blurb: 'NVIDIA and AMD, from display output to 4K gaming.',
    image: 'categories/graphics-cards.webp',
    icon: 'MonitorPlay',
    decidingFactor: 'VRAM sets the ceiling for resolution and model size. Card length has to clear the cabinet.',
    items: [
      { name: 'NVIDIA', detail: 'GeForce RTX for gaming and CUDA work; professional cards where the software is certified.' },
      { name: 'AMD',    detail: 'Radeon RX for gaming and general acceleration.' },
    ],
  },
  {
    id: 'motherboards',
    name: 'Motherboards',
    blurb: 'Intel and AMD platforms, micro-ATX through ATX.',
    image: 'categories/motherboards.webp',
    icon: 'CircuitBoard',
    decidingFactor: 'The socket must match the CPU and the memory type must match the kit. Everything else is features.',
    items: [
      { name: 'Intel platform', detail: 'H, B and Z series for current LGA sockets.' },
      { name: 'AMD platform',   detail: 'A, B and X series for AM4 and AM5.' },
    ],
  },
  {
    id: 'memory',
    name: 'Memory',
    blurb: 'DDR4 and DDR5 for desktop and laptop.',
    image: 'categories/ram.webp',
    icon: 'MemoryStick',
    decidingFactor: 'Generation is fixed by the board. Beyond that, matched pairs beat a single larger stick.',
    items: [
      { name: 'DDR4', detail: '4 GB to 32 GB modules, desktop DIMM and laptop SODIMM.' },
      { name: 'DDR5', detail: '8 GB to 32 GB modules, 4800 MT/s and faster with EXPO/XMP.' },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    blurb: 'NVMe, SATA, mechanical and external.',
    image: 'categories/storage.webp',
    icon: 'HardDrive',
    decidingFactor: 'NVMe for the system drive, always. Capacity per rupee still favours mechanical for archives.',
    items: [
      { name: 'NVMe SSD', detail: 'Gen3 and Gen4 M.2 drives, 256 GB to 4 TB.' },
      { name: 'SATA SSD', detail: '2.5-inch drives for upgrades to older machines.' },
      { name: 'HDD',      detail: 'Desktop and surveillance-rated drives for bulk storage.' },
      { name: 'External', detail: 'Portable SSDs and USB drives for backup and transfer.' },
    ],
  },
  {
    id: 'power',
    name: 'Power',
    blurb: 'Power supplies and UPS protection.',
    image: 'categories/power-supplies.webp',
    icon: 'Zap',
    decidingFactor: 'Size on real draw plus headroom — not on the biggest number that fits the budget.',
    items: [
      { name: 'PSU', detail: '450 W to 1200 W, 80+ Bronze through Platinum, modular options.' },
      { name: 'UPS', detail: 'Line-interactive units from 600 VA, with battery replacement service.' },
    ],
  },
  {
    id: 'cooling',
    name: 'Cooling',
    blurb: 'Air, liquid and case airflow.',
    image: 'categories/cooling.webp',
    icon: 'Fan',
    decidingFactor: 'Rated dissipation against the CPU it is cooling. Airflow through the case matters as much as the cooler.',
    items: [
      { name: 'Air cooling',    detail: 'Single and dual-tower coolers, low-profile for compact builds.' },
      { name: 'Liquid cooling', detail: '240 mm and 360 mm all-in-one radiators.' },
      { name: 'Case fans',      detail: 'Airflow and static-pressure fans, PWM and ARGB.' },
    ],
  },
  {
    id: 'cabinets',
    name: 'Cabinets',
    blurb: 'Gaming, professional, compact and premium.',
    image: 'categories/cabinets.webp',
    icon: 'Box',
    decidingFactor: 'Board form factor, GPU clearance and radiator support. Everything else is looks.',
    items: [
      { name: 'Gaming',       detail: 'Tempered glass, ARGB, mesh fronts for airflow.' },
      { name: 'Professional', detail: 'Sound-damped and understated, front-panel USB-C.' },
      { name: 'Compact',      detail: 'Micro-ATX and mini-ITX for small desks.' },
      { name: 'Premium',      detail: 'Full towers with proper cable management and filtering.' },
    ],
  },
  {
    id: 'monitors',
    name: 'Monitors',
    blurb: 'Gaming, professional and ultrawide panels.',
    image: 'categories/office-pc.webp',
    icon: 'Monitor',
    decidingFactor: 'Match refresh rate to what the GPU actually renders; match colour accuracy to the work.',
    items: [
      { name: 'Gaming',       detail: '144 Hz and above, 1080p and 1440p, adaptive sync.' },
      { name: 'Professional', detail: 'Colour-accurate IPS, height adjustable, 1440p and 4K.' },
      { name: 'Ultrawide',    detail: '21:9 and 32:9 for timelines, trading and multitasking.' },
    ],
  },
];

export const findCategory = (id) => hardwareCategories.find((c) => c.id === id);
