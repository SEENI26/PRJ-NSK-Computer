import { motion } from 'framer-motion';
import { cn, img } from '@/utils/helpers';
import { staggerItem } from '@/animations';

/** Accessory tile. Compact variant is used inside a build's setup strip. */
export function AccessoryCard({ accessory, compact = false }) {
  const image = img(accessory.image);

  return (
    <motion.article
      variants={staggerItem}
      className={cn('surface-card group flex overflow-hidden', compact ? 'flex-row items-center gap-4 p-3' : 'flex-col')}
    >
      <div
        className={cn(
          'relative shrink-0 overflow-hidden bg-base-800',
          compact ? 'h-16 w-16 rounded-lg' : 'aspect-[4/3] w-full',
        )}
      >
        {image ? (
          <img
            src={image}
            alt={accessory.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="grid h-full place-items-center text-[10px] text-ink-faint">No image</div>
        )}
      </div>

      <div className={cn('flex flex-1 flex-col', compact ? 'min-w-0' : 'p-5')}>
        <p className="t-eyebrow text-ink-faint">{accessory.type}</p>
        <h3 className={cn('font-display font-semibold', compact ? 'mt-1 truncate text-sm' : 'mt-2 text-base')}>
          {accessory.name}
        </h3>
        <p className={cn('text-ink-muted', compact ? 'mt-0.5 truncate text-xs' : 'mt-2 text-[13px] leading-relaxed')}>
          {accessory.blurb}
        </p>

        {!compact && (
          <>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-subtle">{accessory.detail}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {accessory.tags.map((tag) => (
                <li key={tag} className="rounded-md border border-white/[0.08] px-2 py-1 text-[11px] text-ink-faint">
                  {tag}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </motion.article>
  );
}
