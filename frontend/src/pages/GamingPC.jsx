import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container, SectionTitle, Button, Badge } from '@/components/common';
import { AccessoryCard } from '@/components/cards';
import { RecommendedAccessories, CTASection } from '@/components/sections';
import { AnimatedCabinet } from '@/components/hero';
import { RigCard, GearCard, GameChip } from '@/components/gaming';
import { gamingBuilds } from '@/data/gamingBuilds';
import { accessories } from '@/data/accessories';
import {
  gamingCategories,
  gamingLaptops,
  gamingCabinets,
  playStyles,
  byStyle,
} from '@/data/gamingProducts';
import { usePageMeta } from '@/hooks/usePageTransition';
import { cn } from '@/utils/helpers';
import { stagger, staggerItem, fadeUp, revealViewport, EASE } from '@/animations';

/**
 * Gaming — §8.
 *
 * Where the professional page borrows the datasheet, this one borrows the
 * overlay: the FPS counter a competitive player keeps in the corner of the
 * screen. That is where the tabular figures, the threshold colours and the
 * capability bars come from. Two audiences, two artifacts, one showroom.
 *
 * Four categories on one page rather than four routes: a player shopping for a
 * rig is usually also deciding on the panel and the cabinet, and making that a
 * navigation problem is how showrooms lose the sale.
 */
