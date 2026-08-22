# 06 — Database Schema

MySQL 8, InnoDB, `utf8mb4_unicode_ci`. Four migrations, 32 tables.
Money is stored as **unsigned integer rupees** — never float, never decimal.

Migration files:
- `2026_01_01_000100_create_identity_tables.php`
- `2026_01_01_000200_create_catalogue_tables.php`
- `2026_01_01_000300_create_crm_tables.php`
- `2026_01_01_000400_create_content_tables.php`
- `2026_01_01_000500_create_platform_tables.php`

---

## Entity relationship overview

```
                     ┌────────────┐
                     │   roles    │
                     └─────┬──────┘
              ┌────────────┼──────────────┐
              ▼            ▼              ▼
   ┌──────────────┐  ┌──────────┐  ┌──────────────────┐
   │ permission_  │  │  users   │  │ (role.level)     │
   │    role      │  └────┬─────┘  └──────────────────┘
   └──────────────┘       │
                          │ assigned_to / author_id / created_by
                          ▼
 ┌───────────┐      ┌───────────┐      ┌──────────────┐
 │ customers │─────▶│ enquiries │─────▶│    quotes    │
 └─────┬─────┘      └─────┬─────┘      └──────┬───────┘
       │                  │                    ▼
       │                  │             ┌──────────────┐
       │                  │             │ quote_items  │──▶ products
       │                  │             └──────────────┘
       │                  ├──▶ enquiry_status_history
       │                  ├──▶ enquiry_notes
       │                  └──▶ attachments (morph)
       │
       ├──▶ build_requests ──▶ enquiries
       └──▶ ai_conversations ──▶ chat_history
                     └──▶ enquiries

 ┌──────────┐    ┌────────────┐    ┌─────────────────────────┐
 │  brands  │───▶│  products  │◀───│      categories         │
 └──────────┘    └─────┬──────┘    └─────────────────────────┘
                       ├──▶ product_images
                       ├──▶ product_specifications
                       ├──▶ product_features
                       ├──▶ product_downloads
                       └──▶ product_related (self M:N)

 ┌────────────────────┐   ┌─────────────┐   ┌──────────────┐
 │ portfolio_projects │   │ blog_posts  │   │   services   │
 └─────────┬──────────┘   └──────┬──────┘   └──────────────┘
           ├──▶ portfolio_images │
           └──────────┬──────────┘
                      ▼
                 ┌─────────┐
                 │taggables│──▶ tags       (polymorphic, shared vocabulary)
                 └─────────┘
```

---

## Table reference

### Identity & access

| Table | Purpose | Key columns |
| --- | --- | --- |
| `roles` | admin / sales / marketing / technician | `name` uq, `level` (lower = more privileged) |
| `permissions` | Atomic capabilities | `name` uq, `group` idx |
| `permission_role` | RBAC matrix | composite PK |
| `users` | Staff accounts | `email` uq, `role_id` FK restrict, soft deletes |
| `password_reset_tokens` · `sessions` · `personal_access_tokens` | Laravel / Sanctum | — |

Roles use `restrictOnDelete` — deleting a role that still has users must fail loudly
rather than silently orphan accounts into a null role.

### Catalogue

| Table | Purpose | Notes |
| --- | --- | --- |
| `brands` | Manufacturers | `is_partner` drives the home marquee |
| `categories` | Self-referencing tree | `group` = Systems / Components / Peripherals |
| `products` | Core catalogue | FULLTEXT on `(name, tagline, description)` |
| `product_images` | Gallery | `is_primary`, `sort_order` |
| `product_specifications` | **Queryable** specs | `(product_id, group, sort_order)` idx |
| `product_features` | Marketing feature tiles | — |
| `product_downloads` | Datasheets, drivers | `download_count` |
| `product_related` | Self M:N | composite PK |

**Why specifications are a table, not a JSON column.** "Show me every motherboard with
five M.2 slots" has to be a `WHERE` clause. A JSON blob forces that filter into the
application layer, which stops scaling the moment the catalogue passes a few hundred SKUs.

**`cost_price` is on the model's `$hidden` array.** It exists for margin reporting and
must never reach a client response.

### CRM

| Table | Purpose | Notes |
| --- | --- | --- |
| `customers` | De-duplicated people | unique `(email, phone)` |
| `enquiries` | Every lead | `reference` uq, denormalised contact snapshot |
| `enquiry_status_history` | Append-only timeline | no `updated_at` by design |
| `enquiry_notes` | Internal + customer-visible notes | `is_internal` |
| `build_requests` | PC Builder configurations | stores both client and server estimates |
| `quotes` | Quotations | `status` idx, soft deletes |
| `quote_items` | Line items | `line_total` recomputed on save |

