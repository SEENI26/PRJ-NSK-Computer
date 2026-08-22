import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/helpers';

/**
 * PixelSnow — a depth-faded particle field rendered at low resolution and
 * upscaled, so the flakes land on a visible pixel grid.
 *
 * Implemented locally against the published prop API. Canvas 2D rather than
 * WebGL: at this particle count the cost is trivial and it avoids shipping a
 * renderer for one decorative background.
 *
 * It is ambient decoration, so it takes three precautions seriously:
 *   • nothing runs while it is scrolled out of view
 *   • nothing runs at all under prefers-reduced-motion
 *   • the backing buffer is `pixelResolution` wide regardless of screen size,
 *     so a 4K display costs no more than a laptop
 */
export function PixelSnow({
  color = '#ffffff',
  flakeSize = 0.01,
  minFlakeSize = 1.25,
  pixelResolution = 200,
  speed = 1.25,
  density = 0.3,
  direction = 125,
  brightness = 1,
  depthFade = 8,
  farPlane = 20,
  gamma = 0.4545,
  variant = 'square',
  className,
}) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let flakes = [];
    let raf = 0;
    let running = false;

    /* Direction is given in degrees; 0 falls straight down. */
    const rad = ((direction - 90) * Math.PI) / 180;
    const dirX = Math.cos(rad);
    const dirY = Math.sin(rad);

    // Decode the colour once so per-flake work is just an alpha change.
    const rgb = (() => {
      const hex = color.replace('#', '');
      const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
      return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
    })();

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const aspect = rect.height / Math.max(1, rect.width);
      // The buffer is fixed-width — this is what produces the pixel grid, and
      // it decouples cost from display resolution.
      width = Math.max(32, Math.round(pixelResolution));
      height = Math.max(32, Math.round(pixelResolution * aspect));
      canvas.width = width;
      canvas.height = height;

      // Count is proportional to buffer AREA — doubling pixelResolution
      // quadruples it, so density has to come down to compensate.
      const count = Math.round(width * height * density * 0.02);
      flakes = Array.from({ length: count }, () => spawn(true));
    }

    function spawn(initial) {
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : -2,
        // Depth drives both size and fade, which is what sells the parallax.
        z: Math.random() * farPlane,
        drift: (Math.random() - 0.5) * 0.35,
      };
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);

      for (const flake of flakes) {
        const depth = 1 - flake.z / farPlane;              // 1 near … 0 far
        const size = Math.max(minFlakeSize, flakeSize * width * depth);
        // Gamma-correct the fade so the falloff reads linearly to the eye.
        const fade = Math.pow(depth, depthFade * 0.12);
        const alpha = Math.min(1, Math.pow(fade, gamma) * brightness * 0.9);

        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
        if (variant === 'square') {
          ctx.fillRect(Math.round(flake.x), Math.round(flake.y), Math.max(1, Math.round(size)), Math.max(1, Math.round(size)));
        } else {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, Math.max(0.5, size / 2), 0, Math.PI * 2);
          ctx.fill();
        }

        const velocity = speed * (0.25 + depth) * 0.5;
        flake.x += dirX * velocity + flake.drift * 0.2;
        flake.y += dirY * velocity;

        // Wrap rather than respawn, so density never visibly dips.
        if (flake.y > height + 2) { flake.y = -2; flake.x = Math.random() * width; }
        if (flake.y < -4)         { flake.y = height + 2; }
        if (flake.x > width + 2)  { flake.x = -2; }
        if (flake.x < -4)         { flake.x = width + 2; }
      }

      raf = requestAnimationFrame(frame);
    }

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const stop  = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Only animate while on screen and while the tab is visible.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [
    reduced, color, flakeSize, minFlakeSize, pixelResolution, speed, density,
    direction, brightness, depthFade, farPlane, gamma, variant,
  ]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('h-full w-full', className)}
      // Nearest-neighbour upscaling is the whole point — it keeps the grid crisp.
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

export default PixelSnow;
