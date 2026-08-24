/**
 * Generates public/robots.txt and public/sitemap.xml.
 *
 *   node scripts/build-seo.mjs
 *
 * Runs as part of `npm run build` so the sitemap is derived from the router's
 * own route table rather than maintained by hand. A hand-written sitemap drifts
 * the first time a route is renamed, and nothing in the build would notice.
 *
 * The origin comes from VITE_SITE_URL when set, so a staging deploy does not
 * publish a sitemap pointing at production.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://www.nskcomputerzone.com').replace(/\/+$/, '');

/* Read the route table as text — importing it would drag in the '@/' alias
   that only Vite resolves. */
const constants = readFileSync(join(root, 'src', 'utils', 'constants.js'), 'utf8');
const table = constants.match(/export const ROUTES = \{([\s\S]*?)\};/)?.[1] ?? '';
const paths = [...table.matchAll(/:\s*'([^']+)'/g)].map((m) => m[1]);

if (paths.length === 0) {
  console.error('build-seo: no routes found in src/utils/constants.js — refusing to write an empty sitemap');
  process.exit(1);
}

/* The home page is the entry point; everything else is one step in. Weighting
   the two PC pages above the rest reflects what the business actually sells. */
const PRIORITY = { '/': '1.0', '/gaming-pcs': '0.9', '/professional-pcs': '0.9' };
const lastmod = new Date().toISOString().slice(0, 10);

const urls = paths
  .map((path) => [
    '  <url>',
    `    <loc>${SITE_URL}${path === '/' ? '/' : path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    `    <priority>${PRIORITY[path] ?? '0.8'}</priority>`,
    '  </url>',
  ].join('\n'))
  .join('\n');

writeFileSync(
  join(publicDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

writeFileSync(
  join(publicDir, 'robots.txt'),
  [
    '# NSK Computer Zone — showcase site, everything is public.',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n'),
);

console.log(`build-seo: wrote sitemap.xml (${paths.length} routes) and robots.txt for ${SITE_URL}`);