**Contact details are duplicated onto `enquiries` deliberately.** The linked `customer`
record may be corrected or merged later; the enquiry must preserve exactly what was
submitted at the time. This is an audit requirement, not a normalisation failure.

**`enquiry_status_history` is append-only** — no `updated_at`, no updates in the model.
Reconstructing pipeline history from a general audit log is unreliable, so it is
first-class data.

**Both estimates are stored on `build_requests`.** `estimate_low/high` is what the
customer saw (user-controllable, advisory); `server_estimate_low/high` is computed by
`BuildEstimator` and is authoritative. Storing both lets sales see any discrepancy.

### Content

| Table | Purpose |
| --- | --- |
| `services` | 8 service lines; `deliverables` and `process` as JSON |
| `portfolio_projects` | Case studies with `stats` JSON, before/after paths |
| `portfolio_images` | Gallery |
| `tags` + `taggables` | Polymorphic vocabulary shared by posts and projects |
| `blog_categories` · `blog_posts` | Editorial; `body` is a structured `ArticleBlock[]` |
| `testimonials` | Optionally linked to a project |
| `faqs` | Categorised, ordered |
| `newsletter_subscribers` | Double opt-in via `confirmation_token` |

JSON is used for `deliverables`, `process`, `stats` and `body` because these are
**presentational sequences that are always read whole and never queried into**. That is
the correct use of a JSON column, and the opposite of the specifications case above.

### Platform

| Table | Purpose | Notes |
| --- | --- | --- |
| `ai_conversations` | Assistant sessions | `session_id` uuid uq, token accounting |
| `chat_history` | Transcript | append-only, structured `recommendations` / `quote_payload` |
| `attachments` | Polymorphic files | `checksum` sha256 for de-duplication |
| `website_settings` | Key–value config | `(group, key)` uq, `type` incl. `encrypted` |
| `notifications` | Laravel notifications | unread composite index |
| `activity_logs` | Audit trail | diff-only `old_values` / `new_values` |
| `page_views` | First-party analytics | `session_hash` — salted, not an identifier |
| `cache` · `cache_locks` · `jobs` · `failed_jobs` | Framework infrastructure | — |

**`website_settings.type = 'encrypted'`** transparently encrypts on save via a model
hook and decrypts in `typedValue()`. SMTP passwords and API keys never sit in plaintext.
`publicSettings()` additionally excludes every encrypted row, so a misconfigured
`is_public` flag still cannot leak a credential.

**`activity_logs` stores diffs, not row dumps.** Logging entire records on every write
would bloat the table and duplicate PII across thousands of rows.

**`page_views.session_hash` is a salted hash**, not a visitor ID. Analytics work; the
table is not a tracking database.

---

## Indexing strategy

Indexes exist to serve specific queries. Each one below has a caller:

| Index | Serves |
| --- | --- |
| `products (is_active, is_featured)` | Home featured rail |
| `products (category_id, is_active, price)` | Category listing + price filter + sort in one index |
| `products FULLTEXT (name, tagline, description)` | Catalogue search |
| `enquiries (status, created_at)` | Admin pipeline, default sort |
| `enquiries (assigned_to, status)` | "My open leads" for sales staff |
| `enquiry_status_history (enquiry_id, created_at)` | Timeline render |
| `blog_posts (status, published_at)` | Published-post listing |
| `chat_history (ai_conversation_id, created_at)` | Transcript replay |
| `page_views (path, created_at)` | Per-page analytics rollups |

Search falls back to `LIKE` for terms shorter than four characters, because MySQL's
default `ft_min_word_len` makes FULLTEXT silently return nothing for short tokens —
a genuinely confusing failure for a user typing "RAM".

---

## Data integrity rules

1. **`restrictOnDelete`** on `products.category_id`, `products.brand_id`, `quotes.customer_id`, `users.role_id` — deleting a referenced parent must fail, not cascade into data loss.
2. **`nullOnDelete`** on `enquiries.assigned_to` — a departing employee must not delete their leads.
3. **`cascadeOnDelete`** only on true children (images, specifications, quote items, chat messages).
4. **Soft deletes** on every business record (`users`, `products`, `enquiries`, `quotes`, `blog_posts`, `portfolio_projects`, `services`, `customers`). Leads are never truly removed.
5. **Derived values are computed, never trusted:** `quote_items.line_total` in a `saving` hook, `quotes.total` in `recalculate()`, `products.discount_percent` as an accessor.

---

## Backup & retention

| Data | Strategy |
| --- | --- |
| MySQL | Nightly logical dump + binlog for point-in-time recovery; 30-day retention |
| R2 media | Versioned bucket, lifecycle to infrequent access at 90 days |
| `activity_logs` | Retained 24 months, then archived to cold storage |
| `page_views` | Aggregated monthly, raw rows pruned at 90 days |
| `chat_history` | Retained 12 months; PII scrubbed on request |
