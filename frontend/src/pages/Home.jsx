import { HeroSection } from '@/components/hero';
import {
  GamingVsProfessional, HardwareCategories, FeaturedBuilds, WhyChooseUs, CTASection,
} from '@/components/sections';
import { usePageMeta } from '@/hooks/usePageTransition';

/**
 * Home — §6.
 *
 * Ordered to tell the story in §32: we have the hardware → choose your side →
 * see complete machines → explore the parts → why us → come in.
 */
export default function Home() {
  usePageMeta('home');

  return (
    <>
      <HeroSection />
      <GamingVsProfessional />
      <FeaturedBuilds />
      <HardwareCategories limit={6} />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
