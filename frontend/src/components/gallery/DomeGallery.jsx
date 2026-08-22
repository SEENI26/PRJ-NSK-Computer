import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn, img } from '@/utils/helpers';

/**
 * DomeGallery — images arranged on the inside of a sphere, draggable.
 *
 * Implemented locally against the published prop API. Built on CSS 3D
 * transforms rather than WebGL: a few dozen tiles do not justify a renderer,
 * and transforms stay on the compositor.
 *
 * Interaction:
 *   • drag (pointer or touch) to rotate, with inertia on release
 *   • arrow keys rotate when the dome has focus
 *   • idle auto-rotation, paused on hover, focus or drag
 *
 * Accessibility: the dome is decorative motion around real content, so it
 * exposes a plain list to assistive technology and the whole thing collapses
 * to a static grid when reduced motion is requested — a drag-to-explore
 * carousel is unusable for anyone who cannot drag.
 */
export function DomeGallery({
  images = [],
  fit = 0.8,
  minRadius = 600,
  maxRadius = 900,
  maxVerticalRotationDeg = 0,
  segments = 34,
  dragDampening = 2,
  grayscale = false,
  autoRotate = true,
  className,
}) {
  const reduced = useReducedMotion();
  const frameRef = useRef(null);
  const stateRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, dragging: false, lastX: 0, lastY: 0 });
  const rafRef = useRef(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [paused, setPaused] = useState(false);
  const [radius, setRadius] = useState(minRadius);

  /* Radius follows the container so the dome fills the frame at any width. */
  useEffect(() => {
    const node = frameRef.current;
    if (!node) return undefined;
    const measure = () => {
      const { width, height } = node.getBoundingClientRect();
      const base = Math.min(width, height) * (1 / Math.max(0.2, fit));
      setRadius(Math.round(Math.min(maxRadius, Math.max(minRadius, base))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [fit, minRadius, maxRadius]);

  /**
   * Tile placement.
   *
   * Rows are latitude bands, `segments` sets how many tiles go round the
   * equator, and each row's count is scaled by cos(latitude) so tiles are not
   * bunched at the poles. Images repeat if there are fewer than slots.
   */
  const tiles = useMemo(() => {
    if (images.length === 0) return [];

    // Three bands always. Two left a bare stripe across the middle, which read
    // as a rendering fault rather than a design.
    const latitudes = [-17, 0, 17];
    const out = [];
    let index = 0;

    for (const lat of latitudes) {
      // `segments` is the tile count at the equator; higher bands need fewer
      // to keep the same spacing, hence the cosine. Tiles overlap slightly so
      // the dome reads as a continuous wall rather than scattered cards.
      const perRow = Math.max(8, Math.round(segments * Math.cos((lat * Math.PI) / 180)));
      for (let i = 0; i < perRow; i++) {
        const lon = (360 / perRow) * i;
        out.push({
          key: `${lat}-${i}`,
          lat,
          lon,
          image: images[index % images.length],
        });
        index++;
      }
    }
    return out;
  }, [images, segments, maxVerticalRotationDeg]);

  /* Animation loop: inertia while free, gentle drift when idle. */
  useEffect(() => {
    if (reduced) return undefined;

    const damping = Math.max(1.01, 1 + dragDampening / 10);
    const step = () => {
      const s = stateRef.current;

      if (!s.dragging) {
        s.vx /= damping;
        s.vy /= damping;
        if (Math.abs(s.vx) < 0.002) s.vx = 0;
        if (Math.abs(s.vy) < 0.002) s.vy = 0;

        if (autoRotate && !paused && s.vx === 0 && s.vy === 0) s.x += 0.045;
        else s.x += s.vx;
        s.y += s.vy;
      }

      // Vertical travel is clamped; letting it flip past the pole is disorienting.
      const limit = Math.max(0, maxVerticalRotationDeg);
      s.y = Math.min(limit, Math.max(-limit, s.y));

      setRotation({ x: s.x, y: s.y });
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, autoRotate, paused, dragDampening, maxVerticalRotationDeg]);

  const onPointerDown = useCallback((event) => {
    if (reduced) return;
    const s = stateRef.current;
    s.dragging = true;
    s.lastX = event.clientX;
    s.lastY = event.clientY;
    s.vx = 0;
    s.vy = 0;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, [reduced]);

  const onPointerMove = useCallback((event) => {
    const s = stateRef.current;
    if (!s.dragging) return;
    const dx = (event.clientX - s.lastX) * 0.22;
    const dy = (event.clientY - s.lastY) * 0.16;
    s.lastX = event.clientX;
    s.lastY = event.clientY;
    s.x += dx;
    s.y += dy;
    s.vx = dx;
    s.vy = dy;
    const limit = Math.max(0, maxVerticalRotationDeg);
    s.y = Math.min(limit, Math.max(-limit, s.y));
    setRotation({ x: s.x, y: s.y });
  }, [maxVerticalRotationDeg]);

  const endDrag = useCallback((event) => {
    const s = stateRef.current;
    if (!s.dragging) return;
    s.dragging = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }, []);

  const onKeyDown = useCallback((event) => {
    const s = stateRef.current;
    const stepSize = 8;
    if (event.key === 'ArrowLeft')  { s.x -= stepSize; event.preventDefault(); }
    if (event.key === 'ArrowRight') { s.x += stepSize; event.preventDefault(); }
    if (event.key === 'ArrowUp' && maxVerticalRotationDeg)   { s.y -= stepSize; event.preventDefault(); }
    if (event.key === 'ArrowDown' && maxVerticalRotationDeg) { s.y += stepSize; event.preventDefault(); }
    setRotation({ x: s.x, y: s.y });
  }, [maxVerticalRotationDeg]);

  /* Reduced motion: a static, scrollable grid. Same pictures, no rotation. */
  if (reduced) {
    return (
      <ul className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4', className)}>
        {images.slice(0, 12).map((image) => (
          <li key={image.src} className="overflow-hidden rounded-xl border border-white/[0.08]">
            <img
              src={img(image.src)}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className={cn('aspect-square w-full object-cover', grayscale && 'grayscale')}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={frameRef}
      className={cn('relative h-full w-full touch-none select-none overflow-hidden', className)}
      style={{ perspective: `${Math.round(radius * 0.9)}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="group"
      aria-label="Showroom gallery — drag or use arrow keys to rotate"
    >
      <div
        className="absolute left-1/2 top-1/2 h-0 w-0"
        style={{
          transformStyle: 'preserve-3d',
          transform:
            `translate(-50%, -50%) translateZ(${-radius}px) ` +
            `rotateX(${rotation.y}deg) rotateY(${rotation.x}deg)`,
        }}
      >
        {tiles.map((tile) => (
          <div
            key={tile.key}
            className="absolute"
            style={{
              // Place on the sphere, then turn the tile back to face the centre.
              transform:
                `rotateY(${tile.lon}deg) rotateX(${tile.lat}deg) translateZ(${radius}px)`,
              width: 190,
              height: 190,
              marginLeft: -95,
              marginTop: -95,
              backfaceVisibility: 'hidden',
            }}
          >
            <img
              src={img(tile.image.src)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              draggable={false}
              className={cn(
                'h-full w-full rounded-xl border border-white/[0.09] object-cover',
                'shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)]',
                grayscale && 'grayscale',
              )}
            />
          </div>
        ))}
      </div>

      {/* Vignette so tiles dissolve at the rim instead of being clipped. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 58%, rgb(var(--bg) / 0.55) 82%, rgb(var(--bg)) 100%)',
        }}
      />

      {/* The pictures, exposed once to assistive technology. The tiles above
          are aria-hidden because each image appears several times on the dome. */}
      <ul className="sr-only">
        {images.map((image) => <li key={image.src}>{image.alt}</li>)}
      </ul>
    </div>
  );
}

export default DomeGallery;
