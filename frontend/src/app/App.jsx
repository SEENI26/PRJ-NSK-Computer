import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { AppRoutes } from './routes';

const AdminRoute = lazy(() => import('@/pages/admin/AdminRoute'));

/**
 * The public site, plus the admin panel mounted beside it.
 *
 * Admin sits outside the site chrome deliberately — it has no navbar, footer
 * or page transition, and lazily loading it keeps the editor out of the bundle
 * a normal visitor downloads.
 */
function PublicSite() {
  return (
    <>
      <Navbar />
      {/* Target of the skip link */}
      <main id="main">
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
}

export function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={<Suspense fallback={null}><AdminRoute /></Suspense>}
      />
      <Route path="*" element={<PublicSite />} />
    </Routes>
  );
}
