# 18 — Content Audit

**Source:** https://www.nskcomputerzone.com — captured July 2026
**Purpose:** record exactly which content is verified, which is derived, and which was
removed, so nothing unverifiable reaches production by accident.

---

## Why this document exists

The site was first built against a fictional brand ("System Hardware"). Placeholder
content included invented client names, testimonials, case-study metrics, staff
biographies and partner certifications. That is normal scaffolding for a design
exercise.

Once the real company was identified, that content became a different thing entirely:
**fabricated claims attributed to a real, named business.** Invented testimonials are
fake reviews. Invented ISO and partner-tier claims are material misrepresentations.
Invented client case studies name third parties who never consented.

All of it has been removed rather than reworded. This document is the record.

---

## 1. Verified facts — taken directly from the source site

| Field | Value | Where on source |
| --- | --- | --- |
| Legal name | NSK Computer Zone Pvt Ltd. | Footer / about copy |
| Also trades as | NSK Computer Accessories | Body copy throughout |
| Address | No. 117B, Heber Rd, Bhima Nagar, Sangillyandapuram, Tiruchirappalli, Tamil Nadu 620001 | Footer, every page |
| Phone | +91 97914 30774 | Header, footer |
| Email | nskcomputer@gmail.com | Footer |
| WhatsApp | 919791430774 | "Chat with Us" link |
| Opening hours | 08:00 AM – 21:00 PM | Footer |
| Experience | "20 years of industry experience" | Home |
| Domain | nskcomputerzone.com (also owns .in) | — |
| Nav structure | Home · About · Service · Products · Desktop Accessories · Laptop Accessories · Networks · CCTV · Gallery · Contact | Header |

**Positioning statements quoted or closely paraphrased:**
- "a leading provider of high-quality tech solutions"
- "Your One-Stop Shop for Top-Quality Computer Accessories!"
- "customer-centric company", "dedicated team of experts", "passionate about technology and committed to staying up-to-date with the latest trends"
- "Rigorous testing" for durability and performance
- "Competitive prices"
- "Hassle-free returns and exchanges"
- "whether it's safeguarding your home, business, or public spaces" (CCTV)
- "Our advanced networking solutions ensure seamless communication between devices and users"

**Product catalogue** — transcribed verbatim from `desktop-spares-in-trichy.html`,
`laptop-spares-in-trichy.html`, `desktop-wholesales-in-trichy.html` and `cctv.html`:

| Family | Variants listed on source |
| --- | --- |
| RAM | DDR2 2 GB (Samsung/Hynix/Consistent) · DDR3 2 GB (Samsung/Hynix/Consistent) · DDR3 4 GB 16 IC (Samsung/Hynix/Crucial/Frontech) · DDR3 8 GB (Samsung/Hynix) · DDR3 ANT Esport · DDR4 4 GB (Samsung/Hynix/Lexar) · DDR4 8 GB (MT/Crucial/ANT Esport/Corsair 10-yr) · DDR4 16 GB (ANT Esport/Crucial) · DDR5 |
| Processors | i3 2nd–12th (F and Plain) · i5 2nd–9th · i7 2nd–9th |
| Cabinets | ATX · RGB Gaming |
| SMPS | ANT ESPORT VS400L / VS450L / VS500L / VS600L / VS750L |
| PCI cards | LAN · 1X LAN · Serial · 1X Serial · USB · 1X USB · Sound · 1X Sound · 1X LPT · VGA |
| UPS | FRONTECH FT2561 · ZEBRONICS U735 · LAPCARE LAPON-750 |
| UPS batteries | ZEBION · ZEBRONICS · LAPCARE |
| Storage | Hard Disk Drives · SSD · M.2 NVME |
| Peripherals | Keyboard · Mouse · Mouse Pad · Speakers · Web Camera · Cooling Fan |
| Other | Motherboard · Graphic Card · Monitors · WIFI Receiver · Cables · Printer · Scanner · Barcode Scanner |
| Networking | Switch · Switch Extender · Jack · Splitters · CAT6 Cable · WIFI Receiver |
| Laptop | Screens · motherboards · hard drives · adapters · cables · panels · PCB cables · OEM components |

---

## 2. Derived — reasonable inference, flagged in code

| Item | Basis | Risk |
| --- | --- | --- |
| `foundingYear: 2005` | "20 years experience" + © 2023 notice | Marked `NEEDS CONFIRMATION` in `lib/site.ts` |
| `lat / lng` | Geocoded from the street address | Marked `NEEDS CONFIRMATION`; verify before relying on the map pin |
| Opening days | Source gives hours but no days | No `dayOfWeek` asserted in schema; UI shows "Opening hours" without days |
| Category groupings | Our structuring of their real product list | Cosmetic only |
| Service descriptions | Their stated services plus the spares range they hold | Process steps are our articulation of standard practice — review for accuracy |

