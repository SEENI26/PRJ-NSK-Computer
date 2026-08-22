# 16 — Security Checklist

Status key: **✅ implemented** · **⚙️ configure at deploy** · **📋 operational process**

---

## 1. Injection & input handling

| Control | Status | Where |
| --- | --- | --- |
| SQL injection — all queries through Eloquent/query builder with bindings | ✅ | No raw interpolation anywhere; `selectRaw` uses only literal column lists |
| `LIKE` wildcards escaped in user search terms | ✅ | `Enquiry::scopeSearch()`, `Product::scopeSearch()` |
| Mass assignment | ✅ | Explicit `$fillable` on every model; `preventSilentlyDiscardingAttributes()` outside production |
| Server-side validation on every write | ✅ | `StoreEnquiryRequest`, `StoreBuildRequestRequest`, `ChatRequest`, inline `validate()` on admin routes |
| Email DNS validation | ✅ | `email:rfc,dns` — rejects typo'd and non-routable domains |
| Phone format validation | ✅ | Regex on both client and server |
| Enum values constrained | ✅ | `Rule::in(EnquiryStatus::values())` etc. |
| File upload restricted by MIME **and** size | ✅ | 10 MB, `pdf,png,jpg,jpeg,webp,doc,docx,xls,xlsx` |
| Uploads stored outside the web root, served via signed URLs | ✅ | R2 + `Attachment::temporaryUrl()` (10 min) |
| Upload checksums for de-duplication | ✅ | sha256 in `attachments.checksum` |
| Honeypot field | ✅ | `website` field marked `prohibited` |

---

## 2. XSS & content injection

| Control | Status | Notes |
| --- | --- | --- |
| React auto-escaping | ✅ | Only one `dangerouslySetInnerHTML` in the codebase |
| JSON-LD escaped | ✅ | `JsonLd` replaces `<` with `<` before injecting — a CMS string cannot break out of the script tag |
| Content Security Policy | ✅ | `next.config.ts`; `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'` |
| `X-Content-Type-Options: nosniff` | ✅ | Frontend headers + `SecurityHeaders` middleware |
| `X-Frame-Options: DENY` | ✅ | Both layers |
| External links `rel="noopener noreferrer"` | ✅ | Enforced in `Button` and all raw anchors |
| No `eval` in production | ✅ | `unsafe-eval` only added when `NODE_ENV === 'development'` |

> **Known CSP limitation.** `style-src` includes `'unsafe-inline'` because Tailwind and
> Framer Motion both emit inline styles. Removing it requires a nonce-based style
> pipeline; that is a deliberate, documented trade-off rather than an oversight.

---

## 3. CSRF & session

| Control | Status |
| --- | --- |
| Sanctum SPA cookie auth (no token in `localStorage`) | ✅ |
| `XSRF-TOKEN` cookie echoed as `X-XSRF-TOKEN` on mutations | ✅ `lib/api.ts` |
| `SameSite=Lax` session cookie | ⚙️ `SESSION_SAME_SITE=lax` |
| `Secure` cookie flag | ⚙️ `SESSION_SECURE_COOKIE=true` |
| `HttpOnly` session cookie | ✅ Laravel default |
| Cookie domain scoped | ⚙️ `SESSION_DOMAIN=.nskcomputerzone.in` |
| `SANCTUM_STATEFUL_DOMAINS` restricted to owned hosts | ⚙️ |
| Session in Redis, not files | ⚙️ `SESSION_DRIVER=redis` |
| Session lifetime 120 min | ⚙️ |

---

## 4. Authentication

| Control | Status |
| --- | --- |
| Bcrypt hashing via `'password' => 'hashed'` cast | ✅ |
| Login throttled 5/min per `email\|IP` | ✅ `RateLimiter::for('login')` |
| Email verification required for admin (`verified` middleware) | ✅ |
| Deactivation takes effect immediately | ✅ `EnsureUserIsActive` revokes tokens and logs out mid-session |
| Seeder refuses to run without `ADMIN_PASSWORD` | ✅ Throws rather than seeding a known default |
| Last admin cannot be deleted | ✅ `UserPolicy::delete()` |
| Self-deletion blocked | ✅ `UserPolicy::delete()` |
| Password reset tokens single-use and expiring | ✅ Laravel default |
| 2FA for admin accounts | 📋 Recommended before go-live |

---

## 5. Authorisation

| Control | Status |
| --- | --- |
| Explicit RBAC (roles → permissions → users) | ✅ Seeded matrix, 4 roles, 22 permissions |
| Policy per resource, wired via `authorizeResource()` | ✅ `EnquiryPolicy`, `ProductPolicy`, `UserPolicy` |
| Row-level scoping applied **in the query**, not only the policy | ✅ Sales see only assigned leads — a per-record policy alone does not stop a list endpoint leaking |
| Export gated by its own permission and audited | ✅ `enquiries.export` |
| Status transitions validated in the domain layer | ✅ `EnquiryStatus::canTransitionTo()` |
| `cost_price` hidden from all API responses | ✅ Model `$hidden` |
| `ip_address` / `user_agent` hidden from API responses | ✅ Model `$hidden` |
| Admin routes not indexed | ✅ `robots.ts` + `noindex` metadata on the admin layout |

