/**
 * Dumps the frontend's audited content to JSON for the PHP seeder.
 *
 * Reading the real modules rather than re-typing their contents means the
 * database cannot drift from what the site already renders, and the content
 * audit (docs/18-content-audit.md) keeps applying.
 *
 *   node api/export-data.mjs
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', 'frontend', 'src');

const { products } = await import(join(src, 'data', 'products.js'));
const { categories } = await import(join(src, 'data', 'categories.js'));
const { services } = await import(join(src, 'data', 'services.js'));
const { blogPosts } = await import(join(src, 'data', 'blog.js'));
const content = await import(join(src, 'data', 'content.js'));
const { site } = await import(join(src, 'lib', 'site.js'));

const payload = {
  products: products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    brand: p.brand ?? null,
    summary: p.tagline ?? null,
    description: p.description ?? null,
    // Stays null — NSK publishes no prices. See docs/18-content-audit.md §4.
    price: p.price ?? null,
    image: p.images?.[0] ?? null,
    specs: p.specGroups ?? [],
    features: p.features ?? [],
    featured: Boolean(p.featured),
  })),

  categories: categories.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? c.tagline ?? null,
    image: c.image ?? null,
    sort_order: i,
  })),

  services: services.map((s, i) => ({
    slug: s.slug,
    title: s.title ?? s.name,
    summary: s.tagline ?? s.summary ?? null,
    description: s.description ?? null,
    icon: s.icon ?? null,
    image: s.image ?? null,
    sort_order: i,
  })),

  blog: blogPosts.map((b) => ({
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt ?? null,
    body: typeof b.body === 'string' ? b.body : JSON.stringify(b.body ?? ''),
    category: b.category ?? null,
    // House byline only — invented author names were removed in the audit.
    author_name: b.author?.name ?? 'NSK Computer Zone',
    image: b.image ?? b.cover ?? null,
    read_minutes: b.readMinutes ?? b.readingTime ?? 5,
    published_at: b.publishedAt ?? b.date ?? null,
  })),

  faqs: (content.faqs ?? []).map((f, i) => ({
    question: f.question,
    answer: f.answer,
    category: f.category ?? null,
    sort_order: i,
  })),

  settings: {
    business_name: site.legalName ?? site.name,
    phone: site.contact?.phone ?? '',
    email: site.contact?.email ?? '',
    whatsapp: site.contact?.whatsapp ?? '',
    address: [
      site.address?.line1,
      site.address?.line2,
      site.address?.city,
      site.address?.state,
      site.address?.postalCode,
    ].filter(Boolean).join(', '),
    // Flattened to a display string. Days are deliberately unstated — the
    // source publishes hours only. See docs/18-content-audit.md §2.
    opening_hours: (site.contact?.hours ?? [])
      .map((h) => (h.days && h.days !== 'Opening hours' ? `${h.days}: ${h.time}` : h.time))
      .join('; '),
    founding_year: String(site.foundingYear ?? ''),
    experience_years: String(site.yearsExperience ?? ''),
  },
};

const out = join(here, 'seed-data.json');
writeFileSync(out, JSON.stringify(payload, null, 2), 'utf8');

console.log(
  `wrote ${out}\n` +
  `  products:   ${payload.products.length}\n` +
  `  categories: ${payload.categories.length}\n` +
  `  services:   ${payload.services.length}\n` +
  `  blog:       ${payload.blog.length}\n` +
  `  faqs:       ${payload.faqs.length}`
);
