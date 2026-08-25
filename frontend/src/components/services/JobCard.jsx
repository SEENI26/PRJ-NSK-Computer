import { motion } from 'framer-motion';
import { AlertTriangle, Check } from 'lucide-react';
import { ServiceGlyph, hasGlyph } from './ServiceGlyph';
import { staggerItem } from '@/animations';

/**
 * A service, presented as a job card.
 *
 * The other pages each borrow the artifact their audience already trusts — the
 * datasheet, the frame counter, the desk plan. Someone whose laptop will not
 * turn on trusts one document: the docket the counter writes when they hand
 * the machine over. So that is the shape here — a torn-off ticket with the
 * fault at the top and the work underneath.
 *
 * The symptoms lead deliberately. Nobody searches for "board-level
 * diagnostics"; they search for "laptop not turning on". Leading with the
 * words people actually use is what makes this page findable and readable by
 * the person who needs it.
 *
 * No photographs: the eight service images in the repo turned out to be stock
 * shots of PS4 controllers and a Search Console dashboard. A job card is a
 * typographic object anyway, so this loses nothing.
 */
export function JobCard({ service }) {
  return (
    <motion.article
      variants={staggerItem}
      className="surface-card group relative flex h-full flex-col overflow-hidden rounded-2xl"
    >
      {/* Docket head — perforated edge, the way a ticket tears off. */}
      <div className="relative border-b border-dashed border-white/15 p-6 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            {hasGlyph(service.id) && (
              <span
                className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl
                           border border-accent/25 bg-accent/[0.07] p-2
                           transition-colors duration-300 group-hover:border-accent/45"
              >
                <ServiceGlyph id={service.id} />
              </span>
            )}
            <h3 className="text-[18px] font-semibold leading-tight tracking-[-0.02em]">
              {service.name}
            </h3>
          </div>
          {service.caution && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/35
                         bg-amber-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-amber-300"
            >
              <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Act fast
            </span>
          )}
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{service.lead}</p>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-5">
        {/* The fault, in the customer's own words. */}
        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          Bring it in if
        </p>
        <ul className="mt-3 space-y-2">
          {service.symptoms.map((s) => (
            <li key={s} className="flex gap-2.5 text-[13px] leading-snug text-ink">
              <span
                aria-hidden="true"
                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent"
              />
              {s}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          What the job covers
        </p>
        <ul className="mt-3 space-y-2">
          {service.covers.map((c) => (
            <li key={c} className="flex gap-2.5 text-[12.5px] leading-snug text-ink-muted">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/70" aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>

        {/* The counter's own advice — the part a marketplace cannot give you. */}
        {service.note && (
          /* mt-auto pins the note to the card floor, so the notes line up
             across a row however long each list above them runs. */
          <p
            className="mt-auto rounded-lg border-l-2 border-accent/50 bg-white/[0.03]
                       px-4 py-3 text-[12.5px] leading-relaxed text-ink-subtle"
          >
            {service.note}
          </p>
        )}
      </div>
    </motion.article>
  );
}
