<?php
/**
 * Configuration. Real secrets belong in config.local.php, which is gitignored
 * and overrides anything here — never commit a key to this file.
 */

declare(strict_types=1);

$config = [
    'db' => [
        'host'     => '127.0.0.1',
        'port'     => 3306,
        'name'     => 'nsk_computer_zone',
        'user'     => 'root',
        'pass'     => '',
        'socket'   => '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
    ],

    // Origins allowed to call this API with credentials. Never '*' — browsers
    // refuse to send session cookies to a wildcard origin.
    /*
     * The dev server runs on 3100 (3000/3001 are used by another project on
     * this machine) and proxies /api, so browser requests are same-origin and
     * never reach this list. It matters only if the frontend is ever pointed
     * straight at the API host.
     */
    /*
     * reCAPTCHA v2 secret, pairing with VITE_RECAPTCHA_SITE_KEY on the
     * frontend. Read from the environment first so the real value never has to
     * live in a tracked file.
     *
     * Blank disables verification — the honeypot, the submit-timing check and
     * the rate limit still apply. See lib/recaptcha.php for why it fails open
     * rather than blocking the shop's only contact form.
     */
    'recaptcha_secret' => getenv('RECAPTCHA_SECRET') ?: '',

    'cors_origins' => [
        'http://localhost:3100',
        'http://127.0.0.1:3100',
    ],

    'business' => [
        'name'     => 'NSK Computer Zone',
        'phone'    => '+91 97914 30774',
        'email'    => 'nskcomputer@gmail.com',
        'whatsapp' => 'https://wa.me/919791430774',
    ],

    'ai' => [
        // Set in config.local.php. Empty means the assistant degrades to a
        // human-escalation reply rather than erroring — the intended failure mode.
        'api_key' => '',
        'model'   => 'claude-sonnet-5',
        'max_tokens' => 1024,
    ],

    // Rate limits: [max requests, window in seconds]
    'rate_limits' => [
        'submissions' => [5, 60],
        'ai_chat'     => [20, 60],
        'login'       => [5, 300],
    ],

    'session_name' => 'nsk_admin_session',
];

$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    $config = array_replace_recursive($config, require $local);
}

return $config;