---

## 3. Removed — fabricated, now empty

| What | Was | Now |
| --- | --- | --- |
| **Testimonials** | 6 invented people at invented companies with specific claims | `testimonials: []` — section hidden. Collect real quotes with permission, or connect the Google Business Profile feed |
| **Portfolio case studies** | 8 projects naming "Nexus Gaming Arena", "Meridian Financial Services", "Velmurugan Precision Industries" etc. with invented metrics (delivery times, downtime, % savings) | `portfolio: []`. `/portfolio` → 301 → `/gallery` |
| **Team** | 6 invented staff with names, roles, biographies | `team: []` — section hidden |
| **Certifications** | Intel Gold Partner, AMD Premier, NVIDIA Solution Provider, ASUS Platinum, ISO 9001:2015 | `certifications: []` — none is evidenced |
| **Company stats** | 12,400 systems delivered · 640 clients · 99.2% on-time · <0.4% DOA | Reduced to the one verifiable figure: 20 years |
| **Star rating** | 4.9/5 from 1,284 reviews | `site.rating = null`. Rating UI hidden; `AggregateRating` omitted from schema |
| **Timeline** | 8 dated milestones (2009 founding, 2012 first enterprise contract…) | `timeline: []` — About falls back to prose |
| **Industry project counts** | "340 projects", "128 projects" etc. per sector | Counts removed; sectors retained |
| **Registration numbers** | Invented GSTIN and CIN | Empty strings — footer omits the row |
| **Social profiles** | Five invented profile URLs | Empty; `activeSocials()` filters them out and `sameAs` drops them |

---

## 4. Prices

The source site publishes **no prices**, which is normal for a wholesale spares
business serving both trade and retail at different rates.

`Product.price` is therefore `number | null`. Null renders as **"Price on request"**
with an enquiry CTA. Consequences handled in code:

- `formatPriceOrRequest()` is the only user-facing price formatter — nothing can render "₹0".
- Budget filters never exclude price-on-request items (we cannot know if they fit, and hiding them would lose leads).
- Price sorting puts nulls last in both directions.
- **Product schema omits `offers` entirely** when there is no price. Emitting `price: 0` would advertise the item as free and breach Google's structured-data policy.

---

## 5. Still to review

- [ ] Confirm the founding year and replace the provisional 2005
- [ ] Confirm opening **days**, not just hours
- [ ] Verify the map coordinates against the actual shopfront
- [ ] Supply GSTIN / CIN if they should be published
- [ ] Supply real social profile URLs, or leave empty
- [ ] Replace gallery stock photography with real store and workbench photos (`data/portfolio.ts`, same paths)
- [ ] Decide on the blog: the 8 articles are generic hardware guidance, not claims about NSK, but they carry invented author names in `data/blog.ts`. Either reattribute to the company or remove.
- [ ] Confirm warranty terms per category — currently phrased as "confirmed at purchase"
- [ ] Confirm which partner brands may be displayed (see §6)
- [ ] `data/admin.ts` still holds demo enquiries referencing invented companies. Not public-facing, but replace before staff training on it.

---

## 6. Partner brand marks

`scripts/build-brand-logos.mjs` fetches 12 real vector marks from Simple Icons
(CC0 icon files; the trademarks remain with their owners). A further 10 brands NSK
demonstrably stocks — Hynix, Crucial, Lexar, Micron, ANT Esport, Frontech,
Zebronics, Lapcare, Zebion, Consistent — have no vector available and render as
typographic wordmarks, so the strip reflects the real catalogue.

**Displaying a supplier's mark implies a genuine trading relationship.** NSK stocks
these brands, which is the ordinary basis for referential use — but confirm each is
acceptable and honour their brand guidelines. Remove any that are not.

Gigabyte, Western Digital and Logitech are absent from Simple Icons; add authorised
SVGs manually if required.

---

## 7. Principle applied

> Where a fact could not be verified, the site says less rather than inventing more.

Every removal above degrades gracefully: the section hides, the schema property is
omitted, the footer row disappears. Nothing renders as an empty shell, and adding
real data anywhere restores that section automatically with no code change.

---

## Legal pages — outstanding

`Privacy Policy` and `Terms of Service` were linked in the footer but the routes did
not exist, so the links were removed (a 404 is worse than an absent link) and the
entries dropped from the sitemap.

These are the one category of content that should **not** be generated: they state
this business's actual data-handling and trading terms. Note that since the site
now carries no forms, its data collection is minimal — enquiries go to WhatsApp and
the phone, which are third-party channels with their own policies. That makes a
short, accurate privacy notice straightforward to write.

