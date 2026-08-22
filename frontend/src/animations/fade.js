/**
 * Motion vocabulary — §23.
 *
 * One easing curve and three durations across the whole site. Everything
 * animates transform and opacity only, both of which the compositor handles
 * without a repaint.
 */
export const EASE = [0.16, 1, 0.3, 1];

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
};

export const fadeDown = {
  hidden:  { opacity: 0, y: -18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const fadeLeft = {
  hidden:  { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.62, ease: EASE } },
};

export const fadeRight = {
  hidden:  { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.62, ease: EASE } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.965 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } },
};
