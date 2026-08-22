<?php
/** POST /v1/enquiries */

declare(strict_types=1);

rate_limit('submissions');

$input = body();

// Honeypot: a hidden field only a bot fills in. Accept silently so the bot
// cannot tell it was rejected.
if (!empty($input['website'])) {
    json_out(['data' => ['reference' => 'NSK-' . strtoupper(bin2hex(random_bytes(4)))]], 201);
}

$clean = validate($input, [
    'name'    => 'required|min:2|max:160',
    'email'   => 'email|max:200',
    'phone'   => 'phone|max:40',
    'subject' => 'max:240',
    'message' => 'required|min:10|max:5000',
    'source'  => 'in:website,ai_assistant,pc_builder,phone,whatsapp',
]);

// At least one way to reply, or the enquiry is unusable.
if (empty($clean['email']) && empty($clean['phone'])) {
    fail(422, 'The given data was invalid.', [
        'email' => ['Provide an email address or a phone number.'],
        'phone' => ['Provide an email address or a phone number.'],
    ]);
}

$reference = 'NSK-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

execute(
    'INSERT INTO enquiries (reference, name, email, phone, subject, message, source, build_spec)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
        $reference,
        $clean['name'],
        $clean['email'] ?? null,
        $clean['phone'] ?? null,
        $clean['subject'] ?? null,
        $clean['message'],
        $clean['source'] ?? 'website',
        isset($input['build_spec']) ? json_encode($input['build_spec']) : null,
    ]
);

json_out([
    'data' => [
        'reference' => $reference,
        'message'   => 'Thank you — we have received your enquiry and will be in touch shortly.',
    ],
], 201);
