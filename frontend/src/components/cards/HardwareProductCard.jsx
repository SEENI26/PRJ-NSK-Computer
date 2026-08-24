import { motion } from 'framer-motion';
import { getIcon } from '@/utils/icons';
import { BrandMark, hasBrandMark } from '@/components/common';
import { cn, slugify } from '@/utils/helpers';
import { staggerItem } from '@/animations';

/**
 * One real product from the catalogue.
 *
 * Deliberately un-photographed. The shipped image library is mislabelled in
 * ways that would put a hard drive on a cabinet card and case fans on a
 * motherboard (see scripts/check-content.mjs §5), and a wrong picture is worse
 * than none — so the card carries the department's drawn mark instead, which
 * is also the idiom the rest of the site uses.
 *
 * No price, by the same rule as everywhere else: the business quotes rather
 * than lists, and the card's job is to get someone to that conversation with
 * the right part in mind.
 */

const TONES = {
  good:  'border-accent/35 bg-accent/[0.07] text-accent',
  mid:   'border-white/15 bg-white/[0.05] text-ink-muted',
  quiet: 'border-white/10 bg-white/[0.03] text-ink-faint',
};

export function HardwareProductCard({ product, icon }) {
  const Icon = getIcon(icon);
  const brandSlug = slugify(product.brand);
  const showsMark = hasBrandMark(brandSlug);
  // "Multi-brand" is a stocking fact, not a manufacturer — saying so is more
  // useful than printing it as if it were one.
  const multiBrand = product.brand === 'Multi-brand';

  return (
    <motion.article
      variants={staggerItem}
      className="surface-card group flex flex-col p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10
                     bg-white/[0.03] transition-colors duration-300 group-hover:border-accent/30"
        >
          <Icon className="h-[19px] w-[19px] text-accent" strokeWidth={1.4} />
        </span>

        <span
          className={cn(
            'rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none tracking-wide',
            TONES[product.availability.tone],
          )}
        >
          {product.availability.label}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">
        {showsMark ? (
          <span className="h-3.5">
            <BrandMark slug={brandSlug} title={product.brand} />
          </span>
        ) : (
          <span>{multiBrand ? 'Several brands stocked' : product.brand}</span>
        )}
        {product.badge && (
          <>
            <span aria-hidden="true" className="text-ink-faint/50">·</span>
            <span className="text-accent">{product.badge}</span>
          </>
        )}
      </div>

      <h4 className="mt-2.5 font-display text-[17px] font-semibold leading-snug">{product.name}</h4>
      <p className="mt-2.5 text-[13px] leading-relaxed text-ink-muted">{product.tagline}</p>

      {product.highlights.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-5">
          {product.highlights.slice(0, 3).map((line) => (
            <li key={line} className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink-subtle">
              <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
              {line}
            </li>
          ))}
        </ul>
      )}

      {(product.warranty || product.leadTime) && (
        <dl className="mt-auto grid gap-1.5 border-t border-white/[0.06] pt-5 text-[11.5px] leading-relaxed">
          {product.leadTime && (
            <div className="flex gap-2">
              <dt className="shrink-0 text-ink-faint">Supply</dt>
              <dd className="text-ink-subtle">{product.leadTime}</dd>
            </div>
          )}
          {product.warranty && (
            <div className="flex gap-2">
              <dt className="shrink-0 text-ink-faint">Warranty</dt>
              <dd className="text-ink-subtle">{product.warranty}</dd>
            </div>
          )}
        </dl>
      )}
    </motion.article>
  );
}
