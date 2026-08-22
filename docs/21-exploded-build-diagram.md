# 21 — Exploded build diagram

A 3D cutaway for `/build` showing how a desktop goes together. Modelled in
Blender via blender-mcp, exported as a still (and optionally a short loop).

---

## Why this and not product renders

The site has a standing rule: nothing depicts a product NSK cannot stand behind.
Seven stock images were found showing the wrong hardware
(`18-content-audit.md` §8), and product photography is being replaced with
photographs of real stock.

A diagram sidesteps that entirely. It is **explanatory, not representational** —
it shows where a motherboard sits relative to a cabinet, not "this is the
motherboard you will receive". No brand marks, no model numbers, no implication
of specific stock.

It also does something the photographs cannot: it makes the configurator's
ordering legible. The reason the steps run cabinet → motherboard → graphics →
memory → storage → cooling is that each choice constrains the next, and a picture
carries that faster than the copy does.

---

## The cabinet shell — reference analysis

Modelled from a reference image the owner supplied (a Circle Gaming dual-chamber
case). **Unbranded**: the silhouette and layout are generic to this whole class
of case, but the logos on the PSU shroud and fan hubs are that manufacturer's
trademark and are deliberately omitted. The result is usable regardless of which
cabinets NSK stocks, and it doubles as the shell for the exploded view.

Geometry to reproduce:

| Feature | Detail |
| --- | --- |
| Form | Mid-tower, dual-chamber — motherboard front chamber, cables/PSU rear |
| Glass | Panoramic wraparound, front + left, seamless corner with no pillar |
| Side intake | Three 120 mm fans in a vertical column, right side of the front chamber |
| Rear exhaust | One 120 mm, upper-left of the rear panel |
| Expansion slots | Seven, horizontal, left of the motherboard tray |
| PSU shroud | Full-width, lower third, flat top surface |
| Shroud vents | Two horizontal light strips on the shroud face |
| Bottom front | One further light strip below the shroud |
| Mesh | Perforated hex pattern — rear panel, top, and inside the left edge |
| Feet | Four, chamfered, ~20 mm lift |
| Front I/O | Bottom front lip: power, reset, 3.5 mm, 2× USB-A, 1× USB-C |
| Finish | Matte white throughout; glass tinted very slightly cool |

Lighting in the reference is cool white from the fans. For the diagram, drop the
fan glow to near-zero — the callouts need to be the brightest thing in frame, and
`.rgb-edge` in the site's CSS keeps RGB as an edge rather than a wash.

---

## What it shows

Components separated along an assembly axis, in the same order as
`data/configurator.js` `DESKTOP_STEPS`:

| # | Part | Note in the diagram |
| --- | --- | --- |
| 1 | Cabinet | Outer shell, shown as a wireframe or half-transparent so the interior reads |
| 2 | Motherboard | Mounted to the rear-right panel |
| 3 | Graphics card | Into the top PCIe slot, horizontal |
| 4 | Memory | Two sticks in the slots beside the socket |
| 5 | Storage | M.2 flat on the board; 2.5" in the drive bay |
| 6 | Cooling | Tower cooler over the socket, or a 240 mm radiator at the front |
| — | Power supply | Basement, bottom-rear — not a configurator step but part of the build |

Callout labels use the same wording as the configurator steps so the diagram and
the flow reinforce each other.

---

## Visual direction

Follow the site's existing language rather than inventing a new one:

- **Ground** — `--bg` `#060818`, the dark navy-black used by `.theme-dark`
- **Component surfaces** — desaturated slate, no brand colours
- **Highlight edges** — primary `#6091FF` and accent `#22D3EE`
- **Callout lines** — hairline, matching the `.spec-plate` corner-tick motif
- **Labels** — JetBrains Mono uppercase, tracking `0.14em`, matching `.spec-label`

No RGB wash. The site's rule is that RGB appears as a lit *edge*, never a fill
(`.rgb-edge` in `globals.css`) — the diagram should hold that line.

Isometric or a shallow three-quarter view. Straight-on hides the depth that makes
an exploded view worth doing.

---

## Output

