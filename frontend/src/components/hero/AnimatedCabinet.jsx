import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { CABINET_MODES, cabinetReveal } from '@/animations';

/**
 * The cabinet — §12.
 *
 * Drawn, not photographed: a layered CSS construction of chassis, glass, fans,
 * GPU, cooler and cable channel, composed so it reads as a real machine seen
 * slightly off-axis. Three modes (gaming / professional / desktop) change the
 * lighting and pace without changing the structure.
 *
 * Deliberately NOT a spinning 3D box — it tilts a few degrees with the pointer
 * and drifts on a long loop, the way a product film moves. Every animated
 * property is transform or opacity so the compositor does the work.
 *
 * Reduced motion collapses it to a still render (§22).
 */
export function AnimatedCabinet({
  mode = 'gaming',
  tilt = { x: 0, y: 0 },
  className,
  scrollParallax = true,
}) {
  const config = CABINET_MODES[mode] ?? CABINET_MODES.gaming;
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    scrollParallax && !reduced ? [40, -40] : [0, 0],
  );

  // Pointer tilt, damped. A few degrees is enough to suggest depth; more looks
  // like a toy.
  const rotateY = reduced ? 0 : tilt.x * config.tiltStrength;
  const rotateX = reduced ? 0 : -tilt.y * (config.tiltStrength * 0.55);

  const fanClass = reduced ? '' : config.fanClass;

  return (
    <motion.div
      ref={ref}
      style={{ y: parallaxY, perspective: 1400 }}
      className={cn('relative isolate mx-auto w-full max-w-[420px]', className)}
    >
      {/* Ground glow, sitting behind everything */}
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 -z-10 blur-3xl', !reduced && 'anim-glow')}
        style={{
          background: `radial-gradient(60% 55% at 50% 55%, ${config.glowColor} 0%, transparent 70%)`,
          opacity: config.glowOpacity,
        }}
      />

      <motion.div
        variants={cabinetReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        animate={
          reduced
            ? undefined
            : { y: [0, -config.floatRange, 0] }
        }
        transition={
          reduced
            ? undefined
            : { duration: config.floatDuration, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
        className="relative will-transform"
      >
        {/* ── Chassis ─────────────────────────────────────────────────── */}
        <div
          className="relative aspect-[3/4.4] w-full overflow-hidden rounded-[20px]
                     border border-white/10 shadow-[0_50px_120px_-40px_rgb(0,0,0,0.95)]"
          style={{
            background:
              'linear-gradient(155deg, #1c1f26 0%, #101318 42%, #0a0c10 100%)',
          }}
        >
          {/* Brushed-metal sheen across the panel */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.5]"
            style={{
              background:
                'repeating-linear-gradient(102deg, rgb(255 255 255/0.028) 0px, rgb(255 255 255/0.028) 1px, transparent 1px, transparent 4px)',
            }}
          />

          {/* Tempered-glass side panel */}
          <div className="absolute inset-[9px] rounded-[13px] border border-white/[0.09]
                          bg-gradient-to-br from-white/[0.055] via-transparent to-white/[0.02]
                          backdrop-blur-[1px]">

            {/* Top radiator + its two fans */}
            <div className="absolute inset-x-3 top-3 flex h-[17%] items-center justify-around
                            rounded-md border border-white/[0.07] bg-black/45">
              {[0, 1].map((i) => (
                <Fan key={i} size="28%" color={config.glowColor} spinClass={fanClass} delay={i * 0.4} />
              ))}
            </div>

            {/* Motherboard plane */}
            <div className="absolute inset-x-3 top-[22%] bottom-[26%] rounded-md
                            border border-white/[0.06] bg-gradient-to-b from-[#0f1319] to-[#0b0e13]">
              {/* CPU block */}
              <div className="absolute left-[8%] top-[8%] h-[22%] w-[30%] rounded
                              border border-white/10 bg-[#171b22]">
                <div className="absolute inset-[22%] rounded-sm border border-white/[0.09] bg-[#0d1015]" />
              </div>

              {/* Memory sticks */}
              <div className="absolute right-[8%] top-[7%] flex h-[26%] w-[26%] gap-[3px]">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-[2px] border border-white/10 bg-[#161a20]"
                    style={{
                      boxShadow: `0 0 7px -1px ${config.glowColor}`,
                      opacity: 0.55 + i * 0.12,
                    }}
                  />
                ))}
              </div>

              {/* Graphics card, spanning the board */}
              <div className="absolute inset-x-[6%] bottom-[12%] h-[30%] rounded
                              border border-white/[0.09] bg-gradient-to-b from-[#1b1f27] to-[#0f1217]">
                <div className="absolute inset-y-0 left-2 flex items-center gap-[6px]">
                  {[0, 1].map((i) => (
                    <Fan key={i} size="26px" color={config.glowColor} spinClass={fanClass} delay={i * 0.25} />
                  ))}
                </div>
                {/* Lit edge along the top of the card */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-2 top-1 h-[2px] rounded-full"
                  style={{ background: config.glowColor, opacity: config.glowOpacity + 0.25 }}
                />
              </div>
            </div>

            {/* PSU shroud */}
            <div className="absolute inset-x-3 bottom-3 h-[22%] rounded-md
                            border border-white/[0.07] bg-gradient-to-b from-[#12151b] to-[#0a0c10]">
              <div className="absolute inset-y-0 right-3 flex items-center">
                <Fan size="34px" color={config.glowColor} spinClass={fanClass} delay={0.6} />
              </div>
              {/* Cable channel — the detail that says "built properly" */}
              <div className="absolute inset-y-0 left-3 flex w-[45%] flex-col justify-center gap-[5px]">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-[3px] rounded-full bg-white/[0.07]" style={{ width: `${88 - i * 16}%` }} />
                ))}
              </div>
            </div>

            {/* Glass reflection sweep */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[13px]"
            >
              <div
                className={cn('absolute -inset-y-8 w-1/3 bg-white/[0.05] blur-md', !reduced && 'anim-scan')}
                style={{ transform: 'skewX(-14deg)' }}
              />
            </div>
          </div>

          {/* Front I/O */}
          <div className="absolute right-3 top-3 flex flex-col items-end gap-[5px]">
            <div className="h-[5px] w-[5px] rounded-full" style={{ background: config.glowColor }} />
            <div className="h-[3px] w-3 rounded-full bg-white/15" />
          </div>
        </div>

        {/* Feet */}
        <div aria-hidden="true" className="mx-auto mt-[6px] flex w-[78%] justify-between">
          {[0, 1].map((i) => <div key={i} className="h-[5px] w-9 rounded-b-md bg-white/[0.07]" />)}
        </div>
      </motion.div>

      {/* Reflected pool under the machine */}
      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto mt-3 h-16 w-[72%] rounded-[50%] blur-2xl"
        style={{ background: config.glowColor, opacity: config.glowOpacity * 0.42 }}
      />
    </motion.div>
  );
}

/** A fan: outer ring, hub, and blades that only spin when motion is allowed. */
function Fan({ size, color, spinClass, delay = 0 }) {
  return (
    <div
      className="relative grid place-items-center rounded-full border border-white/[0.09] bg-black/55"
      style={{ width: size, aspectRatio: '1', boxShadow: `0 0 12px -3px ${color}` }}
    >
      <div
        className={cn('absolute inset-[14%] rounded-full', spinClass)}
        style={{
          animationDelay: `${delay}s`,
          background: `conic-gradient(from 0deg, transparent 0deg, ${color} 42deg, transparent 84deg,
                        transparent 120deg, ${color} 162deg, transparent 204deg,
                        transparent 240deg, ${color} 282deg, transparent 324deg)`,
          opacity: 0.55,
        }}
      />
      <div className="relative h-[22%] w-[22%] rounded-full bg-white/25" />
    </div>
  );
}
