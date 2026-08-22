<?php
/** GET /v1/offers — public: only live, in-window offers. */

declare(strict_types=1);

$rows = query(
    'SELECT * FROM offers
      WHERE is_active = 1
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (ends_at   IS NULL OR ends_at   >= NOW())
      ORDER BY sort_order, id DESC'
);

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
    ], $rows),
]);
