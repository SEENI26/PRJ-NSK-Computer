<?php
/**
 * GET /v1/captcha — issue a fresh verification image.
 *
 * Public and cheap. Rate limited anyway, because generating images is the one
 * thing here that costs real CPU and an open image generator is a small DoS
 * surface.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../lib/captcha.php';

rate_limit('captcha');

$issued = captcha_issue();

// Never cache: a reused image is a reused answer.
header('Cache-Control: no-store, max-age=0');

json_out(['data' => $issued]);
