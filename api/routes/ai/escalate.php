<?php
/** POST /v1/ai/escalate — visitor explicitly asks for a human. */

declare(strict_types=1);

$clean = validate(body(), [
    'session_id' => 'required|max:64',
    'name'       => 'max:160',
    'email'      => 'email|max:200',
    'phone'      => 'phone|max:40',
    'reason'     => 'max:1000',
]);

rate_limit('submissions', $clean['session_id']);

$conversation = query_one('SELECT * FROM ai_conversations WHERE session_id = ?', [$clean['session_id']]);

if (!$conversation) {
    fail(404, 'Conversation not found.');
}

execute(
    'UPDATE ai_conversations
        SET escalated = 1,
            visitor_name  = COALESCE(NULLIF(?, ""), visitor_name),
            visitor_email = COALESCE(NULLIF(?, ""), visitor_email),
            visitor_phone = COALESCE(NULLIF(?, ""), visitor_phone)
      WHERE id = ?',
    [
        $clean['name'] ?? '',
        $clean['email'] ?? '',
        $clean['phone'] ?? '',
        $conversation['id'],
    ]
);

$reference = null;

// Only raise an enquiry when we can actually reply to it.
$name  = $clean['name'] ?? $conversation['visitor_name'] ?? '';
$email = $clean['email'] ?? $conversation['visitor_email'] ?? '';
$phone = $clean['phone'] ?? $conversation['visitor_phone'] ?? '';

if ($name !== '' && ($email !== '' || $phone !== '')) {
    $transcript = query(
        'SELECT role, content FROM chat_messages WHERE conversation_id = ? ORDER BY id ASC LIMIT 20',
        [$conversation['id']]
    );

    $summary = implode("\n", array_map(
        static fn (array $m): string => strtoupper($m['role']) . ': ' . $m['content'],
        $transcript
    ));

    $reference = 'NSK-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

    execute(
        'INSERT INTO enquiries (reference, name, email, phone, subject, message, source, priority)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            $reference,
            $name,
            $email ?: null,
            $phone ?: null,
            'Escalated from AI assistant',
            ($clean['reason'] ?? 'Customer asked for a person.') . "\n\n--- Transcript ---\n" . $summary,
            'ai_assistant',
            'high',
        ]
    );
}

json_out([
    'data' => [
        'escalated' => true,
        'reference' => $reference,
        'message'   => 'A member of the team will contact you shortly.',
    ],
]);
