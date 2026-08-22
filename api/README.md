# NSK Computer Zone — API

Plain PHP on XAMPP. No framework, no Composer dependencies.

## Layout

```
api/
├── index.php          Front controller — all routing
├── config.php         Defaults; override in config.local.php (gitignored)
├── schema.sql         13 tables
├── seed.php           Seeder (CLI only)
├── export-data.mjs    Dumps frontend src/data → seed-data.json
├── lib/
│   ├── bootstrap.php  DB, CORS, JSON, validation, rate limiting, sessions
│   └── assistant.php  AI sales assistant
├── routes/            One file per endpoint
├── uploads/           Admin image uploads (web-readable)
└── storage/           Error log + rate-limit state (never web-readable)
```

## Setup

```bash
mysql -u root nsk_computer_zone < api/schema.sql
node api/export-data.mjs                              # frontend data → JSON
php api/seed.php                                      # content
php api/seed.php --admin-password='…'                 # + admin account
```

`storage/` and `uploads/` must be writable by the web server user (`daemon` on
XAMPP), or requests fail with 503.

## Configuration

Copy real values into `config.local.php` — it overrides `config.php` and is
never committed:

```php
<?php
return [
    'db' => ['user' => 'root', 'pass' => ''],
    'ai' => ['api_key' => 'sk-ant-…'],
];
```

Without an Anthropic key the assistant still works: it degrades to a
human-escalation reply rather than erroring.

## Endpoints

All under `/v1`. Public reads need no auth; everything under `/admin` requires a
session.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | Includes a database probe |
| GET | `/v1/products` | `?category= &brand= &search= &sort= &page=` |
| GET | `/v1/products/{slug}` | With related items |
| GET | `/v1/categories` | Live product counts |
| GET | `/v1/services`, `/v1/services/{slug}` | |
| GET | `/v1/blog`, `/v1/blog/{slug}` | |
| GET | `/v1/faqs`, `/v1/settings`, `/v1/offers` | |
| POST | `/v1/enquiries` | Rate limited 5/min |
| POST | `/v1/newsletter/subscribe` | |
| POST | `/v1/ai/chat`, `/v1/ai/escalate` | Rate limited 20/min per session |
| POST | `/v1/auth/login`, `/v1/auth/logout` | |
| GET | `/v1/auth/me` | |
| GET | `/v1/admin/dashboard` | |
| GET/PATCH/DELETE | `/v1/admin/enquiries[/{id}]` | |
| GET/POST/PUT/DELETE | `/v1/admin/offers[/{id}]` | |
| GET/PUT | `/v1/admin/product-images` | |
| POST | `/v1/admin/upload` | Multipart; 5 MB; MIME sniffed |
| GET/PUT | `/v1/admin/settings` | |

## Design decisions

**Prices are nullable and stay that way.** The business publishes no list
prices. `NULL` renders as "Price on request". Never default to `0` — that
advertises free stock and breaches Google's structured-data policy. Price
sorting puts `NULL` last in *both* directions, and budget filters keep
price-on-request items rather than hiding potential leads.

**Enquiry status transitions are validated server-side** against a fixed map, so
an illegal move returns 422 regardless of which client sent it. `won` is
terminal.

**One administrator account, no roles.** There is a single login and no
user-management UI, so `require_admin()` is the entire authorisation check —
any authenticated caller is the owner. Re-running the seeder with
`--admin-password` updates that account rather than adding a second, which
makes it the password-reset command. Adding staff logins later means restoring
a `role` column and reinstating per-endpoint checks.

**Login failures are indistinguishable.** Wrong username, wrong password and
deactivated account all return the same 401, and `password_verify` runs against
a dummy hash when the user is missing so timing does not leak existence either.

**Uploads trust sniffed MIME, never the filename.** The stored extension is
derived from the sniffed type, so a PHP file renamed `.webp` cannot land in a
web-served directory.

**The AI assistant cannot invent product facts.** `search_products` queries
MySQL directly; the model supplies arguments but never results. Two defects
carried over from the previous Laravel implementation are fixed here: the tool
loop is now multi-turn (results are fed back via `tool_result` so replies are
grounded), and `create_enquiry` / `escalate_to_human` are actually handled
rather than silently ignored. `create_enquiry` refuses to write a row without a
name and at least one contact method, instead of inserting
`unknown@placeholder.invalid`.

**Rate limiting fails loudly.** If the state directory is unwritable the request
returns 503 rather than silently proceeding unlimited.

## Not built

No quotes/PDF, no email delivery, no portfolio or testimonials (deliberately
empty per `docs/18-content-audit.md` §3), no product/blog/category write
endpoints, no user management. The single account is managed via `seed.php`.
