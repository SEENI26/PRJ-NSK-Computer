<?php
/** GET /v1/products/{slug} — detail plus related items. */

declare(strict_types=1);

$row = query_one('SELECT * FROM products WHERE slug = ? AND is_active = 1', [$params['slug']]);

if (!$row) {
    fail(404, 'Product not found.');
}

$product = present_product($row);

// Admin-managed image overrides win over the seeded default.
$overrides = query(
    'SELECT path FROM product_images WHERE product_slug = ? ORDER BY sort_order, id',
    [$row['slug']]
);
if ($overrides) {
    $product['images'] = array_column($overrides, 'path');
    $product['image']  = $product['images'][0];
} else {
    $product['images'] = $product['image'] ? [$product['image']] : [];
}

$related = query(
    'SELECT * FROM products
      WHERE category_slug = ? AND slug <> ? AND is_active = 1
      ORDER BY is_featured DESC, name ASC
      LIMIT 4',
    [$row['category_slug'], $row['slug']]
);

json_out([
    'data'    => $product,
    'related' => array_map('present_product', $related),
]);
