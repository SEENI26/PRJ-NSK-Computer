/**
 * Fetch client for the PHP API.
 *
 * Design notes
 *  - Admin auth is a PHP session cookie, so every request sends
 *    `credentials: 'include'`. There is no CSRF token exchange — the API only
 *    accepts an explicit origin allow-list (see api/config.php).
 *  - 422 validation payloads are surfaced as `ApiError` so forms can map field
 *    errors without re-parsing shapes.
 *  - Reads degrade to the bundled content in src/data via `withFallback()`, so
 *    the public site renders even with the API down.
 */

/*
 * `??` is wrong here: .env ships VITE_API_BASE_URL as an empty string to mean
 * "same origin, use the dev proxy", and nullish coalescing keeps empty strings.
 * That silently produced `/v1/...` and a 404 on every read, which withFallback
 * then swallowed — the site looked fine and simply ignored the database.
 */
const CONFIGURED_BASE = import.meta.env.VITE_API_BASE_URL;
export const API_BASE = `${CONFIGURED_BASE || '/api'}/v1`;



export class ApiError extends Error {
  constructor(message, status, errors = {}, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.payload = payload;
  }

  /** First error message for a field, if any. */
  field(name) {
    return this.errors[name]?.[0];
  }

  /** Flattened `{ field: 'first message' }` map for form state. */
  fieldErrors() {
    return Object.fromEntries(Object.entries(this.errors).map(([k, v]) => [k, v[0] ?? '']));
  }

  get isValidation() {
    return this.status === 422;
  }
  get isRateLimited() {
    return this.status === 429;
  }
  get isUnauthorized() {
    return this.status === 401 || this.status === 419;
  }
}


async function request(path, { body, raw, ...init } = {}) {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  // Let the browser set the multipart boundary itself on raw uploads.
  if (body !== undefined && !raw) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include', // Carries the PHP admin session cookie.
    body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
  });

  if (response.status === 204) return undefined;

  const text = await response.text();
  const data = text ? safeJson(text) : null;

  if (!response.ok) {
    const message =
      data?.message ??
      (response.status === 429 ? 'Too many requests. Please slow down.' : `Request failed (${response.status})`);
    throw new ApiError(message, response.status, data?.errors ?? {}, data);
  }

  // The API wraps collections in `{ data: … }`; unwrap so callers see the payload.
  return data?.data ?? data;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 200) };
  }
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) =>
    request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) =>
    request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) =>
    request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),

  /** Multipart upload (contact form attachments). */
  upload: (path, form) => request(path, { method: 'POST', body: form, raw: true }),
};

/* Admin session helpers. */

export const auth = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  /** Resolves to the signed-in user, or null when there is no valid session. */
  me: async () => {
    try {
      return await api.get('/auth/me');
    } catch {
      return null;
    }
  },
};

/**
 * Read-through helper for pages that must render even when the API is down.
 * Returns the local fallback rather than throwing a 500 to the visitor.
 */
export async function withFallback(promise, fallback) {
  try {
    return await promise;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[api] falling back to local content:', error.message);
    }
    return fallback;
  }
}

/* Page section copy — see api/lib/sections.php for the registry. */

export const sections = {
  /** Public read. Only sections that have been edited come back. */
  all: () => api.get('/sections'),
  /** Admin read: the registry the editor builds its form from, plus values. */
  editable: () => api.get('/admin/sections'),
  save: (payload) => api.put('/admin/sections', payload),
};

/** Admin image upload. Returns { path, url, mime, size }. */
export function uploadImage(file) {
  const form = new FormData();
  form.append('file', file);
  return api.upload('/admin/upload', form);
}
