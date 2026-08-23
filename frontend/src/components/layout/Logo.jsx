import { Link } from 'react-router-dom';
import brandMeta from '@/data/generated/brand-meta.json';
import { COMPANY } from '@/data/company';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/utils/helpers';

/**
 * The NSK brand marks.
 *
 * Every asset here is derived from the supplied artwork at `brand/logo-master.png`
 * by `scripts/build-brand.mjs` — this component only places the logo, it never
 * redraws it. To change the logo, replace that one file and re-run
 * `npm run brand:build`.
 *
 * The site is a single dark theme, so only the white colourway ships. The navy
 * variants are still generated (print, light backgrounds, the OG card) but are
 * deliberately not referenced here: navy on #080808 is unreadable.
 *
 * Intrinsic width/height come from the generated manifest so the header never
 * reflows once the image decodes.
 */

const { display } = brandMeta.assets;

/** Two-density srcset from the generated display pair. */
function srcSet(pair) {
  return Object.values(pair)
    .map((a) => `${a.src} ${a.width}w`)
    .join(', ');
}

/** Rendered width of each slot, in CSS px — drives `sizes` and the box. */
const NAV_WIDTH = 126;
const FOOTER_WIDTH = 232;

/**
 * Header lockup — NSK + horse, no type lines.
 *
 * The full lockup is not used here: at a 72px header its two type lines would
 * render around 6px tall and turn to mud. The footer, which has vertical room,
 * gets the complete lockup instead.
 */
export function Logo({ className, to = ROUTES.home, onClick }) {
  const base = display.navPrimary.w160;

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label={`${COMPANY.name} — home`}
      className={cn(
        'inline-flex shrink-0 items-center rounded-sm transition-opacity duration-300 hover:opacity-80',
        className,
      )}
    >
      <img
        src={base.src}
        srcSet={srcSet(display.navPrimary)}
        sizes={`${NAV_WIDTH}px`}
        width={base.width}
        height={base.height}
        alt=""
        /* The link already carries the accessible name; alt="" keeps a screen
           reader from announcing the company twice. */
        decoding="async"
        fetchPriority="high"
        className="h-auto w-[126px]"
      />
    </Link>
  );
}

/** Full lockup — NSK, horse, company name and tagline. Footer and wide contexts. */
export function LogoLockup({ className, to = ROUTES.home }) {
  const base = display.footerLockup.w260;

  return (
    <Link
      to={to}
      aria-label={`${COMPANY.name} — home`}
      className={cn(
        'inline-flex shrink-0 items-center rounded-sm transition-opacity duration-300 hover:opacity-80',
        className,
      )}
    >
      <img
        src={base.src}
        srcSet={srcSet(display.footerLockup)}
        sizes={`${FOOTER_WIDTH}px`}
        width={base.width}
        height={base.height}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-auto w-[232px]"
      />
    </Link>
  );
}
