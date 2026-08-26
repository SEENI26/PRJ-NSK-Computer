import { lazy, Suspense } from 'react';
import { Container, SectionTitle, Button } from '@/components/common';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { activeGalleryImages, usingFallbackGallery } from '@/data/gallery';
import { COMPANY } from '@/data/company';
import { ROUTES } from '@/utils/constants';

/**
 * The dome is only mounted once it scrolls into view — it runs a rAF loop and
 * decodes a couple of dozen images, neither of which should compete with the
 * hero for the first paint.
 */
const DomeGallery = lazy(() =>
  import('@/components/gallery/DomeGallery').then((m) => ({ default: m.DomeGallery })),
);

export function ShowroomGallery() {
  const [ref, visible] = useScrollReveal({ threshold: 0.05, rootMargin: '200px 0px' });

  return (
    <section ref={ref} className="relative overflow-hidden py-24 lg:py-32" aria-labelledby="showroom-heading">
      <Container>
        <SectionTitle
          titleId="showroom-heading"
          eyebrow="Inside the showroom"
          title="Come and see the machines"
          lead={`Twenty years of builds, spares and service on Heber Main Road. Drag the wall to look around — then come in and we will show you the real thing.`}
          action={
            <Button to={`${ROUTES.about}#visit`} variant="secondary">
              Directions and hours
            </Button>
          }
        />
      </Container>

      <div className="relative mt-14 h-[460px] w-full sm:h-[540px] lg:h-[620px]">
        {visible && (
          <Suspense fallback={<div className="h-full w-full" aria-hidden="true" />}>
            <DomeGallery
              images={activeGalleryImages}
              fit={0.8}
              minRadius={600}
              maxVerticalRotationDeg={0}
              segments={34}
              dragDampening={2}
              grayscale
            />
          </Suspense>
        )}
      </div>

      <Container>
        <p className="mt-10 text-center text-xs text-ink-faint">
          {usingFallbackGallery
            /* Says so plainly rather than passing stock imagery off as the shop. */
            ? 'Showing product photography — showroom pictures are being added.'
            : `${COMPANY.address.city} · ${COMPANY.hours.display}, ${COMPANY.hours.days}`}
        </p>
      </Container>
    </section>
  );
}
