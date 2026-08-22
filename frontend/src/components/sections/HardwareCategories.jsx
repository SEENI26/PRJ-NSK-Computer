import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container, SectionTitle, Button } from '@/components/common';
import { HardwareCard } from '@/components/cards';
import { hardwareCategories } from '@/data/hardwareCategories';
import { ROUTES } from '@/utils/constants';
import { stagger, revealViewport } from '@/animations';

export function HardwareCategories({ limit }) {
  const shown = limit ? hardwareCategories.slice(0, limit) : hardwareCategories;

  return (
    <section className="py-24 lg:py-32" aria-labelledby="hardware-heading">
      <Container>
        <SectionTitle
          eyebrow="Explore the components"
          title="Every part we stock and fit"
          lead="Nine departments, from processors to panels. Each one lists what we carry and the thing that actually decides the choice."
          action={
            <Button to={ROUTES.hardware} variant="secondary">
              All hardware <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((category) => (
            <HardwareCard key={category.id} category={category} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
