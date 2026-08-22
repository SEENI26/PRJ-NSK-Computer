<?php
/** GET /v1/admin/offers — every offer, including inactive and expired. */

declare(strict_types=1);

require_admin();

$rows = query('SELECT * FROM offers ORDER BY sort_order, id DESC');

json_out([
    'data' => array_map(static fn (array $r): array => [
        'id'          => (int) $r['id'],
        'title'       => $r['title'],
        'description' => $r['description'],
        'poster'      => $r['poster'],
        'posterAlt'   => $r['poster_alt'],
        'ctaLabel'    => $r['cta_label'],
        'ctaHref'     => $r['cta_href'],
        'startsAt'    => $r['starts_at'],
        'endsAt'      => $r['ends_at'],
        'isActive'    => (bool) $r['is_active'],
        'sortOrder'   => (int) $r['sort_order'],
    ], $rows),
]);
