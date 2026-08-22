<?php

declare(strict_types=1);

$db = 'ok';
try {
    query_one('SELECT 1 AS ok');
} catch (Throwable) {
    $db = 'unavailable';
}

json_out([
    'status'   => $db === 'ok' ? 'ok' : 'degraded',
    'database' => $db,
    'time'     => date('c'),
    'version'  => APP_VERSION,
]);
