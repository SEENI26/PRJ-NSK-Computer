import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/helpers';

/**
 * The desk, from above — this page's signature.
 *
 * Gaming borrows the FPS overlay, professional borrows the datasheet. An
 * accessory buyer is not comparing specs at all; they are working out what is
 * still missing from a desk. So this page borrows the *plan* — the top-down
 * drawing an installer or a fit-out sketches before wiring a room.
 *
 * Every position is a filter. The point is not decoration: laid out this way
 * the gaps are visible, which is the whole problem with a flat grid of
 * twenty-two tiles. Nobody forgets the monitor. Everybody forgets the UPS.
 *
 * Drawn rather than photographed, same as <DeviceRender> — orthographic, one
 * hairline weight, tokens for fill so it survives a colourway change.
 *
 * On a phone the plan is an illustration, not a control. Seven hotspots inside
 * a ~318px-wide drawing cannot each be 44px without overlapping each other, and
 * a 10px tap target is worse than no tap target. The chip row directly beneath
 * filters exactly the same way at a proper size, so below `sm` the positions
 * stop being buttons and the plan just shows you the shape of the problem.
 */

const VIEW = { w: 520, h: 340 };

const line = {
  stroke: 'currentColor',
  strokeWidth: 1.25,
  fill: 'none',
  vectorEffect: 'non-scaling-stroke',
};

/**
 * Each position carries the geometry of its own hotspot, so the hit area is
 * the drawn object rather than an invisible rectangle floating over it.
 */
const POSITIONS = [
  { id: 'display', label: 'Display',  hit: { x: 168, y: 40,  w: 184, h: 52 } },
  { id: 'camera',  label: 'Camera',   hit: { x: 244, y: 22,  w: 32,  h: 16 } },
  { id: 'audio',   label: 'Audio',    hit: { x: 96,  y: 44,  w: 44,  h: 74 } },
  { id: 'input',   label: 'Keys',     hit: { x: 150, y: 176, w: 168, h: 52 } },
  { id: 'connect', label: 'Dock',     hit: { x: 380, y: 150, w: 74,  h: 40 } },
  { id: 'power',   label: 'Power',    hit: { x: 60,  y: 254, w: 96,  h: 52 } },
  { id: 'seat',    label: 'Seat',     hit: { x: 200, y: 262, w: 120, h: 54 } },
];

