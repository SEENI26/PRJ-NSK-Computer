import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, PackageCheck, Undo2 } from 'lucide-react';
import { Container, Badge, SectionTitle } from '@/components/common';
import { AccessoryCard } from '@/components/cards';
import { CTASection } from '@/components/sections';
import { DeskPlan } from '@/components/accessories';
import {
  ACCESSORY_GROUPS,
  ACCESSORY_ZONES,
  accessories,
  byZone,
} from '@/data/accessories';
import { usePageMeta } from '@/hooks/usePageTransition';
import { cn } from '@/utils/helpers';
import { stagger, staggerItem, fadeUp, revealViewport, EASE } from '@/animations';

/**
 * Accessories — §11.
 *
 * The other two catalogue pages borrow an artifact their audience already
 * trusts: the datasheet, the frame counter. Nobody compares a mouse pad on a
 * spec sheet. What an accessory buyer is actually doing is working out what is
 * still missing from a desk — so this page borrows the *plan*, the top-down
 * drawing you sketch before wiring a room, and every position on it filters
 * the catalogue.
 *
 * The second thing this page has to carry is the reason to buy here rather
 * than from a marketplace: switch feel and sensor weight are personal, and
 * they are on the counter to be tried. That is stated once, plainly, rather
 * than repeated on every tile.
 */
