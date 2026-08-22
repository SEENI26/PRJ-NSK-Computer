<?php
/** POST /v1/auth/login */

declare(strict_types=1);

$clean = validate(body(), [
    'username' => 'required|max:80',
    'password' => 'required|max:200',
]);

// Keyed on username+IP to slow credential stuffing without locking out a whole office.
rate_limit('login', $clean['username'] . '|' . ($_SERVER['REMOTE_ADDR'] ?? ''));

$user = query_one(
    'SELECT * FROM admin_users WHERE username = ? OR email = ?',
    [$clean['username'], $clean['username']]
);

/*
 * One generic message for every failure — wrong user, wrong password, or
 * deactivated. Distinguishing them tells an attacker which usernames are real.
 * password_verify is still called on a dummy hash when the user is missing, so
 * the response time does not reveal existence either.
 */
$hash = $user['password_hash'] ?? '$2y$12$usesomesillystringfHqXJEz6ClfDVW4hdmqYc8dg9K9C4y.';

if (!password_verify($clean['password'], $hash) || !$user || (int) $user['is_active'] !== 1) {
    fail(401, 'Those credentials do not match our records.');
}

session_start_admin();
session_regenerate_id(true); // Defeats session fixation.

$_SESSION['admin_id'] = (int) $user['id'];

execute('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?', [$user['id']]);

json_out([
    'data' => [
        'id'       => (int) $user['id'],
        'username' => $user['username'],
        'name'     => $user['name'],
        'email'    => $user['email'],
    ],
]);
