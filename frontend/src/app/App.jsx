import { Navbar, Footer } from '@/components/layout';
import { AppRoutes } from './routes';

export function App() {
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
