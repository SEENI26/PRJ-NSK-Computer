---
name: nsk-showroom-ui
description: The NSK Computer Zone showroom design system — its two colourways (dark gaming, light professional), the drawn-not-photographed device idiom, the honesty rules about brands and pricing, and the verification loop that catches theme bugs. Use this whenever you touch anything visual or content-bearing in the NSK frontend — building or restyling a page or section, adding products or accessories, choosing colours or type, adding a new colourway, working on the hero or cabinet visuals, or reviewing UI for contrast and responsiveness. Also use it before adding any product imagery or writing catalogue copy, because the rules about what may be claimed are easy to violate by accident.
---

# NSK showroom UI

This is a **showcase site, not a shop** — for a real computer dealer in
Tiruchirappalli. Seven pages (Home, Gaming, Professional, Hardware,
Accessories, Services, About/Contact) and a hard architectural rule: **no
cart, no checkout, no prices.**

CLAUDE.md still says six. Services was added deliberately once it became clear
the brand's own social card advertises "Desktop & Laptop Spares · Networking ·
CCTV" while the site covered none of it — repair and AMC are the half of this
trade that brings people back. Adding an eighth page needs the same bar: real
business the site is currently silent about, not a category that sounds tidy. The spec is settled in conversation at the counter, and
the page's job is to get someone to that conversation with the right machine in
mind.

Stack: Vite + React 19, Tailwind, framer-motion, react-router. Live entry is
`src/app/App.jsx`. (`src/App.jsx` is dead Next-era code — ignore it.)

## The one idea to hold onto

Each audience gets the artifact it already trusts.

| Page | Audience | Borrowed artifact | Reads as |
|---|---|---|---|
| Professional | buyers comparing machines | the **datasheet** | white paper, hairline rules, tabular figures, comparison tables |
| Gaming | players comparing performance | the **FPS overlay** | near-black, threshold colours, capability bars, monospace figures |
| Accessories | people working out what is missing | the **desk plan** | top-down drawing, positions as filters, gaps made visible |
| Services | someone whose machine has stopped | the **job card** | perforated docket, symptoms first in the customer's words |

When you add a section, ask which artifact it belongs to and shape it that way.
This is what stops the two halves of the site collapsing into the same dark
card grid with a different accent, which is where it started.

## Colourways are scoped, never global

Every colour resolves through CSS variables in `src/styles/globals.css`, so a
colourway is one wrapper class that re-points those variables. Everything
token-based underneath (`bg-base-800`, `text-ink-muted`, `border-line`)
re-themes for free, and the other pages are untouched.

- `:root` — the dark default
- `.theme-pro` — light. Paper `#F6F6F3`, accent `#211D71` (the **real NSK navy**
  from `brand/logo-master.png`, unusable on black and therefore only ever seen
  here)
- `.theme-gaming` — the dark ground pushed, plus `--rgb-1/2/3` and
  `--fps-good/mid/low`

Adding a colourway:

1. Re-point the variables inside the wrapper class.
2. **Re-derive the text scale, don't inherit it.** The dark scale leans on glow
   for hierarchy and its faintest step measures 3.2:1 on paper — a fail on the
   11px labels that use it. Compute contrast for all four steps against both the
   page ground and a card. `scripts/contrast.py` does this.
3. Grep the components you reuse for `bg-white/[…]` and `border-white/…`. Those
   are white overlays; they are correct on black and invisible on paper. Either
   re-point them via a `btn-*` / `surface-card` hook in the colourway block, or
   build page-specific components.
4. Check the navbar. It is white type on nothing until you scroll, so over a
   light page it must be forced opaque (see `overLightPage` in `Navbar.jsx`) —
   translucent black over white washes out to grey.

## Devices are drawn, never photographed

`src/components/common/DeviceRender.jsx` draws each product as an orthographic
elevation — `tower`, `sff`, `aio`, `cabinet`, `ultrabook`,
`mobile-workstation`, `gaming-laptop` — tinted per brand or per line.

Two reasons this exists, and both matter more than the visual:

- There is no honest per-brand photography available, and generating a fake
  "Dell laptop" photo misrepresents a real company.
- It is the same idiom as `AnimatedCabinet` on the hero, so the site reads as
  one hand.

The chassis fill is `rgb(var(--bg-800))`, not white — that is what lets one
drawing sit correctly on a white professional card *and* on the gaming ground.
Add new shapes to the `SHAPES` map; keep the shared `line` stroke so the set
stays one drawing.

## What may and may not be claimed

Getting this wrong is the most likely way to do real damage, and it is easy to
do while trying to be helpful.

