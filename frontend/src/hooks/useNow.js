'use client';

import { useEffect, useState } from 'react';

/**
 * A ticking clock for countdowns and time-gated UI.
 *
 * Returns `null` until the component has mounted. That is the whole point: the
 * server renders at build/ISR time and the browser renders "now", so any
 * component that branches on the current time would otherwise hydrate with a
 * mismatch. Callers render nothing (or a static shell) while this is `null`,
 * then get a real timestamp on the first client frame.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());

    const id = window.setInterval(() => setNow(Date.now()), intervalMs);

    // A backgrounded tab throttles timers to once a minute or worse, so a
    // countdown can return visibly stale. Resync the moment it comes forward.
    const resync = () => document.visibilityState === 'visible' && setNow(Date.now());
    document.addEventListener('visibilitychange', resync);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', resync);
    };
  }, [intervalMs]);

  return now;
}
