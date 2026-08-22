<?php
/** GET /v1/admin/enquiries/{id} */

declare(strict_types=1);

require_admin();

$row = query_one('SELECT * FROM enquiries WHERE id = ?', [(int) $params['id']]);

if (!$row) {
    fail(404, 'Enquiry not found.');
}

$row['build_spec'] = json_col($row['build_spec'], null);

json_out(['data' => $row]);
