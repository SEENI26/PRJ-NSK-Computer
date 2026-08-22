<?php
/** GET /v1/admin/enquiries */

declare(strict_types=1);

require_admin();

$where  = ['1 = 1'];
$params = [];

if ($status = query_param('status')) {
    $where[]  = 'status = ?';
    $params[] = $status;
}

if ($search = query_param('search')) {
    $where[]  = '(reference LIKE ? OR name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)';
    $like     = '%' . $search . '%';
    array_push($params, $like, $like, $like, $like, $like);
}

$sql     = 'FROM enquiries WHERE ' . implode(' AND ', $where);
$total   = (int) (query_one("SELECT COUNT(*) AS c {$sql}", $params)['c'] ?? 0);
$perPage = min(max((int) query_param('per_page', '25'), 1), 100);
$page    = max((int) query_param('page', '1'), 1);

$rows = query(
    "SELECT * {$sql} ORDER BY created_at DESC LIMIT {$perPage} OFFSET " . (($page - 1) * $perPage),
    $params
);

json_out([
    'data' => array_map(static fn (array $r): array => [
        'id'        => (int) $r['id'],
        'reference' => $r['reference'],
        'name'      => $r['name'],
        'email'     => $r['email'],
        'phone'     => $r['phone'],
        'subject'   => $r['subject'],
        'message'   => $r['message'],
        'source'    => $r['source'],
        'status'    => $r['status'],
        'priority'  => $r['priority'],
        'createdAt' => $r['created_at'],
    ], $rows),
    'meta' => [
        'total'     => $total,
        'page'      => $page,
        'per_page'  => $perPage,
        'last_page' => (int) ceil($total / $perPage),
    ],
]);
