<?php
/**
 * Shared runtime for every endpoint: config, database, CORS, JSON responses,
 * validation, rate limiting and admin session handling.
 *
 * Every endpoint file starts with `require_once __DIR__ . '/../lib/bootstrap.php';`
 */

declare(strict_types=1);

// Errors are logged, never printed — a PHP notice in the output stream turns a
// valid JSON response into something the frontend cannot parse.
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../storage/php-error.log');

date_default_timezone_set('Asia/Kolkata');

const APP_VERSION = '1.0.0';

$GLOBALS['nsk_config'] = require __DIR__ . '/../config.php';

function config(string $path, mixed $default = null): mixed
{
    $value = $GLOBALS['nsk_config'];
    foreach (explode('.', $path) as $segment) {
        if (!is_array($value) || !array_key_exists($segment, $value)) {
            return $default;
        }
        $value = $value[$segment];
    }
    return $value;
}

/* ── Database ───────────────────────────────────────────────────────────── */

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $c = config('db');
    // Prefer the unix socket when present — XAMPP's MariaDB is not always
    // reachable over TCP on this machine.
    $dsn = (!empty($c['socket']) && file_exists($c['socket']))
        ? sprintf('mysql:unix_socket=%s;dbname=%s;charset=utf8mb4', $c['socket'], $c['name'])
        : sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $c['host'], $c['port'], $c['name']);

    try {
        $pdo = new PDO($dsn, $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        error_log('DB connection failed: ' . $e->getMessage());
        fail(503, 'The service is temporarily unavailable.');
    }

    return $pdo;
}

/** Fetch all rows. */
function query(string $sql, array $params = []): array
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

/** Fetch one row, or null. */
function query_one(string $sql, array $params = []): ?array
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetch() ?: null;
}

/** Run a write; returns affected row count. */
function execute(string $sql, array $params = []): int
{
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->rowCount();
}

/* ── HTTP ───────────────────────────────────────────────────────────────── */

function cors(): void
{
    $origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = config('cors_origins', []);

    if ($origin !== '' && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-CSRF-Token');
    header('Access-Control-Max-Age: 86400');

    // Defence-in-depth, carried over from the previous build's SecurityHeaders.
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Cache-Control: no-store, private');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_out(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $status, string $message, array $errors = []): never
{
    $body = ['message' => $message];
    if ($errors) {
        $body['errors'] = $errors;
    }
    json_out($body, $status);
}

/** Restrict an endpoint to specific verbs. */
function allow_methods(string ...$methods): string
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, $methods, true)) {
        header('Allow: ' . implode(', ', $methods));
        fail(405, 'Method not allowed.');
    }
    return $method;
}

/** Decode a JSON request body, falling back to form-encoded input. */
function body(): array
{
    static $parsed = null;
    if ($parsed !== null) {
        return $parsed;
    }

    $raw = file_get_contents('php://input') ?: '';
    if ($raw !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return $parsed = $decoded;
        }
    }

    return $parsed = $_POST;
}

function query_param(string $key, ?string $default = null): ?string
{
    $value = $_GET[$key] ?? null;
    return (is_string($value) && $value !== '') ? $value : $default;
}

/* ── Validation ─────────────────────────────────────────────────────────── */

/**
 * Minimal rule-based validator. Rules: required, email, phone, min:N, max:N, in:a,b
 * Returns clean values; sends a 422 shaped like the frontend's ApiError expects.
 */
function validate(array $input, array $rules): array
{
    $clean  = [];
    $errors = [];

    foreach ($rules as $field => $ruleset) {
        $value = $input[$field] ?? null;
        $value = is_string($value) ? trim($value) : $value;

        foreach (explode('|', $ruleset) as $rule) {
            [$name, $arg] = array_pad(explode(':', $rule, 2), 2, null);

            $missing = $value === null || $value === '';

            if ($name === 'required' && $missing) {
                $errors[$field][] = 'This field is required.';
                break;
            }
            if ($missing) {
                break; // Optional and absent — skip remaining rules.
            }

            switch ($name) {
                case 'email':
                    if (!filter_var((string) $value, FILTER_VALIDATE_EMAIL)) {
                        $errors[$field][] = 'Enter a valid email address.';
                    }
                    break;
                case 'phone':
                    if (!preg_match('/^[0-9+\-\s()]{7,20}$/', (string) $value)) {
                        $errors[$field][] = 'Enter a valid phone number.';
                    }
                    break;
                case 'min':
                    if (mb_strlen((string) $value) < (int) $arg) {
                        $errors[$field][] = "Must be at least {$arg} characters.";
                    }
                    break;
                case 'max':
                    if (mb_strlen((string) $value) > (int) $arg) {
                        $errors[$field][] = "Must not exceed {$arg} characters.";
                    }
                    break;
                case 'in':
                    if (!in_array((string) $value, explode(',', (string) $arg), true)) {
                        $errors[$field][] = 'Invalid value.';
                    }
                    break;
            }
        }

        if (!isset($errors[$field])) {
            $clean[$field] = $value;
        }
    }

    if ($errors) {
        fail(422, 'The given data was invalid.', $errors);
    }

    return $clean;
}

