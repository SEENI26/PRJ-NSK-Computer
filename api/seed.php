<?php
/**
 * Seeds the database from seed-data.json (produced by export-data.mjs).
 *
 * Idempotent: re-running updates existing rows by slug rather than duplicating.
 *
 *   php api/seed.php                       # content only
 *   php api/seed.php --admin-password=…    # also create/update the admin user
 *
 * Deliberately NOT seeded: testimonials, team, certifications, timeline and
 * portfolio. Those were removed as fabricated content attributed to a real
 * business — see docs/18-content-audit.md §3. Re-adding placeholder rows here
 * would undo that work.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("This script runs from the command line only.\n");
}

require_once __DIR__ . '/lib/bootstrap.php';

$file = __DIR__ . '/seed-data.json';
if (!is_file($file)) {
    exit("seed-data.json is missing. Run:  node api/export-data.mjs\n");
}

$data = json_decode((string) file_get_contents($file), true);
if (!is_array($data)) {
    exit("seed-data.json could not be parsed.\n");
}

$opts = getopt('', ['admin-password::', 'admin-username::', 'admin-name::']);

echo "Seeding {$GLOBALS['nsk_config']['db']['name']}…\n";

/* ── Categories ─────────────────────────────────────────────────────────── */

foreach ($data['categories'] as $c) {
    execute(
        'INSERT INTO categories (slug, name, description, image, sort_order)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            name = VALUES(name), description = VALUES(description),
            image = VALUES(image), sort_order = VALUES(sort_order)',
        [$c['slug'], $c['name'], $c['description'], $c['image'], $c['sort_order']]
    );
}
printf("  categories  %d\n", count($data['categories']));

/* ── Products ───────────────────────────────────────────────────────────── */

foreach ($data['products'] as $p) {
    execute(
        'INSERT INTO products
            (slug, name, category_slug, brand, summary, description, price, image, specs, features, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            name = VALUES(name), category_slug = VALUES(category_slug),
            brand = VALUES(brand), summary = VALUES(summary),
            description = VALUES(description), price = VALUES(price),
            image = VALUES(image), specs = VALUES(specs),
            features = VALUES(features), is_featured = VALUES(is_featured)',
        [
            $p['slug'],
            $p['name'],
            $p['category'],
            $p['brand'],
            $p['summary'],
            $p['description'],
            $p['price'], // null stays null — "Price on request"
            $p['image'],
            json_encode($p['specs']),
            json_encode($p['features']),
            (int) $p['featured'],
        ]
    );
}
printf("  products    %d\n", count($data['products']));

/* ── Services ───────────────────────────────────────────────────────────── */

foreach ($data['services'] as $s) {
    execute(
        'INSERT INTO services (slug, title, summary, description, icon, image, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            title = VALUES(title), summary = VALUES(summary),
            description = VALUES(description), icon = VALUES(icon),
            image = VALUES(image), sort_order = VALUES(sort_order)',
        [$s['slug'], $s['title'], $s['summary'], $s['description'], $s['icon'], $s['image'], $s['sort_order']]
    );
}
printf("  services    %d\n", count($data['services']));

/* ── Blog ───────────────────────────────────────────────────────────────── */

foreach ($data['blog'] as $b) {
    $publishedAt = $b['published_at'] ? date('Y-m-d H:i:s', strtotime($b['published_at'])) : null;

    execute(
        'INSERT INTO blog_posts
            (slug, title, excerpt, body, category, author_name, image, read_minutes, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            title = VALUES(title), excerpt = VALUES(excerpt), body = VALUES(body),
            category = VALUES(category), author_name = VALUES(author_name),
            image = VALUES(image), read_minutes = VALUES(read_minutes),
            published_at = VALUES(published_at)',
        [
            $b['slug'], $b['title'], $b['excerpt'], $b['body'], $b['category'],
            $b['author_name'], $b['image'], (int) $b['read_minutes'], $publishedAt,
        ]
    );
}
printf("  blog        %d\n", count($data['blog']));

/* ── FAQs ───────────────────────────────────────────────────────────────── */

// No natural key, so replace wholesale.
execute('DELETE FROM faqs');
foreach ($data['faqs'] as $f) {
    execute(
        'INSERT INTO faqs (question, answer, category, sort_order) VALUES (?, ?, ?, ?)',
        [$f['question'], $f['answer'], $f['category'], $f['sort_order']]
    );
}
printf("  faqs        %d\n", count($data['faqs']));

/* ── Settings ───────────────────────────────────────────────────────────── */

foreach ($data['settings'] as $name => $value) {
    // Settings are scalar by contract. Anything structured means the export
    // mapped a field wrongly — surface it rather than storing "Array".
    if (is_array($value) || is_object($value)) {
        fwrite(STDERR, "  WARNING: setting '{$name}' is not scalar; skipped.\n");
        continue;
    }

    execute(
        'INSERT INTO settings (name, value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value = VALUES(value)',
        [$name, (string) $value]
    );
}
printf("  settings    %d\n", count($data['settings']));

/* ── Admin user ─────────────────────────────────────────────────────────── */

/*
 * One account by design. Passing --admin-password updates the existing
 * administrator's credentials rather than adding a second login, so this
 * doubles as the password-reset command.
 */
if (isset($opts['admin-password']) && $opts['admin-password'] !== '') {
    $password = (string) $opts['admin-password'];

    if (strlen($password) < 8) {
        exit("\nRefusing to seed: the admin password must be at least 8 characters.\n");
    }

    $username = (string) ($opts['admin-username'] ?? 'admin');
    $name     = (string) ($opts['admin-name'] ?? 'Administrator');
    $hash     = password_hash($password, PASSWORD_DEFAULT);

    $existing = query_one('SELECT id, username FROM admin_users ORDER BY id LIMIT 1');

    if ($existing) {
        execute(
            'UPDATE admin_users SET username = ?, name = ?, password_hash = ?, is_active = 1 WHERE id = ?',
            [$username, $name, $hash, $existing['id']]
        );
        printf("  admin user  %s (updated)\n", $username);
    } else {
        execute(
            'INSERT INTO admin_users (username, name, email, password_hash) VALUES (?, ?, ?, ?)',
            [$username, $name, config('business.email'), $hash]
        );
        printf("  admin user  %s (created)\n", $username);
    }
} elseif (!query_one('SELECT id FROM admin_users LIMIT 1')) {
    echo "\n  No admin user exists. Create one with:\n";
    echo "    php api/seed.php --admin-password='your-password'\n";
}

echo "\nDone.\n";
