import { cn } from '@/utils/helpers';

/**
 * A drawn mark per kind of job.
 *
 * The services page was 4,871px tall with 4,276px of it an unbroken run of
 * text — nine job cards carrying no visual at all. These break that run
 * without pretending to be photographs, which matters here more than usual:
 * every stock image in this repo is mislabelled (the file named `pc-repair`
 * is two PS4 controllers), so drawing is the only honest option left.
 *
 * Same hairline weight and `currentColor` stroke as <DeviceRender>, so the
 * marks read as the same hand rather than a bought icon set. Each one shows
 * the *object* of the job rather than a generic symbol — a hinge for laptop
 * repair, a platter and head for recovery, a lens cone for CCTV — because a
 * spanner on all nine would say nothing.
 *
 * Decorative: the service name sits beside every one of these, so they are
 * hidden from assistive technology rather than given a redundant label.
 */

const V = 48;
const line = {
  stroke: 'currentColor',
  strokeWidth: 1.5,
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
};

/* Desktop repair — a tower opened, with a probe on the board. */
const DesktopRepair = () => (
  <>
    <rect x="9" y="7" width="20" height="34" rx="3" {...line} />
    <line x1="13" y1="13" x2="25" y2="13" {...line} opacity="0.5" />
    <line x1="13" y1="17" x2="25" y2="17" {...line} opacity="0.5" />
    <circle cx="19" cy="27" r="3.5" {...line} />
    {/* probe, angled in from outside the chassis */}
    <line x1="33" y1="14" x2="24" y2="24" {...line} />
    <path d="M33 14 l5 -5 l2 2 l-5 5 z" {...line} />
  </>
);

/* Laptop repair — the hinge is the fault people actually bring in. */
const LaptopRepair = () => (
  <>
    <path d="M13 10 h22 v18 h-22 z" {...line} />
    <path d="M8 32 h32 l3 6 h-38 z" {...line} />
    <circle cx="24" cy="30" r="1.6" {...line} opacity="0.7" />
    {/* hinge, called out */}
    <path d="M13 28 a4 4 0 0 0 -4 4" {...line} strokeWidth="2" />
  </>
);

/* Data recovery — platter and head, the shape of the thing at risk. */
const DataRecovery = () => (
  <>
    <rect x="7" y="9" width="34" height="30" rx="3" {...line} />
    <circle cx="21" cy="24" r="10" {...line} opacity="0.75" />
    <circle cx="21" cy="24" r="2.5" {...line} />
    {/* actuator arm swung over the platter */}
    <path d="M37 13 l-3 3 l-8 8" {...line} />
    <circle cx="37" cy="13" r="1.8" {...line} />
  </>
);

/* Upgrades — a stick going in, with the direction stated. */
const Upgrade = () => (
  <>
    <rect x="8" y="24" width="32" height="12" rx="2" {...line} />
    {[13, 18, 23, 28, 33].map((x) => (
      <line key={x} x1={x} y1="36" x2={x} y2="39" {...line} opacity="0.5" />
    ))}
    <line x1="24" y1="20" x2="24" y2="7" {...line} />
    <path d="M19 12 l5 -5 l5 5" {...line} />
  </>
);

/* Custom build — parts converging into one chassis. */
const CustomBuild = () => (
  <>
    <rect x="14" y="12" width="20" height="30" rx="3" {...line} />
    <line x1="19" y1="19" x2="29" y2="19" {...line} opacity="0.6" />
    <rect x="18" y="25" width="12" height="6" rx="1.5" {...line} opacity="0.7" />
    {/* two parts still on their way in */}
    <path d="M7 9 l5 4" {...line} opacity="0.65" />
    <rect x="3" y="5" width="6" height="5" rx="1" {...line} opacity="0.65" />
    <path d="M41 9 l-5 4" {...line} opacity="0.65" />
    <rect x="39" y="5" width="6" height="5" rx="1" {...line} opacity="0.65" />
  </>
);

/* Networking — a switch feeding points, which is what gets installed. */
const Networking = () => (
  <>
    <rect x="15" y="6" width="18" height="8" rx="2" {...line} />
    {[19, 23, 27].map((x) => (
      <line key={x} x1={x} y1="14" x2={x} y2="17" {...line} opacity="0.6" />
    ))}
    <path d="M24 14 v8" {...line} />
    <path d="M11 30 v-4 h26 v4" {...line} />
    <path d="M24 22 v4" {...line} />
    {[11, 24, 37].map((x) => (
      <rect key={x} x={x - 4} y="30" width="8" height="7" rx="1.5" {...line} />
    ))}
  </>
);

/* CCTV — body, mount and the cone of what it actually covers. */
const Cctv = () => (
  <>
    <path d="M10 12 h18 a3 3 0 0 1 3 3 v6 a3 3 0 0 1 -3 3 h-18 z" {...line} />
    <circle cx="31" cy="18" r="3.5" {...line} />
    <path d="M19 24 v5" {...line} />
    <path d="M13 41 h12 l-6 -12 z" {...line} opacity="0.45" strokeDasharray="3 3" />
    <line x1="34" y1="14" x2="40" y2="11" {...line} opacity="0.55" />
    <line x1="34" y1="22" x2="40" y2="25" {...line} opacity="0.55" />
  </>
);

/* Server setup — stacked units, the shape of a rack. */
const ServerSetup = () => (
  <>
    {[8, 20, 32].map((y) => (
      <g key={y}>
        <rect x="9" y={y} width="30" height="9" rx="2" {...line} />
        <circle cx="14" cy={y + 4.5} r="1.4" fill="currentColor" stroke="none" opacity="0.8" />
        <line x1="20" y1={y + 4.5} x2="34" y2={y + 4.5} {...line} strokeWidth="1" opacity="0.4" />
      </g>
    ))}
  </>
);

/* AMC — a scheduled cycle rather than a one-off visit. */
const Amc = () => (
  <>
    <rect x="9" y="11" width="30" height="28" rx="3" {...line} />
    <line x1="9" y1="18" x2="39" y2="18" {...line} opacity="0.6" />
    <line x1="17" y1="7" x2="17" y2="13" {...line} />
    <line x1="31" y1="7" x2="31" y2="13" {...line} />
    <path d="M17 28 l4 4 l9 -9" {...line} />
  </>
);

/* Biometrics — a finger on the plate, which is the whole interaction. */
const Biometrics = () => (
  <>
    <rect x="11" y="6" width="26" height="36" rx="4" {...line} />
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={`M${19 - i * 3} 27 a${5 + i * 3} ${6 + i * 3} 0 0 1 ${10 + i * 6} 0`}
        {...line}
        opacity={0.9 - i * 0.2}
      />
    ))}
    <line x1="24" y1="27" x2="24" y2="20" {...line} opacity="0.8" />
    <line x1="17" y1="36" x2="31" y2="36" {...line} strokeWidth="1" opacity="0.4" />
  </>
);

const GLYPHS = {
  'desktop-repair': DesktopRepair,
  'laptop-repair': LaptopRepair,
  'data-recovery': DataRecovery,
  upgrades: Upgrade,
  'custom-build': CustomBuild,
  networking: Networking,
  cctv: Cctv,
  biometrics: Biometrics,
  'server-setup': ServerSetup,
  amc: Amc,
};

export function ServiceGlyph({ id, className }) {
  const Glyph = GLYPHS[id];
  if (!Glyph) return null;

  return (
    <svg
      viewBox={`0 0 ${V} ${V}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={cn('h-full w-full text-accent', className)}
    >
      <Glyph />
    </svg>
  );
}

export function hasGlyph(id) {
  return Boolean(GLYPHS[id]);
}