export function DeskPlan({ zone, onSelect, className }) {
  const isMobile = useIsMobile();
  const on = (id) => zone === id;

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="h-full w-full text-ink"
        role="group"
        aria-label="Desk plan — select a position to filter"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Desk surface */}
        <rect x="44" y="30" width="432" height="212" rx="10" {...line} opacity="0.4"
              fill="rgb(var(--bg-800))" />
        <line x1="44" y1="242" x2="476" y2="242" {...line} opacity="0.55" />

        {/* ── Display: monitor footprint plus its stand ─────────────────── */}
        <g opacity={zone && !on('display') ? 0.28 : 1}>
          <rect x="168" y="44" width="184" height="14" rx="3" {...line}
                fill={on('display') ? 'rgb(var(--accent))' : 'none'}
                fillOpacity={on('display') ? 0.18 : 0} />
          <path d="M244 58 L244 78 L276 78 L276 58" {...line} opacity="0.7" />
          <rect x="228" y="78" width="64" height="10" rx="4" {...line} opacity="0.7" />
        </g>

        {/* ── Camera: clipped to the top edge of the panel ──────────────── */}
        <g opacity={zone && !on('camera') ? 0.28 : 1}>
          <rect x="248" y="26" width="24" height="10" rx="4" {...line}
                fill={on('camera') ? 'rgb(var(--accent))' : 'none'}
                fillOpacity={on('camera') ? 0.2 : 0} />
          <circle cx="260" cy="31" r="2.4" fill="currentColor" opacity="0.75" />
        </g>

        {/* ── Audio: a speaker each side, angled in ─────────────────────── */}
        <g opacity={zone && !on('audio') ? 0.28 : 1}>
          {[108, 372].map((x) => (
            <g key={x}>
              <rect x={x} y="48" width="34" height="62" rx="5" {...line}
                    fill={on('audio') ? 'rgb(var(--accent))' : 'none'}
                    fillOpacity={on('audio') ? 0.16 : 0} />
              <circle cx={x + 17} cy="68" r="9" {...line} opacity="0.6" />
              <circle cx={x + 17} cy="93" r="5" {...line} opacity="0.6" />
            </g>
          ))}
        </g>

        {/* ── Input: keyboard, pad and mouse, laid out as they sit ──────── */}
        <g opacity={zone && !on('input') ? 0.28 : 1}>
          <rect x="150" y="180" width="168" height="48" rx="5" {...line}
                fill={on('input') ? 'rgb(var(--accent))' : 'none'}
                fillOpacity={on('input') ? 0.18 : 0} />
          {[190, 200, 210].map((y) => (
            <line key={y} x1="158" y1={y} x2="310" y2={y} {...line} strokeWidth="1" opacity="0.32" />
          ))}
          {/* Pad, with the mouse on it */}
          <rect x="330" y="176" width="76" height="56" rx="4" {...line} opacity="0.45"
                fill={on('input') ? 'rgb(var(--accent))' : 'none'}
                fillOpacity={on('input') ? 0.1 : 0} />
          <ellipse cx="368" cy="202" rx="13" ry="19" {...line} opacity="0.8" />
          <line x1="368" y1="188" x2="368" y2="197" {...line} strokeWidth="1" opacity="0.5" />
        </g>

        {/* ── Connect: dock at the desk edge, cable to the machine ──────── */}
        <g opacity={zone && !on('connect') ? 0.28 : 1}>
          <rect x="392" y="120" width="62" height="26" rx="4" {...line}
                fill={on('connect') ? 'rgb(var(--accent))' : 'none'}
                fillOpacity={on('connect') ? 0.2 : 0} />
          {[402, 412, 422].map((x) => (
            <rect key={x} x={x} y="129" width="7" height="8" rx="1.5" {...line}
                  strokeWidth="1" opacity="0.55" />
          ))}
        </g>

        {/* ── Power: under the desk, which is exactly why it gets missed ── */}
        <g opacity={zone && !on('power') ? 0.28 : 1}>
          <rect x="64" y="258" width="88" height="46" rx="5" {...line}
                fill={on('power') ? 'rgb(var(--accent))' : 'none'}
                fillOpacity={on('power') ? 0.2 : 0} />
          <line x1="74" y1="272" x2="120" y2="272" {...line} strokeWidth="1" opacity="0.4" />
          <circle cx="138" cy="272" r="5" {...line} opacity="0.6" />
          <line x1="74" y1="288" x2="142" y2="288" {...line} strokeWidth="1" opacity="0.3" />
          <text x="108" y="320" textAnchor="middle" fontSize="10" fill="currentColor"
                opacity="0.45" letterSpacing="1.5">UNDER DESK</text>
        </g>

        {/* ── Seat ───────────────────────────────────────────────────────── */}
        <g opacity={zone && !on('seat') ? 0.28 : 1}>
          <rect x="206" y="266" width="108" height="46" rx="16" {...line}
                fill={on('seat') ? 'rgb(var(--accent))' : 'none'}
                fillOpacity={on('seat') ? 0.18 : 0} />
          <line x1="206" y1="288" x2="314" y2="288" {...line} strokeWidth="1" opacity="0.3" />
        </g>

        {/* Hotspots last so they take the pointer, and each is a real button. */}
        {!isMobile && POSITIONS.map((p) => (
          <rect
            key={p.id}
            x={p.hit.x} y={p.hit.y} width={p.hit.w} height={p.hit.h}
            rx="6"
            fill="transparent"
            className="cursor-pointer outline-none"
            role="button"
            tabIndex={0}
            aria-pressed={on(p.id)}
            aria-label={`${p.label} — filter accessories for this position`}
            onClick={() => onSelect(on(p.id) ? 'all' : p.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(on(p.id) ? 'all' : p.id);
              }
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export { POSITIONS as DESK_POSITIONS };
