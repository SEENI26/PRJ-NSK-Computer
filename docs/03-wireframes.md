# 03 — Wireframes

Low-fidelity structure for every template. These describe *layout intent*; the
high-fidelity implementation lives in the components referenced beneath each block.

Legend: `▓` media · `───` divider · `[ ]` interactive · `·····` supporting text

---

## Home — `/`

```
┌──────────────────────────────────────────────────────────────────┐
│ ● trust strip: authorised partner · phone · email        (hides) │
├──────────────────────────────────────────────────────────────────┤
│ LOGO   Products▾  PC Builder  Services▾  Portfolio  Blog  About  │
│                                    [WA] [Call Sales] [Build PC]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ◦ New — RTX 50 shipping         ┌──────────────────┐            │
│                                  │ ┌──────────────┐ │  ┌───────┐ │
│  BUILD BETTER.                   │ │              │ │  │ ★4.9  │ │
│  PERFORM FASTER.        (sheen)  │ │   ▓▓▓▓▓▓▓▓   │ │  │ 1,284 │ │
│                                  │ │   hero rig   │ │  └───────┘ │
│  ·········································· │ │              │ │            │
│                                  │ ├──────────────┤ │  ┌───────┐ │
│  [ Build Your PC ] [ Explore ]   │ │ Apex 5080    │ │  │12,400+│ │
│                                  │ │ CPU GPU RAM  │ │  │systems│ │
│  ─────────────────────────────   │ └──────────────┘ │  └───────┘ │
│  ✓ Authorised  ✓ Warranty  ✓ Burn-in                 │            │
│                                  └──────────────────┘            │
│                            ▼ scroll                              │
├──────────────────────────────────────────────────────────────────┤
│  ← INTEL   AMD   NVIDIA   ASUS   MSI   CORSAIR   … (marquee) →   │
├──────────────────────────────────────────────────────────────────┤
│  12,400+      17 yrs       640+        99.2%                     │
│  delivered    in business  clients     on-time      (counters)   │
├──────────────────────────────────────────────────────────────────┤
│  FEATURED                              [ View catalogue ]        │
│  ┌────────┐ ┌────────┐ ┌────────┐                                │
│  │ ▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓ │   6 product cards, 3-up        │
│  │ name   │ │        │ │        │                                │
│  │ ₹price │ │        │ │        │                                │
│  └────────┘ └────────┘ └────────┘                                │
├──────────────────────────────────────────────────────────────────┤
│  GAMING — editorial split                                        │
│  ┌───────────────────────────┐  ┌──────────┐                     │
│  │ ▓▓▓▓ hero rig, specs      │  │ card 2   │                     │
│  │ overlaid, CTA             │  ├──────────┤                     │
│  │                           │  │ card 3   │                     │
│  └───────────────────────────┘  └──────────┘                     │
├──────────────────────────────────────────────────────────────────┤
│  CATEGORIES — 13 tiles, 4-up                                     │
├──────────────────────────────────────────────────────────────────┤
│  WHY US — 6 bento cards (icon · claim · body · metric)           │
├──────────────────────────────────────────────────────────────────┤
│  SERVICES — 8 cards, 4-up          [ All services ]              │
├──────────────────────────────────────────────────────────────────┤
│  LATEST BUILDS — 3 case studies with outcome stats               │
├──────────────────────────────────────────────────────────────────┤
│  INDUSTRIES — 8 tiles with project counters                      │
├──────────────────────────────────────────────────────────────────┤
│  TESTIMONIALS — 6 cards, 3-up                                    │
├──────────────────────────────────────────────────────────────────┤
│  BLOG — 3 featured articles                                      │
├──────────────────────────────────────────────────────────────────┤
│  FAQ                    │  accordion, 8 items, first open        │
│  [Ask] [WhatsApp]       │                                        │
│  ┌─ phone card ─┐       │                                        │
├──────────────────────────────────────────────────────────────────┤
│  CONTACT CTA — centred, parallax photo, dual CTA, 3 assurances   │
├──────────────────────────────────────────────────────────────────┤
│  FOOTER: brand+address+social │ newsletter+stats                 │
│          4 link columns · CTA strip · legal row                  │
└──────────────────────────────────────────────────────────────────┘
```
Components: `Hero` · `home/sections.tsx` · `Navbar` · `Footer`

---

## Products index — `/products`

