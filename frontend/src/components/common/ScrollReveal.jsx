import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, revealViewport } from '@/animations';

/**
 * Reveal a block on scroll.
 *
 * With reduced motion the children are rendered plainly — no transform, no
 * opacity ramp — rather than animated quickly, which still reads as movement.
 */
export function ScrollReveal({ children, delay = 0, variants = fadeUp, className, as = 'div' }) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
