<?php
/** DELETE /v1/admin/offers/{id} */

declare(strict_types=1);

require_admin();

if (!execute('DELETE FROM offers WHERE id = ?', [(int) $params['id']])) {
    fail(404, 'Offer not found.');
}

json_out(['data' => ['message' => 'Offer deleted.']]);
