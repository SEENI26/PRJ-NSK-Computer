import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container, SectionTitle, Button } from '@/components/common';
import { PCBuildCard } from '@/components/cards';
import { gamingBuilds } from '@/data/gamingBuilds';
import { professionalBuilds } from '@/data/professionalBuilds';
import { ROUTES } from '@/utils/constants';
import { stagger, revealViewport } from '@/animations';

/** Three builds that show the range: one gaming, one pro, one enthusiast. */
const FEATURED = [
  gamingBuilds.find((b) => b.id === 'gaming-performance'),
  professionalBuilds.find((b) => b.id === 'pro-developer'),
  gamingBuilds.find((b) => b.id === 'gaming-ultimate'),
].filter(Boolean);

export function FeaturedBuilds() {
  return (
    <section className="py-24 lg:py-32" aria-labelledby="builds-heading">
      <Container>
        <SectionTitle
          eyebrow="Complete machines"
          title="Builds people actually order"
          lead="Each one is a starting point, not a fixed SKU — components are confirmed against stock and your budget when you enquire."
          action={
            <Button to={ROUTES.gaming} variant="secondary">
              All builds <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <motion.div
          variants={stagger(0.09)}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {FEATURED.map((build) => (
            <PCBuildCard key={build.id} build={build} tone={build.type} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
