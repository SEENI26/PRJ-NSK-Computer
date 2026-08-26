import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '@/components/admin/AdminAuth';

const AdminLogin = lazy(() => import('./AdminLogin'));
const AdminSections = lazy(() => import('./AdminSections'));

/**
 * The admin entry point.
 *
 * The gate here is a convenience, not the security boundary — every admin
 * endpoint calls `require_admin()` for itself, so hiding the UI is only about
 * not showing a form that would fail. Anyone who bypasses this screen still
 * gets a 401 from the API.
 *
 * Lazily loaded and kept out of the public bundle: a visitor who never opens
 * /admin never downloads the editor.
 */
function AdminGate() {
  const { user, checking } = useAdminAuth();

  if (checking) {
    return (
      <main className="grid min-h-[100dvh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden="true" />
        <span className="sr-only">Checking your session</span>
      </main>
    );
  }

  return user ? <AdminSections /> : <AdminLogin />;
}

export default function AdminRoute() {
  return (
    <AdminAuthProvider>
      <Suspense
        fallback={
          <main className="grid min-h-[100dvh] place-items-center">
            <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden="true" />
          </main>
        }
      >
        <AdminGate />
      </Suspense>
    </AdminAuthProvider>
  );
}
