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
 */
function Cabinet({ tint }) {
  return (
    <>
      <rect x="98" y="20" width="124" height="172" rx="8" {...line} fill="rgb(var(--bg-800))" />
      {/* Tempered side panel */}
      <rect x="108" y="30" width="104" height="152" rx="4" {...line} opacity="0.5"
            fill={tint} fillOpacity="0.07" />
      {/* Top-mounted radiator */}
      <rect x="116" y="38" width="88" height="26" rx="3" {...line} opacity="0.6" />
      {[132, 160, 188].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="51" r="9.5" {...line} opacity="0.55" />
          <circle cx={cx} cy="51" r="2.4" fill={tint} stroke="none" />
        </g>
      ))}
      {/* Graphics card, held horizontally the way it actually sits */}
      <rect x="118" y="96" width="84" height="18" rx="2.5" {...line} opacity="0.75" />
      <line x1="124" y1="114" x2="124" y2="122" {...line} opacity="0.4" />
      <rect x="118" y="96" width="84" height="3" rx="1.5" fill={tint} stroke="none" opacity="0.9" />
      {/* Vertical memory sticks */}
      {[128, 134, 140, 146].map((x) => (
        <rect key={x} x={x} y="74" width="3.4" height="16" rx="1" {...line} strokeWidth="1" opacity="0.5" />
      ))}
      {/* Front intake, lit through the mesh */}
      {[84, 116, 148].map((cy) => (
        <g key={cy}>
          <circle cx="196" cy={cy} r="7.5" {...line} strokeWidth="1" opacity="0.4" />
          <circle cx="196" cy={cy} r="2" fill={tint} stroke="none" opacity="0.8" />
        </g>
      ))}
      {/* PSU shroud */}
      <rect x="116" y="152" width="88" height="22" rx="3" {...line} opacity="0.55" />
      <line x1="124" y1="163" x2="168" y2="163" {...line} strokeWidth="1" opacity="0.35" />
      {/* The RGB strip — the one saturated element in the drawing */}
      <rect x="112" y="34" width="2.5" height="144" rx="1.25" fill={tint} stroke="none" opacity="0.85" />
      <line x1="98" y1="192" x2="222" y2="192" {...line} opacity="0.9" />
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

export function DeviceRender({ shape = 'tower', tint = '#211D71', className }) {
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
      <Shape tint={tint} />
    </svg>
  );
}