- **Never invent model numbers, prices, or benchmark figures.** Not
  "Precision 3680 — ₹1,45,000", not "184 FPS in Valorant".
- **Series families are fine** — Precision, ThinkStation, ZBook, ROG Strix,
  Legion Pro. These are real product lines a dealer genuinely supplies, and
  describing what a line is *for* is honest.
- **Configurations are ranges**, because that is how these are ordered:
  "RTX 4060 – 4080 laptop", "32–128 GB, ECC optional".
- **Only badge something with a brand if that brand actually makes it.** Generic
  cabinet shapes are stocked from several makers, so they carry a `tint` and no
  manufacturer — putting ASUS on a generic mesh tower claims something untrue.
- Performance bars are **relative capability**, and the page says so in the
  section lead. If you cannot label a number honestly, do not show it.
- Brand marks come from `partner-brands.json` (Simple Icons, CC0; trademarks
  remain with their owners). The PNGs in `public/brands/` are **generated
  placeholders**, per `public/images/CREDITS.md` — do not present them as
  official logos.
- **No turnaround or availability promises.** "24-hour repair" and "in stock
  now" are cheques the counter has to honour. Promise the *process* instead —
  diagnosis before quote, approval before work — which is true every time.

## The stock photography is not what its filename says

`public/images/` is Unsplash placeholders, and several are actively wrong:
`pc-repair.webp` is two PS4 controllers, `data-recovery.webp` is a Search
Console dashboard, `gaming-pc-rgb.webp` is a bedroom with a neon sign, and
`laptop-workstation.webp` / `workstation.webp` have their subjects swapped.

**Open any image before you place it.** Where there is nothing honest to show,
draw it or go typographic — that is why Services has no photography and why the
desk plan and the device renders exist at all.

## Data lives outside components

`src/data/*.js`, joined by id: a build's `recommendedAccessories` holds ids from
`accessories.js`. That join is what makes a machine and its peripherals read as
one recommendation rather than two catalogues. Keep it.

## Motion

One easing (`EASE`), one duration scale. Animate **transform and opacity only** —
animating `width` or `height` lays out every frame.

A trap worth knowing: a nested `whileInView` inside a parent that already drives
variants **never fires**. Make the child a variant (`hidden`/`visible`) so it
rides the parent's propagation instead. This silently left every capability bar
empty the first time the gaming cards were built.

Respect `prefers-reduced-motion`. The global CSS rule only kills CSS animation —
framer's JS animations need `useReducedMotion()` and a zeroed duration.

## Verify before claiming it works

A screenshot is worth a thousand assumptions, and headless Chrome lies in one
specific way: with `--virtual-time-budget`, pages with a rAF loop (the particle
field, the three.js hero) snapshot early and come out **blank**. That is a
capture artifact, not a bug — do not "fix" a layout because of it. Drive Chrome
over CDP instead and give it real wall-clock time.

`scripts/verify.mjs` sweeps every route at every required breakpoint and reports
horizontal overflow, missing H1, broken images, console errors, CLS and page
height. Run it after any visual change:

```bash
node --experimental-websocket .claude/skills/nsk-showroom-ui/scripts/verify.mjs http://localhost:3101
```

It needs Chrome already running with `--remote-debugging-port=9222`; the script
prints the exact command if it cannot connect.

Breakpoints that must hold: 1920, 1440, 1366, 768, 430, 390. Mobile is an
intentional layout, not a shrunk desktop.

Known and pre-existing: desktop CLS sits at ~0.158 because the lazy-route
Suspense fallback in `src/app/routes.jsx` is `min-h-[70vh]` while real pages are
taller, so the footer jumps on first paint. If you see that number, it is not
something you just introduced.

## Working with the design skills

`ui-ux-pro-max` and `frontend-design` are both useful here, but treat the
database output as a starting point and say when you overrule it. Real examples
from this codebase, both of which were right calls:

- It proposed **EB Garamond / Lato** for the professional page — its own note
  says "best for law firms". Declined; the site uses Space Grotesk + Inter
  everywhere and cohesion across six pages beats a per-page font.
- It proposed **indigo→violet gradient CTAs** for gaming. Declined; that is the
  stock gamer-template look, and its own anti-pattern list says no AI
  purple/pink gradients. Cyan stayed primary, and the magenta partner is used
  only for addressable-RGB moments — the hardware's own light, not a wash.

The useful question when a recommendation arrives: *is this specific to a
computer dealer in Tiruchirappalli, or would it come out the same for any
prompt in this category?*
