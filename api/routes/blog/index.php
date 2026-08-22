<?php
/** GET /v1/blog */

declare(strict_types=1);

$where  = ['is_published = 1'];
$params = [];

if ($category = query_param('category')) {
    $where[]  = 'category = ?';
    $params[] = $category;
}

if ($search = query_param('search')) {
    $where[]  = '(title LIKE ? OR excerpt LIKE ?)';
    $like     = '%' . $search . '%';
    array_push($params, $like, $like);
}

$rows = query(
    'SELECT id, slug, title, excerpt, category, author_name, image, read_minutes, published_at
       FROM blog_posts
      WHERE ' . implode(' AND ', $where) . '
      ORDER BY published_at DESC, id DESC',
    $params
);

json_out([
    'data' => array_map(static fn (array $r): array => [
        'id'           => (int) $r['id'],
        'slug'         => $r['slug'],
        'title'        => $r['title'],
        'excerpt'      => $r['excerpt'],
        'category'     => $r['category'],
        'author'       => ['name' => $r['author_name']],
        'image'        => $r['image'],
        'readMinutes'  => (int) $r['read_minutes'],
        'publishedAt'  => $r['published_at'],
    ], $rows),
]);
