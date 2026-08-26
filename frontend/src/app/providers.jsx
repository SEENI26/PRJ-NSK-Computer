import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { SectionProvider } from '@/hooks/useSections';

/**
 * App-wide providers.
 *
 * MotionConfig's `reducedMotion="user"` makes every Framer animation in the
 * tree honour the OS setting automatically, so a component cannot forget to
 * check it (§22).
 *
 * SectionProvider fetches the admin-edited copy once for the whole tree. It
 * never blocks: pages render their compiled text immediately and only swap in
 * an edited string if one comes back.
 */
export function Providers({ children }) {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <SectionProvider>{children}</SectionProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}
