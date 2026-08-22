<?php
/**
 * PUT /v1/admin/product-images
 *
 * Body: { slug: "ddr4-8gb", images: ["uploads/a.webp", …] }
 * Replaces that product's override set. An empty array clears it, restoring the
 * seeded default image.
 */

declare(strict_types=1);

require_admin();

$input = body();
$clean = validate($input, ['slug' => 'required|max:160']);

$images = $input['images'] ?? [];
if (!is_array($images)) {
    fail(422, 'The given data was invalid.', ['images' => ['Expected an array of paths.']]);
}

if (!query_one('SELECT id FROM products WHERE slug = ?', [$clean['slug']])) {
    fail(404, 'Product not found.');
}

$pdo = db();
$pdo->beginTransaction();

try {
    execute('DELETE FROM product_images WHERE product_slug = ?', [$clean['slug']]);

    $order = 0;
    foreach ($images as $path) {
        if (!is_string($path) || $path === '') {
            continue;
        }
        execute(
            'INSERT INTO product_images (product_slug, path, sort_order) VALUES (?, ?, ?)',
            [$clean['slug'], $path, $order++]
        );
    }

    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    error_log('product-images update failed: ' . $e->getMessage());
    fail(500, 'Could not save the images.');
}

$rows = query(
    'SELECT path FROM product_images WHERE product_slug = ? ORDER BY sort_order, id',
    [$clean['slug']]
);

json_out(['data' => ['slug' => $clean['slug'], 'images' => array_column($rows, 'path')]]);
