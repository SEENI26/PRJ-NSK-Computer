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
const AboutContact   = lazy(() => import('@/pages/AboutContact'));
const NotFound       = lazy(() => import('@/pages/NotFound'));

const PAGES = [
  { path: ROUTES.home,         Component: Home },
  { path: ROUTES.gaming,       Component: GamingPC },
  { path: ROUTES.professional, Component: ProfessionalPC },
  { path: ROUTES.hardware,     Component: Hardware },
  { path: ROUTES.accessories,  Component: Accessories },
  { path: ROUTES.about,        Component: AboutContact },
];

function RouteFallback() {
  return <div className="min-h-[70vh]" aria-hidden="true" />;
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
