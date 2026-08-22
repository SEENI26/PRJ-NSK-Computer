# 13 — Folder Structure

```
NKS computers Website/
├── README.md                      Start here — setup, scripts, conventions
├── docs/                          This documentation set
│   ├── 01-information-architecture.md
│   ├── 02-user-flows.md
│   ├── 03-wireframes.md
│   ├── 04-design-system.md
│   ├── 05-component-library.md
│   ├── 06-database-schema.md
│   ├── 07-api-endpoints.md
│   ├── 08-ai-assistant-flow.md
│   ├── 13-folder-structure.md
│   ├── 14-deployment-guide.md
│   ├── 15-cloud-architecture.html   ← open in a browser
│   ├── 16-security-checklist.md
│   └── 17-seo-checklist.md
│
├── frontend/                      Next.js 15 · React 19 · TypeScript · Tailwind
│   ├── next.config.ts             CSP, security headers, image config, redirects
│   ├── tailwind.config.ts         Design tokens — single source of truth
│   ├── tsconfig.json              strict, @/* path alias
│   ├── postcss.config.mjs
│   ├── package.json
│   │
│   ├── scripts/
│   │   ├── image-manifest.mjs     Every asset: source, preset, SEO alt text
│   │   └── fetch-images.mjs       Download → crop → WebP → LQIP → manifest
│   │
│   ├── public/
│   │   └── images/
│   │       ├── hero/              4 cinematic hero plates
│   │       ├── backgrounds/       6 abstract/technical backdrops
│   │       ├── categories/        13 category tiles
│   │       ├── products/          25 product photographs
│   │       ├── services/          8 service photographs
│   │       ├── portfolio/         12 project photographs
│   │       ├── blog/              9 article covers
│   │       ├── about/             3 facility photographs
│   │       ├── team/              6 portraits
│   │       ├── testimonials/      6 avatars
│   │       ├── brands/            18 generated wordmarks
│   │       ├── og/                Social card (PNG + WebP)
│   │       └── CREDITS.md         Source attribution + replacement instructions
│   │
│   └── src/
│       ├── app/                   App Router
│       │   ├── layout.tsx         Root: fonts, schema, nav, footer, AI widget
│       │   ├── page.tsx           Home
│       │   ├── globals.css        Tokens as CSS vars + component layer
│       │   ├── sitemap.ts         Generated sitemap with intent-weighted priority
│       │   ├── robots.ts          Crawler rules incl. AI bots
│       │   ├── not-found.tsx      Branded 404 with likely destinations
│       │   ├── error.tsx          Route error boundary with phone fallback
│       │   ├── loading.tsx        Skeleton shell
│       │   ├── about/
│       │   ├── products/          index + [slug]
│       │   ├── build/             PC Builder
│       │   ├── services/          index + [slug]
│       │   ├── portfolio/         index + [slug]
│       │   ├── blog/              index + [slug]
│       │   ├── contact/
│       │   └── admin/             Separate root layout, noindex
│       │       ├── layout.tsx
│       │       ├── page.tsx       Dashboard
│       │       ├── enquiries/  products/  portfolio/
│       │       ├── blog/  quotes/  users/  settings/
│       │
│       ├── components/
│       │   ├── ui/                Button · primitives · Field · Accordion · icon-registry
│       │   ├── layout/            Navbar · Footer · Logo · PageHeader · NewsletterForm
│       │   ├── motion/            Reveal · effects (Counter, Parallax, Tilt, Marquee…)
│       │   ├── media/             SmartImage · MediaFrame
│       │   ├── seo/               JsonLd · Breadcrumbs
│       │   ├── home/              Hero · sections (13 home blocks)
│       │   ├── products/          ProductCard · ProductsExplorer · Gallery · EnquiryButton
│       │   ├── portfolio/         PortfolioGrid · BeforeAfter
│       │   ├── blog/              BlogIndex
│       │   ├── builder/           BuilderWizard
│       │   ├── contact/           ContactForm
│       │   ├── ai/                AssistantWidget
│       │   └── admin/             AdminShell · widgets · EnquiryTable
│       │
│       ├── lib/
│       │   ├── api.ts             Typed fetch client, ApiError, ISR mapping
│       │   ├── images.ts          Manifest resolution, CDN indirection
│       │   ├── seo.ts             Metadata builders
│       │   ├── schema.ts          JSON-LD builders
│       │   ├── site.ts            Company identity + navigation (single source)
│       │   ├── motion.ts          Shared variants and easing
│       │   └── utils.ts           cn, formatPrice, formatDate, slugify…
│       │
│       ├── data/                  Build-time content = ISR fallback
│       │   ├── products.ts        21 products, full detail
│       │   ├── categories.ts      13 categories
│       │   ├── services.ts        8 services with process + FAQ
│       │   ├── portfolio.ts       8 case studies with outcomes
│       │   ├── blog.ts            8 articles with structured bodies
│       │   ├── content.ts         Stats, differentiators, industries, testimonials, FAQ, team, timeline
│       │   ├── builder.ts         Wizard options + client estimator
│       │   ├── admin.ts           Admin fixtures
│       │   └── generated/
│       │       └── image-meta.json  ← generated; do not edit by hand
│       │
│       └── types/index.ts         Domain types mirrored by the API resources
│
└── backend/                       Laravel 12 · PHP 8.3
    ├── composer.json
    ├── .env.example               Every variable documented, no secrets
    │
    ├── app/
    │   ├── Enums/                 EnquiryStatus (with transition rules) · Priority · EnquirySource
    │   ├── Models/                20 Eloquent models
    │   ├── Services/              EnquiryService · BuildEstimator · AiAssistantService
    │   ├── Policies/              EnquiryPolicy · ProductPolicy · UserPolicy
    │   ├── Mail/                  EnquiryReceived · EnquiryAutoReply
    │   ├── Notifications/         AiLeadEscalated
    │   ├── Providers/             AppServiceProvider (rate limiters, policies, model guards)
    │   └── Http/
    │       ├── Controllers/Api/V1/        Public controllers
    │       ├── Controllers/Api/V1/Admin/  Admin controllers
    │       ├── Requests/                  FormRequest validators
    │       ├── Resources/                 API resources (shape-matched to the frontend types)
    │       └── Middleware/                EnsureUserIsActive · SecurityHeaders
    │
    ├── database/
    │   ├── migrations/            5 migrations, 32 tables
    │   └── seeders/               RolePermissionSeeder · DatabaseSeeder
    │
    └── routes/api.php             Versioned, rate-limited, policy-guarded
```

---

## Conventions

**Where does a new file go?**

| Adding | Location |
| --- | --- |
| A reusable visual primitive | `components/ui/` |
| A block used by exactly one page | `components/<page>/` |
| Anything animated | `components/motion/` |
| A pure function | `lib/` |
| Static content | `data/` |
| A shared type | `types/index.ts` |

**Import order** — external, then `@/components`, then `@/lib`, then `@/data`, then types.

**Naming**

| Kind | Style | Example |
| --- | --- | --- |
| React component file | PascalCase | `ProductCard.tsx` |
| Multi-export module | camelCase | `sections.tsx`, `primitives.tsx` |
| Utility module | camelCase | `api.ts` |
| PHP class | PascalCase, PSR-4 | `EnquiryService.php` |
| DB table | snake_case plural | `enquiry_status_history` |
| Route name | dot-delimited | `api.v1.admin.enquiries.index` |

**Server vs client components.** Default to server. Add `'use client'` only for
interactivity, and when you do, never use `import * as` from an icon or utility package
— see `components/ui/icon-registry.ts` for why.

**The `data/` directory is not throwaway.** Those files are the ISR fallback: if the
Laravel API is cold or unreachable, `withFallback()` serves them and the public site
still renders. Their shapes are contractually identical to the API resources.
