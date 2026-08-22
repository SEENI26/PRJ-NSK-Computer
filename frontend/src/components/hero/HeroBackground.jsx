import { motion, useReducedMotion } from 'framer-motion';
import { PixelSnow } from '@/components/effects/PixelSnow';

/**
 * Hero ground: a grid, two colour washes and a horizon line.
 *
 * Purely decorative, so it is hidden from assistive technology and never
 * animates anything but opacity and transform.
 */
export function HeroBackground({ tilt = { x: 0, y: 0 } }) {
  const reduced = useReducedMotion();
  const shift = (factor) => (reduced ? 0 : tilt.x * factor);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Perspective grid, fading out before it reaches the copy */}
      <div className="absolute inset-0 grid-backdrop mask-fade-b opacity-70" />

      {/* Ambient particle field. Density is kept low and it sits under the
          colour washes, so it reads as atmosphere rather than weather. */}
      <div className="absolute inset-0 opacity-[0.32] mask-fade-b">
        <PixelSnow
          color="#ffffff"
          flakeSize={0.01}
          minFlakeSize={1.25}
          /* 200 upscales to ~14px squares at desktop width, which fights the
             headline. A finer buffer keeps the pixel character at a size that
             stays atmospheric. */
          pixelResolution={460}
          speed={1.25}
          /* Flake count scales with the buffer AREA, so raising the
             resolution needs a matching cut here to keep the same count. */
          density={0.06}
          direction={125}
          brightness={1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="square"
        />
      </div>

      {/* Accent wash, top right */}
      <motion.div
        animate={{ x: shift(-18), y: reduced ? 0 : tilt.y * -10 }}
        transition={{ type: 'spring', stiffness: 40, damping: 22 }}
        className="absolute -right-[12%] -top-[18%] h-[60vh] w-[60vh] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgb(var(--accent) / 0.24), transparent 68%)' }}
      />

      {/* Cool wash, bottom left — keeps the frame from going flat */}
      <motion.div
        animate={{ x: shift(12), y: reduced ? 0 : tilt.y * 8 }}
        transition={{ type: 'spring', stiffness: 34, damping: 24 }}
        className="absolute -bottom-[22%] -left-[10%] h-[52vh] w-[52vh] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgb(var(--accent-blue) / 0.18), transparent 70%)' }}
      />

      {/* Horizon */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgb(var(--accent) / 0.35) 30%, rgb(var(--accent) / 0.35) 70%, transparent)',
        }}
      />
    </div>
  );
}
