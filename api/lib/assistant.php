<?php
/**
 * AI sales assistant.
 *
 * Ported from the previous Laravel AiAssistantService, with the two defects that
 * audit found corrected:
 *
 *   1. The tool loop is now multi-turn. Tool results are sent back to the model
 *      in a `tool_result` block so its reply is grounded in real data. The old
 *      version executed the tool but discarded the result, so the model answered
 *      before it had seen anything.
 *   2. `create_enquiry` and `escalate_to_human` are handled. They were declared
 *      to the model but fell through to an empty match arm.
 *
 * Grounding rule preserved: product facts come only from the database via
 * search_products. The model cannot invent a price.
 */

declare(strict_types=1);

const AI_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const AI_MAX_TURNS = 4;

function ai_system_prompt(): string
{
    $business = config('business');

    return <<<PROMPT
    You are the sales assistant for {$business['name']}, a computer hardware
    supplier in Tiruchirappalli, Tamil Nadu, trading wholesale and retail for
    over 20 years.

    How to behave:
    - Be direct and useful. You are talking to shopkeepers, resellers, IT staff
      and walk-in customers. Skip pleasantries after the first message.
    - Ask what the machine is for and what budget they have before recommending.
      If a cheaper spend achieves the customer's goal, say so plainly.
    - Prices are in Indian rupees.
    - You may ONLY state product names, specifications and prices returned by the
      search_products tool. Never invent a specification, a price or availability.
      If you do not have the data, say you will check with the team.
    - Many items are priced on request. When a product has no price, say exactly
      that and offer to have the team quote it. Never guess a figure.
    - Keep replies under 120 words unless asked for detail. Use plain sentences.
    - Collect name, phone and email once the customer shows real buying intent,
      then call create_enquiry.
    - If asked about refunds, complaints, legal matters, or if the customer asks
      for a person, call escalate_to_human immediately. Do not attempt to resolve it.
    - Never promise a delivery date, a discount, or a warranty term that is not in
      the tool output.

    Contact details you may share: phone {$business['phone']}, WhatsApp
    {$business['whatsapp']}, email {$business['email']}.
    PROMPT;
}

function ai_tools(): array
{
    return [
        [
            'name'        => 'search_products',
            'description' => 'Search the live catalogue. This is the ONLY source of product facts and prices.',
            'input_schema' => [
                'type'       => 'object',
                'properties' => [
                    'query'     => ['type' => 'string', 'description' => 'Free-text search'],
                    'category'  => ['type' => 'string', 'description' => 'Category slug, e.g. ram'],
                    'max_price' => ['type' => 'integer', 'description' => 'Budget ceiling in rupees'],
                ],
                'required' => ['query'],
            ],
        ],
        [
            'name'        => 'create_enquiry',
            'description' => 'Create a sales enquiry once the name and a contact method are known.',
            'input_schema' => [
                'type'       => 'object',
                'properties' => [
                    'name'    => ['type' => 'string'],
                    'email'   => ['type' => 'string'],
                    'phone'   => ['type' => 'string'],
                    'summary' => ['type' => 'string', 'description' => 'What the customer needs'],
                    'budget'  => ['type' => 'string'],
                ],
                'required' => ['name', 'summary'],
            ],
        ],
        [
            'name'        => 'escalate_to_human',
            'description' => 'Hand the conversation to the sales team. Use for complaints, refunds, legal questions, or on explicit request.',
            'input_schema' => [
                'type'       => 'object',
                'properties' => ['reason' => ['type' => 'string']],
                'required'   => ['reason'],
            ],
        ],
    ];
}

/**
 * Executes a tool against real data. The model supplies arguments but never the
 * results — every value here comes from the database.
 */
function ai_execute_tool(string $name, array $input, int $conversationId): array
{
    switch ($name) {
        case 'search_products':
            $where  = ['is_active = 1'];
            $params = [];

            if (!empty($input['query'])) {
                $where[]  = '(name LIKE ? OR summary LIKE ? OR brand LIKE ? OR category_slug LIKE ?)';
                $like     = '%' . $input['query'] . '%';
                array_push($params, $like, $like, $like, $like);
            }
            if (!empty($input['category'])) {
                $where[]  = 'category_slug = ?';
                $params[] = $input['category'];
            }
            if (!empty($input['max_price'])) {
                // Price-on-request items stay in results: we cannot know they
                // exceed the budget, and hiding them would lose leads.
                $where[]  = '(price IS NULL OR price <= ?)';
                $params[] = (int) $input['max_price'];
            }

            $rows = query(
                'SELECT slug, name, brand, category_slug, summary, price
                   FROM products WHERE ' . implode(' AND ', $where) . '
                  ORDER BY is_featured DESC, name ASC LIMIT 8',
                $params
            );

            return [
                'count'    => count($rows),
                'products' => array_map(static fn (array $r): array => [
                    'slug'     => $r['slug'],
                    'name'     => $r['name'],
                    'brand'    => $r['brand'],
                    'category' => $r['category_slug'],
                    'summary'  => $r['summary'],
                    'price'    => $r['price'] === null ? 'Price on request' : (float) $r['price'],
                ], $rows),
            ];

        case 'create_enquiry':
            $name  = trim((string) ($input['name'] ?? ''));
            $email = trim((string) ($input['email'] ?? ''));
            $phone = trim((string) ($input['phone'] ?? ''));

            /*
             * Refuse to write a junk row. The old implementation inserted
             * 'unknown@placeholder.invalid' and phone '0000000000' when details
             * were partial, which polluted every enquiry export.
             */
            if ($name === '' || ($email === '' && $phone === '')) {
                return [
                    'created' => false,
                    'reason'  => 'Need a name and either an email address or a phone number before an enquiry can be raised.',
                ];
            }

            $reference = 'NSK-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

            execute(
                'INSERT INTO enquiries (reference, name, email, phone, subject, message, source)
                 VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    $reference,
                    $name,
                    $email ?: null,
                    $phone ?: null,
                    'AI assistant enquiry',
                    trim((string) ($input['summary'] ?? '')) .
                        (!empty($input['budget']) ? "\n\nBudget: " . $input['budget'] : ''),
                    'ai_assistant',
                ]
            );

            execute(
                'UPDATE ai_conversations
                    SET visitor_name = COALESCE(NULLIF(?, ""), visitor_name),
                        visitor_email = COALESCE(NULLIF(?, ""), visitor_email),
                        visitor_phone = COALESCE(NULLIF(?, ""), visitor_phone)
                  WHERE id = ?',
                [$name, $email, $phone, $conversationId]
            );

            return ['created' => true, 'reference' => $reference];

        case 'escalate_to_human':
            execute('UPDATE ai_conversations SET escalated = 1 WHERE id = ?', [$conversationId]);

            return [
                'escalated' => true,
                'reason'    => $input['reason'] ?? 'Customer request',
                'message'   => 'The sales team has been notified and will follow up.',
            ];
    }

    return ['error' => 'Unknown tool.'];
}

