import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, SectionTitle, Button, Badge } from '@/components/common';
import { PCBuildCard } from '@/components/cards';
import { RecommendedAccessories, CTASection } from '@/components/sections';
import { AnimatedCabinet } from '@/components/hero';
import { professionalBuilds } from '@/data/professionalBuilds';
import { usePageMeta } from '@/hooks/usePageTransition';
import { cn } from '@/utils/helpers';
import { stagger, staggerItem, fadeUp, revealViewport, EASE } from '@/animations';

/** Professional workstations — §9. Same structure as Gaming, different tone. */
export default function ProfessionalPC() {
  usePageMeta('professional');
  const [selected, setSelected] = useState(professionalBuilds[1].id);
  const active = professionalBuilds.find((b) => b.id === selected) ?? professionalBuilds[0];

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-36 lg:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-backdrop mask-fade-b opacity-40" />
        </div>

        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div variants={stagger(0.08)} initial="hidden" animate="visible">
              <motion.div variants={staggerItem}><Badge>Professional</Badge></motion.div>
              <motion.h1 variants={staggerItem} className="t-hero mt-6 max-w-[14ch] font-semibold">
                Systems specified for the work.
              </motion.h1>
              <motion.p variants={fadeUp} className="t-sub mt-7 max-w-[54ch] text-ink-muted">
                Workstations for offices, developers, creators, engineers and AI workloads — chosen
                on sustained throughput, expandability and how quietly they run all day.
              </motion.p>
              <motion.div variants={staggerItem} className="mt-10 flex flex-wrap gap-3">
                <Button href="#pro-builds" size="lg">See the workstations</Button>
                <Button to="/about" variant="secondary" size="lg">Talk to us about a fleet</Button>
              </motion.div>
            </motion.div>

            <div className="flex justify-center lg:justify-end">
              <AnimatedCabinet mode="professional" />
            </div>
          </div>
        </Container>
      </section>

      <section id="pro-builds" className="pb-8" aria-labelledby="pro-builds-heading">
        <Container>
          <SectionTitle
            eyebrow="Five workstations"
            title="Specified around the workload"
            lead="An office machine and a render node are not the same problem. Each of these is built around what the work actually stresses — cores, memory, VRAM or silence."
          />

          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {professionalBuilds.map((build) => (
              <div key={build.id} onClick={() => setSelected(build.id)} role="presentation">
                <PCBuildCard build={build} tone="professional" />
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="py-20" aria-labelledby="pro-setup-heading">
        <Container>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <h2 id="pro-setup-heading" className="t-eyebrow text-ink-faint">Setup for</h2>
            {professionalBuilds.map((build) => (
              <button
                key={build.id}
                type="button"
                onClick={() => setSelected(build.id)}
                aria-pressed={build.id === selected}
                className={cn(
                  'rounded-full border px-4 py-2 text-[13px] transition-all duration-300',
                  build.id === selected
                    ? 'border-white/40 bg-white/[0.08] text-ink'
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
