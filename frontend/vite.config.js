import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 3100,
    strictPort: true,
    // The contact form posts to the PHP API. Proxying keeps it same-origin in
    // development, so there is no CORS to configure.
    /*
     * The PHP API is served by XAMPP's Apache out of htdocs, so its real path
     * contains the project folder — and a space. Proxying keeps the browser on
     * one origin, which matters for two reasons beyond tidiness: percent-
     * encoding that space in every fetch is error-prone, and the admin session
     * cookie travels without any SameSite negotiation when it is same-origin.
     */
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '/NKS computers Website/api'),
      },
      // Uploaded images are written beside the API, not into public/.
      '/uploads': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/uploads/, '/NKS computers Website/api/uploads'),
      },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Keep React and the animation runtime in their own chunks so a page
        // change never re-downloads them. Rolldown (Vite 8) requires the
        // function form — the object form is Rollup-only.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return 'react';
          }
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'motion';
          }
          return undefined;
        },
      },
    },
  },
});
