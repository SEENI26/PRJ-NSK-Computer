import { useEffect, useState } from 'react';

/**
 * Subscribe to a media query.
 *
 * Starts false and corrects after mount, so the first paint is deterministic
 * and there is no layout flash from reading a width during render.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = (event) => setMatches(event.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useIsMobile  = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet  = () => useMediaQuery('(min-width: 768px) and (max-width: 1365px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1366px)');

/** True when the visitor has asked for less motion — §22. */
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