- [ ] Write a Privacy Policy covering: what the website itself collects (analytics,
      if any), that enquiries route to WhatsApp/telephone, and how enquiry data is
      retained once it reaches the shop
- [ ] Write Terms of Service covering: pricing on request, warranty handling,
      returns and exchanges, and wholesale terms
- [ ] Create `/privacy` and `/terms`, then restore both to `legalNav` in `lib/site.ts`
      and to `app/sitemap.ts`

---

## 8. Redesign — August 2026

The premium redesign (`NSK_Computers_Claude_Prompt.md`) asked for several things
this document had already removed. What was done with each:

| Brief asked for | Built as |
| --- | --- |
| Certifications — "Authorized Dealer Certificates", "Brand Certifications" | Section built to full spec, wired to `certifications` (empty). Renders **nothing** until real documents are supplied. Deliberately **not** in the nav — a link to a hidden section is a dead end. |
| Testimonials with Google ratings | Existing `Testimonials` retained; still early-returns `null` on an empty array. |
| Animated stats — "Happy Customers", "Products Sold", "Projects Completed" | Not built. Only "20 years" is verifiable; the rest would be invented figures. `Counter` remains available for when real numbers exist. |
| ASUS ROG / Alienware-tier prebuilt gaming PCs | Not claimed. The gaming sections present what NSK genuinely sells: cabinets, SMPS, cooling, memory, gaming laptops and peripherals. |

**Catalogue additions.** Gaming laptops, cooling, gaming peripherals and
desks/chairs were confirmed by the owner as genuinely sold and added as real
products (ids 29–32) with four new categories. All carry `price: null` and
`rating: {value: 0, count: 0}` per §4 — no invented prices or review counts.

**Mislabelled stock imagery — unresolved.** Several files in
`public/images/products/` do not depict what their filename says:

| File | Actually shows |
| --- | --- |
| `pc-case.webp` | A bare desktop hard drive |
| `office-pc.webp` | A MacBook |
| `gaming-pc.webp` | An iMac desktop setup |
| `intel-core-ultra.webp` | Two NVIDIA graphics cards |
| `amd-ryzen.webp` | A generic circuit board, no visible CPU |

Where these were being used misleadingly they have been repointed or the alt text
corrected to describe the real subject. The Intel/AMD processor cards were made
**typographic rather than photographic** for this reason — labelling a GPU as a
CPU on a hardware supplier's own site is an error a customer notices immediately.

- [ ] Replace these five assets with real photography of the stock actually held,
      then restore images to the processor section.

**Accessibility fix.** `--ink-faint` was `106 124 160`, which measured 4.20:1 on
white and 3.84:1 on the tinted card surface — below 4.5:1 in every context it was
used, on 12px labels. Now `92 110 146` (4.86:1 on the tinted band). The dark ramp
was contrast-checked at the same time; all tone tokens clear 4.5:1.

---

## 9. Fabricated claims found on product pages — August 2026

Surfaced while preparing per-model gaming content. All were **template defaults**
that had been live on every product page since the original build.

| Claim | Where | Now |
| --- | --- | --- |
| **"4.5/5 ★ · 1K Reviews"** | `products/[slug]/page.jsx` — `product.rating.value \|\| '4.5'` and `.count \|\| '1K'` | Block renders only when `rating.count > 0`. Every product carries `{value: 0, count: 0}`, so the fallbacks fired **everywhere** — the site advertised a 4.5-star rating from a thousand reviews that do not exist. |
| **"Sourcing: Authorised Distribution"** | Same file, hardcoded table row | Renders only when a product carries an explicit `sourcing` value. None does. |
| **"Authorised partner for Intel, AMD, NVIDIA, ASUS & Corsair"** | `Navbar.jsx` utility strip — on **every page** | Replaced with "Genuine components, brand warranty — wholesale & retail, 20 years in Trichy". |
| **"Authorised partner & stocking distributor for"** | `sections.jsx`, above the brand marquee | Replaced with "Brands we stock". |

Stocking a brand and being its authorised partner are different statements. The
first is ordinary referential use; the second is a contractual relationship, and
asserting it without one is a material misrepresentation — the same reason §3
emptied the certifications array.

**Seventh mislabelled image found.** `products/laptop-workstation.webp` shows an
**Alienware desktop with visible branding** — a competitor's product, on the
gaming-laptops page, the laptop-screens product and the gaming-laptops category
tile. All three repointed to `products/workstation.webp`, which is an actual
unbranded laptop. The §8 image list should be read as seven files, not five.

## 10. Per-model gaming content — not generated

