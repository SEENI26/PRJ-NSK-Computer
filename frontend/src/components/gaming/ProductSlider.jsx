import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DeviceRender } from '@/components/common';
import { img } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

/**
 * The product carousel on a tier card.
 *
 * Slide one is always the drawn cabinet, so a build with no photographs yet
 * still shows something true rather than an empty frame or a stock desk shot.
 * Anything listed in the build's `gallery` follows it, and the carousel only
 * starts moving once there is more than one slide — a lone drawing sitting
 * still is correct, not broken.
 *
 * Drop shop photographs into public/images/products/ and list them in
 * `gallery` on the build; no code change is needed here.
 */

const INTERVAL = 4200;

export function ProductSlider({ build, tint, className }) {
  const reduced = useReducedMotion();
  const gallery = build.gallery ?? [];
  // The drawing is index 0; photographs follow it.
  const count = gallery.length + 1;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(0);

  const go = useCallback((next) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    // Auto-advance is decoration, so it stops for reduced motion, for a single
    // slide, and while a pointer or keyboard focus is resting on the card —
    // nothing is more irritating than a carousel moving under the cursor.
    if (reduced || count < 2 || paused) return undefined;
    timer.current = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => window.clearInterval(timer.current);
  }, [reduced, count, paused]);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      style={{ background: `radial-gradient(70% 60% at 50% 108%, ${tint}2E 0%, transparent 70%)` }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.45 }}
          className="absolute inset-0"
        >
          {index === 0 ? (
            <div className="h-full w-full p-2 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
              <DeviceRender shape="cabinet" level={build.tier} tint={tint} />
            </div>
          ) : (
            <img
              src={img(gallery[index - 1])}
              alt={`${build.brand?.name ?? ''} ${build.product ?? build.name}`.trim()}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                i === index ? 'w-5' : 'w-1.5 bg-white/30 hover:bg-white/60',
              )}
              style={i === index ? { background: tint } : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
