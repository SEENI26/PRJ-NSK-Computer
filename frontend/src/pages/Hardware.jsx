import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Container, SectionTitle, Badge } from '@/components/common';
import { HardwareCard } from '@/components/cards';
import { CTASection } from '@/components/sections';
import { hardwareCategories } from '@/data/hardwareCategories';
import { usePageMeta } from '@/hooks/usePageTransition';
import { img } from '@/utils/helpers';
import { stagger, staggerItem, fadeUp, revealViewport, EASE } from '@/animations';

/**
 * Hardware explorer — §10.
 *
 * A browsing tool, not a shop. Selecting a category expands it in place to
 * show the sub-families and the single thing that decides the choice — which
 * is what a showroom can tell you and a spec sheet cannot.
 */
export default function Hardware() {
  usePageMeta('hardware');
  const [openId, setOpenId] = useState(hardwareCategories[0].id);
  const open = hardwareCategories.find((c) => c.id === openId);

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-36 lg:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 grid-backdrop mask-fade-b opacity-50" />
        <Container>
          <motion.div variants={stagger(0.08)} initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={staggerItem}><Badge tone="accent">Hardware</Badge></motion.div>
            <motion.h1 variants={staggerItem} className="t-hero mt-6">
              Every part, <span className="text-gradient">explained.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="t-sub mt-7 text-ink-muted">
              Nine departments. For each one we list what we actually carry and the thing that
              really decides the choice — so you can tell whether the expensive option is worth it
              for what you are doing.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      <section aria-labelledby="explorer-heading">
        <Container>
          <h2 id="explorer-heading" className="sr-only">Hardware categories</h2>

          <motion.div
            variants={stagger(0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {hardwareCategories.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-28">
                <HardwareCard
                  category={category}
                  expanded={category.id === openId}
                  onSelect={setOpenId}
                />
              </div>
            ))}
          </motion.div>

          {/* Detail panel for the open category */}
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                key={open.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-8 overflow-hidden rounded-3xl border border-white/[0.09] bg-base-800"
              >
                <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                  <div className="relative min-h-[240px] overflow-hidden">
                    {img(open.image) && (
                      <img
                        src={img(open.image)}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                      />
                    )}
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent to-base-800" />
                  </div>

                  <div className="p-8 lg:p-10">
                    <div className="flex items-center gap-3">
                      <CategoryIcon name={open.icon} />
                      <h3 className="t-title">{open.name}</h3>
                    </div>

                    <p className="mt-5 rounded-xl border border-accent/20 bg-accent/[0.06] p-4 text-[13.5px] leading-relaxed text-ink">
                      <span className="t-eyebrow mb-2 block text-accent">What decides it</span>
                      {open.decidingFactor}
                    </p>

                    <dl className="mt-7 divide-y divide-white/[0.06]">
                      {open.items.map((item) => (
                        <div key={item.name} className="py-4">
                          <dt className="font-display text-[15px] font-medium">{item.name}</dt>
                          <dd className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{item.detail}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </section>

      <CTASection />
    </>
  );
}

function CategoryIcon({ name }) {
  const Icon = Icons[name] ?? Icons.Cpu;
  return (
    <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
      <Icon className="h-[18px] w-[18px] text-accent" />
    </span>
  );
}
