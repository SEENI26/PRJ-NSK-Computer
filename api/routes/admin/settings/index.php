<?php
/** GET /v1/admin/settings */

declare(strict_types=1);

require_admin();

$rows = query('SELECT name, value, updated_at FROM settings ORDER BY name');

json_out(['data' => array_column($rows, 'value', 'name')]);
