<?php
/**
 * GET /v1/admin/product-images
 *
 * Returns { slug: [path, …] } — the override map the admin image manager edits.
 */

declare(strict_types=1);

require_admin();

$rows = query('SELECT product_slug, path FROM product_images ORDER BY product_slug, sort_order, id');

$map = [];
foreach ($rows as $row) {
    $map[$row['product_slug']][] = $row['path'];
}

json_out(['data' => (object) $map]);
