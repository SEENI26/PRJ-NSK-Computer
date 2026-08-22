import { Container, Button } from '@/components/common';
import { ROUTES } from '@/utils/constants';
import { useEffect } from 'react';
import { applyMeta } from '@/utils/seo';

export default function NotFound() {
  useEffect(() => {
    applyMeta({
      title: 'Page not found',
      description: 'That page does not exist.',
      path: '/404',
    });
  }, []);

  return (
    <section className="grid min-h-[70vh] place-items-center pt-24">
      <Container className="text-center">
        <p className="t-mono text-6xl font-semibold text-accent">404</p>
        <h1 className="t-display mt-6">That page does not exist.</h1>
        <p className="mx-auto mt-5 max-w-[44ch] text-sm leading-relaxed text-ink-muted">
          The link may be out of date. Everything on the site is reachable from the home page.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button to={ROUTES.home} size="lg">Back to home</Button>
          <Button to={ROUTES.hardware} variant="secondary" size="lg">Browse hardware</Button>
        </div>
      </Container>
    </section>
  );
}
