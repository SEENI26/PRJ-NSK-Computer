<?php
/** PUT /v1/admin/offers/{id} */

declare(strict_types=1);

require_admin();

$id = (int) $params['id'];

if (!query_one('SELECT id FROM offers WHERE id = ?', [$id])) {
    fail(404, 'Offer not found.');
}

$input = body();

validate($input, [
    'title'     => 'min:2|max:200',
    'poster'    => 'max:255',
    'ctaHref'   => 'max:255',
]);

// Only touch columns the request actually sent, so a partial update cannot
// blank out fields it never mentioned.
$map = [
    'title'       => 'title',
    'description' => 'description',
    'poster'      => 'poster',
    'posterAlt'   => 'poster_alt',
    'ctaLabel'    => 'cta_label',
    'ctaHref'     => 'cta_href',
    'startsAt'    => 'starts_at',
    'endsAt'      => 'ends_at',
];

$sets   = [];
$values = [];

foreach ($map as $key => $column) {
    if (array_key_exists($key, $input)) {
        $sets[]   = "{$column} = ?";
        $values[] = $input[$key] === '' ? null : $input[$key];
    }
}

if (array_key_exists('isActive', $input)) {
    $sets[]   = 'is_active = ?';
    $values[] = (int) (bool) $input['isActive'];
}

if (array_key_exists('sortOrder', $input)) {
    $sets[]   = 'sort_order = ?';
    $values[] = (int) $input['sortOrder'];
}

if (!$sets) {
    fail(422, 'Nothing to update.');
}

$values[] = $id;
execute('UPDATE offers SET ' . implode(', ', $sets) . ' WHERE id = ?', $values);

json_out(['data' => query_one('SELECT * FROM offers WHERE id = ?', [$id])]);
