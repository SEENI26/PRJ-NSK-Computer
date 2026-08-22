<?php
/** GET /v1/products — filterable, paginated catalogue listing. */

declare(strict_types=1);

$where  = ['is_active = 1'];
$params = [];

if ($category = query_param('category')) {
    $where[]  = 'category_slug = ?';
    $params[] = $category;
}

if ($brand = query_param('brand')) {
    $where[]  = 'brand = ?';
    $params[] = $brand;
}

if ($search = query_param('search')) {
    $where[]  = '(name LIKE ? OR summary LIKE ? OR brand LIKE ?)';
    $like     = '%' . $search . '%';
    array_push($params, $like, $like, $like);
}

if (query_param('featured') === '1') {
    $where[] = 'is_featured = 1';
}

$sql = 'FROM products WHERE ' . implode(' AND ', $where);

$total   = (int) (query_one("SELECT COUNT(*) AS c {$sql}", $params)['c'] ?? 0);
$perPage = min(max((int) (query_param('per_page', '24')), 1), 100);
$page    = max((int) (query_param('page', '1')), 1);
$offset  = ($page - 1) * $perPage;

/*
 * Price sorting puts NULLs last in BOTH directions. A price-on-request item is
 * not "cheapest" — surfacing it first would mislead. See docs/18-content-audit.md §4.
 */
$order = match (query_param('sort', 'name')) {
    'price_asc'  => 'price IS NULL, price ASC',
    'price_desc' => 'price IS NULL, price DESC',
    'newest'     => 'created_at DESC',
    default      => 'is_featured DESC, name ASC',
};

$rows = query(
    "SELECT * {$sql} ORDER BY {$order} LIMIT {$perPage} OFFSET {$offset}",
    $params
);

json_out([
    'data' => array_map('present_product', $rows),
    'meta' => [
        'total'     => $total,
        'page'      => $page,
        'per_page'  => $perPage,
        'last_page' => (int) ceil($total / $perPage),
    ],
]);