The brief for per-model gaming pages required specifications "verified from
official manufacturer sources" and "never fabricated". Both cannot be satisfied
by writing from model recall: gaming model names persist across refreshes while
GPU, panel and cooling change beneath them, and Indian retail SKUs differ from
the US listings that dominate search results.

A fill-in template is at `19-gaming-product-template.md`. Specs come from the
box, the supplier sheet or the manufacturer's India page; the copy, performance
analysis and formatting are written from those facts.

Manufacturer product photography is copyrighted and generally requires a dealer
agreement — which the site must not imply it holds. Generic category imagery
until NSK photographs its own stock.

---

## 11. NSK Ultra 9 Gaming Build — DRAFT, not publishable

Added from a Desertcart listing the owner supplied. Framed as an **NSK-assembled
build**, not a resold prebuilt: brand is "NSK Computer Zone", and the selling
point is local assembly, bench testing and warranty handling — things a
cross-border reseller does not offer. Copying the reseller's product name,
configuration and photograph would have been none of those.

**The source could not be read.** Desertcart returns HTTP 403 to automated
requests, and the supplied URL was truncated at the GPU (`…285k-geforce-rtx`).
Search surfaced *both* RTX 5080 16 GB and RTX 5090 32 GB machines under the same
"Titan" name, so the configuration is genuinely unknown. Intel.com and
TechPowerUp also blocked reads.

**Confirmed** — Intel's own product-page title plus multiple independent listings:
Core Ultra 9 285K · 24 cores / 24 threads (8 P + 16 E) · 36 MB cache · up to
5.70 GHz.

**Unconfirmed** — GPU, memory, storage, motherboard, PSU, cooling and cabinet are
placeholders taken from a third-party listing. Each is marked `⚠ CONFIRM` in
`data/products.js` and renders visibly on the page, deliberately: a marker that
is easy to miss is a marker that ships.

- [ ] Replace all seven `⚠ CONFIRM` values with the parts actually sourced, then
      delete the warning block above the product entry.

## 12. Content guard

`scripts/check-content.mjs` (`npm run content:check`) now fails the build on:

- any `⚠ CONFIRM` marker left in the catalogue
- `price: 0` (must be `null` — "Price on request")
- broken category or `relatedSlugs` references, duplicate ids

and warns on non-zero ratings and known-mislabelled imagery.

It exists because this project has repeatedly shipped placeholder content that
looked finished. It caught one on its first run: **all three Intel processor
products were illustrated with a photograph of two NVIDIA graphics cards**
(`intel-core-ultra.webp`). Repointed to `amd-ryzen.webp`, a generic circuit-board
macro — silicon, no wrong brand. Add a check here whenever a new class of
mistake is found.

---

## 13. Configurator + processor imagery — August 2026

**Real processor photography.** Six images supplied by the owner (3 Intel retail
boxes, 3 AMD Ryzen 9000-series boxes) converted to WebP by
`frontend/scripts/convert-assets.mjs`. Each was opened and visually confirmed to
show the product its filename claims before being wired in — 4.01 MB saved on
conversion.

The script also writes `src/data/generated/image-meta.json`. That step was
missing on the first pass and the images rendered as nothing: `SmartImage`
resolves dimensions and the blur placeholder from that manifest, so a file on
disk but absent from it is invisible. Anything added outside `images:fetch` must
register itself.

These replace the typographic placeholder in the processor lanes (§8), which
existed only because the stock library had no picture of an actual CPU.

**`/build` replaced.** The needs-based wizard (purpose → performance → budget →
estimate range) is gone. In its place a component picker: processor → form
factor → then either the laptop path (laptop, peripherals, monitor, furniture)
or the desktop path (cabinet, motherboard, graphics, memory, storage, cooling,
monitor, peripherals). Output is a parts list sent over WhatsApp.

No prices anywhere in it, deliberately. Every product is "Price on request", so a
running total would be meaningless — the specification goes over, the quotation
comes back.

`Testimonials` was mounted at the foot of `/build` and rendered nothing (§3).
Replaced with `ContactCta`.

**Brand filters** are built and working but currently hidden: they require two or
more named brands in a category, and nearly everything is a `Multi-brand` range
page. See `20-brand-list-request.md`.

**Fifth fabricated claim removed.** The Stats trust cards carried "Authorized IT
Brands" — the same unevidenced dealer claim as the four in §9. Now "Genuine Stock
Only · Sourced through legitimate supply, backed by manufacturer warranty."

**Accessibility.** The global `:focus-visible` ring was drawing a box around the
configurator's step heading, which takes programmatic focus on each step change
so screen readers announce it. `[tabindex="-1"]` is now exempted; genuine
controls keep their ring.
