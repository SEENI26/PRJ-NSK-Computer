<?php
/** GET /v1/categories — with a live product count per category. */

declare(strict_types=1);

$rows = query(
    'SELECT c.*, (
        SELECT COUNT(*) FROM products p
         WHERE p.category_slug = c.slug AND p.is_active = 1
     ) AS product_count
       FROM categories c
      WHERE c.is_active = 1
      ORDER BY c.sort_order, c.name'
);

json_out([
    'data' => array_map(static fn (array $r): array => [
        'id'            => (int) $r['id'],
        'slug'          => $r['slug'],
        'name'          => $r['name'],
        'description'   => $r['description'],
        'image'         => $r['image'],
        'product_count' => (int) $r['product_count'],
    ], $rows),
]);
