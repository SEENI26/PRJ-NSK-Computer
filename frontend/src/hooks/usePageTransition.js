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
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const meta = PAGE_META[key];
    if (meta) applyMeta(meta);
    applyBusinessSchema();
  }, [key]);

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      return undefined;
    }

    /*
     * Hash links need doing by hand here.
     *
     * The browser resolves a fragment against the document it already has, but
     * every route is lazily loaded — on a client-side navigation the target
     * section does not exist yet when the hash is read, so nothing happens and
     * the visitor lands at the top of a long page wondering where the form
     * went. Retry briefly until the element mounts, then give up rather than
     * poll forever over a hash that matches nothing.
     */
    let frame = 0;
    const started = Date.now();

    const settle = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (Date.now() - started < 2000) {
        frame = window.requestAnimationFrame(settle);
      }
    };

    frame = window.requestAnimationFrame(settle);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);
}