```
┌──────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: eyebrow · title · lede · 4 stats                   │
├──────────────────────────────────────────────────────────────────┤
│  Home › Products › Gaming PCs                                    │
├──────────────────────────────────────────────────────────────────┤
│ ┌─ FILTERS ─┐ │ [🔍 search................] [Filters] [Sort ▾]   │
│ │ CATEGORY  │ │ ─────────────────────────────────────────────    │
│ │ Systems   │ │ (×) Gaming PCs  (×) Intel  (×) Under ₹2L        │
│ │  Gaming 24│ │ Showing 8 of 21 products                         │
│ │  Works. 16│ │                                                  │
│ │  Office 12│ │ ┌────────┐ ┌────────┐ ┌────────┐                │
│ │ Components│ │ │ ▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓ │                │
│ │  …        │ │ │ badge  │ │        │ │        │                │
│ │ BRAND     │ │ │ name   │ │        │ │        │                │
│ │ [chips]   │ │ │ 3 spec │ │        │ │        │                │
│ │ BUDGET    │ │ │ ₹price │ │        │ │        │  layout anim   │
│ │ ○ Under…  │ │ └────────┘ └────────┘ └────────┘                │
│ │ AVAIL.    │ │                                                  │
│ │ [toggle]  │ │                                                  │
│ └───────────┘ │                                                  │
├──────────────────────────────────────────────────────────────────┤
│  CONTACT CTA                                                     │
└──────────────────────────────────────────────────────────────────┘

Mobile: sidebar → bottom-sheet drawer behind a [Filters ③] button.
```
Components: `ProductsExplorer` · `ProductCard` · `PageHeader`

---

## Product detail — `/products/[slug]`

```
┌──────────────────────────────────────────────────────────────────┐
│  Home › Products › Gaming PCs › Apex 5080                        │
├──────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ │ ● In stock  ◦ Flagship  ◦ Save 9%        │
│ │                  │ │ SYSTEM HARDWARE · SKU NSK-APEX-5080       │
│ │   ▓▓▓▓▓▓▓▓▓▓▓▓   │ │ Apex 5080 Gaming PC                      │
│ │   gallery stage  │ │ 4K ultra at high refresh                 │
│ │   ‹  [⛶]      ›  │ │ ★★★★★ 4.9 · 142 reviews                  │
│ │                  │ │ ······································· │
│ └──────────────────┘ │ ┌─────────────────────────────────────┐  │
│ [▓][▓][▓][▓] thumbs  │ │ ₹2,85,000    ₹3,12,000 (struck)     │  │
│                      │ │ incl. GST · EMI · credit terms      │  │
│                      │ │ [Request quote] [Enquire]           │  │
│                      │ │ [WhatsApp] [Call]                   │  │
│                      │ └─────────────────────────────────────┘  │
│                      │ ┌ Warranty ┐┌ Lead time ┐┌ Sourcing ┐    │
│                      │ AT A GLANCE — ✓ ✓ ✓ ✓                    │
├──────────────────────────────────────────────────────────────────┤
│  BEYOND THE BOX — 4 feature cards                                │
├──────────────────────────────────────────────────────────────────┤
│  SPECIFICATIONS              │  ┌─ Downloads ────┐ (sticky)      │
│  Core platform               │  │ spec sheet PDF │                │
│   Processor      …           │  │ benchmarks PDF │                │
│   Graphics       …           │  │ drivers ZIP    │                │
│  Storage & power             │  └────────────────┘                │
│   …                          │  ┌─ Not sure? ────┐                │
│                              │  │ [PC Builder]   │                │
│                              │  │ [Talk to eng.] │                │
├──────────────────────────────────────────────────────────────────┤
│  RELATED — 3 products                                            │
└──────────────────────────────────────────────────────────────────┘
```
Components: `ProductGallery` · `EnquiryButton` · `SpecRow`

---

## PC Builder — `/build`

