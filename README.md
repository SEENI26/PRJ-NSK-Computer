# NSK Computer Zone

**A click for many solution**

Website and platform for NSK Computer Zone, a Trichy-based wholesale and retail supplier
of computer accessories, desktop and laptop spares, networking hardware and CCTV.
React + Vite frontend, plain-PHP API on XAMPP, MySQL, with an AI sales assistant and an
admin console.

---

## Quick start

```bash
# ── Database ────────────────────────────────────────────────────────────────
mysql -u root -e "CREATE DATABASE nsk_computer_zone CHARACTER SET utf8mb4"
mysql -u root nsk_computer_zone < api/schema.sql

# ── API (served by XAMPP Apache from htdocs) ────────────────────────────────
node api/export-data.mjs                     # frontend content → seed-data.json
php api/seed.php                             # seed catalogue + settings
php api/seed.php --admin-password='…'        # create the admin account

# ── Frontend ────────────────────────────────────────────────────────────────
cd frontend
npm install
npm run dev                                  # http://localhost:3100
```

The frontend renders fully without the API — public pages fall back to the local
content in `src/data/`. The API is needed for the admin console, enquiry storage
and the AI assistant.

`npm run dev` proxies `/api` to XAMPP, so browser requests are same-origin and no
CORS negotiation is involved.

---

## What is here

| Area | Detail |
| --- | --- |
| **Public site** | Home, Gaming, Business, About, Products (+detail), PC Builder, Services (+detail), Gallery, Blog (+detail), Contact |
| **PC Builder** | Six-step configurator with a live estimate range |
| **AI assistant** | Tool-using sales assistant grounded in the live catalogue, with deterministic escalation to a human |
| **Admin console** | Single-login panel: dashboard, enquiry pipeline with status workflow, offers, product images, settings |
| **API** | Plain PHP — 13 tables, session auth, rate limiting, file uploads |
| **Content** | 32 product families, 19 categories, 6 services, 8 articles, 13 FAQs — transcribed from the live site, plus the gaming range |
| **Images** | 99 optimised `.webp` assets + 12 real vendor marks as inline SVG |

---

## Scripts

### Frontend
| Command | Does |
| --- | --- |
| `npm run dev` | Development server (proxies `/api` to XAMPP) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run images:fetch` | Fetch missing images → crop → WebP → LQIP → manifest |
| `npm run brand:build` | Regenerate logo, favicon, PWA icons and OG card |
| `npm run brands:build` | Refetch partner vendor marks |

### API
| Command | Does |
| --- | --- |
| `node api/export-data.mjs` | Dump `frontend/src/data` to `seed-data.json` |
| `php api/seed.php` | Seed catalogue, services, blog, FAQs, settings |
| `php api/seed.php --admin-password='…'` | Create or update the admin account |

Full API reference: [`api/README.md`](api/README.md)

---

## Stack

**Frontend** — React 19 · Vite 8 · JavaScript (JSX) · Tailwind CSS 3.4 ·
Framer Motion 11 · React Router 7 · Lucide · Zod

**Backend** — PHP 8 · MySQL / MariaDB · Apache (XAMPP) · Anthropic API

No framework, no Composer dependencies, no TypeScript build step.

---

## Design

**Two moods, one token system.** The site runs light by default and switches to a
dark scope for the gaming run — hero, gaming showcase, processors and the
complete-setup section, plus the whole of `/gaming`. `/business`, services and
about stay light.

This is not a theme switcher and there is no user toggle. `.theme-dark` in
`globals.css` re-points the same CSS variables for a subtree; because no
component hard-codes a colour, wrapping a section in it inverts everything
inside with no per-component branching. `.on-media` is the same mechanism for
subtrees over photography.

Why split at all: gaming buyers respond to atmosphere, and an office manager
comparing AMC quotes responds to legibility. The theme change communicates which
audience a page is for before a word is read.

**Type has three roles.** Chakra Petch for display (squared, technical — reads as
instrumentation rather than esports), Inter for body, JetBrains Mono for spec
labels and part numbers.

**The signature is the spec plate** — a hairline frame with machined corner ticks
and a mono micro-label, borrowed from the datasheets and bench labels that are
this trade's own vernacular. `.spec-plate` and `.spec-label` in `globals.css`.
RGB appears only as `.rgb-edge`, a lit rim on hover, never as a fill.

Every colour resolves through a CSS variable in `globals.css`. No component
hard-codes a surface, border or ink value, so the entire palette is retunable
from a single block.

| Token family | Purpose | Alpha modifiers |
| --- | --- | --- |
| `--bg`, `--bg-500…800` | Page and elevated surfaces | Yes — `rgb(var(--bg) / <alpha>)` |
| `--ink`, `--ink-muted/subtle/faint` | Text ramp | Yes |
| `--surface-1/2/3` | Translucent overlays (the glass system) | No — alpha is baked in |
| `--line`, `--line-soft/strong` | Borders and dividers | No |
| `--on-accent` | Text on a **solid** brand fill | Yes |
| `--tone-*` | Status text on a **tinted** fill | Yes |
| `--media-scrim-*` | Scrims over photography | No |

Three decisions earn their keep:

**Brand colours are a step deeper than the raw hues.** Primary is `#1D4FD8` and
accent is cyan-700, because cyan-500 manages only 2.4:1 on white and cannot carry
text. Body ink hits 17.6:1.

