import { motion } from 'framer-motion';
import { getIcon } from '@/utils/icons';
import { cn, img } from '@/utils/helpers';
import { staggerItem } from '@/animations';

/**
 * A hardware category tile. Shows the sub-families and, on the detail view,
 * the thing that actually decides the choice — which is the part a showroom
 * can explain and a spec sheet cannot.
 */
export function HardwareCard({ category, expanded = false, onSelect }) {
  const Icon = getIcon(category.icon);
  const image = img(category.image);
  const interactive = Boolean(onSelect);

  const Tag = interactive ? motion.button : motion.div;

  return (
    <Tag
      variants={staggerItem}
      {...(interactive
        ? { type: 'button', onClick: () => onSelect(category.id), 'aria-pressed': expanded }
        : {})}
      className={cn(
        'surface-card group flex flex-col overflow-hidden text-left',
        expanded && 'border-accent/40',
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-base-800">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-70 transition-all duration-700
                       group-hover:scale-[1.04] group-hover:opacity-90"
          />
        ) : (
          /* No honest photograph exists for this department in the asset
             library; a designed mark beats a misleading stock image. */
          <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <div className="absolute inset-0 grid-backdrop opacity-60" />
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(55% 55% at 50% 45%, rgb(var(--accent) / 0.14), transparent 70%)' }}
            />
            <Icon className="relative h-10 w-10 text-accent/60" strokeWidth={1.15} />
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-base-700 via-base-700/40 to-transparent" />
        <span
          aria-hidden="true"
          className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-xl
                     border border-white/10 bg-black/55 backdrop-blur-sm"
        >
          <Icon className="h-[18px] w-[18px] text-accent" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold">{category.name}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{category.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {category.items.map((item) => (
            <li
              key={item.name}
              className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1
                         text-[11px] text-ink-subtle"
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </Tag>
  );
}