/* ── Rate limiting ──────────────────────────────────────────────────────── */

/**
 * File-backed fixed-window limiter. Adequate for a single-server XAMPP
 * deployment; swap for Redis if this ever runs on more than one node.
 */
function rate_limit(string $bucket, ?string $key = null): void
{
    [$max, $window] = config("rate_limits.{$bucket}", [60, 60]);

    $key = $key ?: ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $dir = __DIR__ . '/../storage/rate-limit';

    if (!is_dir($dir) && !@mkdir($dir, 0777, true) && !is_dir($dir)) {
        // Fail loudly. A silently disabled limiter looks like a working one
        // right up until someone abuses the endpoint.
        error_log("Rate limiter cannot create {$dir} — check permissions for the web server user.");
        fail(503, 'The service is temporarily unavailable.');
    }

    if (!is_writable($dir)) {
        error_log("Rate limiter directory {$dir} is not writable by " . (get_current_user() ?: 'the web user'));
        fail(503, 'The service is temporarily unavailable.');
    }

    $file = $dir . '/' . hash('sha256', $bucket . '|' . $key) . '.json';
    $now  = time();

    $state = ['count' => 0, 'start' => $now];
    if (is_file($file)) {
        $decoded = json_decode((string) file_get_contents($file), true);
        if (is_array($decoded) && ($now - (int) ($decoded['start'] ?? 0)) < $window) {
            $state = $decoded;
        }
    }

    $state['count']++;

    if ($state['count'] > $max) {
        $retry = $window - ($now - (int) $state['start']);
        header('Retry-After: ' . max(1, $retry));
        fail(429, 'Too many requests. Please wait a moment and try again.');
    }

    @file_put_contents($file, json_encode($state), LOCK_EX);
}

/* ── Admin session ──────────────────────────────────────────────────────── */

function session_start_admin(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name(config('session_name', 'nsk_admin_session'));
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function current_admin(): ?array
{
    session_start_admin();
    $id = $_SESSION['admin_id'] ?? null;
    if (!$id) {
        return null;
    }

    $user = query_one(
        'SELECT id, username, name, email, is_active FROM admin_users WHERE id = ?',
        [$id]
    );

    // A deactivated account must lose access immediately, not at next login.
    if (!$user || (int) $user['is_active'] !== 1) {
        $_SESSION = [];
        session_destroy();
        return null;
    }

    return $user;
}

function require_admin(): array
{
    $user = current_admin();
    if (!$user) {
        fail(401, 'Authentication required.');
    }
    return $user;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

/** Decode a JSON column, tolerating nulls and malformed values. */
function json_col(?string $raw, mixed $default = []): mixed
{
    if ($raw === null || $raw === '') {
        return $default;
    }
    $decoded = json_decode($raw, true);
    return $decoded === null ? $default : $decoded;
}

/** Cast a product row into the shape the frontend expects. */
function present_product(array $row): array
{
    return [
        'id'         => (int) $row['id'],
        'slug'       => $row['slug'],
        'name'       => $row['name'],
        'category'   => $row['category_slug'],
        'brand'      => $row['brand'],
        'summary'    => $row['summary'],
        'description' => $row['description'] ?? null,
        // NULL stays NULL — "Price on request". Never coerce to 0.
        'price'      => $row['price'] === null ? null : (float) $row['price'],
        'image'      => $row['image'],
        'specs'      => json_col($row['specs'] ?? null),
        'features'   => json_col($row['features'] ?? null),
        'featured'   => (bool) ($row['is_featured'] ?? false),
    ];
}

cors();
