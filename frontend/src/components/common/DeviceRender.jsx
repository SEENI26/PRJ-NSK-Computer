import { cn } from '@/utils/helpers';

/**
 * Device drawings — the page's signature.
 *
 * Every product gets its own visual without shipping a photograph of hardware
 * we do not own. These are orthographic elevations, the way a datasheet or a
 * rack diagram draws a machine: flat, measured, no perspective tricks. It is
 * the same "drawn, not photographed" idiom as <AnimatedCabinet> on the dark
 * side of the site, restated for paper.
 *
 * Each shape is tinted with its brand's own colour, used only on the screen
 * wash and one detail — enough to tell a Dell row from a Lenovo row at a
 * glance, not enough to turn the grid into six competing logos.
 *
 * Decorative: the product name is already adjacent in text, so these are
 * hidden from assistive technology rather than given a redundant label.
 */

const VIEW = { w: 320, h: 220 };

/*
 * The chassis fill is a token, not white. `--bg-800` is the raised surface in
 * whichever colourway is in scope: white on the professional page, near-black
 * on the gaming side. Same drawing, correct in both — otherwise a gaming
 * laptop renders as a solid white slab on a black ground.
 */

/** Hairline stroke shared by every shape, so the set reads as one drawing. */
const line = { stroke: 'currentColor', strokeWidth: 1.25, fill: 'none', vectorEffect: 'non-scaling-stroke' };

function Tower({ tint }) {
  return (
    <>
      <rect x="112" y="24" width="96" height="164" rx="7" {...line} fill="rgb(var(--bg-800))" />
      {/* Top intake — drawn as real slots, the way the panel is actually cut */}
      {[38, 45, 52, 59].map((y) => (
        <line key={y} x1="126" y1={y} x2="194" y2={y} {...line} strokeWidth="1" opacity="0.5" />
      ))}
      {/* Drive bays */}
      <rect x="126" y="74" width="68" height="13" rx="2.5" {...line} opacity="0.65" />
      <rect x="126" y="93" width="68" height="13" rx="2.5" {...line} opacity="0.65" />
      {/* Power button, in the brand's colour */}
      <circle cx="160" cy="124" r="7.5" {...line} />
      <circle cx="160" cy="124" r="3" fill={tint} stroke="none" />
      {/* Lower mesh */}
      {[144, 152, 160, 168, 176].map((y) => (
        <line key={y} x1="128" y1={y} x2="192" y2={y} {...line} strokeWidth="1" opacity="0.32" />
      ))}
      <line x1="112" y1="188" x2="208" y2="188" {...line} opacity="0.9" />
    </>
  );
}

function Sff({ tint }) {
  return (
    <>
      <rect x="52" y="92" width="216" height="70" rx="7" {...line} fill="rgb(var(--bg-800))" />
      {/* Front bezel split */}
      <line x1="52" y1="112" x2="268" y2="112" {...line} opacity="0.35" />
      {/* Slot-load bay */}
      <rect x="70" y="98" width="120" height="7" rx="2" {...line} opacity="0.5" />
      {/* Port cluster — the reason this shape exists is that they face forward */}
      <rect x="70" y="126" width="16" height="9" rx="2" {...line} opacity="0.65" />
      <rect x="92" y="126" width="16" height="9" rx="2" {...line} opacity="0.65" />
      <circle cx="126" cy="130.5" r="4" {...line} opacity="0.65" />
      <circle cx="246" cy="130.5" r="7" {...line} />
      <circle cx="246" cy="130.5" r="2.8" fill={tint} stroke="none" />
      {/* Feet */}
      <line x1="76" y1="162" x2="76" y2="168" {...line} />
      <line x1="244" y1="162" x2="244" y2="168" {...line} />
    </>
  );
}