| Asset | Purpose | Notes |
| --- | --- | --- |
| `public/images/diagrams/build-exploded.webp` | Static, `/build` page | 1600px long edge, transparent or `#060818` ground |
| `public/images/diagrams/build-exploded-mobile.webp` | Narrow viewports | Vertical stack — the horizontal layout is unreadable at 390px |
| *(optional)* short loop | Assembly animation | Only if it earns its weight; respect `prefers-reduced-motion` |

Run through `frontend/scripts/convert-assets.mjs` so dimensions, alt text and the
blur placeholder land in `image-meta.json`. **An image missing from that manifest
renders as nothing** — that mistake cost a debugging cycle on the processor
imagery (§13).

Alt text should describe the content, e.g. "Exploded diagram of a desktop PC
showing cabinet, motherboard, graphics card, memory, storage and cooling in
assembly order."

---

## Prerequisites — installed 6 August 2026

- [x] `uv` / `uvx` 0.12.2 — via the standalone installer to `~/.local/bin`,
      **not** Homebrew, which is not present on this machine
- [x] Blender **4.5.9 LTS** at `/Applications/Blender.app`
- [x] Addon at `~/Library/Application Support/Blender/4.5/scripts/addons/blender_mcp_addon.py`,
      enabled and saved to preferences
- [x] Socket server verified on `localhost:9876` — `get_scene_info` returned the
      default scene
- [ ] **Claude Code restarted** — MCP servers connect at session start, so the
      `blender` tools are unavailable until then

### Two things the upstream README does not spell out

**Blender must be open with its GUI.** The addon refuses to start headless:
`cannot start server in background mode (blender -b) — commands would never
execute`. `blender --background` is not an option; the app has to be running and
visible for the whole session.

**4.5 LTS rather than 5.x.** The addon declares `"blender": (3, 0, 0)` and was
last touched in 2025, before Blender 5's API changes. LTS is the safer target.

`mcp_config.json` in the project root is a reference copy from the upstream
README and is **not read by Claude Code**. The live config is `.mcp.json`.

---

## Built — 7 August 2026

Live at the foot of `/build`. Source: `blender/build-diagram.blend`, rebuilt by
running `cabinet.py` → `internals.py` → `explode.py` → `labels.py` →
`render_exploded.py` through `blender/bl.py`.

**Seven callouts** in `DESKTOP_STEPS` order — cabinet, motherboard, memory,
cooling, graphics, storage, power supply — each with a step number, the same
label the configurator uses, a one-line note and a leader line to its part.

**2.3 MB PNG → 46 KB WebP** via `convert-assets.mjs`, which now handles
`assets/diagrams/` alongside the product art and registers both in
`image-meta.json`.

### Notes for whoever picks this up

**The MCP server was never used.** It was installed mid-session and MCP servers
attach at startup, so `blender/bl.py` talks to the addon's socket on port 9876
directly. Same channel the MCP server would drive. After a Claude Code restart
the `blender` tools become available and `bl.py` is redundant — but it still
works and needs no restart.

**Blender must be open with its GUI.** The addon refuses headless mode outright:
`cannot start server in background mode — commands would never execute`.

**Four bugs worth not repeating:**

- `primitive_cube_add` + scale + `transform_apply` collapses every object to the
  origin at half size — `transform_apply` bakes the transform into mesh data and
  zeroes the object location. Build with `bmesh` instead.
- Three 120 mm fans need 0.372 m of column. A shroud at 30% of interior height
  left only 0.336 m, so the third fan was silently dropped by a fits-check.
  Shroud is now 22%.
- `Transmission Weight` without `use_raytrace_refraction` renders glass fully
  invisible in EEVEE. Smoked alpha reads better for a diagram anyway.
- Exploding along −Y made the parts recede from the camera and overlap. +X lays
  them across the frame where each can be seen and labelled.

**Labels are staggered across two tiers.** Parts sit 0.14–0.18 m apart; a label
needs about 0.30 m. On one line they overlapped into mush.

### Still open

- [ ] Geometry is honest but crude — the motherboard is a slab with three
      heatsinks, the GPU a box with two fans. The labels carry the meaning. Worth
      refining only if the diagram is ever shown larger.
- [ ] No mobile variant. At 390px the horizontal layout is unreadable; a vertical
      stack would need its own render.
