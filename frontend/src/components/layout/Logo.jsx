import Image from 'next/image';
import Link from 'next/link';
import brandMeta from '@/data/generated/brand-meta.json';
import { cn } from '@/lib/utils';
import { site } from '@/lib/site';

/**
 * NSK brand marks.
 *
 * Every asset is derived from the supplied artwork at `brand/logo-master.png`
 * by `scripts/build-brand.mjs` — this component only places it, never redraws it.
 *
 * The site is a single light theme, so only the brand-navy colourway is used.
 * The white variants are still generated (they are needed for dark photographic
 * backgrounds and print), and `variant="light"` selects them where a mark sits
 * on imagery rather than on the page ground.
 */

const ASSETS = {
  /** NSK + horse, no type lines. Legible down to ~36px tall — used in the header. */
  primary: {
    navy: { src: '/images/brand/logo-primary.webp', ...brandMeta.assets.primary },
    light: { src: '/images/brand/logo-primary-light.webp', ...brandMeta.assets.primaryLight },
  },
  /** Complete lockup including company name and tagline. Needs ~80px of height. */
  lockup: {
    navy: { src: '/images/brand/logo.webp', ...brandMeta.assets.logo },
    light: { src: '/images/brand/logo-light.webp', ...brandMeta.assets.logoLight },
  },
  /** Horse alone. */
  mark: {
    navy: { src: '/images/brand/logo-mark.webp', ...brandMeta.assets.mark },
    light: { src: '/images/brand/logo-mark-light.webp', ...brandMeta.assets.markLight },
  },
} ;


function BrandImage({
  asset,
  variant = 'navy',
  alt,
  className,
  sizes,
  priority = false,
}
) {
  const { src, width, height } = ASSETS[asset][variant];
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}

/** The galloping horse on its own — admin rail, compact contexts. */
export function LogoMark({
  className,
  variant = 'navy',
  priority = false,
}
) {
  return (
    <BrandImage
      asset="mark"
      variant={variant}
      alt=""
      className={cn('h-8 w-auto', className)}
      sizes="120px"
      priority={priority}
    />
  );
}

/** Full lockup — NSK, horse, company name and tagline. Footer and wide contexts. */
export function LogoLockup({
  className,
  variant = 'navy',
  priority = false,
}
) {
  return (
    <BrandImage
      asset="lockup"
      variant={variant}
      alt={site.legalName}
      className={cn('h-auto w-auto', className)}
      sizes="(max-width: 640px) 260px, 340px"
      priority={priority}
    />
  );
}

/**
 * Header logo — links home.
 *
 * Uses the *primary* crop (NSK + horse) rather than the full lockup: at a 44px
 * header height the two type lines beneath would render around 5px tall and be
 * illegible. The footer, which has vertical room, gets the complete lockup.
 */
export function Logo({
  className,
  compact = false,
  variant,
}
) {
  const size = compact ? 'h-9 w-auto' : 'h-11 w-auto sm:h-12';
  const asset = compact ? 'mark' : 'primary';

  /*
   * With no explicit variant, render BOTH colourways and let CSS pick.
   *
   * The navy mark disappears against a dark section and the white one against
   * the page, but which applies depends on an ancestor (`.theme-dark` /
   * `.on-media`) that this component cannot see. Threading a prop down through
   * every caller would mean the header, footer and mobile drawer each tracking
   * the theme themselves. The swap rules live in globals.css.
   */
  const auto = variant === undefined;

  return (
    <Link
      href="/"
      aria-label={`${site.legalName} — home`}
      className={cn(
        'group inline-flex shrink-0 items-center transition-opacity duration-300 hover:opacity-85',
        className
      )}
    >
      {auto ? (
        <>
          <BrandImage
            asset={asset}
            variant="navy"
            alt={site.name}
            className={cn(size, 'logo-navy')}
            sizes={compact ? '120px' : '260px'}
            priority
          />
          <BrandImage
            asset={asset}
            variant="light"
            alt=""
            className={cn(size, 'logo-light')}
            sizes={compact ? '120px' : '260px'}
            priority
          />
        </>
      ) : (
        <BrandImage
          asset={asset}
          variant={variant}
          alt={site.name}
          className={size}
          sizes={compact ? '120px' : '260px'}
          priority
        />
      )}
    </Link>
  );
}
