import { motion } from 'framer-motion';
import { DeviceRender, BrandMark, hasBrandMark } from '@/components/common';
import { gamingBrands, playStyles } from '@/data/gamingProducts';
import { staggerItem } from '@/animations';
import { cn } from '@/utils/helpers';

const BRAND = Object.fromEntries(gamingBrands.map((b) => [b.id, b]));
const STYLE = Object.fromEntries(playStyles.map((s) => [s.id, s]));

/**
 * A laptop or a cabinet.
 *
 * Same card for both, because from the buyer's side they are the same
 * question: what is it for, what is inside, and what does it cost you
 * elsewhere. The drawing is lit in the line's own colour — ROG red, Legion
 * cyan — which is how these are told apart on a shelf.
 */
export function GearCard({ item, kind = 'laptop' }) {
  /*
   * Laptops carry a brand; cabinets deliberately do not. We stock these
   * cabinet shapes from several makers, so badging a generic mesh tower with
   * one manufacturer would claim something untrue. Those entries bring their
   * own `tint` and render the shape name instead of a mark.
   */
  const brand = BRAND[item.brand];
  const tint = brand?.accent ?? item.tint;

  return (
    <motion.article
      variants={staggerItem}
      className="surface-card group relative flex h-full flex-col overflow-hidden rounded-2xl"
    >
      <div
        className="relative aspect-[16/11] w-full"
        style={{
          background: `radial-gradient(75% 65% at 50% 105%, ${tint}26 0%, transparent 72%)`,
        }}
      >
        <div className="absolute inset-0 p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <DeviceRender shape={item.shape} tint={tint} />
        </div>

        <span
          className="absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[10px]
                     font-medium uppercase tracking-[0.14em] backdrop-blur-sm"
          style={{
            borderColor: `${tint}55`,
            color: tint,
            background: 'rgb(0 0 0 / 0.5)',
          }}
        >
          {item.series}
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t border-white/[0.07] p-6">
        <div className="flex items-center gap-2.5">
          {brand && hasBrandMark(brand.mark) && (
            <span className="h-3.5 shrink-0" style={{ color: tint }}>
              <BrandMark slug={brand.mark} title={brand.name} />
            </span>
          )}
          <span className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            {kind === 'laptop' ? 'Gaming laptop' : 'Cabinet'}
          </span>
        </div>

        <h3 className="mt-3.5 text-[18px] font-semibold leading-snug tracking-[-0.02em]">
          {item.name}
        </h3>
        <p className="mt-2 text-[13.5px] font-medium leading-snug text-ink-muted">
          {item.headline}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-subtle">{item.blurb}</p>

        <dl className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {Object.entries(item.config).map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">{label}</dt>
              <dd className="overlay-num text-right text-[12px] font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {item.highlights.map((h) => (
            <li key={h} className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-ink-muted">
              {h}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[11.5px] leading-relaxed text-ink-faint">
          <span className="text-ink-subtle">Suits </span>
          {item.styles.map((s) => STYLE[s]?.label.toLowerCase()).filter(Boolean).join(' · ')}
        </p>
      </div>
    </motion.article>
  );
}

/** Category / filter control, shared by the section tabs and the style row. */
export function GameChip({ active, children, className, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'rounded-full border px-4 py-2 text-[13px] transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[rgb(var(--bg))]',
        active
          ? 'border-accent/55 bg-accent/12 text-accent shadow-[0_0_22px_-10px_rgb(var(--accent)/0.9)]'
          : 'border-white/10 text-ink-muted hover:border-white/25 hover:text-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
