/**
 * Showroom gallery.
 *
 * Photographs of real builds, the bench and the shop floor. Drop files into
 * `public/images/gallery/` and list them here — see the README in that folder
 * for naming and sizing.
 *
 * Until real photographs are supplied this falls back to the existing product
 * imagery, so the section is never empty and never shows a broken tile.
 */
export const galleryImages = [
  // Add real showroom photographs here, e.g.:
  // { src: 'gallery/rift-build-front.webp', alt: 'Rift gaming build, front three-quarter view' },
];

/**
 * Stand-in drawn from the existing library. Every entry was checked against
 * what the picture actually SHOWS — the filenames in this library are not
 * reliable (see hardwareCategories.js).
 */
export const fallbackGalleryImages = [
  { src: 'products/nvidia-rtx.webp',        alt: 'Graphics card installed in a chassis' },
  { src: 'products/amd-ryzen.webp',         alt: 'Motherboard closeup showing the socket area' },
  { src: 'categories/ram.webp',             alt: 'DDR memory module' },
  { src: 'categories/power-supplies.webp',  alt: 'Processor seated in a motherboard socket' },
  { src: 'categories/cabinets.webp',        alt: 'Mechanical hard drive with the cover removed' },
  { src: 'categories/storage.webp',         alt: 'All-in-one liquid cooler with illuminated pump head' },
  { src: 'products/gaming-keyboard.webp',   alt: 'Mechanical keyboard' },
  { src: 'products/gaming-monitor.webp',    alt: 'Desktop monitor on a desk' },
  { src: 'products/headset-pro.webp',       alt: 'Over-ear headphones' },
  { src: 'categories/accessories.webp',     alt: 'Wireless mouse' },
  { src: 'products/laptop-workstation.webp',alt: 'Desktop workstation beside a widescreen monitor' },
  { src: 'categories/networking.webp',      alt: 'Wireless router' },
  { src: 'products/gaming-pc-rgb.webp',     alt: 'Gaming setup with RGB lighting' },
  { src: 'products/server-rack.webp',       alt: 'Structured cabling in a server rack' },
];

/** Real photographs when they exist, the stand-in otherwise. */
export const activeGalleryImages =
  galleryImages.length > 0 ? galleryImages : fallbackGalleryImages;

/** True while the section is still showing stand-in imagery. */
export const usingFallbackGallery = galleryImages.length === 0;
