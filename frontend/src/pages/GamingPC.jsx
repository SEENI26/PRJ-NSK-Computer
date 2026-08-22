import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, SectionTitle, Button, Badge } from '@/components/common';
import { PCBuildCard } from '@/components/cards';
import { RecommendedAccessories, CTASection } from '@/components/sections';
import { AnimatedCabinet } from '@/components/hero';
import { gamingBuilds } from '@/data/gamingBuilds';
import { usePageMeta } from '@/hooks/usePageTransition';
import { cn } from '@/utils/helpers';
import { stagger, staggerItem, fadeUp, revealViewport, EASE } from '@/animations';

/**
 * Gaming PCs — §8.
 *
 * Four tiers, then the setup that goes with the selected one. Selecting a tier
 * swaps the accessory strip rather than navigating, so comparing a build
 * against its peripherals costs nothing.
 */
export default function GamingPC() {
  usePageMeta('gaming');
  const [selected, setSelected] = useState(gamingBuilds[1].id);
  const active = gamingBuilds.find((b) => b.id === selected) ?? gamingBuilds[0];

  return (
    <>
      <PageHero />

      <section className="pb-8" aria-labelledby="builds-heading">
        <Container>
          <SectionTitle
            eyebrow="Four tiers"
            title="Pick the level of play"
            lead="Each tier names the class of component, not a fixed part number — stock moves weekly, and we would rather describe the tier honestly than promise a card we cannot source."
          />

          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {gamingBuilds.map((build) => (
              <div key={build.id} onClick={() => setSelected(build.id)} role="presentation">
                <PCBuildCard build={build} tone="gaming" />
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* The setup for whichever build is selected — §13 */}
      <section className="py-20" aria-labelledby="setup-heading">
        <Container>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <h2 id="setup-heading" className="t-eyebrow text-ink-faint">Setup for</h2>
            {gamingBuilds.map((build) => (
              <button
                key={build.id}
                type="button"
                onClick={() => setSelected(build.id)}
                aria-pressed={build.id === selected}
                className={cn(
                  'rounded-full border px-4 py-2 text-[13px] transition-all duration-300',
                  build.id === selected
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-white/10 text-ink-muted hover:border-white/25 hover:text-ink',
                )}
              >
                {build.name}
              </button>
            ))}
          </div>

          <motion.div key={active.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.42, ease: EASE }}>
            <RecommendedAccessories ids={active.recommendedAccessories} compact={false} />
          </motion.div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}

function PageHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 lg:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-backdrop mask-fade-b opacity-60" />
        <div
          className="absolute -right-[8%] -top-[10%] h-[55vh] w-[55vh] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--accent) / 0.24), transparent 68%)' }}
        />
      </div>

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={stagger(0.08)} initial="hidden" animate="visible">
            <motion.div variants={staggerItem}>
              <Badge tone="accent">Gaming</Badge>
            </motion.div>
            <motion.h1 variants={staggerItem} className="t-hero mt-6 max-w-[12ch]">
              Frames are <span className="text-gradient">everything.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="t-sub mt-7 max-w-[52ch] text-ink-muted">
              Custom gaming builds from starter to ultimate. Assembled, cable-managed and
              stress-tested here — then matched with a panel and peripherals that suit them.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-10 flex flex-wrap gap-3">
              <Button href="#builds-heading" size="lg">See the builds</Button>
              <Button to="/about" variant="secondary" size="lg">Get a recommendation</Button>
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
