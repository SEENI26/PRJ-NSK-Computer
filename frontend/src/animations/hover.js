import { EASE } from './fade';

/** Card lift — §16. Paired with .surface-card for the border and glow. */
export const cardHover = {
  rest:  { y: 0,  transition: { duration: 0.32, ease: EASE } },
  hover: { y: -6, transition: { duration: 0.32, ease: EASE } },
};

/** The image inside a lifting card. */
export const imageHover = {
  rest:  { scale: 1,    transition: { duration: 0.5, ease: EASE } },
  hover: { scale: 1.04, transition: { duration: 0.5, ease: EASE } },
};

export const arrowNudge = {
  rest:  { x: 0, transition: { duration: 0.28, ease: EASE } },
  hover: { x: 4, transition: { duration: 0.28, ease: EASE } },
};
