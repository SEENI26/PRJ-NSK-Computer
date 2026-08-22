# 17 — SEO Checklist

Status key: **✅ implemented** · **⚙️ configure at deploy** · **📋 ongoing**

---

## 1. Metadata

| Item | Status | Implementation |
| --- | --- | --- |
| Unique `<title>` per route | ✅ | `buildMetadata()`; template `%s \| NSK Computer Zone` |
| Unique meta description per route | ✅ | 140–160 chars, written per page |
| Canonical URL on every page | ✅ | `alternates.canonical`, absolute, from `metadataBase` |
| `robots` directives | ✅ | `max-image-preview: large`, `max-snippet: -1` |
| Admin excluded from indexing | ✅ | `noindex, nofollow, nocache` on the admin layout |
| Keywords, author, publisher | ✅ | `defaultMetadata` |
| `lang="en-IN"` | ✅ | Root layout |
| Viewport + theme colour | ✅ | `viewport` export |

## 2. Open Graph & Twitter

| Item | Status |
| --- | --- |
| `og:type` correct per template (`website` / `article`) | ✅ |
| `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale` | ✅ |
| `og:image` 1200×630, absolute URL | ✅ Generated at build |
| `article:published_time` / `modified_time` / `author` / `tag` | ✅ Blog and portfolio |
| `twitter:card = summary_large_image` | ✅ |
| `twitter:site` / `twitter:creator` | ✅ |

> **The default OG image is emitted as PNG as well as WebP, and the PNG is what the
> meta tag points at.** Several crawlers — LinkedIn and WhatsApp among them — still
> reject WebP social cards. This is the one deliberate exception to the all-WebP rule.

## 3. Structured data (JSON-LD)

| Schema | Where | Status |
| --- | --- | --- |
| `Organization` | Every page (root layout) | ✅ |
| `WebSite` + `SearchAction` | Every page | ✅ |
| `LocalBusiness` / `ComputerStore` | Every page — address, geo, hours, `aggregateRating` | ✅ |
| `BreadcrumbList` | Every page with a trail | ✅ Emitted by `Breadcrumbs` alongside the visible trail |
| `Product` + `Offer` | Product detail — price, currency, availability, condition, `priceValidUntil` | ✅ |
| `AggregateRating` | Product detail | ✅ |
| `Service` | Service detail | ✅ |
| `BlogPosting` | Article detail | ✅ |
| `FAQPage` | Home + service pages | ✅ |
| Rich Results Test passes | | 📋 Verify post-deploy |

All JSON-LD is escaped (`<` → `<`) before injection.

## 4. Crawlability

| Item | Status | Notes |
| --- | --- | --- |
| `robots.txt` generated | ✅ | `app/robots.ts` |
| Sitemap generated with priorities and change frequencies | ✅ | `app/sitemap.ts` — commercial intent drives priority: `/build` at 0.95 outranks `/about` at 0.7 |
| Sitemap excludes admin, API, tracking params | ✅ | |
| AI crawlers explicitly allowed on editorial content | ✅ | GPTBot, ClaudeBot, PerplexityBot, Google-Extended allowed on `/blog`, `/products`, `/services`; blocked from `/admin` |
| Aggressive SEO scrapers blocked | ✅ | Ahrefs, Semrush, Dotbot, MJ12 |
| Query params with no unique content disallowed | ✅ | `/*?*intent=`, `/*?*utm_` |
| Legacy URLs 301-redirected | ✅ | `/pc-builder` → `/build`, `/shop/*` → `/products/*` |
| No orphan pages | ✅ | Every route reachable from nav, footer or an internal rail |

## 5. Content & semantics

| Item | Status |
| --- | --- |
| Exactly one `<h1>` per page | ✅ |
| Logical heading hierarchy, no skipped levels | ✅ |
| Landmarks: `header`, `nav`, `main`, `footer`, `aside` | ✅ |
| Descriptive anchor text (no "click here") | ✅ |
| Breadcrumbs visible and marked up | ✅ |
| Internal linking: 3 related products, 3 related posts, 4 sibling services, 3 related projects | ✅ |
| Article table of contents with anchor IDs | ✅ |
| `text-wrap: balance` / `pretty` for readable line breaks | ✅ |

