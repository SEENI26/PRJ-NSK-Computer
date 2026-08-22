/**
 * Gaming builds — §8.
 *
 * `specifications` names component CLASSES, not exact SKUs. Stock moves weekly
 * in this trade, and a page promising a specific card we cannot source is
 * worse than one describing the tier honestly. Exact parts are confirmed on
 * enquiry.
 *
 * `recommendedAccessories` holds ids from data/accessories.js — that join is
 * what makes a build and its setup feel like one recommendation (§13).
 */
export const gamingBuilds = [
  {
    id: 'gaming-starter',
    name: 'Starter Gaming',
    type: 'gaming',
    tier: 1,
    tagline: 'Esports at high frame rates',
    description:
      'For students and casual players. Runs Valorant, CS2, Dota and GTA at 1080p with frames to spare, and leaves an upgrade path open on both the GPU and the memory.',
    bestFor: ['1080p esports', 'Students', 'First custom build'],
    image: 'products/gaming-pc.webp',
    accent: 'from-cyan-400/20',
    specifications: {
      cpu:         '6-core AMD Ryzen 5 / Intel Core i5',
      gpu:         'NVIDIA RTX 4060 class, 8 GB',
      motherboard: 'B650 / B760 chipset, Wi-Fi',
      ram:         '16 GB DDR5 (2 × 8, dual channel)',
      storage:     '1 TB NVMe Gen4 SSD',
      psu:         '550–650 W 80+ Bronze',
      cooling:     'Tower air cooler',
      cabinet:     'Mesh-front airflow cabinet',
    },
    performance: [
      { label: '1080p esports',  value: 'High refresh',   pct: 92 },
      { label: '1080p AAA',      value: 'High settings',  pct: 74 },
      { label: '1440p gaming',   value: 'Medium–high',    pct: 48 },
    ],
    recommendedAccessories: ['gaming-monitor', 'mechanical-keyboard', 'gaming-mouse', 'gaming-headset', 'mouse-pad'],
  },
  {
    id: 'gaming-performance',
    name: 'Performance Gaming',
    type: 'gaming',
    tier: 2,
    tagline: 'Competitive frames at 1440p',
    description:
      'The build most people actually want. Comfortable at 1440p in current titles, and fast enough that a 144 Hz panel is the limiting factor rather than the machine.',
    bestFor: ['1440p gaming', 'High-refresh play', 'Streaming basics'],
    image: 'products/gaming-pc-rgb.webp',
    accent: 'from-cyan-400/30',
    popular: true,
    specifications: {
      cpu:         '8-core AMD Ryzen 7 / Intel Core i7',
      gpu:         'NVIDIA RTX 4070 class, 12 GB',
      motherboard: 'B650 / B760 chipset, PCIe 4.0',
      ram:         '32 GB DDR5-6000 (2 × 16)',
      storage:     '1 TB NVMe Gen4 + 2 TB secondary',
      psu:         '750–850 W 80+ Gold',
      cooling:     '240 mm liquid AIO',
      cabinet:     'Tempered-glass gaming cabinet',
    },
    performance: [
      { label: '1440p AAA',     value: 'High–ultra',    pct: 88 },
      { label: '1440p esports', value: 'Very high refresh', pct: 96 },
      { label: '4K gaming',     value: 'Medium–high',   pct: 58 },
    ],
    recommendedAccessories: ['gaming-monitor', 'mechanical-keyboard', 'gaming-mouse', 'gaming-headset', 'mouse-pad', 'gaming-chair'],
  },
  {
    id: 'gaming-high',
    name: 'High Performance',
    type: 'gaming',
    tier: 3,
    tagline: 'AAA at 1440p and 4K',
    description:
      'Built for maximum-setting play at 1440p and a real 4K experience in most titles. Cooling and power are specified with headroom so sustained sessions do not throttle.',
    bestFor: ['4K gaming', 'Ray tracing', 'High-refresh 1440p'],
    image: 'products/gaming-pc-apex.webp',
    accent: 'from-cyan-300/35',
    specifications: {
      cpu:         '8–12 core Ryzen 7/9 or Core i7/i9',
      gpu:         'NVIDIA RTX 4070 Ti / 4080 class, 16 GB',
      motherboard: 'X670 / Z790 chipset, PCIe 5.0',
      ram:         '32 GB DDR5-6000 CL30',
      storage:     '2 TB NVMe Gen4 + 2 TB secondary',
      psu:         '850–1000 W 80+ Gold',
      cooling:     '360 mm liquid AIO',
      cabinet:     'Premium airflow cabinet, glass panel',
    },
    performance: [
      { label: '4K gaming',   value: 'High–ultra',  pct: 86 },
      { label: '1440p AAA',   value: 'Ultra',       pct: 97 },
      { label: 'Ray tracing', value: 'High',        pct: 82 },
    ],
    recommendedAccessories: ['gaming-monitor', 'mechanical-keyboard', 'gaming-mouse', 'gaming-headset', 'mouse-pad', 'streaming-kit'],
  },
  {
    id: 'gaming-ultimate',
    name: 'Ultimate Gaming',
    type: 'gaming',
    tier: 4,
    tagline: 'No compromises, streaming included',
    description:
      'An enthusiast machine: top-tier graphics, high core count for simultaneous encoding, and a chassis specified for silence under sustained load rather than peak numbers alone.',
    bestFor: ['4K ultra', 'Streaming and gaming', 'Enthusiast builds'],
    image: 'products/nvidia-rtx.webp',
    accent: 'from-cyan-300/45',
    specifications: {
      cpu:         '16-core Ryzen 9 / Core i9',
      gpu:         'NVIDIA RTX 4080 / 4090 class',
      motherboard: 'X670E / Z790 flagship, PCIe 5.0',
      ram:         '64 GB DDR5-6000 CL30',
      storage:     '2 TB NVMe Gen5 + 4 TB Gen4',
      psu:         '1000–1200 W 80+ Platinum',
      cooling:     '360 mm AIO, full fan curve tuning',
      cabinet:     'Full-tower, sound-damped, glass',
    },
    performance: [
      { label: '4K ultra',        value: 'Very high',  pct: 97 },
      { label: 'Stream + play',   value: 'Very high',  pct: 94 },
      { label: 'Ray tracing',     value: 'Very high',  pct: 95 },
    ],
    recommendedAccessories: ['gaming-monitor', 'mechanical-keyboard', 'gaming-mouse', 'gaming-headset', 'mouse-pad', 'streaming-kit', 'gaming-chair', 'controller'],
  },
];

/** Spec rows in a fixed, readable order — CPU and GPU first, chassis last. */
export const SPEC_ORDER = [
  ['cpu', 'Processor'],
  ['gpu', 'Graphics'],
  ['motherboard', 'Motherboard'],
  ['ram', 'Memory'],
  ['storage', 'Storage'],
  ['psu', 'Power supply'],
  ['cooling', 'Cooling'],
  ['cabinet', 'Cabinet'],
];
