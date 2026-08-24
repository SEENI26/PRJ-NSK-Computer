import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container, SectionTitle, Button } from '@/components/common';
import { AccessoryCard } from '@/components/cards';
import { accessories, ACCESSORY_GROUPS } from '@/data/accessories';
import { byIds } from '@/utils/helpers';
import { ROUTES } from '@/utils/constants';
import { stagger, revealViewport } from '@/animations';

/**
 * Recommended accessories, on the home page.
 *
 * Distinct from `RecommendedAccessories`, which resolves one build's ids and
 * says "matched to this build". There is no build in context here, so this
 * takes one representative line from each of the four groups instead — the
 * point being that the shop covers all four, not that these six go together.
 */
const FEATURED = [
  'gaming-monitor',
  'mechanical-keyboard',
  'gaming-headset',
  'docking-station',
  'wifi-adapter',
  'ups',
];

export function AccessoriesPreview() {
  const items = byIds(accessories, FEATURED);

  return (
    <section className="py-24 lg:py-32" aria-labelledby="accessories-preview-heading">
      <Container>
        <SectionTitle
          titleId="accessories-preview-heading"
          eyebrow="Complete the setup"
          title="Recommended accessories"
          lead={`The parts you actually touch all day — ${ACCESSORY_GROUPS.map((g) => g.label.toLowerCase()).join(', ')}. Switches, sensors and panels change how a machine feels more than another few frames ever will.`}
          action={
            <Button to={ROUTES.accessories} variant="secondary">
              All accessories <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <motion.div
          variants={stagger(0.055)}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((accessory) => (
            <AccessoryCard key={accessory.id} accessory={accessory} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