/** One HTTP call to the Anthropic Messages API. */
function ai_call_model(array $messages): array
{
    $payload = [
        'model'      => config('ai.model'),
        'max_tokens' => (int) config('ai.max_tokens', 1024),
        'system'     => ai_system_prompt(),
        'tools'      => ai_tools(),
        'messages'   => $messages,
    ];

    $ch = curl_init(AI_ENDPOINT);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 45,
        CURLOPT_HTTPHEADER     => [
            'content-type: application/json',
            'x-api-key: ' . config('ai.api_key'),
            'anthropic-version: 2023-06-01',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
    ]);

    $raw    = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err    = curl_error($ch);
    curl_close($ch);

    if ($raw === false || $status >= 400) {
        error_log("Anthropic API error (HTTP {$status}): " . ($err ?: substr((string) $raw, 0, 500)));
        throw new RuntimeException('Model call failed.');
    }

    $decoded = json_decode((string) $raw, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('Malformed model response.');
    }

    return $decoded;
}

/**
 * Runs the conversation to completion, executing tools and feeding their results
 * back until the model stops asking for them.
 *
 * @return array{reply:string, recommendations:array, escalated:bool, reference:?string}
 */
function ai_converse(array $history, int $conversationId): array
{
    $messages        = $history;
    $recommendations = [];
    $escalated       = false;
    $reference       = null;
    $inputTokens     = 0;
    $outputTokens    = 0;

    for ($turn = 0; $turn < AI_MAX_TURNS; $turn++) {
        $response = ai_call_model($messages);

        $inputTokens  += (int) ($response['usage']['input_tokens'] ?? 0);
        $outputTokens += (int) ($response['usage']['output_tokens'] ?? 0);

        $content   = $response['content'] ?? [];
        $toolUses  = array_values(array_filter($content, static fn ($b) => ($b['type'] ?? '') === 'tool_use'));

        if (!$toolUses) {
            $text = implode('', array_map(
                static fn ($b) => $b['text'] ?? '',
                array_filter($content, static fn ($b) => ($b['type'] ?? '') === 'text')
            ));

            ai_record_usage($conversationId, $inputTokens, $outputTokens);

            return [
                'reply'           => trim($text),
                'recommendations' => $recommendations,
                'escalated'       => $escalated,
                'reference'       => $reference,
            ];
        }

        // Echo the assistant's turn back verbatim — required before tool_result.
        $messages[] = ['role' => 'assistant', 'content' => $content];

        $results = [];
        foreach ($toolUses as $use) {
            $result = ai_execute_tool($use['name'], $use['input'] ?? [], $conversationId);

            if ($use['name'] === 'search_products') {
                $recommendations = $result['products'] ?? [];
            }
            if ($use['name'] === 'escalate_to_human' && !empty($result['escalated'])) {
                $escalated = true;
            }
            if ($use['name'] === 'create_enquiry' && !empty($result['reference'])) {
                $reference = $result['reference'];
            }

            $results[] = [
                'type'        => 'tool_result',
                'tool_use_id' => $use['id'],
                'content'     => json_encode($result),
            ];
        }

        $messages[] = ['role' => 'user', 'content' => $results];
    }

    // Ran out of turns — hand off rather than loop forever.
    ai_record_usage($conversationId, $inputTokens, $outputTokens);

    return [
        'reply'           => 'Let me get one of the team to pick this up with you directly.',
        'recommendations' => $recommendations,
        'escalated'       => true,
        'reference'       => $reference,
    ];
}

function ai_record_usage(int $conversationId, int $in, int $out): void
{
    execute(
        'UPDATE ai_conversations
            SET input_tokens = input_tokens + ?, output_tokens = output_tokens + ?
          WHERE id = ?',
        [$in, $out, $conversationId]
    );
}

/** The reply used whenever the model is unreachable or unconfigured. */
function ai_fallback_reply(): string
{
    $business = config('business');

    return 'I cannot reach our systems right now. Please call us on '
        . $business['phone'] . ' or message us on WhatsApp and the team will help you straight away.';
}
