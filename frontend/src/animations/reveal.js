import { EASE } from './fade';

/** Parent that staggers its children. `delay` offsets the whole group. */
export const stagger = (step = 0.07, delay = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
});

/** The child paired with `stagger`. */
export const staggerItem = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.56, ease: EASE } },
};

/** Viewport config shared by every scroll reveal: fire once, slightly early. */
export const revealViewport = { once: true, margin: '-12% 0px -8% 0px' };

/** A headline that wipes up from behind a mask. */
export const maskUp = {
  hidden:  { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.78, ease: EASE } },
};
