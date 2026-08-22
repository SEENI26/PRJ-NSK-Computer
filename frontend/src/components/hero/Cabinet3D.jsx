import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { AnimatedCabinet } from './AnimatedCabinet';

/**
 * The real three.js viewer, embedded.
 *
 * `public/3d/{workstation,cabinet}.html` are the standalone viewers, mounted in
 * an iframe rather than ported to react-three-fiber. That is deliberate: the
 * scene is several hundred lines of imperative geometry that already works,
 * and an iframe keeps three.js out of the app bundle entirely — it is fetched
 * only when this component mounts, by a document that owns its own lifecycle.
 *
 * Until the frame reports load, the CSS cabinet stands in, so the hero never
 * shows an empty box while three.js downloads.
 *
 * The viewer honours prefers-reduced-motion itself (it drops `autorotate`),
 * but we skip the embed entirely under reduced motion — a WebGL canvas running
 * a render loop is exactly what that setting is asking us not to start.
 */
const MODELS = {
  workstation: { file: 'workstation.html', label: 'Anvil workstation and display — interactive 3D model' },
  cabinet:     { file: 'cabinet.html',     label: 'Rift mid-tower cabinet — interactive 3D model' },
};

/**
 * Can this browser actually create a WebGL context?
 *
 * Checked before embedding rather than after: the iframe's load event fires
 * even when the viewer inside failed to get a context, so waiting for onLoad
 * would leave an error message sitting in the hero.
 */
function hasWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    // Release it immediately — contexts are a limited resource.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function Cabinet3D({
  model = 'workstation',
  /** Matches the page ground so the viewer blends instead of sitting on a slab. */
  background = '080808',
  fallbackMode = 'gaming',
  className,
}) {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [webgl, setWebgl] = useState(null); // null = not yet checked
  const timeoutRef = useRef(0);

  // Probed after mount so the first render is identical everywhere.
  useEffect(() => { setWebgl(hasWebGL()); }, []);

  const { file, label } = MODELS[model] ?? MODELS.workstation;

  useEffect(() => {
    if (reduced) return undefined;
    // three.js comes from a CDN. If it cannot be reached the iframe may sit
    // blank forever, so fall back rather than show an empty frame.
    timeoutRef.current = window.setTimeout(() => {
      setLoaded((isLoaded) => {
        if (!isLoaded) setFailed(true);
        return isLoaded;
      });
    }, 9000);
    return () => window.clearTimeout(timeoutRef.current);
  }, [reduced]);

  // No WebGL (or still probing, or reduced motion, or the frame timed out):
  // the CSS cabinet is the answer, not an error message in the hero.
  if (reduced || failed || webgl === false) {
    return <AnimatedCabinet mode={fallbackMode} className={className} scrollParallax={false} />;
  }
  if (webgl === null) {
    return <AnimatedCabinet mode={fallbackMode} className={className} scrollParallax={false} />;
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Placeholder, cross-faded out once the real model paints. */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <AnimatedCabinet mode={fallbackMode} scrollParallax={false} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[5/4] w-full max-w-[620px] mx-auto"
      >
        <iframe
          src={`/3d/${file}?embed&bg=${background}`}
          title={label}
          // Above the fold, so eager. The document is tiny; three.js is what
          // takes the time, and deferring that only delays the reveal.
          className="h-full w-full border-0"
          style={{ background: 'transparent' }}
          onLoad={() => setLoaded(true)}
        />
      </motion.div>
    </div>
  );
}
