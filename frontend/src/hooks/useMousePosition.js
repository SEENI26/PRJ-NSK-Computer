import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

/**
 * Pointer position relative to an element's centre, normalised to −1…1.
 *
 * Drives the hero parallax. Skipped entirely for reduced motion and for coarse
 * pointers, where there is no hover to track and the listener would be waste.
 */
export function useMousePosition(ref, { enabled = true } = {}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    const finePointer =
      typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

    if (!node || !enabled || reduced || !finePointer) return undefined;

    let frame = 0;
    const onMove = (event) => {
      // Coalesce to one update per frame — mousemove fires far faster than paint.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        setPosition({
          x: ((event.clientX - rect.left) / rect.width  - 0.5) * 2,
          y: ((event.clientY - rect.top)  / rect.height - 0.5) * 2,
        });
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      setPosition({ x: 0, y: 0 });
    };

    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, enabled, reduced]);

  return position;
}
