<?php
/** POST /v1/newsletter/subscribe */

declare(strict_types=1);

rate_limit('submissions');

$clean = validate(body(), ['email' => 'required|email|max:200']);

/*
 * Upsert, and return the same response whether or not the address was already
 * on the list — confirming "you are already subscribed" leaks list membership
 * to anyone who can guess an address.
 */
execute(
    'INSERT INTO newsletter_subscribers (email, token)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE email = email',
    [strtolower($clean['email']), bin2hex(random_bytes(16))]
);

json_out([
    'data' => ['message' => 'Thanks — you are on the list.'],
], 201);