```
┌──────────────────────────────────────────────────────────────────┐
│  PAGE HEADER: ~2 min · reply in 1 day · free · no obligation     │
├──────────────────────────────────────────────────────────────────┤
│ ①Purpose ②Budget ③Brand ④Perf ⑤Access ⑥Details │ ┌─ SUMMARY ─┐  │
│  ✓        ✓       ●                             │ │ Purpose ✓ │  │
│                                                 │ │ Budget  ✓ │  │
│  STEP 3 OF 6                                    │ │ Brand   — │  │
│  Any preference?                                │ │ Perf.   — │  │
│                                                 │ │ Access. — │  │
│  ┌────────────┐ ┌────────────┐                  │ ├───────────┤  │
│  │ ● Intel    │ │   AMD      │                  │ │ ESTIMATE  │  │
│  │ ········   │ │ ········   │                  │ │ ₹1.2–1.5L │  │
│  └────────────┘ └────────────┘                  │ │ guide only│  │
│  ┌────────────┐ ┌────────────┐                  │ └───────────┘  │
│  │   NVIDIA   │ │ No pref.   │                  │                │
│  └────────────┘ └────────────┘                  │                │
│  ──────────────────────────────                 │                │
│  [← Back]                    [Continue →]       │                │
├──────────────────────────────────────────────────────────────────┤
│  TESTIMONIALS (social proof at the point of commitment)          │
└──────────────────────────────────────────────────────────────────┘

Step 6 replaces navigation with the submit button.
Success replaces the whole wizard with a reference + estimate panel.
```
Components: `BuilderWizard` · `OptionTile` · `CheckChip`

---

## Contact — `/contact`

```
┌──────────────────────────────────────────────────────────────────┐
│  PAGE HEADER                                                     │
├──────────────────────────────────────────────────────────────────┤
│ ┌─ FORM ─────────────────────┐ │ ┌─ Call ──┐ ┌─ WhatsApp ─┐      │
│ │ Name*        Phone*        │ │ └─────────┘ └────────────┘      │
│ │ Email*       Company       │ │ ┌─ Showroom ────────────┐       │
│ │ About ▾      Budget ▾      │ │ │ 📍 address            │       │
│ │ Message*                   │ │ │ ✉  emails             │       │
│ │ [                        ] │ │ │ 🕐 hours              │       │
│ │ Requirements               │ │ │ [Open in Maps]        │       │
│ │ 📎 Attach (≤10 MB)         │ │ └───────────────────────┘       │
│ │ [ Send message ]           │ │ ┌─ MAP (lazy iframe) ───┐       │
│ └────────────────────────────┘ │ └───────────────────────┘       │
│                                │ ┌─ What happens next ───┐       │
│                                │ │ ① minutes ② 1 day ③ 2-3d│      │
├──────────────────────────────────────────────────────────────────┤
│  FAQ                                                             │
└──────────────────────────────────────────────────────────────────┘
```
Components: `ContactForm`

---

## Admin dashboard — `/admin`

```
┌────────────┬─────────────────────────────────────────────────────┐
│ ▣ SH ADMIN │ [🔍 search…]                      [🔔•] [KM Karthik]│
├────────────┼─────────────────────────────────────────────────────┤
│ ▸Dashboard │ Dashboard          [Export report] [View enquiries] │
│  Enquiries⑳│ ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐                │
│  Products  │ │1847││ 23 ││284 ││48k ││ 67 ││₹8.9││ KPI + delta   │
│  Portfolio │ └────┘└────┘└────┘└────┘└────┘└────┘                │
│  Blog      │ ┌─ Enquiry volume ──────────┐┌─ Revenue by cat. ─┐  │
│  Quotes    │ │      ╱╲    ╱╲             ││ Gaming    ▓▓▓▓▓▓  │  │
│  Users     │ │  ╱╲ ╱  ╲ ╱   ╲  sparkline ││ Works.    ▓▓▓▓▓   │  │
│  Settings  │ │ ╱  ╲     ╲             │  ││ Office    ▓▓▓     │  │
│            │ │ avg 29 · peak 41 · 34% ││  │└───────────────────┘  │
│ ────────── │ └────────────────────────┘                          │
│ KM Karthik │ ┌─ Latest enquiries ────────┐┌─ Activity ────────┐  │
│ ← Website  │ │ ref │ customer │ … │status││ ● marked won      │  │
│            │ │ …                        ││ ● created from…   │  │
└────────────┴─────────────────────────────────────────────────────┘
```
Components: `AdminShell` · `StatTile` · `Sparkline` · `DataTable` · `ActivityFeed`

---

## Responsive behaviour

| Breakpoint | Navigation | Grids | Notable |
| --- | --- | --- | --- |
| < 640 | Drawer | 1 column | Filters become a bottom sheet; hero visual stacks under copy |
| 640–1024 | Drawer | 2 columns | Floating hero stat cards appear |
| 1024–1280 | Full bar + mega menu | 3 columns | Sidebars become sticky |
| > 1280 | Full bar | 3–4 columns | Admin sidebar fixed, content offset 256px |
