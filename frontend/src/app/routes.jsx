import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/layout';
import { ROUTES } from '@/utils/constants';

/**
 * Route table.
 *
 * Pages are code-split (§20) so the first load ships the home page and the
 * shell, not all six. The fallback is a fixed-height block rather than a
 * spinner — it holds the layout still instead of flashing.
 */
const Home           = lazy(() => import('@/pages/Home'));
const GamingPC       = lazy(() => import('@/pages/GamingPC'));
const ProfessionalPC = lazy(() => import('@/pages/ProfessionalPC'));
const Hardware       = lazy(() => import('@/pages/Hardware'));
const Accessories    = lazy(() => import('@/pages/Accessories'));
const Services       = lazy(() => import('@/pages/Services'));
const AboutContact   = lazy(() => import('@/pages/AboutContact'));
const NotFound       = lazy(() => import('@/pages/NotFound'));

const PAGES = [
  { path: ROUTES.home,         Component: Home },
  { path: ROUTES.gaming,       Component: GamingPC },
  { path: ROUTES.professional, Component: ProfessionalPC },
  { path: ROUTES.hardware,     Component: Hardware },
  { path: ROUTES.accessories,  Component: Accessories },
  { path: ROUTES.services,     Component: Services },
  { path: ROUTES.about,        Component: AboutContact },
];

/**
 * Space held while a route's chunk downloads.
 *
 * The height is not cosmetic. At 70vh the footer landed *inside* the first
 * viewport, then dropped away the moment the real page mounted — a visible
 * jump worth 0.158 CLS on every desktop page, well past Google's 0.1 budget.
 *
 * Layout shift is only counted for elements in view, and every real page here
 * is several screens tall, so reserving more than one screen puts the footer
 * below the fold for the whole of the load. It moves further down afterwards,
 * but it was never on screen to be seen moving.
 */
function RouteFallback() {
  return <div className="min-h-[140vh]" aria-hidden="true" />;
}

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          {PAGES.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<PageTransition><Component /></PageTransition>}
            />
          ))}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
