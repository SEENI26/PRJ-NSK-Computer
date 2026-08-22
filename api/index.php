<?php
/**
 * Front controller. Apache rewrites every request here (see .htaccess) and this
 * dispatches on the path, so URLs stay clean: /api/v1/products, not
 * /api/products.php?slug=…
 */

declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

/*
 * Decode BEFORE comparing against SCRIPT_NAME. Apache gives REQUEST_URI
 * percent-encoded but SCRIPT_NAME already decoded, so a mount directory
 * containing a space ("/NKS computers Website/api") never matches otherwise.
 */
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');

// Strip the directory the API is mounted under, so the same code works in a
// subfolder during development and at the domain root in production.
$base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
if ($base !== '' && $base !== '/' && str_starts_with($path, $base)) {
    $path = substr($path, strlen($base));
}

$path   = '/' . trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/*
 * Routes are matched in order. A pattern segment of {name} captures one path
 * segment and is passed to the handler in $params.
 */
$routes = [
    ['GET',  '/health',                'health.php'],
    ['GET',  '/v1/health',             'health.php'],

    // Public catalogue
    ['GET',  '/v1/products',           'products/index.php'],
    ['GET',  '/v1/products/{slug}',    'products/show.php'],
    ['GET',  '/v1/categories',         'categories/index.php'],
    ['GET',  '/v1/services',           'services/index.php'],
    ['GET',  '/v1/services/{slug}',    'services/show.php'],
    ['GET',  '/v1/blog',               'blog/index.php'],
    ['GET',  '/v1/blog/{slug}',        'blog/show.php'],
    ['GET',  '/v1/faqs',               'content/faqs.php'],
    ['GET',  '/v1/settings',           'content/settings.php'],
    ['GET',  '/v1/offers',             'offers/index.php'],

    // Public writes
    ['POST', '/v1/enquiries',          'enquiries/store.php'],
    ['POST', '/v1/newsletter/subscribe', 'newsletter/subscribe.php'],

    // AI assistant
    ['POST', '/v1/ai/chat',            'ai/chat.php'],
    ['POST', '/v1/ai/escalate',        'ai/escalate.php'],

    // Admin auth
    ['POST', '/v1/auth/login',         'auth/login.php'],
    ['POST', '/v1/auth/logout',        'auth/logout.php'],
    ['GET',  '/v1/auth/me',            'auth/me.php'],

    // Admin
    ['GET',    '/v1/admin/dashboard',        'admin/dashboard.php'],
    ['GET',    '/v1/admin/enquiries',        'admin/enquiries/index.php'],
    ['GET',    '/v1/admin/enquiries/{id}',   'admin/enquiries/show.php'],
    ['PATCH',  '/v1/admin/enquiries/{id}',   'admin/enquiries/update.php'],
    ['DELETE', '/v1/admin/enquiries/{id}',   'admin/enquiries/delete.php'],
    ['GET',    '/v1/admin/offers',           'admin/offers/index.php'],
    ['POST',   '/v1/admin/offers',           'admin/offers/store.php'],
    ['PUT',    '/v1/admin/offers/{id}',      'admin/offers/update.php'],
    ['DELETE', '/v1/admin/offers/{id}',      'admin/offers/delete.php'],
    ['GET',    '/v1/admin/product-images',   'admin/product-images/index.php'],
    ['PUT',    '/v1/admin/product-images',   'admin/product-images/update.php'],
    ['POST',   '/v1/admin/upload',           'admin/upload.php'],
    ['GET',    '/v1/admin/settings',         'admin/settings/index.php'],
    ['PUT',    '/v1/admin/settings',         'admin/settings/update.php'],
];

/*
 * Match on path first, collecting every verb registered for it. Several paths
 * carry more than one verb (GET/PATCH/DELETE on an enquiry), so returning 405 at
 * the first path hit would reject the other verbs before they were considered.
 */
$pathMatched = [];

foreach ($routes as [$verb, $pattern, $file]) {
    $regex = '#^' . preg_replace('#\{([a-z_]+)\}#', '(?P<$1>[^/]+)', $pattern) . '$#';

    if (!preg_match($regex, $path, $matches)) {
        continue;
    }

    $pathMatched[] = $verb;

    if ($verb !== $method) {
        continue;
    }

    $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
    $target = __DIR__ . '/routes/' . $file;

    if (!is_file($target)) {
        error_log("Route file missing: {$target}");
        fail(500, 'Endpoint unavailable.');
    }

    require $target;
    exit;
}

// Path exists but no handler for this verb — 405 is more useful than 404.
if ($pathMatched) {
    header('Allow: ' . implode(', ', array_unique($pathMatched)));
    fail(405, 'Method not allowed.');
}

fail(404, 'Endpoint not found.');
