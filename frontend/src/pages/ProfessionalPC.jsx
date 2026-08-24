import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { Container, SectionTitle, Button } from '@/components/common';
import { RecommendedAccessories } from '@/components/sections';
import { DeviceRender, ProductCard, FilterPill } from '@/components/professional';
import {
  proRoles,
  proFormFactors,
  filterProducts,
  brandsWith,
} from '@/data/professionalProducts';
import { professionalBuilds } from '@/data/professionalBuilds';
import { COMPANY } from '@/data/company';
import { ROUTES } from '@/utils/constants';
import { usePageMeta } from '@/hooks/usePageTransition';
import { cn } from '@/utils/helpers';
import { stagger, staggerItem, fadeUp, revealViewport, EASE } from '@/animations';

/**
 * Professional workstations — §9.
 *
 * Deliberately the one light page on the site. The gaming side sells
 * atmosphere; this side sells specification, and the people reading it compare
 * machines the way they compare datasheets — white paper, hairline rules,
 * figures in a column. The colourway is `.theme-pro` in globals.css, and its
 * accent is the real NSK navy, which is unusable anywhere else on a black site.
 *
 * The catalogue is organised by the work first, then by brand, because nobody
 * shops for "a desktop" — they shop for the thing that runs their day.
 */

const SPEC_ROWS = [
  ['cpu', 'Processor'],
  ['gpu', 'Graphics'],
  ['ram', 'Memory'],
  ['storage', 'Storage'],
];

