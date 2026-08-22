import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/common';
import { cn, img } from '@/utils/helpers';
import { SPEC_ORDER } from '@/data/gamingBuilds';
import { staggerItem } from '@/animations';

/**
 * One card for both gaming and professional builds — §25.
 *
 * The difference between the two is a `tone`, not a second component. It
 * expands in place to show the full component list rather than navigating
 * away, because comparing builds is the whole job of these pages.
 */
export function PCBuildCard({ build, tone = 'gaming', defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const image = img(build.image);
  const panelId = `specs-${build.id}`;

  return (
    <motion.article variants={staggerItem} className="surface-card group flex flex-col overflow-hidden">
      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden bg-base-800">
        {image ? (
          <img
            src={image}
            alt={`${build.name} — ${build.tagline}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover saturate-[0.72] transition-all duration-700 ease-out
                       group-hover:scale-[1.04] group-hover:saturate-100"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-ink-faint">No image</div>
        )}

        {/* Legibility scrim under the label */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div>
            <p className={cn('t-eyebrow', tone === 'gaming' ? 'text-accent' : 'text-ink-subtle')}>
              {build.tagline}
            </p>
            <h3 className="t-title mt-2">{build.name}</h3>
          </div>
          {build.popular && <Badge tone="accent">Most chosen</Badge>}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-relaxed text-ink-muted">{build.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {build.bestFor.map((item) => (
            <li key={item}>
              <Badge tone="quiet">{item}</Badge>
            </li>
          ))}
        </ul>

        {/* Performance framing. Explicitly labelled as indicative — these are
            class-based estimates, not benchmark results. */}
        {build.performance && (
          <div className="mt-6 space-y-3">
            {build.performance.map((row) => (
              <div key={row.label}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-ink-subtle">{row.label}</span>
                  <span className="text-ink-muted">{row.value}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className={cn('h-full rounded-full', tone === 'gaming' ? 'bg-accent' : 'bg-ink-muted')}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${row.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
            <p className="pt-1 text-[10.5px] leading-relaxed text-ink-faint">
              Indicative, based on component class — not measured benchmark results.
            </p>
          </div>
        )}

        <div className="flex-1" />

        {/* Spec disclosure */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-6 flex w-full items-center justify-between rounded-lg border border-white/[0.09]
                     px-4 py-3 text-sm text-ink-muted transition-colors hover:border-white/20 hover:text-ink"
        >
          <span>{open ? 'Hide components' : 'What is inside'}</span>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform duration-300', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>

        <motion.div
          id={panelId}
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <dl className="mt-4 divide-y divide-white/[0.06]">
            {SPEC_ORDER.map(([key, label]) => (
              build.specifications[key] ? (
                <div key={key} className="grid grid-cols-[92px_1fr] gap-3 py-2.5">
                  <dt className="text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">{label}</dt>
                  <dd className="text-[13px] leading-snug text-ink">{build.specifications[key]}</dd>
                </div>
              ) : null
            ))}
          </dl>
        </motion.div>
      </div>
    </motion.article>
  );
}
