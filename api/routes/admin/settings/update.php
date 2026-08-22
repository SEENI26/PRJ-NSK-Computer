<?php
/**
 * PUT /v1/admin/settings
 *
 * Body: { phone: "…", email: "…" } — upserts each supplied key.
 */

declare(strict_types=1);

require_admin();

$input = body();

if (!$input) {
    fail(422, 'Nothing to update.');
}

// Allow-list: an arbitrary key would let the panel write rows nothing reads.
$writable = [
    'business_name', 'phone', 'email', 'whatsapp', 'address',
    'opening_hours', 'founding_year', 'experience_years',
    'notification_recipients',
];

$saved = [];

foreach ($input as $name => $value) {
    if (!in_array($name, $writable, true)) {
        continue;
    }
    if (!is_scalar($value) && $value !== null) {
        continue;
    }

    execute(
        'INSERT INTO settings (name, value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value = VALUES(value)',
        [$name, $value === null ? null : (string) $value]
    );

    $saved[$name] = $value;
}

if (!$saved) {
    fail(422, 'No recognised settings were supplied.');
}

json_out(['data' => $saved]);
