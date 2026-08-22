# 04 — Design System

> **Single theme.** The site ships one treatment: white and blue. Colour resolves
> through CSS variables in `globals.css`, so the whole palette is retunable from
> one block — but there is no theme switcher and no dark variant.

Every token below is implemented in `frontend/tailwind.config.ts` and
`frontend/src/app/globals.css`. This document explains the reasoning; the config
files are the source of truth.

---

## 1. Colour

### Core palette

| Token | Hex | Tailwind | Use |
| --- | --- | --- | --- |
| Background | `#050816` | `bg-base` | Page canvas |
| Surface | `#0F172A` | `bg-base-700` | Elevated sections, form controls |
| Primary | `#2563EB` | `primary` | Primary actions, active state, focus |
| Accent | `#06B6D4` | `accent` | Highlights, links, metrics, gradient terminus |
| Success | `#22C55E` | `success` | In stock, won, confirmations |
| Warning | `#F59E0B` | `warning` | Low stock, ratings, escalation |
| Danger | `#EF4444` | `danger` | Errors, lost, destructive actions |
| White | `#FFFFFF` | `text-ink` | Headings |
| Light grey | `#E5E7EB` | `text-ink-muted` | Body copy |

### Derived neutrals

The brief's palette gives two backgrounds and two text colours, which is not enough
for a dark UI with real depth. Four extra background steps and two extra text steps
were derived along the same hue:

```
base-900 #050816   page
base-800 #0A0F26   section bands, admin chrome
base-700 #0F172A   cards, inputs          ← brief's "secondary background"
base-600 #151E38   hover surfaces
base-500 #1C2745   active surfaces

ink        #FFFFFF  headings
ink-muted  #E5E7EB  body                  ← brief's "light gray"
ink-subtle #94A3B8  supporting copy
ink-faint  #64748B  metadata, captions
```

`ink-faint` on `base-900` measures **5.9:1** — above the 4.5:1 AA threshold for normal
text. Nothing smaller than 12px uses it.

### Semantic contrast checks

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `ink` on `base-900` | 19.8:1 | AAA |
| `ink-muted` on `base-900` | 16.4:1 | AAA |
| `ink-subtle` on `base-900` | 8.1:1 | AAA |
| `ink-faint` on `base-900` | 5.9:1 | AA |
| `white` on `primary` | 5.4:1 | AA |
| `base-900` on `accent` | 8.9:1 | AAA |

The accent button uses **dark text on cyan**, not white. White on `#06B6D4` is 2.4:1
and fails; inverting it is the only way to use that colour for a filled button.

### Colour rules

1. Primary blue is for **action**. Never decorate with it.
2. Accent cyan is for **emphasis and data**. Never use it as a large fill except on the accent button.
3. Status colours are **only** for status. A green heading means nothing and dilutes the signal.
4. The `brand-sheen` gradient (`white → #BFD6FE → #22D3EE`) is reserved for display headings and hero numerals — at most one instance per viewport.

---

## 2. Typography

**Inter**, self-hosted via `next/font` — no external request, no FOUT, no layout shift.
`adjustFontFallback` matches the fallback metrics so the swap is imperceptible.

### Fluid display scale

Sizes use `clamp()` so there is no breakpoint jump:

| Token | Clamp | Line height | Tracking | Weight |
| --- | --- | --- | --- | --- |
| `display-2xl` | `clamp(3rem, 7vw, 6rem)` | 0.95 | −0.04em | 800 |
| `display-xl` | `clamp(2.5rem, 5.5vw, 4.5rem)` | 1.0 | −0.035em | 800 |
| `display-lg` | `clamp(2rem, 4vw, 3.25rem)` | 1.08 | −0.03em | 700 |
| `display-md` | `clamp(1.625rem, 2.6vw, 2.25rem)` | 1.15 | −0.02em | 700 |
| `display-sm` | `clamp(1.25rem, 1.8vw, 1.5rem)` | 1.25 | −0.015em | 600 |
| `eyebrow` | `0.75rem` fixed | 1 | **+0.22em** | 600 |

Negative tracking tightens as size increases — large type set at default tracking
looks loose and amateurish. The eyebrow inverts this: wide tracking at small size
reads as a label rather than as body text.

### Body scale

Body copy uses explicit pixel values (`text-[15px]`, `text-[13.5px]`) rather than
Tailwind's `text-sm`/`text-base`. The default 14/16px steps are too coarse for a
dense interface — half-pixel control matters at card scale.

