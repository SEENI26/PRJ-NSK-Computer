import { motion } from 'framer-motion';
import { getIcon } from '@/utils/icons';
import { Container, SectionTitle } from '@/components/common';
import { COMPANY } from '@/data/company';
import { stagger, staggerItem, revealViewport } from '@/animations';

export function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-32" aria-labelledby="why-heading">
      <Container>
        <SectionTitle
          titleId="why-heading"
          eyebrow={`Since ${COMPANY.foundingYear}`}
          title="Why people come back"
          lead="Twenty years at the counter. The value is in being told what you actually need, and in the part working when you get it home."
        />

        <motion.ul
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {COMPANY.differentiators.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <motion.li key={item.id} variants={staggerItem} className="surface-card p-7">
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-accent/25 bg-accent/[0.08]"
                >
                  <Icon className="h-5 w-5 text-accent" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">{item.body}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </Container>
    </section>
  );
}
