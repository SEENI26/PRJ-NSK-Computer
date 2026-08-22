<?php
/**
 * POST /v1/ai/chat
 *
 * Returns a single assistant message object, which is what AssistantWidget
 * appends straight into its message list.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../lib/assistant.php';

$clean = validate(body(), [
    'session_id' => 'required|max:64',
    'message'    => 'required|min:1|max:2000',
]);

rate_limit('ai_chat', $clean['session_id']);

/** Build the reply envelope the frontend expects. */
$reply = static function (string $text, array $extra = []): array {
    return array_merge([
        'id'        => 'a-' . bin2hex(random_bytes(6)),
        'role'      => 'assistant',
        'content'   => $text,
        'createdAt' => date('c'),
        'escalated' => false,
    ], $extra);
};

// Find or create the conversation.
$conversation = query_one('SELECT * FROM ai_conversations WHERE session_id = ?', [$clean['session_id']]);

if (!$conversation) {
    execute('INSERT INTO ai_conversations (session_id) VALUES (?)', [$clean['session_id']]);
    $conversation = query_one('SELECT * FROM ai_conversations WHERE session_id = ?', [$clean['session_id']]);
}

$conversationId = (int) $conversation['id'];

// Persist the visitor's turn before calling the model, so the transcript
// survives even if the API call fails.
execute(
    'INSERT INTO chat_messages (conversation_id, role, content) VALUES (?, ?, ?)',
    [$conversationId, 'user', $clean['message']]
);

// No key configured — degrade to escalation rather than erroring.
if (config('ai.api_key') === '') {
    $text = ai_fallback_reply();
    execute(
        'INSERT INTO chat_messages (conversation_id, role, content) VALUES (?, ?, ?)',
        [$conversationId, 'assistant', $text]
    );
    execute('UPDATE ai_conversations SET escalated = 1 WHERE id = ?', [$conversationId]);

    json_out($reply($text, ['escalated' => true]));
}

// Replay the stored transcript so the model has context across requests.
$history = array_map(
    static fn (array $m): array => ['role' => $m['role'], 'content' => $m['content']],
    query(
        'SELECT role, content FROM chat_messages
          WHERE conversation_id = ? AND role IN ("user","assistant")
          ORDER BY id ASC LIMIT 40',
        [$conversationId]
    )
);

try {
    $result = ai_converse($history, $conversationId);
} catch (Throwable $e) {
    error_log('AI assistant failed: ' . $e->getMessage());

    $text = ai_fallback_reply();
    execute(
        'INSERT INTO chat_messages (conversation_id, role, content) VALUES (?, ?, ?)',
        [$conversationId, 'assistant', $text]
    );
    execute('UPDATE ai_conversations SET escalated = 1 WHERE id = ?', [$conversationId]);

    json_out($reply($text, ['escalated' => true]));
}

$text = $result['reply'] !== '' ? $result['reply'] : ai_fallback_reply();

execute(
    'INSERT INTO chat_messages (conversation_id, role, content) VALUES (?, ?, ?)',
    [$conversationId, 'assistant', $text]
);

json_out($reply($text, [
    'escalated'       => $result['escalated'],
    'recommendations' => $result['recommendations'],
    'reference'       => $result['reference'],
]));
