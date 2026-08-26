<?php
/**
 * PUT /v1/admin/sections
 *
 * Body: { "home.hero": { "heading": "…", "image": "/uploads/x.webp" }, … }
 *
 * Every key is checked against the registry and every field trimmed to its
 * limit before it is written. An unknown key is skipped rather than failing
 * the whole request, so one stale field in the panel cannot block a save.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../../lib/sections.php';

require_admin();

$input = body();

if (!is_array($input) || !$input) {
    fail(422, 'Nothing to update.');
}

$saved   = [];
$skipped = [];

foreach ($input as $key => $values) {
    if (!is_string($key) || !is_array($values)) {
        $skipped[] = (string) $key;
        continue;
    }

    $clean = section_sanitise($key, $values);

    if ($clean === []) {
        /*
         * Every field was cleared. Delete the row rather than storing an empty
         * object, so the section returns to the copy compiled into the site
         * instead of rendering blank.
         */
        execute('DELETE FROM settings WHERE name = ?', [SECTION_PREFIX . $key]);
        $saved[$key] = null;
        continue;
    }

    execute(
        'INSERT INTO settings (name, value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value = VALUES(value)',
        [SECTION_PREFIX . $key, json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]
    );

    $saved[$key] = $clean;
}

if (!$saved) {
    fail(422, 'No recognised sections were supplied.', ['sections' => $skipped]);
}

json_out(['data' => $saved]);
