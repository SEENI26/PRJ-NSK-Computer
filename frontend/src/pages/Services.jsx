import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Phone, Wrench } from 'lucide-react';
import { Container, SectionTitle, Button, Badge } from '@/components/common';
import { JobCard } from '@/components/services';
import { SERVICE_GROUPS, SERVICE_PROCESS, services, servicesIn } from '@/data/services';
import { COMPANY } from '@/data/company';
import { ROUTES } from '@/utils/constants';
import { usePageMeta } from '@/hooks/usePageTransition';
import { cn } from '@/utils/helpers';
import { stagger, staggerItem, fadeUp, revealViewport, EASE } from '@/animations';

/**
 * Services — the counter work.
 *
 * The other five pages sell machines. This one covers the half of the trade
 * that brings people back, and it had no page at all: the brand's own social
 * card has advertised "Desktop & Laptop Spares · Networking · CCTV" the whole
 * time while the site said nothing about any of it.
 *
 * The artifact here is the job card — the docket a counter writes when you
 * hand a machine over. It is the document this audience already trusts, the
 * same way the professional page borrows the datasheet and gaming borrows the
 * frame counter.
 *
 * No prices and no turnaround promises anywhere: both depend on the fault and
 * on stock, and a page guaranteeing "24-hour repair" writes a cheque the
 * counter has to honour. What is promised instead is the process — look
 * first, quote second, work third — which is true every time.
 */
export default function Services() {
  usePageMeta('services');

  const [group, setGroup] = useState('all');
  const shown = useMemo(() => servicesIn(group), [group]);
  const activeGroup = SERVICE_GROUPS.find((g) => g.id === group);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-14 pt-36 lg:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-backdrop mask-fade-b opacity-50" />
          <div
            className="absolute -right-[10%] -top-[12%] h-[50vh] w-[50vh] rounded-full blur-[130px]"
            style={{ background: 'radial-gradient(circle, rgb(var(--accent) / 0.18), transparent 68%)' }}
          />
        </div>

        <Container>
          <motion.div variants={stagger(0.08)} initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={staggerItem}><Badge tone="accent">Service &amp; support</Badge></motion.div>
            <motion.h1 variants={staggerItem} className="t-hero mt-6 max-w-[16ch]">
              Bring it in. We will <span className="text-gradient">look first.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="t-sub mt-7 max-w-[56ch] text-ink-muted">
              Repairs, upgrades, data recovery, networking, CCTV and annual maintenance —
              for a single laptop or for a floor of them. Twenty years of it, at the counter
              in {COMPANY.address.city}.
            </motion.p>

            <motion.div variants={staggerItem} className="mt-10 flex flex-wrap gap-3">
              <Button href="#jobs" size="lg" className="group">
                See what we handle
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
              <Button href={COMPANY.phoneHref} variant="secondary" size="lg">
                <Phone className="h-4 w-4" aria-hidden="true" /> {COMPANY.phone}
              </Button>
            </motion.div>

            {/* The one promise this page makes, made once and up front. */}
            <motion.p
              variants={staggerItem}
              className="mt-12 flex max-w-[58ch] gap-3 rounded-xl border border-white/[0.09]
                         bg-white/[0.02] p-5 text-[13.5px] leading-relaxed text-ink-muted"
            >
              <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <span className="text-ink">Diagnosis before any quote.</span> You are told what is
                actually wrong and what it will cost before a single part is ordered — including
                when the honest answer is that the machine is not worth repairing.
              </span>
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* ── The jobs ─────────────────────────────────────────────────────── */}
      <section id="jobs" className="scroll-mt-24 py-12" aria-labelledby="jobs-heading">
        <Container>
          <SectionTitle
            titleId="jobs-heading"
            eyebrow={`${services.length} kinds of job`}
            title="What comes across the counter"
            lead="Listed by the symptom rather than the fix, because that is how the problem arrives. If what is wrong is not here, it is still worth asking — this is the common half, not the whole of it."
          />

          <div className="mt-10 flex flex-wrap items-center gap-2.5">
            <Chip active={group === 'all'} onClick={() => setGroup('all')}>
              All <span className="ml-1.5 opacity-50">{services.length}</span>
            </Chip>
            {SERVICE_GROUPS.map((g) => (
              <Chip
                key={g.id}
                active={group === g.id}
                onClick={() => setGroup(group === g.id ? 'all' : g.id)}
              >
                {g.label}
                <span className="ml-1.5 opacity-50">{servicesIn(g.id).length}</span>
              </Chip>
            ))}
          </div>

          {activeGroup && (
            <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
              {activeGroup.blurb}
            </p>
          )}

          <motion.div
            key={group}
            variants={stagger(0.06)}
            initial="hidden"
            animate="visible"
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {shown.map((service) => (
              <JobCard key={service.id} service={service} />
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ── How a job runs ───────────────────────────────────────────────── */}
      <section className="py-20" aria-labelledby="process-heading">
        <Container>
          <SectionTitle
            titleId="process-heading"
            eyebrow="How a job runs"
            title="Four steps, every time"
            lead="The same sequence whether it is one laptop or a twenty-machine contract. It is the part we can promise, because it does not depend on what the fault turns out to be."
          />

          {/*
            Numbered because this genuinely is a sequence — the order carries
            information the reader needs, which is the only good reason to
            number anything.
          */}
          <motion.ol
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08]
                       bg-white/[0.06] md:grid-cols-2 xl:grid-cols-4"
          >
            {SERVICE_PROCESS.map((s) => (
              <motion.li key={s.step} variants={staggerItem} className="bg-base-900 p-6">
                <span className="overlay-num text-[13px] font-semibold text-accent">{s.step}</span>
                <h3 className="mt-3 text-[15.5px] font-semibold tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{s.body}</p>
              </motion.li>
            ))}
          </motion.ol>
        </Container>
      </section>

      {/* ── Close ────────────────────────────────────────────────────────── */}
      <section className="pb-28" aria-labelledby="services-cta-heading">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={{ duration: 0.65, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.09] px-8 py-16 text-center lg:px-16 lg:py-20"
            style={{ background: 'linear-gradient(160deg, #0e1418 0%, #0a0c10 55%, #080808 100%)' }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(60% 60% at 50% 0%, rgb(var(--accent) / 0.16), transparent 70%)' }}
            />
            <div className="relative">
              <p className="t-eyebrow text-accent">Describe the fault</p>
              <h2 id="services-cta-heading" className="t-display mx-auto mt-5 max-w-[20ch]">
                Not sure if it is worth repairing?
              </h2>
              <p className="mx-auto mt-6 max-w-[54ch] text-[15px] leading-relaxed text-ink-muted">
                Tell us what it is doing and roughly how old it is. We will tell you whether to
                bring it in — and say so plainly when replacing it is the better spend.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button href={COMPANY.whatsappHref} size="lg">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
                </Button>
                <Button href={COMPANY.phoneHref} variant="secondary" size="lg">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {COMPANY.phone}
                </Button>
                <Button to={ROUTES.about} variant="ghost" size="lg">
                  Visit the showroom
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-4 py-2 text-[13px] transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        active
          ? 'border-accent/50 bg-accent/10 text-accent'
          : 'border-white/10 text-ink-muted hover:border-white/25 hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}