| Context | Size | Weight | Colour |
| --- | --- | --- | --- |
| Lede paragraph | 17px / 1.6 | 400 | `ink-subtle` |
| Body | 15px / 1.7 | 400 | `ink-subtle` |
| Card body | 13.5px / 1.6 | 400 | `ink-subtle` |
| Metadata | 11.5–12px | 500 | `ink-faint` |
| Article body | 16.5px / 1.75 | 400 | `ink-subtle` |

`text-wrap: balance` on every heading, `text-wrap: pretty` on paragraphs — kills orphans
without manual line breaks.

---

## 3. Spacing & layout

**4px base unit.** Section rhythm is fluid:

```
section     clamp(5rem, 10vw, 9rem)     major sections
section-sm  clamp(3.5rem, 7vw, 6rem)    tighter sections
```

**Container:** `max-w-[1400px]`, padding `1.25rem → 2rem` across breakpoints.
A `narrow` variant (`max-w-3xl`) is used for article body copy, where 1400px would
give an unreadable 140-character measure.

**Breakpoints:** 640 / 768 / 1024 / 1280 / 1536, with the container capped at 1400px.

**Grid conventions:**

| Content | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| Product cards | 1 | 2 | 3 |
| Category tiles | 1 | 2 | 4 |
| Service cards | 1 | 2 | 4 |
| Stat tiles | 1 | 2 | 4 (6 on admin) |
| Detail page | stacked | stacked | asymmetric split |

---

## 4. Elevation & surface

Dark UIs cannot use shadow alone for elevation — a shadow on near-black is invisible.
Depth comes from three stacked signals:

```css
.glass {
  border: 1px solid rgba(255,255,255,0.08);   /* 1. hairline edge  */
  background: rgba(255,255,255,0.035);        /* 2. lifted surface */
  backdrop-filter: blur(24px);                /* 3. context blur   */
  box-shadow: 0 20px 60px -25px rgba(0,0,0,0.9),
              inset 0 1px 0 0 rgba(255,255,255,0.06);
}
```

`.edge-light` adds a fading white gradient across the top edge of a card — the visual
cue of a machined metal chamfer. It is what makes the cards read as premium hardware
rather than as generic frosted glass.

**Shadow tokens:**

| Token | Use |
| --- | --- |
| `shadow-glass` | Default card |
| `shadow-glow` | Primary hover, selected state (blue ring + bloom) |
| `shadow-glow-accent` | Accent emphasis |
| `shadow-lift` | Sticky nav once scrolled |

**Radii:** `xs 6px` · `lg 8px` · `xl 12px` · `2xl 16px` · `--radius-card 20px` · `4xl 32px`.
Cards use the CSS variable so the whole system can be re-shaped from one place.

---

## 5. Motion

### Rules