function Aio({ tint }) {
  return (
    <>
      <rect x="48" y="34" width="224" height="132" rx="8" {...line} fill="rgb(var(--bg-800))" />
      <rect x="57" y="43" width="206" height="106" rx="3" fill={tint} opacity="0.1" stroke="none" />
      <rect x="57" y="43" width="206" height="106" rx="3" {...line} opacity="0.45" />
      <circle cx="160" cy="158" r="2.2" fill={tint} stroke="none" />
      {/* Neck and foot */}
      <path d="M148 166 L146 190 L174 190 L172 166 Z" {...line} />
      <rect x="120" y="190" width="80" height="7" rx="3.5" {...line} fill="rgb(var(--bg-800))" />
    </>
  );
}

/** Shared laptop construction — `thick` is what separates a workstation. */
function Laptop({ tint, thick = false }) {
  const deckTop = 150;
  const deckH = thick ? 30 : 22;
  const deckBot = deckTop + deckH;
  const flare = thick ? 20 : 15;

  return (
    <>
      {/* Lid */}
      <rect x="62" y="26" width="196" height="124" rx="7" {...line} fill="rgb(var(--bg-800))" />
      <rect x="70" y="34" width="180" height="102" rx="2.5" fill={tint} opacity="0.11" stroke="none" />
      <rect x="70" y="34" width="180" height="102" rx="2.5" {...line} opacity="0.45" />
      <circle cx="160" cy="143" r="1.8" fill={tint} stroke="none" />

      {/* Deck, opening toward the viewer */}
      <path
        d={`M${62 - 4} ${deckTop} L${258 + 4} ${deckTop} L${258 + flare} ${deckBot} L${62 - flare} ${deckBot} Z`}
        {...line}
        fill="rgb(var(--bg-800))"
      />
      {/* Key bed */}
      <line x1={72} y1={deckTop + 8} x2={248} y2={deckTop + 8} {...line} strokeWidth="1" opacity="0.34" />
      <line x1={68} y1={deckTop + 15} x2={252} y2={deckTop + 15} {...line} strokeWidth="1" opacity="0.34" />
      {/* Trackpad */}
      <rect
        x="136" y={deckBot - 6} width="48" height="4" rx="1.5"
        {...line} strokeWidth="1" opacity="0.4"
      />
      {thick && (
        <>
          {/* Rear exhaust — the visible difference on a mobile workstation */}
          <line x1="78" y1={deckTop + 22} x2="112" y2={deckTop + 22} {...line} strokeWidth="1.5" opacity="0.5" />
          <line x1="208" y1={deckTop + 22} x2="242" y2={deckTop + 22} {...line} strokeWidth="1.5" opacity="0.5" />
        </>
      )}
    </>
  );
}

/**
 * Gaming cabinet — a tower seen through its side panel.
 *
 * The professional tower is drawn closed, because that is how it is sold: a
 * sealed, quiet box. A gaming cabinet is bought for what is visible inside it,
 * so this one is drawn open, with the parts a buyer is actually paying to see.
 *
 * `level` 1–4 escalates the build the way the four tiers actually escalate:
 * the chassis widens, a second intake appears, a radiator arrives at tier 3
 * and grows at tier 4, the card gets thicker, and the lighting steps up. That
 * makes the drawing carry the difference between tiers instead of repeating
 * the same picture four times — the reason to show a picture here at all.
 *
 * Called without a level (the Cabinets tab) it draws a generic mid tower.
 */
