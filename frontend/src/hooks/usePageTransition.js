import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyBusinessSchema, applyMeta, PAGE_META } from '@/utils/seo';

/**
 * Per-page metadata and scroll restoration.
 *
 * An SPA keeps the scroll position and the previous <title> across a route
 * change unless told otherwise; both are corrected here in one place rather
 * than in every page component.
 */
export function usePageMeta(key) {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = PAGE_META[key];
    if (meta) applyMeta(meta);
    applyBusinessSchema();
  }, [key]);

  useEffect(() => {
    // Honour a hash link; otherwise start at the top of the new page.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
}
