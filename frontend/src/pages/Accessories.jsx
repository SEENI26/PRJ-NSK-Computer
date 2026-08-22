import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Badge } from '@/components/common';
import { AccessoryCard } from '@/components/cards';
import { CTASection } from '@/components/sections';
import { ACCESSORY_GROUPS, accessories } from '@/data/accessories';
import { usePageMeta } from '@/hooks/usePageTransition';
import { cn } from '@/utils/helpers';
import { stagger, staggerItem, fadeUp, revealViewport, EASE } from '@/animations';

/**
 * Accessories — §11.
 *
 * Four groups, filterable. "All" is the default so the page never opens on an
 * arbitrary subset, and the filter is a real button group rather than a select
 * so the options are visible at a glance.
 */
export default function Accessories() {
  usePageMeta('accessories');
  const [group, setGroup] = useState('all');

  const shown = group === 'all' ? accessories : accessories.filter((a) => a.group === group);
  const activeGroup = ACCESSORY_GROUPS.find((g) => g.id === group);

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-36 lg:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 grid-backdrop mask-fade-b opacity-50" />
        <Container>
          <motion.div variants={stagger(0.08)} initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={staggerItem}><Badge tone="accent">Accessories</Badge></motion.div>
            <motion.h1 variants={staggerItem} className="t-hero mt-6">
              Finish the <span className="text-gradient">setup.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="t-sub mt-7 text-ink-muted">
              The parts you touch all day. Switches, sensors, panels and audio matter more to how a
              machine feels than another few frames ever will.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      <section aria-labelledby="accessories-heading">
        <Container>
          <h2 id="accessories-heading" className="sr-only">Browse accessories</h2>

          {/* Filter */}
          <div role="group" aria-label="Filter by group" className="flex flex-wrap gap-2.5">
            <FilterChip active={group === 'all'} onClick={() => setGroup('all')}>
              All <span className="ml-1.5 opacity-50">{accessories.length}</span>
            </FilterChip>
            {ACCESSORY_GROUPS.map((g) => {
              const count = accessories.filter((a) => a.group === g.id).length;
              return (
                <FilterChip key={g.id} active={group === g.id} onClick={() => setGroup(g.id)}>
                  {g.label} <span className="ml-1.5 opacity-50">{count}</span>
                </FilterChip>
              );
            })}
          </div>

          {activeGroup && (
            <p className="mt-6 max-w-[56ch] text-sm leading-relaxed text-ink-muted">
              {activeGroup.blurb}
            </p>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={group}
              variants={stagger(0.045)}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {shown.map((accessory) => (
                <AccessoryCard key={accessory.id} accessory={accessory} />
              ))}
            </motion.div>
          </AnimatePresence>
        </Container>
      </section>

      <CTASection />
    </>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-4 py-2 text-[13px] transition-all duration-300',
        active
          ? 'border-accent/50 bg-accent/10 text-accent'
          : 'border-white/10 text-ink-muted hover:border-white/25 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}
