import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getIcon } from '@/utils/icons';
import { Container, Badge, Button } from '@/components/common';
import { HardwareCard, HardwareProductCard } from '@/components/cards';
import { CTASection } from '@/components/sections';
import { hardwareCategories, counterDepartments } from '@/data/hardwareCategories';
import {
  productsInCategory,
  categoryCounts,
  countBySourceCategories,
  hardwareProducts,
} from '@/data/hardwareProducts';
import { COMPANY } from '@/data/company';
import { ROUTES } from '@/utils/constants';
import { usePageMeta } from '@/hooks/usePageTransition';
import { img } from '@/utils/helpers';
import { stagger, staggerItem, fadeUp, revealViewport, EASE } from '@/animations';

/**
 * Hardware explorer.
 *
 * A browsing tool, not a shop. Selecting a department expands it in place to
 * show the sub-families, the one thing that actually decides the choice, and —
 * this is the part that was missing — the real products behind it, read from
 * the transcribed catalogue rather than described in prose.
 *
 * Everything below the tiles is driven by data. The counts are computed, never
 * asserted, so the page cannot claim a range the catalogue does not hold.
 */

/** The single panel every tile discloses into. */
const PANEL_ID = 'department-detail';

/** Component lines actually mapped to a department. */
const LINE_COUNT = hardwareProducts.filter((product) => product.category).length;

export default function Hardware() {
  usePageMeta('hardware');
  const [openId, setOpenId] = useState(hardwareCategories[0].id);
  const open = hardwareCategories.find((c) => c.id === openId);
  const openProducts = open ? productsInCategory(open.id) : [];

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
              {hardwareCategories.length} departments and the {LINE_COUNT} product lines behind
              them. For each one we list what we actually carry and the thing that really decides
              the choice — so you can tell whether the expensive option is worth it for what you
              are doing.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-5 text-[13px] leading-relaxed text-ink-faint">
              No prices here. Stock and rates move week to week, so we quote at the counter or over
              WhatsApp rather than publish a figure that would be wrong by the time you read it.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      <section aria-labelledby="explorer-heading">
        <Container>
          <h2 id="explorer-heading" className="sr-only">Hardware departments</h2>

          <motion.div
            variants={stagger(0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {hardwareCategories.map((category) => (
              <div key={category.id} id={category.id} className="h-full scroll-mt-28">
                <HardwareCard
                  category={category}
                  count={categoryCounts[category.id] ?? 0}
                  expanded={category.id === openId}
                  onSelect={setOpenId}
                  controls={PANEL_ID}
                />
              </div>
            ))}

            {/* Fills the ragged last row — ten tiles across three columns leave
                two empty cells — and says the true thing the grid cannot: the
                counter stocks more than the departments listed here. */}
            <motion.div variants={staggerItem} className="sm:col-span-2">
              <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed
                              border-white/[0.13] bg-white/[0.015] p-8">
                <h3 className="font-display text-lg font-semibold">Not listed here?</h3>
                <p className="mt-2.5 max-w-[46ch] text-[13px] leading-relaxed text-ink-muted">
                  These are the departments we keep on the shelf. Plenty else comes in to order —
                  bring the machine or the part number and we will source it.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={COMPANY.whatsappHref} variant="secondary" size="sm">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp
                  </Button>
                  <Button to={ROUTES.about} variant="ghost" size="sm">
                    Or send an enquiry
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Detail panel for the open department */}
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                key={open.id}
                id={PANEL_ID}
                role="region"
                aria-label={`${open.name} — what we stock`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-8 overflow-hidden rounded-3xl border border-white/[0.09] bg-base-800"
              >
                <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
                  {/* Left rail — what the department is and how to choose.
                      Sticky on desktop: departments with two sub-families are
                      much shorter than their product list, and a short rail
                      next to a long column reads as a hole in the panel. */}
                  <div className="relative border-b border-white/[0.06] lg:border-b-0 lg:border-r">
                   <div className="lg:sticky lg:top-24">
                    {img(open.image) && (
                      <div className="relative h-44 overflow-hidden lg:h-56">
                        <img
                          src={img(open.image)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover opacity-45"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-base-800 via-base-800/50 to-transparent" />
                      </div>
                    )}

                    <div className="p-8 lg:p-10 lg:pt-6">
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
                  </div>

                  {/* Right — the real catalogue behind the department */}
                  <div className="p-8 lg:p-10">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h4 className="t-eyebrow text-ink-faint">
                        What we stock — {openProducts.length}{' '}
                        {openProducts.length === 1 ? 'line' : 'lines'}
                      </h4>
                      <Button to={ROUTES.about} variant="ghost" size="sm" className="group">
                        Ask about a part
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                      </Button>
                    </div>

                    {openProducts.length > 0 ? (
                      <motion.div
                        variants={stagger(0.05)}
                        initial="hidden"
                        animate="visible"
                        className="mt-6 grid gap-4 sm:grid-cols-2"
                      >
                        {openProducts.map((product) => (
                          <HardwareProductCard
                            key={product.id}
                            product={product}
                            icon={open.icon}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <p className="mt-6 text-[13px] leading-relaxed text-ink-muted">
                        Supplied to order for this department — tell us the machine and we will
                        confirm the part and availability the same day.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </section>

      <CounterDepartments />
      <CTASection />
    </>
  );
}

/**
 * The counters that are not component departments.
 *
 * These are real parts of the business with real products in the catalogue,
 * but none of them is a part you would put in a build — so they sit here as a
 * strip rather than as explorer tiles that would promise a browsable range.
 */
function CounterDepartments() {
  return (
    <section className="py-20 lg:py-24" aria-labelledby="counter-heading">
      <Container>
        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          <motion.h2 id="counter-heading" variants={staggerItem} className="t-eyebrow text-ink-faint">
            Also at the counter
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-ink-muted">
            Not everything we do is a component. These run alongside the build side of the shop —
            same counter, same people.
          </motion.p>

          <motion.ul
            variants={stagger(0.05)}
            className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08]
                       bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4"
          >
            {counterDepartments.map((dept) => {
              const Icon = getIcon(dept.icon);
              const count = countBySourceCategories(dept.covers);
              return (
                <motion.li key={dept.id} variants={staggerItem} className="bg-base p-7">
                  <Icon className="h-5 w-5 text-accent" strokeWidth={1.4} aria-hidden="true" />
                  <h3 className="mt-5 font-display text-[16px] font-semibold">{dept.name}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-ink-muted">{dept.detail}</p>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    {count} {count === 1 ? 'line' : 'lines'} listed
                  </p>
                </motion.li>
              );
            })}
          </motion.ul>

          <motion.div variants={staggerItem} className="mt-8">
            <Button to={ROUTES.accessories} variant="secondary">
              Browse accessories <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function CategoryIcon({ name }) {
  const Icon = getIcon(name);
  return (
    <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
      <Icon className="h-[18px] w-[18px] text-accent" />
    </span>
  );
}
