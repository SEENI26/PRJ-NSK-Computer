import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AccessoryCard } from '@/components/cards';
import { accessories } from '@/data/accessories';
import { byIds } from '@/utils/helpers';
import { stagger, revealViewport } from '@/animations';

/**
 * "Complete the setup" — §13.
 *
 * Rendered directly beneath a build, resolving that build's
 * `recommendedAccessories` ids. This is the join that makes a machine and its
 * peripherals read as one recommendation rather than two catalogues.
 */
export function RecommendedAccessories({ ids, title = 'Complete the setup', compact = true }) {
  const items = byIds(accessories, ids);
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 lg:p-8">
      <div className="flex items-center gap-2.5">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        <h3 className="t-eyebrow text-accent">{title}</h3>
      </div>
      <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-ink-muted">
        Matched to this build — the panel, switches and audio we would put with it. Swap anything;
        these are a starting point, not a bundle.
      </p>

      <motion.div
        variants={stagger(0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        className={
          compact
            ? 'mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'
            : 'mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
        }
      >
        {items.map((accessory) => (
          <AccessoryCard key={accessory.id} accessory={accessory} compact={compact} />
        ))}
      </motion.div>
    </div>
  );
}
