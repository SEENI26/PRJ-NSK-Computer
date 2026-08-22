# 07 — REST API Reference

Base URL: `https://api.nskcomputerzone.in/api/v1`
Auth: **Laravel Sanctum, cookie-based SPA session** (not bearer tokens — the admin
panel is a first-party SPA on the same registrable domain, so cookies are both simpler
and safer than storing a token in JS-reachable storage).

All responses are JSON. Collections are wrapped in `{ "data": [...], "meta": {...} }`;
single resources in `{ "data": {...} }`.

---

## Conventions

| Concern | Convention |
| --- | --- |
| Versioning | Path prefix `/api/v1` |
| Errors | RFC-style `{ "message": "...", "errors": { "field": ["..."] } }` |
| Validation failure | `422` with per-field `errors` |
| Rate limited | `429` with `Retry-After` |
| Auth required | `401`; expired CSRF `419` |
| Forbidden by policy | `403` |
| Pagination | `?page=` + `?per_page=` (max 100); Laravel `meta`/`links` |
| Caching | Public reads `Cache-Control: public, max-age=300`; everything authenticated `no-store, private` |

### Rate limits

| Limiter | Applies to | Limit |
| --- | --- | --- |
| `public-read` | All public GETs | 120/min per IP |
| `submissions` | Enquiries, build requests, newsletter | 5/min **and** 20/hour per IP |
| `ai-chat` | Assistant | 20/min **and** 200/day per session |
| `login` | Auth | 5/min per `email\|IP` |
| `admin` | All admin routes | 300/min per user |

---

## Public — catalogue

### `GET /categories`
Returns the 13 active categories with product counts.

### `GET /categories/{slug}`

### `GET /products`

| Param | Type | Notes |
| --- | --- | --- |
| `category` | string | Category slug |
| `brand` | string | Brand slug |
| `min_price` / `max_price` | int | Rupees |
| `in_stock` | bool | |
| `featured` | bool | |
| `q` | string | FULLTEXT ≥4 chars, LIKE below that |
| `sort` | enum | `featured` (default) · `price-asc` · `price-desc` · `rating` · `newest` |
| `per_page` | int | 1–60, default 24 |

```json
{
  "data": [{
    "id": 1,
    "slug": "apex-rtx-5080-gaming-pc",
    "name": "Apex 5080 Gaming PC",
    "sku": "NSK-APEX-5080",
    "category": "gaming-pcs",
    "brand": "NSK Computer Zone",
    "tagline": "4K ultra at high refresh, built and validated in-house.",
    "price": 285000,
    "compareAtPrice": 312000,
    "stock": "in-stock",
    "featured": true,
    "badge": "Flagship",
    "images": ["products/gaming-pc-apex.webp"],
    "highlights": ["4K 120 fps in current AAA titles with DLSS quality"],
    "rating": { "value": 4.9, "count": 142 },
    "warranty": "3-year onsite (parts & labour)",
    "leadTime": "Ships in 3–5 working days"
  }],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 24, "total": 21 }
}
```

### `GET /products/{slug}`
Adds `specGroups`, `features`, `downloads`, `relatedSlugs`. Increments `view_count`
**after** the response is sent (`dispatch(...)->afterResponse()`) — a read never waits
on a write.

### `GET /products/{slug}/related`
Three products: explicit relations first, backfilled from the same category so the
rail is never short.

### `GET /services` · `GET /services/{slug}`
### `GET /portfolio` · `GET /portfolio/{slug}`
### `GET /blog` · `GET /blog/{slug}`

`?category=` and `?q=` supported on `/blog`. The full `body` is returned only on the
`show` route (`$this->when($request->routeIs('*.show'), ...)`) — index payloads stay small.

### `GET /testimonials` · `GET /faqs` · `GET /brands`
### `GET /settings`
Only rows flagged `is_public` **and** not of type `encrypted`.

---

## Public — submissions

### `POST /enquiries`

`multipart/form-data` when an attachment is present, otherwise JSON.

| Field | Rules |
| --- | --- |
| `name` | required, 2–120 |
| `email` | required, `email:rfc,dns`, ≤180 |
| `phone` | required, 8–32, regex `^[+\d][\d\s()\-]{7,31}$` |
| `company` | nullable, ≤180 |
| `product` / `product_id` | nullable; `product_id` must exist |
| `budget` | nullable, ≤80 |
| `message` | required, 10–4000 |
| `requirements` | nullable, ≤4000 |
| `source` | required — `contact`·`product`·`builder`·`service`·`ai-assistant` |
| `attachment` | nullable, ≤10 MB, `pdf,png,jpg,jpeg,webp,doc,docx,xls,xlsx` |
| `website` | **prohibited** (honeypot) |

**`201`**
```json
{ "data": { "reference": "ENQ-2026-1847",
            "message": "Enquiry received. We will respond within one working day." } }
```

Only the reference is returned. Echoing the full record would leak internal fields
(priority, assignment) to an anonymous caller.