## 6. Images

| Item | Status |
| --- | --- |
| Descriptive alt text on every content image | ✅ Authored per asset in the manifest |
| Decorative images `alt="" aria-hidden` | ✅ |
| WebP sources, AVIF + WebP served | ✅ |
| Responsive `srcset` via `next/image` | ✅ |
| Explicit dimensions — zero CLS | ✅ From the generated manifest |
| Lazy loading below the fold | ✅ Default |
| `priority` on LCP image only | ✅ Hero and first row of cards |
| Blur-up placeholders | ✅ 20px base64 LQIP per asset |
| Descriptive file names | ✅ `nvidia-rtx.webp`, not `img_0472.webp` |
| Long-lived immutable cache headers | ✅ `next.config.ts` |

## 7. Performance (Core Web Vitals)

| Item | Status | Notes |
| --- | --- | --- |
| Static generation / ISR on all public routes | ✅ | 21 products, 8 services, 8 projects, 8 posts prerendered |
| First Load JS ≤ 200 kB on every route | ✅ | Verified at build: 167–200 kB |
| Icon tree-shaking enforced | ✅ | `icon-registry.ts` — the namespace import cost 165 kB on `/build` before this |
| `optimizePackageImports` for lucide + framer-motion | ✅ | |
| Self-hosted font, `display: swap`, adjusted fallback metrics | ✅ | No FOUT, no CLS |
| Compositor-only animations | ✅ | Only `opacity` and `transform` |
| `content-visibility` / lazy iframes | ✅ | Map iframe is `loading="lazy"` |
| Brotli + gzip | ⚙️ | Cloudflare + Nginx |
| HTTP/3 | ⚙️ | Cloudflare |
| Lighthouse ≥ 95 | 📋 | Verify on production hardware, not localhost |

## 8. Local SEO

| Item | Status |
| --- | --- |
| `LocalBusiness` schema with geo coordinates and opening hours | ✅ |
| NAP consistent across footer, contact page and schema | ✅ Single source in `lib/site.ts` |
| Google Maps embed on the contact page | ✅ |
| `tel:` and WhatsApp deep links | ✅ |
| Google Business Profile claimed and matching NAP | 📋 |
| Local directory citations | 📋 |

## 9. Mobile

| Item | Status |
| --- | --- |
| Responsive from 360px | ✅ |
| 44px minimum touch targets | ✅ |
| No horizontal overflow | ✅ `overflow-x: hidden` + fluid type |
| `viewport-fit=cover` for notched devices | ✅ |
| Tap highlight suppressed, focus ring preserved | ✅ |

## 10. Post-launch

| Task | Cadence |
| --- | --- |
| Submit sitemap to Google Search Console and Bing Webmaster Tools | Once |
| Verify Rich Results for Product, FAQ, BlogPosting, LocalBusiness | Once, then after schema changes |
| Confirm `/admin` is not indexed (`site:` query) | Once, then monthly |
| Run PageSpeed Insights against production URLs | Monthly |
| Review Search Console coverage and CWV reports | Monthly |
| Refresh product `priceValidUntil` | Annually, automated |
| Audit internal links for 404s after content changes | Quarterly |
| Update blog content and `dateModified` | Ongoing |

---

## Notes on deliberate choices

**Category filters use query parameters, not path segments.** A filtered listing is the
same resource in a different view. `/products?category=gaming-pcs` self-canonicalises
(it is a legitimate landing page for category keywords) but pagination and sort
parameters are excluded from the sitemap and disallowed in `robots.txt`.

**AI crawlers are allowed, not blocked.** Buyers increasingly research hardware through
assistants. The editorial content is the asset most likely to be cited, and being cited
is the point.

**Sitemap priority reflects commercial intent.** `/build` at 0.95 sits above `/about`
at 0.7 because the configurator is where revenue happens. Priority is a hint rather
than a directive, but it costs nothing to make it honest.
