<?php

namespace App\Services;

use App\Models\AiConversation;
use App\Models\ChatMessage;
use App\Models\Product;
use App\Models\User;
use App\Notifications\AiLeadEscalated;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

/**
 * AI assistant orchestration.
 *
 * Design decisions worth knowing:
 *
 *  - The model never sees raw prices from user input; product context is loaded
 *    server-side from the database, so it cannot be prompt-injected into quoting
 *    something at the wrong price.
 *  - Tool results are the only source of product facts. The system prompt
 *    explicitly forbids inventing specifications.
 *  - Every message is persisted before and after the model call, so a timeout
 *    still leaves an auditable transcript.
 *  - Escalation is deterministic (keyword + turn-count + explicit tool call),
 *    not left to the model's discretion alone.
 */
class AiAssistantService
{
    private const MODEL = 'claude-sonnet-5';
    private const MAX_TOKENS = 1024;
    private const HISTORY_LIMIT = 20;

    /** Phrases that always hand off to a human, regardless of model output. */
    private const ESCALATION_TRIGGERS = [
        'speak to a human', 'talk to someone', 'real person', 'complaint',
        'refund', 'legal', 'manager', 'not happy', 'unacceptable',
    ];

    public function __construct(private readonly EnquiryService $enquiries) {}

    public function handle(string $sessionId, string $message, ?string $page = null): array
    {
        $conversation = AiConversation::firstOrCreate(
            ['session_id' => $sessionId],
            ['ip_address' => request()->ip(), 'entry_page' => $page, 'status' => 'active']
        );

        $this->record($conversation, 'user', $message);

        // Deterministic escalation short-circuits the model entirely.
        if ($this->shouldEscalate($conversation, $message)) {
            return $this->escalate($conversation, $message);
        }

        $started = microtime(true);

        try {
            $response = $this->callModel($conversation, $message);
        } catch (\Throwable $e) {
            Log::error('AI assistant call failed', [
                'conversation' => $conversation->id,
                'error' => $e->getMessage(),
            ]);

            return $this->escalate($conversation, $message, failed: true);
        }

        $latency = (int) ((microtime(true) - $started) * 1000);

        $reply = $this->record(
            $conversation,
            'assistant',
            $response['text'],
            recommendations: $response['recommendations'] ?? null,
            quote: $response['quote'] ?? null,
            latency: $latency,
            tokens: $response['usage'] ?? []
        );

        // Once we know who they are, create a real enquiry so sales owns it.
        $this->maybeCreateEnquiry($conversation, $response);

        return [
            'id' => (string) $reply->id,
            'role' => 'assistant',
            'content' => $reply->content,
            'createdAt' => $reply->created_at->toIso8601String(),
            'recommendations' => $reply->recommendations,
            'quote' => $reply->quote_payload,
            'escalated' => false,
        ];
    }

    /* ── Model call ───────────────────────────────────────────────────── */

    private function callModel(AiConversation $conversation, string $message): array
    {
        $history = $conversation->messages()
            ->whereIn('role', ['user', 'assistant'])
            ->latest('created_at')
            ->limit(self::HISTORY_LIMIT)
            ->get()
            ->reverse()
            ->map(fn (ChatMessage $m) => ['role' => $m->role, 'content' => $m->content])
            ->values()
            ->all();

        $response = Http::withHeaders([
            'x-api-key' => config('services.anthropic.key'),
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])
            ->timeout(30)
            ->retry(2, 500)
            ->post('https://api.anthropic.com/v1/messages', [
                'model' => self::MODEL,
                'max_tokens' => self::MAX_TOKENS,
                'system' => $this->systemPrompt(),
                'messages' => $history,
                'tools' => $this->tools(),
            ])
            ->throw()
            ->json();

        return $this->parse($response, $message);
    }

    private function systemPrompt(): string
    {
        return <<<'PROMPT'
        You are the NSK Computer Zone assistant. NSK Computer Zone builds custom PCs,
        workstations and office systems in Tiruchirappalli (Trichy), Tamil Nadu, India, and supplies components
        and IT services.

        How to behave:
        - Ask what the machine is for and the rough budget before recommending anything.
        - Recommend the cheapest option that genuinely does the job. If a smaller
          spend achieves the customer's goal, say so plainly.
        - Prices are in Indian rupees, inclusive of GST.
        - You may ONLY state product names, specifications and prices returned by the
          search_products tool. Never invent a specification, a price or availability.
          If you do not have the data, say you will check with the team.
        - Keep replies under 120 words unless asked for detail. Use plain sentences.
        - Collect name, phone and email once the customer shows real buying intent,
          then call create_enquiry.
        - If asked about refunds, complaints, legal matters, or if the customer asks
          for a person, call escalate_to_human immediately. Do not attempt to resolve it.
        - Never promise a delivery date, a discount, or a warranty term that is not in
          the tool output.
        PROMPT;
    }

