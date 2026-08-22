<?php
/** GET /v1/services/{slug} */

declare(strict_types=1);

$row = query_one('SELECT * FROM services WHERE slug = ? AND is_active = 1', [$params['slug']]);

if (!$row) {
    fail(404, 'Service not found.');
}

json_out([
    'data' => [
        'id'          => (int) $row['id'],
        'slug'        => $row['slug'],
        'title'       => $row['title'],
        'summary'     => $row['summary'],
        'description' => $row['description'],
        'icon'        => $row['icon'],
        'image'       => $row['image'],
    ],
]);
