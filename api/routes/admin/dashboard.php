<?php
/** GET /v1/admin/dashboard — real counts, no demo data. */

declare(strict_types=1);

require_admin();

$counts = query_one(
    'SELECT
        (SELECT COUNT(*) FROM enquiries)                                  AS enquiries_total,
        (SELECT COUNT(*) FROM enquiries WHERE status = "new")             AS enquiries_new,
        (SELECT COUNT(*) FROM enquiries WHERE DATE(created_at) = CURDATE()) AS enquiries_today,
        (SELECT COUNT(*) FROM products WHERE is_active = 1)               AS products_active,
        (SELECT COUNT(*) FROM categories WHERE is_active = 1)             AS categories_active,
        (SELECT COUNT(*) FROM ai_conversations)                           AS conversations_total,
        (SELECT COUNT(*) FROM ai_conversations WHERE escalated = 1)       AS conversations_escalated,
        (SELECT COUNT(*) FROM newsletter_subscribers)                     AS subscribers_total'
) ?? [];

// Enquiries per day for the last 14 days, zero-filled so the chart has no gaps.
$rows = query(
    'SELECT DATE(created_at) AS d, COUNT(*) AS c
       FROM enquiries
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
      GROUP BY DATE(created_at)'
);
$byDate = array_column($rows, 'c', 'd');

$trend = [];
for ($i = 13; $i >= 0; $i--) {
    $date    = date('Y-m-d', strtotime("-{$i} days"));
    $trend[] = ['date' => $date, 'count' => (int) ($byDate[$date] ?? 0)];
}

$byStatus = query('SELECT status, COUNT(*) AS c FROM enquiries GROUP BY status');

$recent = query(
    'SELECT reference, name, subject, status, source, created_at
       FROM enquiries ORDER BY created_at DESC LIMIT 8'
);

json_out([
    'data' => [
        'counts'    => array_map('intval', $counts),
        'trend'     => $trend,
        'by_status' => array_map(
            static fn (array $r): array => ['status' => $r['status'], 'count' => (int) $r['c']],
            $byStatus
        ),
        'recent'    => $recent,
    ],
]);