**Solid fill vs tinted fill.** `text-on-accent` is white — primary and accent are
dark enough to carry it. `text-tone-success` and friends are deep shades, because a
pale green designed for a dark ground is invisible on white. Every one of these
tokens is re-stated under `.theme-dark`, where the constraint reverses.

**Media scrims are independent of the page palette.** Photography is dark
regardless of the theme, so scrims stay dark. Subtrees laid over imagery carry
`.on-media`, which re-points the ink variables — every `text-ink` inside becomes
legible with no per-component branching.

### Two root layouts

`app/(site)/` and `app/(admin)/` are separate route groups, each with its own root
layout. That is the only correct way to have genuinely independent roots in the App
Router — a nested layout rendering its own `<html>` is invalid and its `<head>` is
silently discarded.

---

## Brand

The identity is driven entirely from the **supplied artwork** — no redrawn or
approximated marks ship anywhere on the site.

**Master:** `frontend/brand/logo-master.png` (6192×2400, transparent).
Replace that one file, run `npm run brand:build`, and all seventeen derived assets
regenerate — site, icons and social card together.

| Asset | Path | Used by |
| --- | --- | --- |
| Primary (NSK + horse) | `images/brand/logo-primary[-light].{png,webp}` | Site header |
| Full lockup | `images/brand/logo[-light].{png,webp}` | Footer, OG card |
| Horse mark | `images/brand/logo-mark[-light].{png,webp}` | Admin rail, icons |
| Social card | `images/og/og-default.{png,webp}` | OG / Twitter |
| Icons | `favicon.ico` · `favicon-32.png` · `icon-192.png` · `icon-512.png` · `apple-touch-icon.png` | Browser, PWA |

**Two colourways.** Brand navy `#211D71` — sampled from the master, not guessed — is
what the site uses. A white variant is also generated for marks laid over dark
photography and for print. Both are recoloured from the *same alpha channel*, so
anti-aliased edges are pixel-identical.

**Why the header uses the primary crop, not the full lockup.** At a 44px header height
the two type lines beneath "NSK" would render around 5px tall and be unreadable. The
header gets NSK + horse; the footer, which has vertical room, gets the complete lockup
including the company name and tagline.

> **Note on the supplied SVG.** `NSK_Logo.svg` was also provided but its trace has an
> inverted fill rule — it renders as a solid navy block. The 4K PNG is used as the
> master instead. If you obtain a corrected vector, drop it in and adjust
> `build-brand.mjs` to read it; every downstream asset will follow.

---

## Images

**All 99 assets are real royalty-free photographs** (Unsplash License — free for
commercial use, no attribution required), fetched at build resolution and transcoded to
optimised `.webp` locally.

Partner vendor marks are **real single-colour SVGs** from Simple Icons, stored as path
data and rendered inline so they inherit the theme's ink colour. Those marks remain the
trademarks of their owners — displaying them asserts a genuine supplier relationship, so
confirm it holds for each and remove any you are not authorised to show.

### Replacing an image with your own

Drop your file at the same path in `public/images/` with the same filename. That is the
entire process:

```
public/images/products/gaming-pc.webp   ← overwrite this
```

- The fetch script **never overwrites an existing file** (without `--force`), so your
  asset survives every subsequent run.
- Re-run `npm run images:fetch` and it will re-read your file's real dimensions and
  regenerate its blur placeholder.
