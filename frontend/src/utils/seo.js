import { COMPANY } from '@/data/company';

const SITE_NAME = COMPANY.name;

/**
 * Share preview. Every page used to omit og:image entirely, so every link
 * shared to WhatsApp — which is how this business is actually contacted —
 * rendered as a bare grey card. One default beats six missing ones; a page can
 * still override it by setting `image` in its PAGE_META entry.
 */
const DEFAULT_OG_IMAGE = '/images/og/og-default.png';

/** Absolute origin. Crawlers reject a relative og:image. */
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/+$/, '');
const origin = () => SITE_URL || window.location.origin;

/**
 * Per-page metadata — §19. Applied imperatively by usePageMeta because a Vite
 * SPA has no server render to emit tags into.
 */
export const PAGE_META = {
  home: {
    title: `Computer Hardware Store | Gaming PCs & Professional Workstations`,
    description:
      'Premium computer hardware, custom gaming PCs, professional workstations and accessories — specified, built and supported in Tiruchirappalli.',
    path: '/',
  },
  gaming: {
    title: 'Gaming PCs & Custom Gaming PC Builds',
    description:
      'Custom gaming PC builds from starter to ultimate — every component specified, assembled and stress-tested in-house, with matched monitors, keyboards and headsets.',
    path: '/gaming-pcs',
  },
  professional: {
    title: 'Professional Workstations & High Performance PCs',
    description:
      'Workstations for offices, developers, creators, engineers and AI workloads. Specified on sustained performance, expandability and support terms.',
    path: '/professional-pcs',
  },
  hardware: {
    title: 'Computer Hardware, PC Components & Computer Parts',
    description:
      'Processors, graphics cards, motherboards, memory, storage, power, cooling, cabinets and monitors — explore the components we stock and fit.',
    path: '/hardware',
  },
  accessories: {
    title: 'Gaming & Computer Accessories',
    description:
      'Keyboards, mice, headsets, monitors, docking stations, connectivity and power protection for gaming and professional setups.',
    path: '/accessories',
  },
  about: {
    title: 'Computer Hardware Company | About Us',
    description: `${SITE_NAME} — hardware, systems and custom builds since ${COMPANY.foundingYear}. Visit the showroom or send an enquiry.`,
    path: '/about',
  },
};

/** Upsert a <meta> tag, matched by name or property. */
function upsertMeta(attr, key, content) {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export function applyMeta({ title, description, path, image }) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  document.title = fullTitle;

  const preview = new URL(image ?? DEFAULT_OG_IMAGE, origin()).toString();

  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', fullTitle);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', 'en_IN');
  if (path) upsertMeta('property', 'og:url', new URL(path, origin()).toString());
  upsertMeta('property', 'og:image', preview);
  upsertMeta('property', 'og:image:alt', `${SITE_NAME} — ${title}`);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', fullTitle);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', preview);

  // Canonical, so query-string variants do not read as duplicate pages.
  if (path) {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', new URL(path, origin()).toString());
  }
}

/** LocalBusiness JSON-LD — one script tag, replaced on navigation. */
export function applyBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: COMPANY.name,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    url: origin(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address.street,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.state,
      postalCode: COMPANY.address.postalCode,
      addressCountry: 'IN',
    },
    openingHours: COMPANY.hours.schemaFormat,
    foundingDate: String(COMPANY.foundingYear),
  };

  let tag = document.getElementById('ld-business');
  if (!tag) {
    tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.id = 'ld-business';
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(schema);
}
