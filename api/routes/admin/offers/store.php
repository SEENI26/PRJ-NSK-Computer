<?php
/** POST /v1/admin/offers */

declare(strict_types=1);

require_admin();

$input = body();

$clean = validate($input, [
    'title'       => 'required|min:2|max:200',
    'description' => 'max:2000',
    'poster'      => 'max:255',
    'posterAlt'   => 'max:255',
    'ctaLabel'    => 'max:120',
    'ctaHref'     => 'max:255',
]);

execute(
    'INSERT INTO offers (title, description, poster, poster_alt, cta_label, cta_href, starts_at, ends_at, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
        $clean['title'],
        $clean['description'] ?? null,
        $clean['poster'] ?? null,
        $clean['posterAlt'] ?? null,
        $clean['ctaLabel'] ?? null,
        $clean['ctaHref'] ?? null,
        $input['startsAt'] ?? null,
        $input['endsAt'] ?? null,
        isset($input['isActive']) ? (int) (bool) $input['isActive'] : 1,
        (int) ($input['sortOrder'] ?? 0),
    ]
);

json_out(['data' => query_one('SELECT * FROM offers WHERE id = ?', [(int) db()->lastInsertId()])], 201);
