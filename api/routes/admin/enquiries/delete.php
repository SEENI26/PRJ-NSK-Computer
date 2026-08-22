<?php
/**
 * DELETE /v1/admin/enquiries/{id}
 *
 * Single-account deployment: any authenticated caller is the owner, so
 * require_admin() is the whole authorisation check.
 */

declare(strict_types=1);

require_admin();

$deleted = execute('DELETE FROM enquiries WHERE id = ?', [(int) $params['id']]);

if (!$deleted) {
    fail(404, 'Enquiry not found.');
}

json_out(['data' => ['message' => 'Enquiry deleted.']]);
