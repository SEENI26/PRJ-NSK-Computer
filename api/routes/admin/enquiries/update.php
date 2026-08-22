<?php
/** PATCH /v1/admin/enquiries/{id} — status, priority and notes. */

declare(strict_types=1);

require_admin();

$id  = (int) $params['id'];
$row = query_one('SELECT * FROM enquiries WHERE id = ?', [$id]);

if (!$row) {
    fail(404, 'Enquiry not found.');
}

$input = body();

$clean = validate($input, [
    'status'   => 'in:new,in_progress,quoted,won,lost',
    'priority' => 'in:low,normal,high',
    'notes'    => 'max:5000',
]);

/*
 * Legal transitions. Enforced here rather than in the UI so an illegal move
 * fails the same way regardless of which client sent it.
 */
$allowed = [
    'new'         => ['in_progress', 'lost'],
    'in_progress' => ['quoted', 'won', 'lost'],
    'quoted'      => ['won', 'lost', 'in_progress'],
    'won'         => [],
    'lost'        => ['in_progress'],
];

$sets   = [];
$values = [];

if (!empty($clean['status']) && $clean['status'] !== $row['status']) {
    if (!in_array($clean['status'], $allowed[$row['status']] ?? [], true)) {
        fail(422, "Cannot move an enquiry from '{$row['status']}' to '{$clean['status']}'.", [
            'status' => ['Illegal status transition.'],
        ]);
    }
    $sets[]   = 'status = ?';
    $values[] = $clean['status'];
}

if (!empty($clean['priority'])) {
    $sets[]   = 'priority = ?';
    $values[] = $clean['priority'];
}

if (array_key_exists('notes', $clean)) {
    $sets[]   = 'notes = ?';
    $values[] = $clean['notes'];
}

if (!$sets) {
    fail(422, 'Nothing to update.');
}

$values[] = $id;
execute('UPDATE enquiries SET ' . implode(', ', $sets) . ' WHERE id = ?', $values);

json_out(['data' => query_one('SELECT * FROM enquiries WHERE id = ?', [$id])]);