export default function GamingPC() {
  usePageMeta('gaming');

  const [category, setCategory] = useState('rigs');
  const [style, setStyle] = useState('all');
  const [selected, setSelected] = useState(gamingBuilds[1].id);

  const active = gamingBuilds.find((b) => b.id === selected) ?? gamingBuilds[0];
  const laptops = useMemo(() => byStyle(gamingLaptops, style), [style]);
  const cabinets = useMemo(() => byStyle(gamingCabinets, style), [style]);
  const gamingGear = useMemo(() => accessories.filter((a) => a.group === 'gaming'), []);

  // The play-style filter only means something for laptops and cabinets; the
  // four rig tiers are already the answer to that question.
  const showStyleFilter = category === 'laptops' || category === 'cabinets';

  return (
    <div className="theme-gaming">
      <PageHero />

      {/* ── Category spine ───────────────────────────────────────────────── */}
      <section id="gear" className="scroll-mt-24 pb-4" aria-labelledby="gear-heading">
        <Container>
          <h2 id="gear-heading" className="sr-only">Browse gaming hardware</h2>

          <div
            role="tablist"
            aria-label="Gaming categories"
            className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-5"
          >
            {gamingCategories.map((c) => {
              const on = category === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => { setCategory(c.id); setStyle('all'); }}
                  className={cn(
                    'relative rounded-xl border px-4 py-3 text-left transition-all duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    on
                      ? 'border-accent/50 bg-accent/[0.08]'
                      : 'border-white/[0.08] hover:border-white/20',
                  )}
                >
                  <span className={cn('block text-[14px] font-semibold', on ? 'text-accent' : 'text-ink')}>
                    {c.label}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-ink-faint">{c.blurb}</span>
                </button>
              );
            })}
          </div>

          {showStyleFilter && (
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                What you play
              </span>
              <GameChip active={style === 'all'} onClick={() => setStyle('all')}>All</GameChip>
              {playStyles.map((s) => (
                <GameChip key={s.id} active={style === s.id} onClick={() => setStyle(s.id)}>
                  {s.label}
                </GameChip>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── Gaming PCs ───────────────────────────────────────────────────── */}
      {category === 'rigs' && (
        <section className="py-12" aria-labelledby="rigs-heading">
          <Container>
            <SectionTitle
              titleId="rigs-heading"
              eyebrow="Four tiers"
              title="Pick the level of play"
              lead="Each tier names the class of component, not a fixed part number — stock moves weekly, and we would rather describe the tier honestly than promise a card we cannot source. Bars are relative capability, not measured frame rates."
            />
            <motion.div
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
            >
              {gamingBuilds.map((b) => (
                <RigCard
                  key={b.id}
                  build={b}
                  selected={b.id === selected}
                  onSelect={() => setSelected(b.id)}
                />
              ))}
            </motion.div>

            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: EASE }}
              className="mt-14"
            >
              <RecommendedAccessories ids={active.recommendedAccessories} compact={false} />
            </motion.div>
          </Container>
        </section>
      )}

      {/* ── Gaming laptops ───────────────────────────────────────────────── */}
      {category === 'laptops' && (
        <GearGrid
          eyebrow="Six lines"
          title="Gaming laptops that hold their clocks"
          lead="A fast panel is worth nothing behind a chassis that throttles. These are the lines we stock because their cooling matches the card inside — listed as series families, since configurations change every quarter."
          items={laptops}
          kind="laptop"
          empty="No laptop in the current range is a clear fit for that style."
          onClear={() => setStyle('all')}
        />
      )}

      {/* ── Cabinets ─────────────────────────────────────────────────────── */}
      {category === 'cabinets' && (
        <GearGrid
          eyebrow="Airflow first"
          title="Cabinets, chosen for temperature"
          lead="The most expensive mistake in this category is a sealed glass box around a build that needed mesh. Every cabinet here is described by what it does to your temperatures before what it does to your desk."
          items={cabinets}
          kind="cabinet"
          empty="No cabinet in the current range is a clear fit for that style."
          onClear={() => setStyle('all')}
        />
      )}

      {/* ── Gaming accessories ───────────────────────────────────────────── */}
      {category === 'accessories' && (
        <section className="py-12" aria-labelledby="gear-acc-heading">
          <Container>
            <SectionTitle
              titleId="gear-acc-heading"
              eyebrow={`${gamingGear.length} categories`}
              title="The setup around the machine"
              lead="Peripherals decide how a build actually feels to play on. Switches and sensors are personal — everything here can be tried at the counter before you commit to it."
            />
            <motion.div
              variants={stagger(0.05)}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
              {gamingGear.map((a) => (
                <motion.div key={a.id} variants={staggerItem}>
                  <AccessoryCard accessory={a} />
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>
      )}

      <CTASection context="gaming" />
    </div>
  );
}

/** Laptops and cabinets render identically — only the copy and data differ. */
function GearGrid({ eyebrow, title, lead, items, kind, empty, onClear }) {
  return (
    <section className="py-12" aria-labelledby={`${kind}-heading`}>
      <Container>
        <SectionTitle titleId={`${kind}-heading`} eyebrow={eyebrow} title={title} lead={lead} />

        {items.length > 0 ? (
          <motion.div
            key={`${kind}-${items.length}`}
            variants={stagger(0.06)}
            initial="hidden"
            animate="visible"
            className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {items.map((item) => (
              <GearCard key={item.id} item={item} kind={kind} />
            ))}
          </motion.div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <p className="text-[15px] font-medium text-ink">{empty}</p>
            <p className="mx-auto mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-ink-muted">
              We source outside the range shown here every week. Tell us the games and the
              budget and we will come back with options.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={onClear} variant="secondary">Show everything</Button>
              <Button to="/about">Ask us to source it</Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function PageHero() {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 lg:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-backdrop mask-fade-b opacity-60" />
        <div
          className="absolute -right-[8%] -top-[10%] h-[55vh] w-[55vh] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--accent) / 0.24), transparent 68%)' }}
        />
        <div
          className="absolute -left-[12%] top-[38%] h-[42vh] w-[42vh] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--rgb-3) / 0.14), transparent 70%)' }}
        />
      </div>

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={stagger(0.08)} initial="hidden" animate="visible">
            <motion.div variants={staggerItem}><Badge tone="accent">Gaming</Badge></motion.div>
            <motion.h1 variants={staggerItem} className="t-hero mt-6 max-w-[12ch]">
              Frames are <span className="text-gradient">everything.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="t-sub mt-7 max-w-[52ch] text-ink-muted">
              Rigs, laptops, cabinets and the gear around them. Built, cable-managed and
              stress-tested at the counter — then matched to a panel that can actually show
              what the card is doing.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-10 flex flex-wrap gap-3">
              <Button href="#gear" size="lg" className="group">
                Browse the gear
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
              <Button to="/about" variant="secondary" size="lg">Get a recommendation</Button>
            </motion.div>

            {/* The signature: one addressable-RGB hairline, nowhere else. */}
            <motion.div variants={staggerItem} className="mt-12 max-w-lg">
              <div className="rgb-sweep h-px w-full rounded-full opacity-80" />
              <dl className="mt-6 grid grid-cols-4 gap-4">
                {[['4', 'Rig tiers'], ['6', 'Laptop lines'], ['4', 'Cabinets'], ['8', 'Gear types']].map(
                  ([v, l]) => (
                    <div key={l}>
                      <dt className="sr-only">{l}</dt>
                      <dd>
                        <span className="overlay-num block text-xl font-semibold text-ink">{v}</span>
                        <span className="mt-1 block text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
                          {l}
                        </span>
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            </motion.div>
          </motion.div>

          <div className="flex justify-center lg:justify-end">
            <AnimatedCabinet mode="gaming" />
          </div>
        </div>
      </Container>
    </section>
  );
}
