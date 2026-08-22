import { EASE } from './fade';

/**
 * Route transition — §23. Deliberately short: a page change should feel
 * immediate, and a long transition reads as latency rather than polish.
 */
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.42, ease: EASE } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.22, ease: EASE } },
};
