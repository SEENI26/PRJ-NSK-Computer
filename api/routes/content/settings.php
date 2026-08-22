<?php
/**
 * GET /v1/settings — public business details.
 *
 * Only keys that are safe to expose. Nothing here is invented: values come from
 * the settings table, seeded from the verified facts in docs/18-content-audit.md.
 */

declare(strict_types=1);

$rows   = query('SELECT name, value FROM settings');
$stored = array_column($rows, 'value', 'name');

$public = [
    'business_name', 'phone', 'email', 'whatsapp', 'address',
    'opening_hours', 'founding_year', 'experience_years',
];

$data = [];
foreach ($public as $key) {
    if (isset($stored[$key]) && $stored[$key] !== '') {
        $data[$key] = $stored[$key];
    }
}

json_out(['data' => $data]);