- **No code changes are required.** Nothing in the app references a URL directly —
  everything resolves through `lib/images.ts`.

### Moving to a CDN

Set `NEXT_PUBLIC_IMAGE_CDN=https://cdn.nskcomputerzone.in` and every asset path is
rewritten at resolution time. Again, no code changes.

Full source list and licence notes: [`frontend/public/images/CREDITS.md`](frontend/public/images/CREDITS.md).

---

## Documentation

| Deliverable | Document |
| --- | --- |
| 1. Information architecture | [`docs/01-information-architecture.md`](docs/01-information-architecture.md) |
| 2. User flows | [`docs/02-user-flows.md`](docs/02-user-flows.md) |
| 3. Wireframes | [`docs/03-wireframes.md`](docs/03-wireframes.md) |
| 4. High-fidelity UI | The running application — `npm run dev` |
| 5. Design system | [`docs/04-design-system.md`](docs/04-design-system.md) |
| 6. Component library | [`docs/05-component-library.md`](docs/05-component-library.md) |
| 7. Complete frontend | [`frontend/`](frontend/) |
| 8. Complete API | [`api/`](api/) · [`api/README.md`](api/README.md) |
| 9. Database schema | [`api/schema.sql`](api/schema.sql) — the doc below describes the older 43-table design |
| 10. REST API endpoints | [`api/README.md`](api/README.md) |
| 11. Admin panel | [`frontend/src/app/(admin)/`](frontend/src/app/(admin)/) |
| 12. AI assistant flow | [`docs/08-ai-assistant-flow.md`](docs/08-ai-assistant-flow.md) |
| 13. Folder structure | [`docs/13-folder-structure.md`](docs/13-folder-structure.md) |
| 14. Deployment guide | [`docs/14-deployment-guide.md`](docs/14-deployment-guide.md) |
| 15. Cloud architecture diagram | [`docs/15-cloud-architecture.html`](docs/15-cloud-architecture.html) |
| 16. Security checklist | [`docs/16-security-checklist.md`](docs/16-security-checklist.md) |
| 17. SEO checklist | [`docs/17-seo-checklist.md`](docs/17-seo-checklist.md) |
| 18. Content audit | [`docs/18-content-audit.md`](docs/18-content-audit.md) |

---
## Design tokens

```
Brand navy   #211D71      Primary   #1D4FD8      Success   #22C55E
Accent       cyan-700     Danger    #EF4444      Warning   #F59E0B
```

Typeface: **Inter**. Full rationale in [`docs/04-design-system.md`](docs/04-design-system.md).

---

## Notes for the next developer

- **`src/data/` is not throwaway.** Public pages fall back to it via
  `withFallback()`, so the site renders with the API down. Shapes match the API
  responses.

- **Prices are `null`, never `0`.** NSK publishes no list prices. `null` renders
  as "Price on request"; `0` would advertise free stock and breach Google's
  structured-data policy. Sorting puts nulls last in both directions.

- **Enquiry status transitions are validated in the API**, not the UI. Illegal
  moves return 422. `won` is terminal.

- **The AI assistant cannot invent prices.** Product facts come only from
  `search_products`, which queries MySQL directly.

- **Empty sections are deliberate.** Testimonials, team, certifications,
  timeline and portfolio are empty because the original content was fabricated
  and attributed to a real business — see
  [`docs/18-content-audit.md`](docs/18-content-audit.md) §3. Do not seed
  placeholder rows into them.

- **The admin panel shows real data or an empty state.** It previously rendered
  invented figures (₹89,40,000 revenue, 48,920 visitors) against an empty
  database. Tiles with no data source were removed rather than faked.

- **`docs/` predates the rewrite.** Documents 6, 7, 13, 14 and 15 describe the
  earlier Next.js + Laravel architecture and are kept for reference only.
  `docs/reference-from-laravel/` holds the original AI service, build estimator
  and migrations.

---

## Known gaps

- Legal pages (`/privacy`, `/terms`) are unwritten — see
  `docs/18-content-audit.md`, which explains why these should not be generated.
- Several content facts remain unconfirmed: founding year, opening days, map
  coordinates, GSTIN/CIN, social profiles.
- Admin pages for products, blog and quotations are read-only shells; no write
  endpoints exist for them yet.
- One administrator account, no roles. Change the password by re-running
  `php api/seed.php --admin-password='…'`.
- No automated tests on either side.
- Email delivery is not implemented — enquiries are stored, not sent.