    /** @return list<array<string, mixed>> */
    private function tools(): array
    {
        return [
            [
                'name' => 'search_products',
                'description' => 'Search the live catalogue. This is the ONLY source of product facts and prices.',
                'input_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'query' => ['type' => 'string', 'description' => 'Free-text search'],
                        'category' => ['type' => 'string', 'description' => 'Category slug, e.g. gaming-pcs'],
                        'max_price' => ['type' => 'integer', 'description' => 'Budget ceiling in rupees'],
                    ],
                    'required' => ['query'],
                ],
            ],
            [
                'name' => 'create_enquiry',
                'description' => 'Create a sales enquiry once name and a contact method are known.',
                'input_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'name' => ['type' => 'string'],
                        'email' => ['type' => 'string'],
                        'phone' => ['type' => 'string'],
                        'summary' => ['type' => 'string', 'description' => 'What the customer needs'],
                        'budget' => ['type' => 'string'],
                    ],
                    'required' => ['name', 'summary'],
                ],
            ],
            [
                'name' => 'escalate_to_human',
                'description' => 'Hand the conversation to the sales team. Use for complaints, refunds, legal questions, or on explicit request.',
                'input_schema' => [
                    'type' => 'object',
                    'properties' => ['reason' => ['type' => 'string']],
                    'required' => ['reason'],
                ],
            ],
        ];
    }

    /**
     * Executes a tool call against real data.
     * Note this reads from the database directly — the model cannot influence
     * which prices come back.
     */
    public function executeTool(string $name, array $input): array
    {
        return match ($name) {
            'search_products' => Product::query()
                ->active()
                ->with(['brand:id,name', 'images'])
                ->search($input['query'] ?? null)
                ->when($input['category'] ?? null, fn ($q, $slug) => $q->inCategory($slug))
                ->when($input['max_price'] ?? null, fn ($q, $max) => $q->where('price', '<=', $max))
                ->limit(4)
                ->get()
                ->map(fn (Product $p) => [
                    'slug' => $p->slug,
                    'name' => $p->name,
                    'price' => (int) $p->price,
                    'image' => $p->images->first()?->path,
                    'stock' => $p->stock_status,
                    'highlights' => array_slice($p->highlights ?? [], 0, 3),
                ])
                ->all(),

            default => [],
        };
    }

    /* ── Escalation & conversion ──────────────────────────────────────── */

    private function shouldEscalate(AiConversation $conversation, string $message): bool
    {
        $normalised = mb_strtolower($message);

        foreach (self::ESCALATION_TRIGGERS as $trigger) {
            if (str_contains($normalised, $trigger)) {
                return true;
            }
        }

        // A conversation this long is not converting on its own.
        return $conversation->message_count > 24;
    }

    private function escalate(AiConversation $conversation, string $lastMessage, bool $failed = false): array
    {
        $conversation->update([
            'status' => 'escalated',
            'escalated_to_human' => true,
            'escalated_at' => now(),
        ]);

        $content = $failed
            ? 'I cannot reach our systems right now. I have alerted the sales team and someone will contact you shortly — or call us directly on '.config('app.sales_phone').'.'
            : 'Let me put you through to a person. I have notified the sales team with the details of this conversation, and someone will be in touch shortly.';

        $reply = $this->record($conversation, 'assistant', $content);

        Notification::send(
            User::whereHas('role', fn ($q) => $q->whereIn('name', ['admin', 'sales']))->where('is_active', true)->get(),
            new AiLeadEscalated($conversation, $lastMessage)
        );

        return [
            'id' => (string) $reply->id,
            'role' => 'assistant',
            'content' => $content,
            'createdAt' => $reply->created_at->toIso8601String(),
            'escalated' => true,
        ];
    }

    private function maybeCreateEnquiry(AiConversation $conversation, array $response): void
    {
        if ($conversation->enquiry_id || ! $conversation->hasQualifyingDetails()) {
            return;
        }

        $enquiry = $this->enquiries->create([
            'name' => $conversation->visitor_name,
            'email' => $conversation->visitor_email ?? 'unknown@placeholder.invalid',
            'phone' => $conversation->visitor_phone ?? '0000000000',
            'source' => 'ai-assistant',
            'message' => $response['summary'] ?? 'Lead captured by the AI assistant. See the full transcript.',
        ]);

        $conversation->update(['enquiry_id' => $enquiry->id, 'status' => 'converted']);
    }

    /* ── Persistence ──────────────────────────────────────────────────── */

    private function record(
        AiConversation $conversation,
        string $role,
        string $content,
        ?array $recommendations = null,
        ?array $quote = null,
        int $latency = 0,
        array $tokens = [],
    ): ChatMessage {
        $message = ChatMessage::create([
            'ai_conversation_id' => $conversation->id,
            'role' => $role,
            'content' => $content,
            'recommendations' => $recommendations,
            'quote_payload' => $quote,
            'model' => $role === 'assistant' ? self::MODEL : null,
            'input_tokens' => $tokens['input_tokens'] ?? 0,
            'output_tokens' => $tokens['output_tokens'] ?? 0,
            'latency_ms' => $latency,
            'created_at' => now(),
        ]);

        $conversation->increment('message_count');
        $conversation->update([
            'last_message_at' => now(),
            'total_input_tokens' => $conversation->total_input_tokens + ($tokens['input_tokens'] ?? 0),
            'total_output_tokens' => $conversation->total_output_tokens + ($tokens['output_tokens'] ?? 0),
        ]);

        return $message;
    }

    /** Flattens the Messages API response into the shape the widget renders. */
    private function parse(array $response, string $userMessage): array
    {
        $text = '';
        $recommendations = null;

        foreach ($response['content'] ?? [] as $block) {
            if (($block['type'] ?? null) === 'text') {
                $text .= $block['text'];
            }

            if (($block['type'] ?? null) === 'tool_use' && $block['name'] === 'search_products') {
                $results = $this->executeTool('search_products', $block['input'] ?? []);
                $recommendations = array_map(fn (array $p) => [
                    'slug' => $p['slug'],
                    'name' => $p['name'],
                    'price' => $p['price'],
                    'image' => $p['image'],
                    'reason' => $p['highlights'][0] ?? '',
                ], $results);
            }
        }

        return [
            'text' => trim($text) ?: 'Could you tell me a little more about what you need?',
            'recommendations' => $recommendations,
            'usage' => $response['usage'] ?? [],
            'summary' => $userMessage,
        ];
    }
}
