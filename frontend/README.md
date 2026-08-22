# NSK Computer Zone — hardware showcase

A premium showcase site for a computer hardware business: gaming PCs,
professional workstations, components and accessories.

**This is not an e-commerce site.** There is no cart, no checkout, no payment
and no published pricing. Every path ends at an enquiry or a store visit —
which is how the business actually sells.

---

## Technology

| | |
| --- | --- |
| Build | Vite 8 (Rolldown) |
| UI | React 19 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 3, CSS custom properties |
| Motion | Framer Motion 11 |
| Icons | Lucide React |

No state library, no UI kit, no CSS-in-JS. The site is small enough that they
would cost more than they save.

---

## Install and run

```bash
npm install
cp .env.example .env      # optional — see Environment below
npm run dev               # http://localhost:3100
```

### Production build

```bash
npm run build             # → dist/
npm start                 # preview the built output on :3100
npm run lint
```

---

## Structure

```
src/
├── app/
│   ├── App.jsx              shell: navbar + routed main + footer
│   ├── routes.jsx           route table; pages are code-split
│   └── providers.jsx        Router + MotionConfig (reduced-motion honoured globally)
│
├── components/
│   ├── layout/              Navbar, Footer, MobileMenu, PageTransition
│   ├── common/              Button, Container, Badge, SectionTitle, Divider, ScrollReveal
│   ├── cards/               PCBuildCard, HardwareCard, AccessoryCard  ← shared by all pages
│   ├── hero/                HeroSection, HeroBackground, AnimatedCabinet
│   ├── sections/            GamingVsProfessional, FeaturedBuilds, HardwareCategories,
│   │                        RecommendedAccessories, ShowroomGallery, WhyChooseUs, CTASection
│   ├── gallery/             DomeGallery — draggable sphere of images
│   ├── effects/             PixelSnow — ambient particle field
│   └── contact/             ContactForm, ContactInfo, MapSection
│
├── pages/                   Home, GamingPC, ProfessionalPC, Hardware, Accessories,
│                            AboutContact, NotFound
│
├── data/                    content, kept out of components
│   ├── gallery.js           showroom photographs (see public/images/gallery/README.md)
│   ├── company.js           name, address, phone, hours, differentiators
│   ├── gamingBuilds.js      4 tiers
│   ├── professionalBuilds.js 5 workstations
│   ├── hardwareCategories.js 9 explorer departments
│   ├── hardwareProducts.js  adapter over products.js (the real 33-item catalogue)
│   ├── accessories.js       22 items in 4 groups
│   └── products.js          the transcribed real catalogue — source of truth
│
├── animations/              fade, reveal, hover, pageTransitions, cabinetAnimations
├── hooks/                   useMediaQuery, useMousePosition, useScrollReveal, usePageMeta
├── services/                enquiries.js — the only network call in the app
├── utils/                   helpers, constants, icons, seo
└── styles/                  globals (tokens), typography, animations
```

### How the data joins up

```
PC build ──recommendedAccessories:[id]──▶ accessories
        └─specifications──▶ component classes
hardware category ◀──category── hardwareProducts ◀── products.js
```

A build names accessories by id, so "Complete the setup" on the Gaming and
Professional pages is a lookup rather than a second hand-maintained list.

---

## Environment

Copy `.env.example` to `.env`. Everything is optional — the site runs without any of it.

| Variable | Effect when unset |
| --- | --- |
| `VITE_GOOGLE_MAPS_KEY` | Contact page shows a styled address panel and a directions link instead of an embedded map |
| `VITE_API_BASE_URL` | The enquiry form reports that submission is unconfigured rather than pretending to send. In development the Vite proxy handles `/api`, so blank is correct locally |
| `VITE_WHATSAPP_NUMBER`, `VITE_CONTACT_EMAIL`, `VITE_COMPANY_PHONE` | Unused by the app today; `src/data/company.js` is the live source. Present for future integrations |

Never commit `.env`.

---

## Deployment

The build is a static bundle — any static host works.

```bash
npm run build
# deploy dist/
```

Two requirements:

1. **SPA rewrite.** Routes like `/gaming-pcs` are client-side. The host must
   serve `index.html` for any path that is not a real file, or a refresh on a
   deep link 404s.

   Apache (`dist/.htaccess`):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule ^ index.html [L]
   </IfModule>
   ```

2. **The enquiry API**, if the contact form should work. Point
   `VITE_API_BASE_URL` at the PHP service and make sure its CORS allow-list
   includes the site's origin — or proxy `/api` from the same origin, which
   avoids CORS entirely.

---

## Notes for the next developer

- **The image library is mislabelled.** `categories/power-supplies.webp` is a
  photograph of a CPU; `products/pc-case.webp` is a hard drive. Image paths in
  `hardwareCategories.js` were chosen by looking at what each picture *shows*.
  Check the image before "fixing" a path to match its filename.
- **Some items have no photograph.** They carry `image: null` and an `icon`,
  and render a designed placeholder. That is deliberate — better than a
  misleading stock photo.
- **Prices are absent everywhere by design.** `priceLabel()` renders
  "Price on request" for `null`. Do not invent figures.
- **Icons are registered explicitly** in `utils/icons.js`. A namespace import
  of `lucide-react` pulls the whole ~1000-icon set — it measured 527 kB.
- `_legacy/` holds the previous admin/blog/gallery components, kept out of the
  build and git-ignored.

### DomeGallery and PixelSnow

Both are implemented locally rather than pulled from a package.

**DomeGallery** (`components/gallery/`) arranges images on the inside of a
sphere using CSS 3D transforms — drag, arrow keys, and idle auto-rotation that
pauses on hover or focus. Under reduced motion it renders a static grid
instead, because a drag-to-explore carousel is unusable without dragging.

**PixelSnow** (`components/effects/`) is a canvas particle field drawn into a
fixed-width buffer and upscaled with `image-rendering: pixelated`, so cost is
independent of screen resolution. It stops entirely when scrolled out of view,
when the tab is hidden, and under reduced motion.

Two things to know if you re-tune PixelSnow:

- flake count scales with buffer **area**, so doubling `pixelResolution`
  quadruples the count — drop `density` to compensate;
- the published defaults (`pixelResolution={200}`, `density={0.3}`) upscale to
  roughly 14 px squares at desktop width, which competes with the headline.
  The hero instance uses a finer buffer and lower density for that reason.

### Adding showroom photographs

Drop files into `public/images/gallery/` and list them in `src/data/gallery.js`.
Until then the dome shows product photography and says so in the caption
underneath — it does not pass stock imagery off as the shop.
