# 01 — Information Architecture

## Site map

```
/                                   Home
├── /about                          Company story, mission, timeline, team, certifications
├── /products                       Catalogue index (filterable, URL-synced)
│   └── /products/[slug]            Gallery · specs · features · downloads · related · enquiry
├── /build                          Custom PC Builder (6-step wizard)
├── /services                       Service index
│   └── /services/[slug]            Overview · deliverables · process · FAQ
├── /portfolio                      Case study index (category-filtered)
│   └── /portfolio/[slug]           Challenge · solution · outcome · before/after · gallery
├── /blog                           Article index (category + search)
│   └── /blog/[slug]                Article · TOC · author · related
├── /contact                        Form · map · hours · WhatsApp · phone
├── /privacy  /terms  /warranty     Legal
├── /sitemap.xml  /robots.txt       Machine-readable
└── /admin                          Separate root layout, noindex
    ├── /admin                      Dashboard (6 KPI widgets, trends, activity)
    ├── /admin/enquiries            Pipeline table, filters, bulk actions, export
    ├── /admin/products             Catalogue CRUD
    ├── /admin/portfolio            Case study CRUD
    ├── /admin/blog                 Editorial CRUD
    ├── /admin/quotes               Quotation management
    ├── /admin/users                Users + permission matrix
    └── /admin/settings             Company, SEO, SMTP, integrations, audit log
```

## Navigation model

| Level | Contains | Rationale |
| --- | --- | --- |
| Utility bar | Phone, email, trust statement | Visible on load, collapses on scroll to reclaim vertical space |
| Primary nav | Products, PC Builder, Services, Portfolio, Blog, About | Six items — under the seven-item working-memory limit |
| Mega menu | Products (13 categories), Services (8 lines) | Only the two branches deep enough to need one |
| Persistent CTA | "Build Your PC" + "Call Sales" | The two actions that convert; never scroll out of reach |
| Footer | 4 columns × 5 links, legal row, newsletter | Secondary wayfinding and SEO surface |

**Why the PC Builder sits in the primary nav rather than under Products:** it is the
highest-intent path on the site and the primary conversion mechanism. Burying it one
level down would cost measurable conversions for no navigational benefit.

## Content hierarchy — Home

Ordered by decreasing commercial intent, not by visual interest:

1. **Hero** — value proposition, primary CTA, trust marks (authorised partner, warranty, burn-in)
2. **Brand strip** — supplier credibility, answers "are these genuine parts?" immediately
3. **Statistics** — social proof through volume and tenure
4. **Featured products** — commercial surface, six SKUs
5. **Gaming showcase** — editorial split, highest-margin category
6. **Categories** — full catalogue wayfinding, 13 tiles
7. **Why choose us** — differentiation, six claims each with a metric
8. **Services** — secondary revenue line
9. **Latest builds** — proof of delivery with measured outcomes
10. **Industries** — self-identification for B2B visitors
11. **Testimonials** — third-party validation
12. **Blog** — expertise signal and organic entry point
13. **FAQ** — objection handling before the final CTA
14. **Contact CTA** — conversion

## URL conventions

| Rule | Example |
| --- | --- |
| Lowercase, hyphen-delimited, no trailing slash | `/products/apex-rtx-5080-gaming-pc` |
| Category filtering via query param, not path segment | `/products?category=gaming-pcs` |
| Intent pre-fills the contact form | `/contact?intent=quote` |
| Legacy paths permanently redirected | `/pc-builder` → `/build`, `/shop/*` → `/products/*` |

Category filters use a query parameter deliberately: a filtered listing is the same
resource in a different view, not a distinct document. The canonical tag on
`/products?category=x` points at itself (it is a legitimate landing page for
category keywords), but pagination and sort params are excluded from the sitemap.

## Taxonomy

**Product categories (13)** grouped into three families:

- **Systems** — Gaming PCs, Workstations, Office PCs
- **Components** — Processors, Graphics Cards, Motherboards, Memory, Storage, Power Supplies, Cabinets, Cooling, Networking
- **Peripherals** — Accessories

**Portfolio categories (4)** — Gaming Setups, Office Installations, Workstations, Server & Infrastructure

**Blog categories (5)** — Technology, Gaming, Hardware, Tips, News

**FAQ categories (4)** — Buying, Builds, Service, Business

A single polymorphic `tags` vocabulary is shared between blog posts and portfolio
projects, so "DDR5" means the same thing in both contexts and cross-linking is possible.

## Page templates

| Template | Routes | Rendering |
| --- | --- | --- |
| Marketing home | `/` | Static, `revalidate: 3600` |
| Filterable index | `/products` | Dynamic (reads `searchParams`) |
| Content index | `/blog`, `/portfolio`, `/services` | Static + client-side filtering |
| Detail | `/products/[slug]`, `/blog/[slug]`, `/portfolio/[slug]`, `/services/[slug]` | SSG via `generateStaticParams`, ISR |
| Wizard | `/build` | Static shell, client state |
| Form | `/contact` | Static shell, client form |
| Admin | `/admin/*` | Client-rendered, separate root layout, `noindex` |

## Cross-linking rules

- Every product detail page links to **3 related products** (explicit relations first, then category backfill so the rail is never short).
- Every blog post links to **3 related articles** scored by shared category (+2) and shared tags (+1 each).
- Every service page links to **4 sibling services**.
- Every portfolio project links to **3 other projects**.
- The Contact CTA block appears at the foot of every marketing page — one consistent conversion exit.
