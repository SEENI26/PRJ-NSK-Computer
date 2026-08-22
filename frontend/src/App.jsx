import React, { useState, useEffect, } from 'react';
import { BrowserRouter, Routes, Route, useParams, useSearchParams } from 'react-router-dom';

// Layouts
import SiteLayout from './app/(site)/layout';
import AdminLayout from './app/(admin)/layout';
import NotFoundPage from './app/(site)/not-found';

// Pages - Public (Site)
import HomePage from './app/(site)/page';
import AboutPage from './app/(site)/about/page';
import ContactPage from './app/(site)/contact/page';
import GalleryPage from './app/(site)/gallery/page';
import GamingPage from './app/(site)/gaming/page';
import BusinessPage from './app/(site)/business/page';
import BlogPage from './app/(site)/blog/page';
import BlogPostPage from './app/(site)/blog/[slug]/page';
import ProductsPage from './app/(site)/products/page';
import ProductDetailPage from './app/(site)/products/[slug]/page';
import ServicesPage from './app/(site)/services/page';
import ServiceDetailPage from './app/(site)/services/[slug]/page';
import BuildPage from './app/(site)/build/page';

// Pages - Admin
import AdminDashboard from './app/(admin)/admin/page';
import AdminBlogPage from './app/(admin)/admin/blog/page';
import AdminEnquiriesPage from './app/(admin)/admin/enquiries/page';
import AdminOffersPage from './app/(admin)/admin/offers/page';
import AdminProductImagesPage from './app/(admin)/admin/product-images/page';
import AdminProductsPage from './app/(admin)/admin/products/page';
import AdminQuotesPage from './app/(admin)/admin/quotes/page';
import AdminSettingsPage from './app/(admin)/admin/settings/page';

// Next.js page compatibility router wrapper for async pages
function AsyncPageWrapper({ Component, getProps }) {
  const [rendered, setRendered] = useState(null);
  const [error, setError] = useState(null);
  const props = getProps ? getProps() : {};
  const propsString = JSON.stringify(props);
  useEffect(() => {
    let active = true;
    Component(props)
      .then((node) => {
        if (active) setRendered(node);
      })
      .catch((err) => {
        if (active) setError(err);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Component, propsString]);

  if (error) {
    if (error.message === '404 Not Found') {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-display-lg text-ink font-bold">404</h1>
          <p className="mt-4 text-lg text-ink-subtle">The requested resource could not be found.</p>
        </div>
      );
    }
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-display-sm text-danger font-bold">Error loading page</h1>
        <p className="mt-4 text-ink-subtle">{error.message || 'Something went wrong.'}</p>
      </div>
    );
  }

  if (!rendered) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="text-[13px] font-medium text-ink-faint">Loading catalog...</span>
        </div>
      </div>
    );
  }

  return <>{rendered}</>;
}

// Route parameters adapter wrappers
function BlogPostPageWrapper() {
  const { slug } = useParams();
  const promiseParams = Promise.resolve({ slug: slug || '' });
  return <AsyncPageWrapper Component={BlogPostPage} getProps={() => ({ params: promiseParams })} />;
}

function ProductsPageWrapper() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const promiseSearchParams = Promise.resolve(params);
  return <AsyncPageWrapper Component={ProductsPage} getProps={() => ({ searchParams: promiseSearchParams })} />;
}

function ProductDetailPageWrapper() {
  const { slug } = useParams();
  const promiseParams = Promise.resolve({ slug: slug || '' });
  return <AsyncPageWrapper Component={ProductDetailPage} getProps={() => ({ params: promiseParams })} />;
}

function ServiceDetailPageWrapper() {
  const { slug } = useParams();
  const promiseParams = Promise.resolve({ slug: slug || '' });
  return <AsyncPageWrapper Component={ServiceDetailPage} getProps={() => ({ params: promiseParams })} />;
}

function AdminOffersPageWrapper() {
  return <AsyncPageWrapper Component={AdminOffersPage} />;
}

function AdminProductsPageWrapper() {
  return <AsyncPageWrapper Component={AdminProductsPage} />;
}

function AdminProductImagesPageWrapper() {
  return <AsyncPageWrapper Component={AdminProductImagesPage} />;
}

// Scroll restoration to top on route change
function ScrollToTop() {
  const pathname = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener('popstate', callback);
      return () => window.removeEventListener('popstate', callback);
    },
    () => window.location.pathname
  ) || window.location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Site Routes */}
        <Route
          path="/"
          element={
            <SiteLayout>
              <HomePage />
            </SiteLayout>
          }
        />
        <Route
          path="/about"
          element={
            <SiteLayout>
              <AboutPage />
            </SiteLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <SiteLayout>
              <ContactPage />
            </SiteLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <SiteLayout>
              <GalleryPage />
            </SiteLayout>
          }
        />
        <Route
          path="/gaming"
          element={
            <SiteLayout>
              <GamingPage />
            </SiteLayout>
          }
        />
        <Route
          path="/business"
          element={
            <SiteLayout>
              <BusinessPage />
            </SiteLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <SiteLayout>
              <BlogPage />
            </SiteLayout>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <SiteLayout>
              <BlogPostPageWrapper />
            </SiteLayout>
          }
        />
        <Route
          path="/products"
          element={
            <SiteLayout>
              <ProductsPageWrapper />
            </SiteLayout>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <SiteLayout>
              <ProductDetailPageWrapper />
            </SiteLayout>
          }
        />
        <Route
          path="/services"
          element={
            <SiteLayout>
              <ServicesPage />
            </SiteLayout>
          }
        />
        <Route
          path="/services/:slug"
          element={
            <SiteLayout>
              <ServiceDetailPageWrapper />
            </SiteLayout>
          }
        />
        <Route
          path="/build"
          element={
            <SiteLayout>
              <BuildPage />
            </SiteLayout>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <AdminLayout>
              <AdminBlogPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/enquiries"
          element={
            <AdminLayout>
              <AdminEnquiriesPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/offers"
          element={
            <AdminLayout>
              <AdminOffersPageWrapper />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/product-images"
          element={
            <AdminLayout>
              <AdminProductImagesPageWrapper />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <AdminProductsPageWrapper />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/quotes"
          element={
            <AdminLayout>
              <AdminQuotesPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <AdminSettingsPage />
            </AdminLayout>
          }
        />

        {/*
          Catch-all. Under Next.js, not-found.jsx was picked up by file
          convention; React Router needs it declared, without which every
          unknown URL — including removed admin routes — rendered a blank page.
        */}
        <Route
          path="*"
          element={
            <SiteLayout>
              <NotFoundPage />
            </SiteLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
