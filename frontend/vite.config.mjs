import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Shims that let components keep their `next/*` imports while running
      // under Vite. See src/next-compat/.
      'next/link': path.resolve(dir, './src/next-compat/link.jsx'),
      'next/image': path.resolve(dir, './src/next-compat/image.jsx'),
      'next/navigation': path.resolve(dir, './src/next-compat/navigation.jsx'),
      'next/font/google': path.resolve(dir, './src/next-compat/font.jsx'),
      '@/lib/content-store': path.resolve(dir, './src/next-compat/content-store.js'),
      '@': path.resolve(dir, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.json'],
  },
  /*
   * Proxy /api to XAMPP rather than calling it cross-origin.
   *
   * Two problems disappear by doing this: the API's htdocs path contains
   * spaces (percent-encoding that in a browser fetch is error-prone), and
   * same-origin requests need no CORS negotiation, so the PHP session cookie
   * travels without SameSite friction.
   */
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '/NKS computers Website/api'),
      },
      '/uploads': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/uploads/, '/NKS computers Website/api/uploads'),
      },
    },
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Inherited naming from the Next.js original; kept so component code
    // needn't change. Relative by default, so the proxy above resolves it.
    'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL || '/api'),
    'process.env.NEXT_PUBLIC_IMAGE_CDN': JSON.stringify(process.env.NEXT_PUBLIC_IMAGE_CDN || ''),
  },
});