export default function Accessories() {
  usePageMeta('accessories');

  const [zone, setZone] = useState('all');
  const [group, setGroup] = useState('all');

  const shown = useMemo(() => byZone(accessories, zone, group), [zone, group]);
  const activeZone = ACCESSORY_ZONES.find((z) => z.id === zone);
  const activeGroup = ACCESSORY_GROUPS.find((g) => g.id === group);
  const filtered = zone !== 'all' || group !== 'all';

  return (
    <>
      {/* ── Hero + the plan ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-10 pt-36 lg:pt-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 grid-backdrop mask-fade-b opacity-50"
        />
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
            <motion.div variants={stagger(0.08)} initial="hidden" animate="visible">
              <motion.div variants={staggerItem}><Badge tone="accent">Accessories</Badge></motion.div>
              <motion.h1 variants={staggerItem} className="t-hero mt-6 max-w-[13ch]">
                Finish the <span className="text-gradient">setup.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="t-sub mt-7 max-w-[52ch] text-ink-muted">
                The parts you touch all day. Switches, sensors, panels and audio matter more to
                how a machine feels than another few frames ever will.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-5 max-w-[50ch] text-[14px] leading-relaxed text-ink-subtle">
                <span className="hidden md:inline">Pick a position on the desk to see what goes
                  there — or use the filters for all {accessories.length} of them.</span>
                <span className="md:hidden">Filter by position below, or scroll for all
                  {' '}{accessories.length} of them.</span>
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="surface-card rounded-2xl p-4 sm:p-6"
            >
              <DeskPlan zone={zone === 'all' ? null : zone} onSelect={setZone} className="aspect-[520/340] w-full" />
              <p className="mt-3 text-center text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                {activeZone ? activeZone.label : 'The desk, from above'}
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Catalogue ────────────────────────────────────────────────────── */}
      <section className="pb-8" aria-labelledby="accessories-heading">
        <Container>
          <h2 id="accessories-heading" className="sr-only">Browse accessories</h2>

          {/* Position — the primary axis, mirroring the plan above. */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">Position</span>
            <Chip active={zone === 'all'} onClick={() => setZone('all')}>
              All <span className="ml-1.5 opacity-50">{accessories.length}</span>
            </Chip>
            {ACCESSORY_ZONES.map((z) => {
              const count = byZone(accessories, z.id, group).length;
              return (
                <Chip
                  key={z.id}
                  active={zone === z.id}
                  onClick={() => setZone(zone === z.id ? 'all' : z.id)}
                  disabled={count === 0}
                >
                  {z.label} <span className="ml-1.5 opacity-50">{count}</span>
                </Chip>
              );
            })}
          </div>

          {/* Audience — secondary, and only narrows what the position showed. */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">Built for</span>
            <Chip active={group === 'all'} onClick={() => setGroup('all')}>Anyone</Chip>
            {ACCESSORY_GROUPS.map((g) => {
              const count = byZone(accessories, zone, g.id).length;
              return (
                <Chip
                  key={g.id}
                  active={group === g.id}
                  onClick={() => setGroup(group === g.id ? 'all' : g.id)}
                  disabled={count === 0}
                >
                  {g.label} <span className="ml-1.5 opacity-50">{count}</span>
                </Chip>
              );
            })}
          </div>

          {(activeZone || activeGroup) && (
            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <p className="max-w-[62ch] text-sm leading-relaxed text-ink-muted">
                {activeZone?.blurb ?? activeGroup?.blurb}
              </p>
              {filtered && (
                <button
                  type="button"
                  onClick={() => { setZone('all'); setGroup('all'); }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/12
                             px-3.5 py-1.5 text-[12.5px] text-ink-muted transition-colors
                             hover:border-white/30 hover:text-ink"
                >
                  <Undo2 className="h-3.5 w-3.5" aria-hidden="true" /> Show all
                </button>
              )}
            </div>
          )}

          <p aria-live="polite" className="mt-5 text-[13px] text-ink-faint">
            {shown.length} {shown.length === 1 ? 'item' : 'items'}
          </p>

          {shown.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${zone}-${group}`}
                variants={stagger(0.045)}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
                className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {shown.map((accessory) => (
                  <AccessoryCard key={accessory.id} accessory={accessory} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-12 text-center">
              <p className="text-[15px] font-medium text-ink">
                Nothing in that position is built for {activeGroup?.label.toLowerCase()}.
              </p>
              <p className="mx-auto mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-ink-muted">
                We stock more than is listed here. Tell us what the desk is for and we will bring
                out the options.
              </p>
              <button
                type="button"
                onClick={() => { setZone('all'); setGroup('all'); }}
                className="mt-6 rounded-full border border-white/15 px-4 py-2 text-[13px]
                           text-ink-muted transition-colors hover:border-white/30 hover:text-ink"
              >
                Show everything
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* ── The counter ──────────────────────────────────────────────────── */}
      <section className="py-20" aria-labelledby="counter-heading">
        <Container>
          <SectionTitle
            titleId="counter-heading"
            eyebrow="Before you commit"
            title="Try it at the counter"
            lead="This is the one category where reading a spec tells you almost nothing. A switch you like and a switch you tolerate look identical on paper."
          />

          <motion.ul
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mt-12 grid gap-5 md:grid-cols-3"
          >
            {[
              {
                Icon: Hand,
                title: 'Switches are personal',
                body: 'Linear, tactile and clicky are on the counter to be typed on. Ten minutes here saves returning a keyboard you cannot stand.',
              },
              {
                Icon: PackageCheck,
                title: 'Matched to your machine',
                body: 'A 240 Hz panel on a build that renders 90 is money spent on nothing. Tell us the build and we will match the panel to it.',
              },
              {
                Icon: Undo2,
                title: 'Fitted while you wait',
                body: 'Adapters, docks and power get fitted and tested at the counter, at no extra charge, before you take them home.',
              },
            ].map(({ Icon, title, body }) => (
              <motion.li key={title} variants={staggerItem} className="surface-card rounded-2xl p-6">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.01em]">{title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-muted">{body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </Container>
      </section>

      <CTASection context="accessories" />
    </>
  );
}

function Chip({ active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-4 py-2 text-[13px] transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'disabled:cursor-not-allowed disabled:opacity-35',
        active
          ? 'border-accent/50 bg-accent/10 text-accent'
          : 'border-white/10 text-ink-muted hover:border-white/25 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}
