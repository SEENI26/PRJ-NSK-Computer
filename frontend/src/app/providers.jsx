import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';

/**
 * App-wide providers.
 *
 * MotionConfig's `reducedMotion="user"` makes every Framer animation in the
 * tree honour the OS setting automatically, so a component cannot forget to
 * check it (§22).
 */
export function Providers({ children }) {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </BrowserRouter>
  );
}