function Cabinet({ tint, level = 2 }) {
  const wide = level >= 4;
  const slim = level <= 1;

  const w = slim ? 96 : wide ? 138 : 120;
  const x = 160 - w / 2;
  const top = slim ? 40 : 22;
  const bottom = 192;
  const inner = { x: x + 10, w: w - 20 };

  const radiator = level >= 3;             // AIO from the high tier up
  const radFans = level >= 4 ? 3 : 2;      // 360 mm vs 240 mm
  const intakes = slim ? 2 : 3;
  const gpuH = slim ? 13 : wide ? 22 : 18;
  const gpuY = radiator ? 104 : 92;
  const litFans = level;                   // how much of it glows

  const intakeYs = Array.from({ length: intakes }, (_, i) =>
    (slim ? 92 : 84) + i * (slim ? 34 : 32));

  return (
    <>
      <rect x={x} y={top} width={w} height={bottom - top} rx="8" {...line} fill="rgb(var(--bg-800))" />
      {/* Tempered side panel */}
      <rect x={x + 10} y={top + 10} width={w - 20} height={bottom - top - 20} rx="4"
            {...line} opacity="0.5" fill={tint} fillOpacity={0.05 + level * 0.015} />

      {radiator && (
        <>
          <rect x={inner.x + 4} y={top + 16} width={inner.w - 8} height="26" rx="3" {...line} opacity="0.6" />
          {Array.from({ length: radFans }, (_, i) => {
            const step = (inner.w - 8) / radFans;
            const cx = inner.x + 4 + step * (i + 0.5);
            return (
              <g key={cx}>
                <circle cx={cx} cy={top + 29} r="9" {...line} opacity="0.55" />
                <circle cx={cx} cy={top + 29} r="2.4" fill={tint} stroke="none" />
              </g>
            );
          })}
        </>
      )}

      {/* Graphics card, held horizontally the way it actually sits */}
      <rect x={inner.x + 2} y={gpuY} width={inner.w - 4} height={gpuH} rx="2.5" {...line} opacity="0.75" />
      <rect x={inner.x + 2} y={gpuY} width={inner.w - 4} height="3" rx="1.5"
            fill={tint} stroke="none" opacity="0.9" />
      <line x1={inner.x + 8} y1={gpuY + gpuH} x2={inner.x + 8} y2={gpuY + gpuH + 8} {...line} opacity="0.4" />

      {/* Memory — two sticks at the low tiers, four once it is dual-rank */}
      {Array.from({ length: level >= 3 ? 4 : 2 }, (_, i) => (
        <rect key={i} x={inner.x + 8 + i * 6} y={gpuY - 24} width="3.4" height="16" rx="1"
              {...line} strokeWidth="1" opacity="0.5" />
      ))}

      {/* Front intake, lit through the mesh */}
      {intakeYs.map((cy, i) => (
        <g key={cy}>
          <circle cx={x + w - 26} cy={cy} r="7.5" {...line} strokeWidth="1" opacity="0.4" />
          <circle cx={x + w - 26} cy={cy} r="2" fill={tint} stroke="none"
                  opacity={i < litFans ? 0.85 : 0.25} />
        </g>
      ))}

      {/* PSU shroud */}
      <rect x={inner.x + 4} y={bottom - 40} width={inner.w - 8} height="22" rx="3" {...line} opacity="0.55" />
      <line x1={inner.x + 12} y1={bottom - 29} x2={inner.x + inner.w / 2} y2={bottom - 29}
            {...line} strokeWidth="1" opacity="0.35" />

      {/* The RGB strip. Tier 1 ships without one; the top tier is lit on both
          edges, which is genuinely how these are specified. */}
      {level >= 2 && (
        <rect x={x + 14} y={top + 14} width="2.5" height={bottom - top - 28} rx="1.25"
              fill={tint} stroke="none" opacity="0.85" />
      )}
      {level >= 4 && (
        <rect x={x + w - 16.5} y={top + 14} width="2.5" height={bottom - top - 28} rx="1.25"
              fill={tint} stroke="none" opacity="0.55" />
      )}

      <line x1={x} y1={bottom} x2={x + w} y2={bottom} {...line} opacity="0.9" />
    </>
  );
}

const SHAPES = {
  tower: Tower,
  sff: Sff,
  aio: Aio,
  cabinet: Cabinet,
  ultrabook: (p) => <Laptop {...p} />,
  'mobile-workstation': (p) => <Laptop {...p} thick />,
  /* A gaming laptop is a thick-chassis notebook — same construction as the
     mobile workstation, which is the honest answer: they are the same machine
     with different marketing. */
  'gaming-laptop': (p) => <Laptop {...p} thick />,
};

export function DeviceRender({ shape = 'tower', tint = '#211D71', level, className }) {
  const Shape = SHAPES[shape] ?? Tower;

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={cn('h-full w-full text-ink', className)}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Contact shadow — what stops the drawing floating off the paper */}
      <ellipse cx="160" cy="203" rx="86" ry="6" fill="currentColor" opacity="0.09" />
      <Shape tint={tint} level={level} />
    </svg>
  );
}
