import { HeroSection } from '@/components/hero';
import {
  GamingVsProfessional, HardwareCategories, FeaturedBuilds, AccessoriesPreview,
  ShowroomGallery, WhyChooseUs, CTASection,
} from '@/components/sections';
import { usePageMeta } from '@/hooks/usePageTransition';

/**
 * Home — §6.
 *
 * Ordered to tell the story in §32: we have the hardware → choose your side →
 * see complete machines → explore the parts → finish the setup → why us →
 * come in.
 */
export default function Home() {
  usePageMeta('home');

  return (
    <>
      <HeroSection />
      <GamingVsProfessional />
      <FeaturedBuilds />
      <HardwareCategories limit={6} />
      <AccessoriesPreview />
      <WhyChooseUs />
      <ShowroomGallery />
      <CTASection />
    </>
  );
}