export default function ProfessionalPC() {
  usePageMeta('professional');

  const [formFactor, setFormFactor] = useState('desktop');
  const [brand, setBrand] = useState('all');
  const [role, setRole] = useState('all');

  const brands = useMemo(() => brandsWith(formFactor), [formFactor]);
  const products = useMemo(
    () => filterProducts({ formFactor, brand, role }),
    [formFactor, brand, role],
  );

  // Switching form factor can strand a brand filter that has nothing in the
  // new tab, which would read as an empty catalogue rather than an empty
  // filter. Reset it with the tab.
  function chooseFormFactor(next) {
    setFormFactor(next);
    setBrand('all');
  }

  const activeRole = proRoles.find((r) => r.id === role);

  return (
    <div className="theme-pro">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-20 pt-36 lg:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-backdrop mask-fade-b opacity-70" />
        </div>

        <Container>
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div variants={stagger(0.08)} initial="hidden" animate="visible">
              <motion.p variants={staggerItem} className="t-eyebrow text-accent">
                Professional · Workstations & laptops
              </motion.p>
              <motion.h1
                variants={staggerItem}
                className="t-hero mt-6 max-w-[15ch] font-semibold text-ink"
              >
                Systems specified for the work.
              </motion.h1>
              <motion.p variants={fadeUp} className="t-sub mt-7 max-w-[52ch] text-ink-muted">
                Desktops and laptops for offices, developers, creators, engineers and research
                teams — from Dell, HP, Lenovo, ASUS, Acer and MSI, or built here to a spec you
                set. Chosen on sustained throughput, serviceability and how quietly they run
                all day.
              </motion.p>

              <motion.div variants={staggerItem} className="mt-10 flex flex-wrap gap-3">
                <Button href="#catalogue" size="lg" className="group">
                  Browse the range
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
                <Button to={ROUTES.about} variant="secondary" size="lg">
                  Talk to us about a fleet
                </Button>
              </motion.div>

              <motion.dl
                variants={staggerItem}
                className="tabular mt-14 grid max-w-lg grid-cols-3 gap-x-6 gap-y-5
                           border-t border-[rgb(18_20_26/0.1)] pt-8"
              >
                {[
                  ['6', 'Partner brands'],
                  ['2', 'Form factors'],
                  ['48h', 'Build and test'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <span className="t-mono block text-2xl font-semibold tracking-tight text-ink">
                        {value}
                      </span>
                      <span className="mt-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                        {label}
                      </span>
                    </dd>
                  </div>
                ))}
              </motion.dl>
            </motion.div>

            {/* Both form factors, stated up front — a tower and a notebook. */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
              className="relative mx-auto w-full max-w-[560px]"
            >
              <div className="grid grid-cols-[0.85fr_1.15fr] items-end gap-3">
                <div className="surface-card aspect-[4/5] rounded-2xl p-2">
                  <DeviceRender shape="tower" tint="#211D71" />
                </div>
                <div className="surface-card aspect-[5/4] rounded-2xl p-2">
                  <DeviceRender shape="mobile-workstation" tint="#211D71" />
                </div>
              </div>
              <p className="mt-4 text-center text-[11.5px] uppercase tracking-[0.16em] text-ink-faint">
                Tower workstation · Mobile workstation
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Start from the work ──────────────────────────────────────────── */}
      <section className="py-14" aria-labelledby="roles-heading">
        <Container>
          <h2 id="roles-heading" className="t-eyebrow text-ink-faint">
            Start from the work
          </h2>
          <motion.ul
            variants={stagger(0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[rgb(18_20_26/0.1)]
                       bg-[rgb(18_20_26/0.08)] sm:grid-cols-2 lg:grid-cols-3"
          >
            {proRoles.map((r) => {
              const active = role === r.id;
              return (
                <motion.li key={r.id} variants={staggerItem} className="bg-white">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setRole(active ? 'all' : r.id);
                      document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={cn(
                      'h-full w-full p-6 text-left transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent',
                      active ? 'bg-accent/[0.06]' : 'hover:bg-[rgb(18_20_26/0.025)]',
                    )}
                  >
                    <span
                      className={cn(
                        'flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em]',
                        active ? 'text-accent' : 'text-ink',
                      )}
                    >
                      {r.label}
                      {active && <span className="text-[10px] uppercase tracking-[0.14em]">· filtering</span>}
                    </span>
                    <span className="mt-2 block text-[13px] leading-relaxed text-ink-muted">
                      {r.blurb}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </Container>
      </section>

      {/* ── Catalogue ────────────────────────────────────────────────────── */}
      <section id="catalogue" className="scroll-mt-24 py-14" aria-labelledby="catalogue-heading">
        <Container>
          <SectionTitle
            titleId="catalogue-heading"
            eyebrow="The range"
            title="Machines we supply and support"
            lead="Business desktops and laptops from the manufacturers whose service networks actually reach Tiruchirappalli. Every one is configured, imaged and tested at the counter before it leaves."
          />

          {/* Form factor is the primary axis, so it is a tab row, not a pill. */}
          <div
            role="tablist"
            aria-label="Form factor"
            className="mt-12 flex gap-1 border-b border-[rgb(18_20_26/0.12)]"
          >
            {proFormFactors.map((f) => {
              const active = formFactor === f.id;
              return (
                <button
                  key={f.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => chooseFormFactor(f.id)}
                  className={cn(
                    'relative px-1 pb-3 pr-7 text-[15px] transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    active ? 'font-semibold text-ink' : 'text-ink-faint hover:text-ink-muted',
                  )}
                >
                  {f.label}
                  {active && (
                    <motion.span
                      layoutId="pro-tab"
                      className="absolute inset-x-0 -bottom-px right-7 h-0.5 bg-accent"
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">Brand</span>
            <FilterPill active={brand === 'all'} onClick={() => setBrand('all')}>
              All
            </FilterPill>
            {brands.map((b) => (
              <FilterPill key={b.id} active={brand === b.id} onClick={() => setBrand(b.id)}>
                {b.name}
              </FilterPill>
            ))}

            {role !== 'all' && (
              <button
                type="button"
                onClick={() => setRole('all')}
                className="ml-auto rounded-full border border-accent/30 bg-accent/[0.07] px-3.5 py-1.5
                           text-[12.5px] text-accent transition-colors hover:bg-accent/[0.12]"
              >
                {activeRole?.label} · clear
              </button>
            )}
          </div>

          <p className="mt-5 text-[13px] text-ink-faint">
            {products.length} {products.length === 1 ? 'machine' : 'machines'}
            {role !== 'all' && ` specified for ${activeRole?.label.toLowerCase()}`}
          </p>

          {products.length > 0 ? (
            <motion.div
              key={`${formFactor}-${brand}-${role}`}
              variants={stagger(0.06)}
              initial="hidden"
              animate="visible"
              className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[rgb(18_20_26/0.18)] p-12 text-center">
              <p className="text-[15px] font-medium text-ink">
                Nothing in stock matches that combination.
              </p>
              <p className="mx-auto mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-ink-muted">
                We source outside the range shown here regularly. Tell us the work and the
                budget and we will come back with options.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={() => { setBrand('all'); setRole('all'); }} variant="secondary">
                  Clear filters
                </Button>
                <Button to={ROUTES.about}>Ask us to source it</Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ── NSK-built alternative, as a comparison table ─────────────────── */}
      <section className="py-20" aria-labelledby="builds-heading">
        <Container>
          <SectionTitle
            titleId="builds-heading"
            eyebrow="Or built here"
            title="Five workstations we build ourselves"
            lead="When the brand configurator will not go where the work needs to, we specify it part by part. Same warranty handling, and you keep the choice of every component."
          />

          {/* A comparison table, not cards: these five exist to be read against
              each other, and a table is the only honest shape for that. */}
          <div className="mt-12 overflow-x-auto">
            <table className="tabular w-full min-w-[820px] border-collapse text-left">
              <caption className="sr-only">
                NSK-built professional workstations compared by processor, graphics, memory and storage
              </caption>
              <thead>
                <tr className="border-b border-[rgb(18_20_26/0.16)]">
                  <th scope="col" className="py-3 pr-6 text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    Build
                  </th>
                  {SPEC_ROWS.map(([, label]) => (
                    <th
                      key={label}
                      scope="col"
                      className="py-3 pr-6 text-[11px] uppercase tracking-[0.14em] text-ink-faint"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {professionalBuilds.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-[rgb(18_20_26/0.08)] transition-colors hover:bg-[rgb(18_20_26/0.02)]"
                  >
                    <th scope="row" className="py-4 pr-6 align-top">
                      <span className="block text-[15px] font-semibold text-ink">{b.name}</span>
                      <span className="mt-1 block text-[12.5px] font-normal text-ink-muted">
                        {b.tagline}
                      </span>
                    </th>
                    {SPEC_ROWS.map(([key]) => (
                      <td key={key} className="py-4 pr-6 align-top text-[13px] text-ink-muted">
                        {b.specifications[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* ── Accessories ──────────────────────────────────────────────────── */}
      <section className="pb-20" aria-labelledby="pro-accessories-heading">
        <Container>
          <h2 id="pro-accessories-heading" className="t-eyebrow text-ink-faint">
            Finish the desk
          </h2>
          <p className="mt-3 max-w-[54ch] text-[14px] leading-relaxed text-ink-muted">
            The parts of a professional setup that decide whether an eight-hour day is
            comfortable — and the power protection that decides whether the machine survives
            the monsoon.
          </p>
          <div className="mt-8">
            <RecommendedAccessories
              ids={['pro-monitor', 'office-keyboard', 'wireless-mouse', 'docking-station', 'webcam', 'ups']}
              compact={false}
            />
          </div>
        </Container>
      </section>

      {/* ── Close ────────────────────────────────────────────────────────── */}
      <section className="pb-28" aria-labelledby="pro-cta-heading">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ duration: 0.65, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border border-[rgb(18_20_26/0.12)]
                       bg-white px-8 py-16 text-center lg:px-16 lg:py-20"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{ background: 'radial-gradient(58% 58% at 50% 0%, rgb(33 29 113 / 0.07), transparent 70%)' }}
            />
            <div className="relative">
              <p className="t-eyebrow text-accent">Tell us what the work is</p>
              <h2 id="pro-cta-heading" className="t-display mx-auto mt-5 max-w-[20ch] text-ink">
                Buying for one desk or for twenty?
              </h2>
              <p className="mx-auto mt-6 max-w-[54ch] text-[15px] leading-relaxed text-ink-muted">
                Describe the software the machine has to run and how long it has to last. We
                will specify it, quote it, and say plainly when the cheaper option is the
                right one.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button to={ROUTES.about} size="lg">Get a specification</Button>
                <Button href={COMPANY.whatsappHref} variant="secondary" size="lg">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                </Button>
                <Button href={COMPANY.phoneHref} variant="ghost" size="lg">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {COMPANY.phone}
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
