import { motion } from 'framer-motion';
import { getIcon } from '@/utils/icons';
import { Container, Badge, SectionTitle } from '@/components/common';
import { ContactForm, ContactInfo, MapSection } from '@/components/contact';
import { COMPANY } from '@/data/company';
import { usePageMeta } from '@/hooks/usePageTransition';
import { stagger, staggerItem, fadeUp, revealViewport } from '@/animations';

/** About + Contact — §18. The last step of the story in §32. */
export default function AboutContact() {
  usePageMeta('about');

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-36 lg:pt-44">
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
              Twenty years at the <span className="text-gradient">counter.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="t-sub mt-7 text-ink-muted">
              {COMPANY.legalName} has been supplying, building and repairing computers in{' '}
              {COMPANY.address.city} since {COMPANY.foundingYear}. We sell to home users, offices,
              studios and the trade — and we fit what we sell.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Why us */}
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

      {/* Contact */}
      <section className="py-16" aria-labelledby="contact-heading">
        <Container>
          <SectionTitle
            titleId="contact-heading"
            eyebrow="Get in touch"
            title="Send an enquiry, or come in"
            lead="Tell us what the machine is for. We reply within one working day — usually the same day during shop hours."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <ContactForm />
            <div className="space-y-6">
              <ContactInfo />
              <MapSection />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
