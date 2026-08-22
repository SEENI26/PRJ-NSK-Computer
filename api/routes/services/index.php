<?php
/** GET /v1/services */

declare(strict_types=1);

$rows = query('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order, title');

json_out([
    'data' => array_map(static fn (array $r): array => [
        'id'      => (int) $r['id'],
        'slug'    => $r['slug'],
        'title'   => $r['title'],
        'summary' => $r['summary'],
        'icon'    => $r['icon'],
        'image'   => $r['image'],
    ], $rows),
]);
