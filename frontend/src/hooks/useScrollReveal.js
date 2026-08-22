import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll without Framer, for cases where a plain class toggle is
 * cheaper than mounting a motion component (long lists, mostly).
 *
 * Disconnects after the first intersection: a reveal that re-fires on every
 * scroll past is a distraction, not an effect.
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '-8% 0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}
