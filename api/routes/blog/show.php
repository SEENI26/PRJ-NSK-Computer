<?php
/** GET /v1/blog/{slug} */

declare(strict_types=1);

$row = query_one(
    'SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1',
    [$params['slug']]
);

if (!$row) {
    fail(404, 'Article not found.');
}

$related = query(
    'SELECT slug, title, excerpt, image, read_minutes
       FROM blog_posts
      WHERE category = ? AND slug <> ? AND is_published = 1
      ORDER BY published_at DESC
      LIMIT 3',
    [$row['category'], $row['slug']]
);

json_out([
    'data' => [
        'id'          => (int) $row['id'],
        'slug'        => $row['slug'],
        'title'       => $row['title'],
        'excerpt'     => $row['excerpt'],
        'body'        => $row['body'],
        'category'    => $row['category'],
        'author'      => ['name' => $row['author_name']],
        'image'       => $row['image'],
        'readMinutes' => (int) $row['read_minutes'],
        'publishedAt' => $row['published_at'],
    ],
    'related' => $related,
]);
