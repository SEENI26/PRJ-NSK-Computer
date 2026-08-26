<?php
/**
 * GET /v1/admin/sections — the editable registry plus current values.
 *
 * The panel builds its form from this rather than from a list of its own, so
 * the fields it offers and the fields the server will accept cannot drift.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../lib/sections.php';

require_admin();

$rows   = query('SELECT name, value FROM settings WHERE name LIKE ?', [SECTION_PREFIX . '%']);
$stored = [];

foreach ($rows as $row) {
    $decoded = json_decode((string) $row['value'], true);
    $stored[substr($row['name'], strlen(SECTION_PREFIX))] = is_array($decoded) ? $decoded : [];
}

json_out([
    'data' => [
        'fields'   => SECTION_FIELDS,
        'registry' => section_registry(),
        'values'   => $stored,
    ],
]);
