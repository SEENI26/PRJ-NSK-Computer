import { EASE } from './fade';

/**
 * Cabinet motion — §12.
 *
 * Two personalities from one component: gaming is quicker with a stronger
 * glow, professional is slower and near-still. Neither spins, because a
 * spinning box reads as a screensaver rather than a product film.
 */
export const CABINET_MODES = {
  gaming: {
    glowColor:    'rgb(var(--accent))',
    glowOpacity:  0.55,
    fanClass:     'anim-fan',
    floatRange:   14,
    floatDuration: 7,
    tiltStrength: 9,
  },
  professional: {
    glowColor:    'rgb(var(--ink-muted))',
    glowOpacity:  0.22,
    fanClass:     'anim-fan-slow',
    floatRange:   7,
    floatDuration: 11,
    tiltStrength: 4,
  },
  desktop: {
    glowColor:    'rgb(var(--accent-blue))',
    glowOpacity:  0.36,
    fanClass:     'anim-fan-slow',
    floatRange:   10,
    floatDuration: 9,
    tiltStrength: 6,
  },
};

/** Chassis entrance — assembles rather than fades. */
export const cabinetReveal = {
  hidden:  { opacity: 0, y: 40, rotateY: -14, scale: 0.94 },
  visible: {
    opacity: 1, y: 0, rotateY: 0, scale: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};

/** Internal components settling in after the chassis. */
export const componentReveal = (index) => ({
  hidden:  { opacity: 0, x: -14 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.5, ease: EASE, delay: 0.45 + index * 0.09 },
  },
});
