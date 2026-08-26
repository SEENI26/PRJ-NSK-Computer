import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Lock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { getIcon } from '@/utils/icons';
import { Container, Badge, SectionTitle, Button } from '@/components/common';
import {
  BrandsServiced,
  ContactForm,
  ContactInfo,
  MapSection,
  OpenStatus,
} from '@/components/contact';
import { COMPANY } from '@/data/company';
import { usePageMeta } from '@/hooks/usePageTransition';
import { stagger, staggerItem, fadeUp, revealViewport } from '@/animations';

/**
 * About + Contact — §18, and the last step of the story in §32.
 *
 * Every call to action on the site ends here, which makes this the conversion
 * page rather than an "about us". The artifact it borrows is the shop board:
 * who we are, what we service, where the counter is, when it is open.
 *
 * Two of those were missing entirely. A scan of competing Trichy dealers
 * showed every one of them publishing the brands they service — it is trust
 * and search intent at once, since people search "HP laptop service Trichy"
 * rather than "computer repair". And the hours were printed as static text,
 * which answers the wrong question: the one people actually have at 8pm on a
 * Saturday is "are they open *now*".
 */
/**
 * What `?for=` on the URL means, and which option it preselects.
 *
 * Fifteen calls to action across the site pointed here, promising everything
 * from "get a PC recommendation" to "directions and hours", and every one of
 * them landed at the top of the page. Carrying the context through means the
 * form already knows what the visitor was looking at when they clicked.
 */
const CONTEXT = {
  gaming:       { requirement: 'Gaming PC build',        lead: 'Tell us about your gaming build' },
  professional: { requirement: 'Professional workstation', lead: 'Tell us about the work it has to do' },
  hardware:     { requirement: 'Component upgrade',      lead: 'Tell us what you are upgrading' },
  service:      { requirement: 'Repair or service',      lead: 'Tell us what it is doing wrong' },
  accessories:  { requirement: 'Accessories',            lead: 'Tell us what the desk still needs' },
  trade:        { requirement: 'Bulk / trade enquiry',   lead: 'Tell us about the fleet' },
};