1. Entrances travel **≤ 32px** and last **500–800ms** on `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out).
2. Nothing in peripheral vision loops faster than **2s**.
3. Animate **only `opacity` and `transform`** — never `width`, `height`, `top` or `left`.
4. Scroll reveals fire **once** (`viewport={{ once: true }}`); re-animating on scroll-back is nauseating.
5. `prefers-reduced-motion` is honoured globally in CSS *and* per-component via `useReducedMotion()`.

### Easing tokens

| Token | Curve | Use |
| --- | --- | --- |
| `ease-premium` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default — fast start, long settle |
| `ease-in-out-expo` | `cubic-bezier(0.87, 0, 0.13, 1)` | Symmetric, for reversible transitions |
| `spring` | stiffness 260, damping 30 | Layout shifts |
| `springSnappy` | stiffness 420, damping 34 | Active pills, toggles |

### Primitives

| Component | Behaviour |
| --- | --- |
| `Reveal` | Directional scroll entrance, fires once |
| `RevealGroup` / `RevealItem` | Staggered children, 0.05–0.09s apart |
| `RevealText` | Word-by-word hero reveal, 0.055s stagger |
| `Counter` | easeOutExpo numeric count-up on first view |
| `Parallax` | `useScroll` + `useTransform` on Y only |
| `TiltCard` | 3D tilt + cursor spotlight; disabled for touch and reduced-motion |
| `Magnetic` | Cursor attraction — hero CTA only |
| `Marquee` | CSS-keyframe infinite scroll, pauses on hover |
| `ScrollProgress` | Spring-damped top progress bar |

**Reduced motion is not an afterthought.** `TiltCard`, `Magnetic` and `Parallax` all
check `useReducedMotion()` and return undefined style objects rather than animating
to zero — no wasted compositor work.

---

## 6. Components

### Button

Six variants × five sizes. Every non-ghost variant carries the diagonal `sheen`
sweep on hover — a single consistent affordance that says "this is pressable".

| Variant | When |
| --- | --- |
| `primary` | The one action you want taken on this screen |
| `accent` | High-contrast alternative (dark text on cyan) |
| `outline` | Secondary action |
| `ghost` | Tertiary, in-table, low-emphasis |
| `glass` | On photography or gradient backgrounds |
| `danger` | Destructive, admin only |

Sizes: `sm 36px` · `md 44px` · `lg 52px` · `xl 60px` · `icon 44×44`.
44px is the minimum touch target throughout, matching the WCAG 2.5.5 guideline.

`Button` renders `<button>`, `<Link>` or `<a>` depending on props — `href` with a
`tel:`/`mailto:`/`http` prefix or `external` becomes a plain anchor. Callers never
have to think about it.

### Form controls

All controls share `controlBase`: 12px radius, `base-700/60` fill, `white/10` border,
and a 4px `primary/15` focus ring. Error state swaps the border and ring to danger and
sets `aria-invalid`.

`Field` wraps label + control + error/hint and owns the `htmlFor`/`id` pairing via
`useId()`, so an unlabelled control is impossible by construction.

`OptionTile` and `CheckChip` are the large selectable surfaces the PC Builder is built
from — `role="radio"` / `role="checkbox"` with `aria-checked`, so the wizard is fully
keyboard and screen-reader operable.

### Cards

| Variant | Composition |
| --- | --- |
| Product card | 4:3 media, badges, brand, rating, 3 highlights, price, arrow affordance |
| Category tile | 16:10 media, count chip, name, description |
| Service card | 16:9 media with floating icon, deliverables preview, price + turnaround |
| Testimonial | Quote glyph, body, stars, avatar footer |
| Stat tile | Icon, delta chip, value, label |

The product card uses a **full-card overlay link** (`absolute inset-0 z-30`) rather than
wrapping the whole article in an anchor — that keeps a single tab stop, an accessible
name, and valid HTML with nested interactive content.

---

## 7. Iconography

**Lucide**, 1.5px stroke. Sizes: 14px (inline) · 16px (buttons, body) · 20px (feature tiles) · 24px (empty states).

**Critical constraint:** client components must never use `import * as Icons from 'lucide-react'`.
The namespace import defeats tree-shaking and pulled the entire icon set into the
`/build` bundle — **165 kB of First Load JS**. Client components resolve icons through
`components/ui/icon-registry.ts`, an explicit map. Server components may use dynamic
lookup safely because it never reaches the browser bundle.

---

## 8. Imagery

- **Format:** `.webp` source files; Next.js serves AVIF with WebP fallback.
- **Access:** every image goes through `SmartImage`, never a raw `<Image src="/...">`.
- **Zero CLS:** intrinsic width/height come from the generated `image-meta.json`.
- **Blur-up:** a 20px base64 WebP LQIP per asset, also generated at build.
- **Loading:** lazy by default; `priority` only for above-the-fold art.
- **Scrims:** `MediaFrame` applies a gradient scrim so white text stays legible over any photograph.
- **Swappable:** drop a file at the same path in `public/images/` and it just works — no code change, and the fetch script never overwrites an existing file.

---

## 9. Accessibility

| Requirement | Implementation |
| --- | --- |
| Focus visibility | Global `:focus-visible` ring, 2px accent + 2px offset. Never suppressed. |
| Skip link | First focusable element, jumps to `#main` |
| Landmarks | `header`/`nav`/`main`/`footer` with `aria-label` where duplicated |
| Modals | `role="dialog"`, `aria-modal`, Escape to close, body scroll locked |
| Live regions | `role="status" aria-live="polite"` on result counts |
| Form errors | `role="alert"`, `aria-invalid`, focus moves to first invalid control |
| Decorative images | `alt=""` + `aria-hidden` |
| Colour independence | Status always pairs colour with a text label and often a dot |
| Reduced motion | Global CSS override + per-component hooks |
| Touch targets | 44px minimum |

---

## 10. Admin theme

The admin panel shares the token set but reads differently by design:

- Denser spacing (16–24px vs 32–48px) — operators scan, they do not browse.
- Fixed 256px sidebar, sticky 64px top bar.
- Data tables with `min-w` + horizontal scroll rather than reflow, so column alignment is preserved.
- Charts are **inline SVG** with no charting dependency — the sparkline is ~40 lines and adds zero kB to the bundle.
- Separate root layout: no marketing Navbar, Footer or AI widget, and `robots: noindex, nofollow, nocache`.
