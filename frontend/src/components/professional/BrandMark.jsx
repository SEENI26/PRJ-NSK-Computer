import brandData from '@/data/generated/partner-brands.json';
import { cn } from '@/utils/helpers';

/**
 * A partner brand mark, drawn inline from the generated icon set.
 *
 * Paths come from Simple Icons (CC0 icon files; the trademarks themselves
 * remain with their owners) via `npm run brands:build`. Inline SVG rather than
 * an <img> so the mark inherits `currentColor` and sits correctly on paper or
 * on the dark side of the site without shipping two files per brand.
 */

const BY_SLUG = Object.fromEntries(brandData.brands.map((b) => [b.slug, b]));

export function BrandMark({ slug, className, title }) {
  const brand = BY_SLUG[slug];
  if (!brand) return null;

  return (
    <svg
      viewBox={brand.viewBox}
      className={cn('h-full w-auto fill-current', className)}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={brand.path} />
    </svg>
  );
}

/** Does the generated set actually have this mark? Callers fall back to type. */
export function hasBrandMark(slug) {
  return Boolean(BY_SLUG[slug]);
}
