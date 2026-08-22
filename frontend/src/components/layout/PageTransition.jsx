import { motion, useReducedMotion } from 'framer-motion';
import { pageTransition } from '@/animations';

/** Route-level fade. Skipped entirely under reduced motion. */
export function PageTransition({ children }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
    >
      {children}
    </motion.div>
  );
}
