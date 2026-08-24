import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ProductSlider } from './ProductSlider';
import { BrandBar } from './BrandBar';
import { staggerItem, EASE } from '@/animations';
import { cn } from '@/utils/helpers';

/**
 * A build, presented as a benchmark overlay.
 *
 * Competitive players already read one of these every session — the FPS
 * counter in the corner of the screen. So the performance figures lead, in
 * tabular monospace with threshold colours, and the parts list follows. It is
 * the gaming counterpart to the professional page's spec table: same data,
 * shaped by the artifact its audience already trusts.
 *
 * The bars are driven by `performance[].pct` from the build data, which is a
 * relative capability score rather than a measured frame rate. It is labelled
 * as such — inventing "184 FPS in Valorant" would be a number we cannot stand
 * behind.
 */

/*
 * The fill is a variant rather than a `whileInView` of its own, so it rides the
 * grid's existing hidden/visible propagation. A nested whileInView inside a
 * parent that already drives variants never fires, which is what left these
 * bars empty the first time round.
 *
 * It scales rather than growing its width: transform is composited, width
 * triggers layout on every frame of every bar on screen.
 */
const barFill = {
  hidden: { scaleX: 0 },
  visible: ({ pct, reduced }) => ({
    scaleX: pct / 100,
    transition: { duration: reduced ? 0 : 0.85, ease: EASE },
  }),
};

/*
 * Lighting per tier. More RGB as the build gets more serious is not a
 * flourish — it is how these are actually specified and sold, so the hue
 * escalation doubles as a tier marker you can read across the grid.
 * Cyan holds the first two tiers because cyan is the brand.
 */
const TIER_LIGHT = {
  1: '#22D3EE',
  2: '#22D3EE',
  3: '#A75CFF',
  4: '#FF3C94',
};

/** Threshold colours, read the way a frame counter reads. */
function band(pct) {
  if (pct >= 80) return 'var(--fps-good)';
  if (pct >= 55) return 'var(--fps-mid)';
  return 'var(--fps-low)';
}

export function RigCard({ build, selected, onSelect }) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      variants={staggerItem}
      className={cn(
        'surface-card rgb-edge group relative flex h-full flex-col overflow-hidden rounded-2xl',
        selected && 'border-accent/45',
      )}
    >
      {/*
       * Slide one is the build drawn — `level` widens the chassis, adds the
       * radiator at tier 3 and lights more of it as the tier climbs, so the
       * four pictures differ by the same thing the four tiers differ by.
       * Shop photographs listed in the build's `gallery` follow it and the
       * carousel starts advancing on its own once there is more than one.
       */}
      <ProductSlider
        build={build}
        tint={TIER_LIGHT[build.tier]}
        className="aspect-[3/2] w-full shrink-0"
      />

      <div className="flex flex-1 flex-col border-t border-white/[0.07] p-6">
        <BrandBar
          brand={build.brand}
          gpuVendor={build.gpuVendor}
          className="mb-4 border-b border-white/[0.07] pb-4"
        />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="t-eyebrow text-accent">
              Tier {build.tier} · {build.name}
            </p>
            <h3 className="mt-2.5 text-[19px] font-semibold tracking-[-0.02em]">
              {build.product ?? build.name}
            </h3>
            <p className="mt-1 text-[13px] text-ink-muted">{build.tagline}</p>
          </div>
          {build.popular && (
            <span className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1
                             text-[10px] uppercase tracking-[0.14em] text-accent">
              Popular
            </span>
          )}
        </div>

        {/* The overlay. Bars first, because this is what the buyer came for. */}
        <div className="mt-6 rounded-xl border border-white/[0.07] bg-black/40 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
            Relative capability
          </p>
          <ul className="mt-3.5 space-y-3">
            {build.performance.map((row) => (
              <li key={row.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[12px] text-ink-muted">{row.label}</span>
                  <span
                    className="overlay-num text-[12px] font-semibold"
                    style={{ color: `rgb(${band(row.pct)})` }}
                  >
                    {row.value}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className="h-full w-full origin-left rounded-full"
                    style={{ background: `rgb(${band(row.pct)})` }}
                    variants={barFill}
                    custom={{ pct: row.pct, reduced }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-ink-subtle">{build.description}</p>

        <dl className="mb-6 mt-5 space-y-1.5 border-t border-white/[0.07] pt-4">
          {[['gpu', 'GPU'], ['cpu', 'CPU'], ['ram', 'Memory']].map(([key, label]) => (
            <div key={key} className="flex items-baseline justify-between gap-4">
              <dt className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">{label}</dt>
              <dd className="overlay-num text-right text-[12px] text-ink-muted">
                {build.specifications[key]}
              </dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={cn(
            // mt-auto pins the CTA to the card floor so the four tiers line up
            // no matter how long each description runs.
            'mt-auto flex w-full items-center justify-between rounded-lg border px-4 py-3',
            'text-[13px] transition-colors duration-300',
            selected
              ? 'border-accent/50 bg-accent/10 text-accent'
              : 'border-white/[0.09] text-ink-muted hover:border-white/25 hover:text-ink',
          )}
        >
          {selected ? 'Setup shown below' : 'See the matching setup'}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
}
