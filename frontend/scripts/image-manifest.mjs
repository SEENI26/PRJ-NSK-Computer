/**
 * Single source of truth for every downloadable image asset.
 *
 * `src` values are Unsplash photo IDs (Unsplash License — free for commercial use,
 * no attribution required, though CREDITS.md is generated as good practice).
 *
 * To swap in your own photography: just drop a file with the SAME path/filename into
 * `public/images/**`. The fetch script never overwrites an existing file unless run
 * with `--force`, and nothing in the app code references Unsplash directly.
 */

/** Standard aspect presets used across the design system. */
export const PRESETS = {
  hero: { width: 2400, height: 1350 }, // 16:9 cinematic
  banner: { width: 1920, height: 800 }, // 12:5 wide band
  card: { width: 1200, height: 900 }, // 4:3 product card
  wide: { width: 1600, height: 900 }, // 16:9 editorial
  portrait: { width: 900, height: 1200 }, // 3:4 tall
  square: { width: 800, height: 800 }, // 1:1
  avatar: { width: 400, height: 400 }, // 1:1 small
};

/**
 * @typedef {Object} Asset
 * @property {string} file    Path relative to public/images
 * @property {string} src     Unsplash photo id
 * @property {keyof PRESETS} preset
 * @property {string} alt     SEO alt text baked into the generated alt-text map
 */

