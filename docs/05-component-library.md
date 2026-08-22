# 05 — Component Library

Every component, its API, and when to reach for it. Tokens are defined in
[`04-design-system.md`](./04-design-system.md).

---

## UI primitives — `components/ui/`

### `Button`
```tsx
<Button variant="primary" size="lg" href="/build">Build Your PC</Button>
<Button variant="danger" onClick={remove}>Delete</Button>
<Button href={whatsappLink()} external variant="outline">WhatsApp</Button>
```
| Prop | Type | Default |
| --- | --- | --- |
| `variant` | `primary` · `accent` · `outline` · `ghost` · `glass` · `danger` | `primary` |
| `size` | `sm` · `md` · `lg` · `xl` · `icon` | `md` |
| `href` | string — renders `Link`, or `<a>` for `tel:`/`mailto:`/`http`/`external` | — |
| `withSheen` | boolean — diagonal hover sweep | `true` |

Polymorphic by design: callers never decide between `button`, `Link` and `a`.

### `Container` · `Section`
`Container` sizes: `narrow` (3xl, article copy) · `default` (1400px) · `wide` (1720px).
`Section` applies the fluid vertical rhythm; `tight` halves it.

### `SectionHeading` · `Eyebrow`
```tsx
<SectionHeading eyebrow="Featured" title={<>Systems <span className="text-sheen">we stand behind</span></>}
                description="…" align="center" as="h2" />
```

### `Card`
`glass` + `edge-light` + optional `card-interactive`. Accepts `as` and spreads
arbitrary HTML attributes (so `id` for anchor targets works).

### `Badge`
Tones: `neutral` · `primary` · `accent` · `success` · `warning` · `danger`. `dot` adds
a status dot so meaning never rests on colour alone.

### `SpecRow` · `Skeleton` · `EmptyState` · `Divider`
`EmptyState` always takes an `action` — an empty state without an exit is a dead end.

### `AuroraOrbs` · `GridBackdrop`
Decorative, `aria-hidden`, `-z-10`, GPU-composited, reduced-motion safe.

---

## Form controls — `components/ui/Field.tsx`

### `Field`
Wraps label + control + error/hint. Owns `htmlFor`/`id` pairing via `useId()` — an
unlabelled control is impossible by construction.

### `Input` · `Textarea` · `Select`
```tsx
<Input label="Email" name="email" type="email" required error={errors.email} icon={<Mail />} />
<Select label="Budget" options={BUDGET_OPTIONS} placeholder="Select a range" hint="Optional" />
```
Error state swaps border and ring to danger and sets `aria-invalid`.

### `OptionTile`
Large selectable card — `role="radio"`, `aria-checked`. The PC Builder's primary control.

### `CheckChip`
Multi-select chip — `role="checkbox"`, `aria-checked`.

---

## Disclosure — `components/ui/Accordion.tsx`

### `Accordion`
Single-open FAQ. Height animates via Framer's native `height: auto` interpolation —
no measured pixel hacks. Proper `aria-expanded` / `aria-controls` / `role="region"`.

### `Tabs`
Horizontally scrollable filter tabs with a `layoutId` pill that slides between items.
Pass a unique `layoutId` per instance or two tab sets on one page will animate into
each other.

---

## Motion — `components/motion/`

### `Reveal` · `RevealGroup` / `RevealItem` · `RevealText`
```tsx
<RevealGroup className="grid gap-6 lg:grid-cols-3" stagger={0.08}>
  {items.map(i => <RevealItem key={i.id}>…</RevealItem>)}
</RevealGroup>
```
Fire once. `RevealText` reveals word-by-word for hero headlines.

### `effects.tsx`
| Component | Notes |
| --- | --- |
| `Counter` | easeOutExpo count-up on first view; `decimals`, `prefix`, `suffix` |
| `Parallax` | Y-axis only, `speed` 0–1 |
| `TiltCard` | 3D tilt + cursor spotlight; auto-disabled for touch and reduced-motion |
| `Magnetic` | Cursor attraction — hero CTA only |
| `Marquee` | CSS-keyframe scroll; **children are duplicated internally**, pass one copy |
| `ScrollProgress` | Spring-damped top bar |

---

## Media — `components/media/SmartImage.tsx`

### `SmartImage`
```tsx
<SmartImage src="products/gaming-pc.webp" alt="Custom gaming PC" fill priority
            sizes="(max-width: 768px) 100vw, 33vw" />
```
The **only** image component in the app. Resolves manifest keys through `lib/images.ts`,
supplies intrinsic dimensions and a blur-up LQIP, lazy by default.

`alt=""` deliberately falls back to the manifest's authored SEO alt text; pass
`alt="" aria-hidden` for genuinely decorative images.

### `MediaFrame`
Fixed-ratio frame with a gradient scrim so white text stays legible over any
photograph. `scrim`: `true` · `'strong'` · `false`. Children are absolutely positioned
over the media (used for badges and overlaid copy).

---

## Layout — `components/layout/`

| Component | Notes |
| --- | --- |
| `Navbar` | Utility strip (collapses on scroll) · mega menu with 140ms pointer grace · mobile drawer with scroll lock · Escape to close |
| `Footer` | Brand + address + social · newsletter · 4 link columns · CTA strip · legal |
| `Logo` / `LogoMark` | Inline SVG chip glyph, gradient stroke, rotates on hover |
| `PageHeader` | Shared inner-page hero: eyebrow → title → lede → optional stat rail |
| `NewsletterForm` | Client component, inline validation, three-state button |

---

## SEO — `components/seo/`

### `JsonLd`
Accepts one schema or an array. Escapes `<` before injection so a CMS string cannot
break out of the script element.

### `Breadcrumbs`
Renders the visible trail **and** the matching `BreadcrumbList` JSON-LD from one call.
Prepends Home automatically.

---

## Domain components

### Products
| Component | Notes |
| --- | --- |
| `ProductCard` | Full card. Whole-card overlay link keeps a single tab stop and an accessible name |
| `ProductCardCompact` | Horizontal variant for rails |
| `ProductsExplorer` | Client filtering, URL-synced via `router.replace`, layout-animated grid, mobile bottom-sheet |
| `ProductGallery` | Stage + thumbnails + lightbox; arrow keys and Escape |
| `EnquiryButton` | Modal enquiry with SKU context attached automatically |

### Builder
`BuilderWizard` — six steps, directional slide transitions, live estimate rail,
clickable completed steps, forward navigation gated on validation, success panel with
reference and WhatsApp handoff.

### Portfolio
`PortfolioGrid` (category tabs + layout animation) · `BeforeAfter` (draggable
comparison, also operable by arrow keys through a visually-hidden range input).

### Blog · Contact · AI
`BlogIndex` (category + search) · `ContactForm` (Zod validation, attachment handling,
intent pre-fill) · `AssistantWidget` (transcript, suggestions, product cards, quote
cards, escalation notice).

### Admin
`AdminShell` (fixed sidebar, sticky bar, animated active indicator) ·
`StatTile` · `Sparkline` (inline SVG, no chart library) · `ShareBar` ·
`DataTable` / `Cell` · `ActivityFeed` · `EnquiryTable`.

---

## Composition rules

1. **Server by default.** `'use client'` only for interactivity.
2. **No raw `<img>` or `next/image`.** Always `SmartImage`.
3. **No hard-coded colours.** Tokens only.
4. **No namespace imports in client components.** Use `icon-registry.ts`.
5. **Every interactive element has an accessible name.** `aria-label` when the label is an icon.
6. **Every empty state has an action.**
7. **Every animation checks reduced motion.**