---

## 6. Rate limiting & abuse

| Surface | Limit | Status |
| --- | --- | --- |
| Public reads | 120/min per IP | ✅ |
| Form submissions | 5/min **and** 20/hour per IP | ✅ |
| AI chat | 20/min **and** 200/day per session | ✅ |
| Login | 5/min per email+IP | ✅ |
| Admin API | 300/min per user | ✅ |
| Cloudflare WAF + bot management | ⚙️ Enable managed OWASP ruleset |
| Cloudflare rate limiting on `/api/*` | ⚙️ Second layer at the edge |

---

## 7. Secrets & configuration

| Control | Status |
| --- | --- |
| No secrets in the repository | ✅ `.env.example` has empty values only |
| SMTP passwords and API keys encrypted at rest in `website_settings` | ✅ `type: encrypted` + `Crypt` on save |
| Encrypted settings excluded from `publicSettings()` | ✅ Belt and braces against a bad `is_public` flag |
| Password fields never returned by the settings API | ✅ |
| `APP_DEBUG=false` in production | ⚙️ |
| `APP_KEY` generated per environment | ⚙️ |
| Deploy-time secrets from the CI secret store, not files | 📋 |
| Key rotation schedule | 📋 Quarterly |

---

## 8. Transport & headers

| Header | Value | Status |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ |
| `Content-Security-Policy` | See §2 | ✅ |
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `X-Frame-Options` | `DENY` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | camera/mic/geolocation denied | ✅ |
| `Cross-Origin-Resource-Policy` | `same-site` | ✅ API |
| `Cache-Control` on API | `no-store, private` | ✅ |
| TLS 1.3, Cloudflare Full (strict) | | ⚙️ |
| Origin firewall — 443 from Cloudflare IPs only | | ⚙️ UFW |

---

## 9. Audit & monitoring

| Control | Status |
| --- | --- |
| Audit log with actor, action, subject, IP, user agent | ✅ `activity_logs` |
| Diffs stored, not full row dumps | ✅ Avoids duplicating PII across thousands of rows |
| Enquiry timeline as first-class append-only data | ✅ `enquiry_status_history` |
| Exports logged | ✅ |
| Escalations logged and notified | ✅ |
| Failed job table | ✅ |
| Error tracking | ⚙️ `SENTRY_LARAVEL_DSN` |
| Log level `warning` in production | ⚙️ |
| Uptime monitoring on `/api/health` | 📋 |
| Log review cadence | 📋 Weekly |

---

## 10. Data protection

| Control | Status |
| --- | --- |
| Soft deletes on all business records | ✅ |
| PII minimised in analytics (`session_hash`, salted) | ✅ |
| Attachment URLs signed and short-lived | ✅ 10 minutes |
| Backup encryption at rest | ⚙️ |
| Point-in-time recovery (binlog) | ⚙️ |
| Restore actually tested, not just configured | 📋 Quarterly — an untested backup is a hypothesis |
| Retention policy documented | ✅ `06-database-schema.md` |
| Data subject deletion process | 📋 |

---

## 11. Dependencies & supply chain

| Control | Status |
| --- | --- |
| Lockfiles committed | ✅ |
| `npm audit` / `composer audit` in CI | 📋 |
| Dependabot or Renovate | 📋 |
| Larastan level 6+ | ⚙️ `composer analyse` |
| Pint (PSR-12) in CI | ⚙️ `composer lint` |
| `tsc --noEmit` in CI | ✅ Passes clean today |

---

## Pre-launch gate

Do not go live until every one of these is true:

- [ ] `APP_DEBUG=false`, `APP_ENV=production`, fresh `APP_KEY`
- [ ] `ADMIN_PASSWORD` set to a generated value; seeder run; variable then removed
- [ ] `SANCTUM_STATEFUL_DOMAINS` and `SESSION_DOMAIN` match the real hostnames
- [ ] UFW allows 443 only from Cloudflare ranges; 22 restricted to the admin IP
- [ ] Cloudflare set to Full (strict); WAF managed ruleset enabled
- [ ] SSL Labs grade A or better
- [ ] `securityheaders.com` grade A or better
- [ ] A database restore has been performed successfully from backup
- [ ] Error tracking receives a test exception
- [ ] `/admin` returns `noindex` and is absent from `sitemap.xml`
- [ ] Rate limits verified by test (submit 6 forms in a minute; expect a 429)