/** @type {Asset[]} */
export const ASSETS = [
  // ── hero ──────────────────────────────────────────────────────────────────
  { file: 'hero/hero-abstract-tech.webp', src: '1635070041078-e363dbe005cb', preset: 'hero', alt: 'Abstract blue technology light forms representing high performance computing' },
  { file: 'hero/hero-gaming-rig.webp', src: '1616588589676-62b3bd4ff6d2', preset: 'hero', alt: 'Custom built gaming PC with RGB lighting inside a tempered glass case' },
  { file: 'hero/hero-circuit.webp', src: '1518770660439-4636190af475', preset: 'hero', alt: 'Macro photograph of a computer circuit board and processor traces' },
  { file: 'hero/hero-workstation.webp', src: '1593642632823-8f785ba67e45', preset: 'hero', alt: 'Professional multi-monitor workstation setup in a modern studio' },

  // ── backgrounds ───────────────────────────────────────────────────────────
  { file: 'backgrounds/abstract-grid.webp', src: '1639762681485-074b7f938ba0', preset: 'banner', alt: 'Abstract three dimensional blue grid technology background' },
  { file: 'backgrounds/abstract-network.webp', src: '1451187580459-43490279c0fa', preset: 'banner', alt: 'Global network connections visualised as glowing lines of light' },
  { file: 'backgrounds/abstract-waves.webp', src: '1550751827-4bd374c3f58b', preset: 'banner', alt: 'Abstract blue light waves on a dark technology background' },
  { file: 'backgrounds/abstract-code.webp', src: '1487058792275-0ad4aaf24ca7', preset: 'banner', alt: 'Colourful source code displayed on a dark developer screen' },
  { file: 'backgrounds/abstract-ai.webp', src: '1620712943543-bcc4688e7485', preset: 'banner', alt: 'Abstract artificial intelligence neural rendering in blue and violet' },
  { file: 'backgrounds/workshop-cta.webp', src: '1603481588273-2f908a9a7a1b', preset: 'banner', alt: 'Technician assembling a custom PC on a workshop bench' },

  // ── categories ────────────────────────────────────────────────────────────
  { file: 'categories/gaming-pc.webp', src: '1542751371-adc38448a05e', preset: 'card', alt: 'Gaming PC category — illuminated gaming desktop and peripherals' },
  { file: 'categories/office-pc.webp', src: '1497366754035-f200968a6e72', preset: 'card', alt: 'Office PC category — desktop computers in a modern open plan office' },
  { file: 'categories/workstation.webp', src: '1593642632823-8f785ba67e45', preset: 'card', alt: 'Workstation category — high performance multi display creator setup' },
  { file: 'categories/processors.webp', src: '1591488320449-011701bb6704', preset: 'card', alt: 'Processor category — desktop CPU held above a motherboard socket' },
  { file: 'categories/graphics-cards.webp', src: '1591799264318-7e6ef8ddb7ea', preset: 'card', alt: 'Graphics card category — RGB lit GPU installed in a gaming PC' },
  { file: 'categories/motherboards.webp', src: '1587202372775-e229f172b9d7', preset: 'card', alt: 'Motherboard category — detailed view of a gaming motherboard' },
  { file: 'categories/ram.webp', src: '1562976540-1502c2145186', preset: 'card', alt: 'Memory category — DDR RAM modules with heat spreaders' },
  { file: 'categories/storage.webp', src: '1597872200969-2b65d56bd16b', preset: 'card', alt: 'Storage category — solid state drives and NVMe modules' },
  { file: 'categories/power-supplies.webp', src: '1555617981-dac3880eac6e', preset: 'card', alt: 'Power supply category — modular PSU with braided cables' },
  { file: 'categories/cabinets.webp', src: '1601737487795-dab272f52420', preset: 'card', alt: 'PC cabinet category — tempered glass mid tower chassis' },
  { file: 'categories/cooling.webp', src: '1558346490-a72e53ae2d4f', preset: 'card', alt: 'Cooling category — liquid CPU cooler and case fans' },
  { file: 'categories/networking.webp', src: '1606904825846-647eb07f5be2', preset: 'card', alt: 'Networking category — managed switch with patch cables' },
  { file: 'categories/accessories.webp', src: '1527814050087-3793815479db', preset: 'card', alt: 'Accessories category — gaming mouse, keyboard and desk peripherals' },

  // ── products ──────────────────────────────────────────────────────────────
  { file: 'products/gaming-pc.webp', src: '1547082299-de196ea013d6', preset: 'card', alt: 'Custom gaming PC with RGB illuminated internals' },
  { file: 'products/gaming-pc-rgb.webp', src: '1616588589676-62b3bd4ff6d2', preset: 'card', alt: 'RGB gaming desktop with tempered glass side panel' },
  { file: 'products/gaming-pc-apex.webp', src: '1593305841991-05c297ba4575', preset: 'card', alt: 'High end gaming rig on a dark desk with ambient lighting' },
  { file: 'products/workstation.webp', src: '1593642632823-8f785ba67e45', preset: 'card', alt: 'Creator workstation PC with dual displays and colour calibrated monitor' },
  { file: 'products/office-pc.webp', src: '1517336714731-489689fd1ca8', preset: 'card', alt: 'Compact office desktop PC on a clean minimal workspace' },
  { file: 'products/intel-core-ultra.webp', src: '1591488320449-011701bb6704', preset: 'card', alt: 'Intel Core class desktop processor held between fingertips' },
  { file: 'products/amd-ryzen.webp', src: '1518770660439-4636190af475', preset: 'card', alt: 'AMD Ryzen class processor die and circuit board detail' },
  { file: 'products/nvidia-rtx.webp', src: '1624705002806-5d72df19c3ad', preset: 'card', alt: 'NVIDIA RTX class graphics card with triple fan cooler' },
  { file: 'products/motherboard.webp', src: '1587202372775-e229f172b9d7', preset: 'card', alt: 'Gaming motherboard with heatsinks, M.2 slots and RGB accents' },
  { file: 'products/ram-ddr5.webp', src: '1562976540-1502c2145186', preset: 'card', alt: 'DDR5 memory modules with aluminium heat spreaders' },
  { file: 'products/ssd-nvme.webp', src: '1625842268584-8f3296236761', preset: 'card', alt: 'NVMe M.2 solid state drive close up' },
  { file: 'products/ssd-sata.webp', src: '1597872200969-2b65d56bd16b', preset: 'card', alt: '2.5 inch SATA solid state drive on a dark surface' },
  { file: 'products/power-supply.webp', src: '1555617981-dac3880eac6e', preset: 'card', alt: 'Fully modular ATX power supply unit with cables' },
  { file: 'products/pc-case.webp', src: '1601737487795-dab272f52420', preset: 'card', alt: 'Premium mid tower PC case with mesh front panel' },
  { file: 'products/liquid-cooler.webp', src: '1558346490-a72e53ae2d4f', preset: 'card', alt: 'All in one liquid CPU cooler with illuminated pump head' },
  { file: 'products/gaming-monitor.webp', src: '1527443224154-c4a3942d3acf', preset: 'card', alt: 'Curved high refresh rate gaming monitor on a desk' },
  { file: 'products/gaming-keyboard.webp', src: '1618384887929-16ec33fab9ef', preset: 'card', alt: 'Mechanical gaming keyboard with per key RGB backlighting' },
  { file: 'products/gaming-mouse.webp', src: '1527814050087-3793815479db', preset: 'card', alt: 'Ergonomic gaming mouse with optical sensor on a desk mat' },
  { file: 'products/gaming-headset.webp', src: '1615663245857-ac93bb7c39e7', preset: 'card', alt: 'Over ear gaming headset with boom microphone' },
  { file: 'products/headset-pro.webp', src: '1546435770-a3e426bf472b', preset: 'card', alt: 'Studio grade over ear headphones on a dark background' },
  { file: 'products/network-switch.webp', src: '1606904825846-647eb07f5be2', preset: 'card', alt: 'Rack mounted gigabit network switch with connected patch cables' },
  { file: 'products/server-rack.webp', src: '1558494949-ef010cbdcc31', preset: 'card', alt: 'Server rack in a data centre with status indicator lights' },
  { file: 'products/ups-power.webp', src: '1560472354-b33ff0c44a43', preset: 'card', alt: 'Uninterruptible power supply unit for IT infrastructure' },
  { file: 'products/keyboard-office.webp', src: '1555664424-778a1e5e1b48', preset: 'card', alt: 'Low profile office keyboard on a minimal white desk' },
  { file: 'products/laptop-workstation.webp', src: '1593640408182-31c70c8268f5', preset: 'card', alt: 'Mobile workstation laptop open on a desk beside components' },

  // ── services ──────────────────────────────────────────────────────────────
  { file: 'services/custom-pc-assembly.webp', src: '1603481588273-2f908a9a7a1b', preset: 'wide', alt: 'Technician assembling a custom PC with anti static tools' },
  { file: 'services/pc-repair.webp', src: '1580327344181-c1163234e5a0', preset: 'wide', alt: 'Engineer diagnosing and repairing desktop PC hardware' },
  { file: 'services/laptop-repair.webp', src: '1587831990711-23ca6441447b', preset: 'wide', alt: 'Laptop opened on a repair bench during component level service' },
  { file: 'services/hardware-upgrade.webp', src: '1541029071515-84cc54f84dc5', preset: 'wide', alt: 'Installing a memory upgrade into a desktop motherboard' },
  { file: 'services/annual-maintenance.webp', src: '1516387938699-a93567ec168e', preset: 'wide', alt: 'IT technician performing scheduled preventive maintenance' },
  { file: 'services/networking.webp', src: '1573164713988-8665fc963095', preset: 'wide', alt: 'Structured network cabling and patch panel installation' },
  { file: 'services/server-installation.webp', src: '1544197150-b99a580bb7a8', preset: 'wide', alt: 'Server room installation with racks and cable management' },
  { file: 'services/data-recovery.webp', src: '1560472354-b33ff0c44a43', preset: 'wide', alt: 'Data recovery process on storage drives in a clean workspace' },

  // ── portfolio ─────────────────────────────────────────────────────────────
  { file: 'portfolio/gaming-setup-01.webp', src: '1542751371-adc38448a05e', preset: 'wide', alt: 'Completed gaming setup with illuminated desk and dual monitors' },
  { file: 'portfolio/gaming-setup-02.webp', src: '1550745165-9bc0b252726f', preset: 'wide', alt: 'Streaming battlestation with ambient RGB lighting' },
  { file: 'portfolio/gaming-setup-03.webp', src: '1593305841991-05c297ba4575', preset: 'wide', alt: 'Custom water cooled gaming PC delivered to a client' },
  { file: 'portfolio/office-install-01.webp', src: '1497366754035-f200968a6e72', preset: 'wide', alt: 'Corporate office desktop rollout across an open plan floor' },
  { file: 'portfolio/office-install-02.webp', src: '1524758631624-e2822e304c36', preset: 'wide', alt: 'Modern office workstations after an IT infrastructure deployment' },
  { file: 'portfolio/office-install-03.webp', src: '1600880292203-757bb62b4baf', preset: 'wide', alt: 'Team working at newly installed office computer systems' },
  { file: 'portfolio/workstation-01.webp', src: '1593642632823-8f785ba67e45', preset: 'wide', alt: 'Colour grading workstation built for a post production studio' },
  { file: 'portfolio/server-room-01.webp', src: '1558494949-ef010cbdcc31', preset: 'wide', alt: 'Completed server room build with structured racks' },
  { file: 'portfolio/server-room-02.webp', src: '1544197150-b99a580bb7a8', preset: 'wide', alt: 'Data centre aisle with server cabinets and cable trays' },
  { file: 'portfolio/build-before.webp', src: '1580327344181-c1163234e5a0', preset: 'wide', alt: 'Before — dusty legacy desktop awaiting a full rebuild' },
  { file: 'portfolio/build-after.webp', src: '1547082299-de196ea013d6', preset: 'wide', alt: 'After — rebuilt and cable managed PC with RGB lighting' },
  { file: 'portfolio/studio-build-01.webp', src: '1531297484001-80022131f5a1', preset: 'wide', alt: 'Creative studio workspace with custom built computers' },

  // ── blog ──────────────────────────────────────────────────────────────────
  { file: 'blog/gpu-buying-guide.webp', src: '1624705002806-5d72df19c3ad', preset: 'wide', alt: 'Graphics card buying guide cover image' },
  { file: 'blog/ddr5-vs-ddr4.webp', src: '1562976540-1502c2145186', preset: 'wide', alt: 'DDR5 versus DDR4 memory comparison cover image' },
  { file: 'blog/nvme-speed.webp', src: '1625842268584-8f3296236761', preset: 'wide', alt: 'NVMe storage performance article cover image' },
  { file: 'blog/cooling-guide.webp', src: '1558346490-a72e53ae2d4f', preset: 'wide', alt: 'PC cooling guide cover image with liquid cooler' },
  { file: 'blog/build-guide.webp', src: '1603481588273-2f908a9a7a1b', preset: 'wide', alt: 'Step by step PC building guide cover image' },
  { file: 'blog/ai-workstation.webp', src: '1620712943543-bcc4688e7485', preset: 'wide', alt: 'AI workstation hardware article cover image' },
  { file: 'blog/office-it.webp', src: '1600880292203-757bb62b4baf', preset: 'wide', alt: 'Office IT procurement article cover image' },
  { file: 'blog/server-room.webp', src: '1558494949-ef010cbdcc31', preset: 'wide', alt: 'Small business server infrastructure article cover image' },
  { file: 'blog/esports.webp', src: '1542751371-adc38448a05e', preset: 'wide', alt: 'Esports performance tuning article cover image' },

  // ── about ─────────────────────────────────────────────────────────────────
  { file: 'about/workshop.webp', src: '1603481588273-2f908a9a7a1b', preset: 'wide', alt: 'NSK Computer Zone assembly workshop and testing bench' },
  { file: 'about/team-collab.webp', src: '1522071820081-009f0129c71c', preset: 'wide', alt: 'NSK Computer Zone team collaborating on a build specification' },
  { file: 'about/facility.webp', src: '1497366754035-f200968a6e72', preset: 'wide', alt: 'NSK Computer Zone office and service facility interior' },

  // ── team ──────────────────────────────────────────────────────────────────
  { file: 'team/team-01.webp', src: '1560250097-0b93528c311a', preset: 'portrait', alt: 'Portrait of the founder and managing director' },
  { file: 'team/team-02.webp', src: '1580489944761-15a19d654956', preset: 'portrait', alt: 'Portrait of the head of enterprise solutions' },
  { file: 'team/team-03.webp', src: '1507003211169-0a1dd7228f2d', preset: 'portrait', alt: 'Portrait of the lead systems engineer' },
  { file: 'team/team-04.webp', src: '1573497019940-1c28c88b4f3e', preset: 'portrait', alt: 'Portrait of the client success manager' },
  { file: 'team/team-05.webp', src: '1519389950473-47ba0277781c', preset: 'portrait', alt: 'Portrait of the senior build technician' },
  { file: 'team/team-06.webp', src: '1522071820081-009f0129c71c', preset: 'portrait', alt: 'Portrait of the network infrastructure specialist' },

  // ── testimonials (square avatars) ─────────────────────────────────────────
  { file: 'testimonials/client-01.webp', src: '1560250097-0b93528c311a', preset: 'avatar', alt: 'Client testimonial portrait' },
  { file: 'testimonials/client-02.webp', src: '1580489944761-15a19d654956', preset: 'avatar', alt: 'Client testimonial portrait' },
  { file: 'testimonials/client-03.webp', src: '1507003211169-0a1dd7228f2d', preset: 'avatar', alt: 'Client testimonial portrait' },
  { file: 'testimonials/client-04.webp', src: '1573497019940-1c28c88b4f3e', preset: 'avatar', alt: 'Client testimonial portrait' },
  { file: 'testimonials/client-05.webp', src: '1519389950473-47ba0277781c', preset: 'avatar', alt: 'Client testimonial portrait' },
  { file: 'testimonials/client-06.webp', src: '1522071820081-009f0129c71c', preset: 'avatar', alt: 'Client testimonial portrait' },
];

/**
 * Brand wordmarks are GENERATED locally (not downloaded) — third-party logos are
 * trademarks and must not be redistributed. These are neutral monochrome
 * placeholders with correct dimensions so layout is final; drop official,
 * licensed logo files over them when you have permission to use them.
 */
export const BRANDS = [
  'Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Gigabyte',
  'Corsair', 'NZXT', 'Samsung', 'Western Digital', 'Seagate', 'Kingston',
  'Cooler Master', 'Logitech', 'Lenovo', 'Dell', 'HP', 'TP-Link',
];
