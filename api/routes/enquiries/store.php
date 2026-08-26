<?php
/** POST /v1/enquiries */

declare(strict_types=1);

require_once __DIR__ . '/../../lib/recaptcha.php';

rate_limit('submissions');

$input = body();

/*
 * Reference generator, shared by the real path and the silent rejections
 * below. The decoys previously used a different shape — NSK-XXXXXXXX against
 * the real NSK-ymd-XXXXXX — which handed a bot a reliable way to detect that
 * it had been caught. Same format, always.
 */
$make_reference = static fn (): string =>
    'NSK-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

/*
 * Three checks, cheapest first, before anything touches the database.
 *
 * The two silent ones return a plausible reference rather than an error: a bot
 * that is told it failed simply adjusts and retries, whereas one that thinks it
 * succeeded goes away. A person can never trip either — the honeypot field is
 * hidden from them, and nobody fills in a contact form in under three seconds.
 */

// 1. Honeypot — a field only an automated form-filler will populate.
if (!empty($input['website'])) {
    json_out(['data' => ['reference' => $make_reference()]], 201);
}

// 2. Time on form. Absent means an older client, so it is not held against them.
$elapsed = $input['elapsed_ms'] ?? null;
if (is_numeric($elapsed) && (int) $elapsed < 3000) {
    json_out(['data' => ['reference' => $make_reference()]], 201);
}

// 3. reCAPTCHA. Skipped entirely when no secret is configured — see lib.
$captcha = recaptcha_check(
    isset($input['recaptcha_token']) ? (string) $input['recaptcha_token'] : null,
    $_SERVER['REMOTE_ADDR'] ?? null
);

if (!$captcha['ok']) {
    // This one *is* explicit: a real person who let the checkbox expire needs
    // to be told to tick it again, not silently ignored.
    fail(422, 'Please confirm the "I am not a robot" check and try again.', [
        'recaptcha' => ['Verification failed. Tick the box and resend.'],
    ]);
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

$reference = $make_reference();

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