**Side effects:** customer upsert → enquiry → status-history row → attachment →
sales notification (queued) → customer auto-reply (queued) → activity log. Steps 1–4
run in one transaction.

### `POST /build-requests`

```json
{
  "purpose": "gaming",
  "budget": 150000,
  "brand": "amd",
  "performance": "mid",
  "accessories": ["monitor", "ups"],
  "customer": { "name": "...", "phone": "...", "email": "...",
                "company": "...", "location": "...", "notes": "..." },
  "estimate": { "low": 132000, "high": 168000 }
}
```

**`201`**
```json
{ "data": { "reference": "NSK-BUILD-2026-0231",
            "estimate": { "low": 132000, "high": 168000 },
            "message": "Build request received. An engineer will send a written specification within one working day." } }
```

The submitted `estimate` is stored for comparison only. `BuildEstimator` recalculates
server-side and that value is authoritative.

### `POST /newsletter/subscribe` · `GET /newsletter/confirm/{token}` (signed URL)

---

## AI assistant

### `POST /ai/chat`

```json
{ "session_id": "uuid", "message": "Recommend a 1440p rig under ₹1.5L", "page": "/products" }
```

```json
{ "data": {
    "id": "8241", "role": "assistant",
    "content": "For 1440p at high refresh under ₹1.5 lakh …",
    "createdAt": "2026-07-29T09:14:00+05:30",
    "recommendations": [{ "slug": "vanguard-rtx-5070-gaming-pc", "name": "Vanguard 5070",
                          "price": 168000, "image": "products/gaming-pc.webp",
                          "reason": "1440p 165 fps+ in competitive titles" }],
    "quote": null, "escalated": false } }
```

### `POST /ai/escalate`
Forces handoff. Always returns `escalated: true` and notifies sales.

---

## Authentication

| Endpoint | Notes |
| --- | --- |
| `GET /sanctum/csrf-cookie` | Call once before the first mutation |
| `POST /auth/login` | 5/min per email+IP |
| `POST /auth/logout` | Auth required |
| `GET /auth/me` | Current user + role + permissions |
| `POST /auth/forgot-password` · `POST /auth/reset-password` | Throttled |

---

## Admin

All routes: `auth:sanctum` + `verified` + `active.user` + `throttle:admin`, and every
action additionally passes through a Policy.

### Dashboard
| Endpoint | Returns |
| --- | --- |
| `GET /admin/dashboard` | 6 KPI widgets with period-over-period deltas, pipeline counts, SLA breach count. Cached 120s. |
| `GET /admin/dashboard/trends?days=14` | Gap-filled daily series + revenue by category |
| `GET /admin/activity` | Last 30 audit entries |

### Enquiries
| Endpoint | Notes |
| --- | --- |
| `GET /admin/enquiries` | Filters: `status`, `priority`, `source`, `assigned_to`, `overdue`, `from`, `to`, `q`. Sales without `enquiries.view_all` are constrained to their own leads **in the query**, not just the policy. |
| `GET /admin/enquiries/{id}` | Full record with timeline, notes, attachments (signed URLs), quotes |
| `PATCH /admin/enquiries/{id}/status` | Validated against `EnquiryStatus::canTransitionTo()`; illegal moves → `422` |
| `PATCH /admin/enquiries/{id}/assign` | Requires `enquiries.assign` |
| `PATCH /admin/enquiries/{id}/priority` | |
| `POST /admin/enquiries/{id}/notes` | |
| `DELETE /admin/enquiries/{id}` | Soft delete, admin only |
| `GET /admin/enquiries/export` | **Streamed** CSV, chunked 500 rows — a 50k export must not exhaust memory. Requires `enquiries.export`, always audit-logged. |

### Resources
`apiResource` CRUD for `products`, `categories`, `portfolio`, `blog`, `services`,
`testimonials`, `faqs`, `quotes`, `users`. Each controller calls `authorizeResource()`,
so `index/show/store/update/destroy` map onto the matching Policy automatically.

Extras: `POST /admin/quotes/{id}/send` · `GET /admin/quotes/{id}/pdf` ·
`POST /admin/media` · `DELETE /admin/media/{id}` ·
`GET /admin/ai/conversations[/{id}]` ·
`GET|PUT /admin/settings` · `POST /admin/settings/test-mail` · `GET /admin/audit-log`

---

## Health

`GET /health` → `{ "status": "ok", "time": "...", "version": "1.0.0" }`
Used by the Nginx upstream probe and external uptime monitoring.

---

## Client integration

`frontend/src/lib/api.ts` wraps all of this:

- `credentials: 'include'` on every request, `X-XSRF-TOKEN` echoed on mutations
- Laravel's `{ data: ... }` envelope unwrapped automatically
- `422` payloads surfaced as a typed `ApiError` with `.fieldErrors()` for direct form mapping
- `revalidate` maps onto the Next.js Data Cache — reads are ISR-cached, writes are `no-store`
- `withFallback()` lets a public page render from local content when the API is cold
