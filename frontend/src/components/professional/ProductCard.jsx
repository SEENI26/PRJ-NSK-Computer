import { motion } from 'framer-motion';
import { DeviceRender, BrandMark, hasBrandMark } from '@/components/common';
import { proBrands, proRoles } from '@/data/professionalProducts';
import { staggerItem } from '@/animations';
import { cn } from '@/utils/helpers';

const BRAND = Object.fromEntries(proBrands.map((b) => [b.id, b]));
const ROLE = Object.fromEntries(proRoles.map((r) => [r.id, r]));

/**
 * One machine, presented as a datasheet entry rather than a product tile.
 *
 * The order is the order a buyer reads in: who makes it, what it is, what it is
 * for, then the configuration table. Price is deliberately absent — this is a
 * showroom, and the spec is settled in conversation.
 */
export function ProductCard({ product }) {
  const brand = BRAND[product.brand];

  return (
    <motion.article
      variants={staggerItem}
      className="surface-card group flex flex-col overflow-hidden rounded-2xl"
    >
      {/* Drawing sits on a tinted wash so the white chassis has something to
          sit against without introducing a second card colour. */}
      <div
        className="relative aspect-[16/10] w-full"
        style={{ background: `linear-gradient(170deg, ${brand.accent}0F 0%, ${brand.accent}05 60%, transparent 100%)` }}
      >
        <div className="absolute inset-0 p-3 transition-transform duration-500 ease-out group-hover:scale-[1.035]">
          <DeviceRender shape={product.shape} tint={brand.accent} />
        </div>

        <span
          className="absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]"
          style={{ borderColor: `${brand.accent}38`, color: brand.accent, background: '#fff' }}
        >
          {product.series}
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t border-[rgb(18_20_26/0.08)] p-6">
        <div className="flex items-center gap-2.5">
          {hasBrandMark(product.brand) ? (
            <span className="h-3.5 shrink-0 text-ink" style={{ color: brand.accent }}>
              <BrandMark slug={product.brand} title={brand.name} />
            </span>
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: brand.accent }}>
              {brand.name}
            </span>
          )}
          <span aria-hidden="true" className="h-3 w-px bg-[rgb(18_20_26/0.16)]" />
          <span className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            {product.shape === 'mobile-workstation'
              ? 'Mobile workstation'
              : product.shape === 'ultrabook'
                ? 'Business laptop'
                : product.shape === 'tower'
                  ? 'Tower'
                  : 'Compact desktop'}
          </span>
        </div>

        <h3 className="mt-3.5 text-[19px] font-semibold leading-snug tracking-[-0.02em]">
          {product.name}
        </h3>
        <p className="mt-2 text-[13.5px] font-medium leading-snug text-ink-muted">
          {product.headline}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-subtle">{product.blurb}</p>

        {/* Configuration reads as a table because that is how it is compared. */}
        <dl className="tabular mt-5 divide-y divide-[rgb(18_20_26/0.07)] border-y border-[rgb(18_20_26/0.07)]">
          {Object.entries(product.config).map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">{label}</dt>
              <dd className="text-right text-[12.5px] font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {product.highlights.map((h) => (
            <li
              key={h}
              className="rounded-md bg-[rgb(18_20_26/0.045)] px-2 py-1 text-[11px] text-ink-muted"
            >
              {h}
            </li>
          ))}
        </ul>

        <p className="mt-5 pt-1 text-[11.5px] leading-relaxed text-ink-faint">
          <span className="text-ink-subtle">Specified for </span>
          {product.roles.map((r) => ROLE[r]?.label.toLowerCase()).filter(Boolean).join(' · ')}
        </p>
      </div>
    </motion.article>
  );
}

/** Filter pill — shared by the brand and role rows so they behave identically. */
export function FilterPill({ active, children, className, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        active
          ? 'border-accent bg-accent text-white'
          : 'border-[rgb(18_20_26/0.14)] text-ink-muted hover:border-[rgb(18_20_26/0.34)] hover:text-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
