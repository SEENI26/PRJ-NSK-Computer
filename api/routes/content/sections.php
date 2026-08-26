<?php
/**
 * GET /v1/sections — page section copy and images.
 *
 * Public and unauthenticated: this is the same text the site already ships in
 * its bundle, just editable. Returns only sections that have actually been
 * edited; anything absent falls back to the compiled copy on the client, so a
 * fresh database and a fully edited one both render correctly.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../lib/sections.php';

$rows  = query('SELECT name, value FROM settings WHERE name LIKE ?', [SECTION_PREFIX . '%']);
$known = section_keys();
$data  = [];

foreach ($rows as $row) {
    $key = substr($row['name'], strlen(SECTION_PREFIX));

    // A key that has left the registry stays in the table but stops being
    // served — removing a section from the site should not surface stale copy.
    if (!isset($known[$key])) {
        continue;
    }

    $decoded = json_decode((string) $row['value'], true);
    if (is_array($decoded) && $decoded !== []) {
        $data[$key] = $decoded;
    }
}

json_out(['data' => $data]);
