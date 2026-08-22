<?php
/** GET /v1/auth/me */

declare(strict_types=1);

$user = require_admin();

json_out([
    'data' => [
        'id'       => (int) $user['id'],
        'username' => $user['username'],
        'name'     => $user['name'],
        'email'    => $user['email'],
    ],
]);
