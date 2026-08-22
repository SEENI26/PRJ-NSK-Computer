import { motion } from 'framer-motion';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { Container, Button } from '@/components/common';
import { COMPANY } from '@/data/company';
import { ROUTES } from '@/utils/constants';
import { EASE, revealViewport } from '@/animations';

/** The closing ask — §32's final step: contact or visit. */
export function CTASection() {
  return (
    <section className="py-24 lg:py-32" aria-labelledby="cta-heading">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.09] px-8 py-16 text-center lg:px-16 lg:py-24"
          style={{ background: 'linear-gradient(160deg, #0e1418 0%, #0a0c10 55%, #080808 100%)' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(60% 60% at 50% 0%, rgb(var(--accent) / 0.16), transparent 70%)' }}
          />
          <div aria-hidden="true" className="absolute inset-0 grid-backdrop opacity-40 mask-fade-b" />

          <div className="relative">
            <p className="t-eyebrow text-accent">Tell us what it is for</p>
            <h2 id="cta-heading" className="t-display mx-auto mt-5 max-w-[18ch]">
              Not sure which build you need?
            </h2>
            <p className="mx-auto mt-6 max-w-[52ch] text-[15px] leading-relaxed text-ink-muted">
              Describe the work or the games, and the budget. We will specify the machine around it —
              and say so plainly if a cheaper build is the right answer.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button to={ROUTES.about} size="lg">Get a PC Recommendation</Button>
              <Button href={COMPANY.whatsappHref} variant="secondary" size="lg">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
              </Button>
              <Button href={COMPANY.phoneHref} variant="ghost" size="lg">
                <Phone className="h-4 w-4" aria-hidden="true" /> {COMPANY.phone}
              </Button>
            </div>

            <p className="mt-10 inline-flex items-center gap-2 text-[13px] text-ink-subtle">
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              {COMPANY.address.city} · {COMPANY.hours.display}, {COMPANY.hours.days}
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