export default function AboutContact() {
  usePageMeta('about');

  const [params] = useSearchParams();
  const context = CONTEXT[params.get('for') ?? ''] ?? null;

  return (
    <>
      {/* ── Who ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-14 pt-36 lg:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-backdrop mask-fade-b opacity-50" />
          <div
            className="absolute -left-[6%] top-[10%] h-[46vh] w-[46vh] rounded-full blur-[130px]"
            style={{ background: 'radial-gradient(circle, rgb(var(--accent) / 0.16), transparent 70%)' }}
          />
        </div>

        <Container>
          <motion.div variants={stagger(0.08)} initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={staggerItem}>
              <Badge tone="accent">Since {COMPANY.foundingYear}</Badge>
            </motion.div>
            <motion.h1 variants={staggerItem} className="t-hero mt-6 max-w-[16ch]">
              Everything, over one <span className="text-gradient">counter.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="t-sub mt-7 text-ink-muted">
              {COMPANY.legalName} has been supplying, building and repairing computers in{' '}
              {COMPANY.address.city} since {COMPANY.foundingYear}. We sell to home users, offices,
              studios and the trade — and we fit what we sell.
            </motion.p>

            {/* The three things a visitor is here to do, before any scrolling. */}
            <motion.div variants={staggerItem} className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={COMPANY.phoneHref} size="lg">
                <Phone className="h-4 w-4" aria-hidden="true" /> {COMPANY.phone}
              </Button>
              <Button href={COMPANY.whatsappHref} variant="secondary" size="lg">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
              </Button>
              <OpenStatus />
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ── What we service ──────────────────────────────────────────────── */}
      <section className="pb-14" aria-labelledby="brands-heading">
        <Container>
          <h2 id="brands-heading" className="t-eyebrow text-ink-faint">
            Supplied and serviced
          </h2>
          <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-ink-muted">
            Sales, spares and repair for the makes we carry — plus assembled machines built here
            to a spec you set. Bring in any of these and we can quote on it.
          </p>
          <div className="mt-7">
            <BrandsServiced />
          </div>
        </Container>
      </section>

      {/* ── How we work ──────────────────────────────────────────────────── */}
      <section className="pb-12" aria-labelledby="about-heading">
        <Container>
          <h2 id="about-heading" className="sr-only">How we work</h2>
          <motion.ul
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {COMPANY.differentiators.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <motion.li key={item.id} variants={staggerItem} className="surface-card p-7">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-5 font-display text-[17px] font-semibold">{item.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{item.body}</p>
                </motion.li>
              );
            })}
          </motion.ul>
        </Container>
      </section>

      {/* ── Find the counter ─────────────────────────────────────────────── */}
      <section id="visit" className="scroll-mt-24 py-16" aria-labelledby="visit-heading">
        <Container>
          <SectionTitle
            titleId="visit-heading"
            eyebrow="Find the counter"
            title="Come in with the machine"
            lead="Most repairs are decided faster across the counter than over a phone call. We are on Heber Main Road in Beema Nagar, and there is no appointment needed during shop hours."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              {/* Hours carry the live badge, because "are they open now" is the
                  question, not "what are the hours". */}
              <div className="surface-card rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                    <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Shop hours
                  </span>
                  <OpenStatus />
                </div>
                <p className="mt-4 text-[17px] font-semibold text-ink">{COMPANY.hours.display}</p>
                <p className="mt-1 text-[13.5px] text-ink-muted">{COMPANY.hours.days}</p>
                <p className="mt-3 text-[12.5px] text-ink-subtle">{COMPANY.hours.note}</p>
              </div>

              <div className="surface-card rounded-2xl p-6">
                <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                  <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Address
                </span>
                <address className="mt-4 text-[14.5px] not-italic leading-relaxed text-ink">
                  {COMPANY.address.street}
                  <br />
                  {COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.postalCode}
                </address>
              </div>

              <ContactInfo />
            </div>

            <MapSection />
          </div>
        </Container>
      </section>

      {/* ── Enquiry ──────────────────────────────────────────────────────── */}
      <section id="enquiry" className="scroll-mt-24 pb-24" aria-labelledby="contact-heading">
        <Container>
          <SectionTitle
            titleId="contact-heading"
            eyebrow="Get in touch"
            title={context ? context.lead : 'Send an enquiry'}
            lead="Tell us what the machine is for, or what it is doing wrong. We reply within one working day — usually the same day during shop hours."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <ContactForm defaultRequirement={context?.requirement} />

              {/*
                What happens to the details the form collects. India's DPDP Act
                applies to this data and the page said nothing about it, which
                is both a compliance gap and the sort of thing that makes people
                hesitate before typing a phone number in.
              */}
              <p className="mt-5 flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5
                            text-[12.5px] leading-relaxed text-ink-subtle">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                <span>
                  Your name, phone and email are used only to answer this enquiry. We do not sell
                  them, share them with anyone else, or add you to a mailing list. Ask us at{' '}
                  <a href={COMPANY.emailHref} className="text-ink-muted underline underline-offset-2 hover:text-accent">
                    {COMPANY.email}
                  </a>{' '}
                  and we will delete what you have sent.
                </span>
              </p>
            </div>

            <div className="surface-card h-fit rounded-2xl p-6 lg:p-8">
              <p className="t-eyebrow text-accent">Faster than a form</p>
              <h3 className="mt-4 text-[19px] font-semibold tracking-[-0.02em]">
                A photo of the fault usually saves a visit
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">
                Send a picture of the machine, the error on screen or the part you are replacing,
                and we can normally tell you what it needs before you carry it in.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={COMPANY.whatsappHref}>
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                </Button>
                <Button href={COMPANY.phoneHref} variant="secondary">
                  <Phone className="h-4 w-4" aria-hidden="true" /> Call
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
