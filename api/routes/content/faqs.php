<?php
/** GET /v1/faqs */

declare(strict_types=1);

$rows = query('SELECT id, question, answer, category FROM faqs WHERE is_active = 1 ORDER BY sort_order, id');

json_out(['data' => $rows]);
