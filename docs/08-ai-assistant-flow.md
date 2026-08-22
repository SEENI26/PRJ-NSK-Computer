# 08 — AI Assistant Flow

Implementation: `backend/app/Services/AiAssistantService.php`,
`backend/app/Http/Controllers/Api/V1/AiAssistantController.php`,
`frontend/src/components/ai/AssistantWidget.tsx`.

---

## What it is for

A sales engineer who is always available. It qualifies a visitor, recommends hardware
from **real catalogue data**, drafts a quotation, captures contact details, and hands
off to a human the moment the conversation stops being a hardware question.

It is explicitly **not** a support bot, and it is not allowed to be the last line of
contact — every failure path ends at a person.

---

## Architecture

```
Browser widget
   │  POST /api/v1/ai/chat { session_id, message, page }
   ▼
AiAssistantController ──▶ AiAssistantService::handle()
   │
   ├─ 1. upsert AiConversation on session_id
   ├─ 2. persist the user message           ◀── written BEFORE the model call,
   │                                             so a timeout still leaves a transcript
   ├─ 3. deterministic escalation check ─── hit? ──▶ escalate(), return
   │
   ├─ 4. build history (last 20 turns)
   ├─ 5. Anthropic Messages API
   │        model: claude-sonnet-5 · max_tokens 1024
   │        system: guardrail prompt
   │        tools:  search_products · create_enquiry · escalate_to_human
   │
   ├─ 6. tool_use? ──▶ executeTool() runs against MySQL directly
   │                    (the model never supplies the price)
   ├─ 7. persist the assistant message + token usage + latency
   ├─ 8. qualifying details known? ──▶ create Enquiry, mark conversation "converted"
   └─ 9. return the rendered payload

   Any throw at step 5 ──▶ escalate(failed: true) ──▶ phone number shown
```

---

## Guardrails

The value of this feature is entirely dependent on it not making things up. Four
mechanisms enforce that, in order of strength:

**1. Tool results are the only source of product facts.**
`search_products` queries MySQL server-side. The model receives names, prices, stock
status and highlights as tool output. It cannot invent a price, because it was never
given the ability to state one that did not come from the database.

**2. The system prompt forbids fabrication explicitly.**
> "You may ONLY state product names, specifications and prices returned by the
> search_products tool. Never invent a specification, a price or availability. If you
> do not have the data, say you will check with the team."

It also forbids promising delivery dates, discounts or warranty terms that are not in
tool output — the three things a salesperson is most tempted to improvise.

**3. Escalation is deterministic, not discretionary.**
Before the model is called at all:

```php
private const ESCALATION_TRIGGERS = [
    'speak to a human', 'talk to someone', 'real person', 'complaint',
    'refund', 'legal', 'manager', 'not happy', 'unacceptable',
];
```

Any match, or a conversation past 24 turns, short-circuits to a human. The model is
never given the chance to attempt a refund conversation.

**4. Prompt injection has a limited blast radius.**
A visitor can certainly instruct the model to misbehave in its *replies*. What they
cannot do is change what `search_products` returns, create an enquiry with forged data
(the enquiry is built from `AiConversation` columns the service controls, not from
model output), or reach any endpoint other than the catalogue read.

---

## Tools

### `search_products`
```json
{ "query": "string", "category": "string?", "max_price": "integer?" }
```
Executes `Product::active()->search()->inCategory()->where('price','<=',…)->limit(4)`.
Returns slug, name, price, image, stock and top three highlights. Rendered by the
widget as tappable product cards linking to the real product page.

### `create_enquiry`
```json
{ "name": "string", "email": "string?", "phone": "string?",
  "summary": "string", "budget": "string?" }
```
Only fires once `hasQualifyingDetails()` is true (name **and** at least one contact
method). Routes through the same `EnquiryService` as every other lead, so an AI lead
gets a reference number, an auto-reply, a sales notification and an audit entry
identically to a form submission.

### `escalate_to_human`
```json
{ "reason": "string" }
```
Sets `status: escalated`, notifies all active admin and sales users by database
notification *and* email, and tells the visitor a person is coming.

---

## Conversation state

| Column | Purpose |
| --- | --- |
| `session_id` | UUID from `sessionStorage`; survives navigation within a session |
| `visitor_name` / `_email` / `_phone` | Progressively collected |
| `status` | `active` → `converted` \| `escalated` \| `abandoned` |
| `intent` | recommendation · comparison · upgrade · quotation · support · general |
| `message_count` | Drives the turn-limit escalation |
| `total_input_tokens` / `total_output_tokens` | Cost accounting per conversation |
| `escalated_to_human`, `escalated_at`, `escalated_to` | Handoff audit |

Every message row additionally stores `model`, `input_tokens`, `output_tokens` and
`latency_ms` — enough to answer "what is this feature costing us and is it getting
slower?" without instrumenting anything else.

---

## Cost control

| Control | Value |
| --- | --- |
| Per-session rate limit | 20/min **and** 200/day |
| History window | Last 20 turns only — an unbounded context is an unbounded bill |
| `max_tokens` | 1024 — replies are meant to be under 120 words |
| Turn ceiling | 24 turns then mandatory handoff |
| Daily budget | `AI_DAILY_TOKEN_BUDGET` env var, checked before dispatch |

The 20-turn history window is the single most important cost control. Without it, a
long conversation re-sends its entire history on every turn and cost grows quadratically.

---

## Failure behaviour

| Failure | Visitor sees |
| --- | --- |
| API timeout / 5xx | "I cannot reach our systems right now. I have alerted the sales team… or call us on `<number>`." Sales notified. |
| Rate limited | Plain message with a wait instruction |
| Network error in browser | Widget renders the same escalation bubble locally |
| Empty model response | Falls back to "Could you tell me a little more about what you need?" |

The rule: **the widget never dead-ends.** Every failure path surfaces a phone number
and a notified human.

---

## Privacy

- Conversations are stored and the widget says so, in the composer footer.
- `ip_address` is on the model's `$hidden` array — never returned by the API.
- Transcripts are visible in the admin panel to admin and sales roles only.
- Retention: 12 months, PII scrubbed on request (see `06-database-schema.md`).
- No transcript content is used for training.

---

## Admin surface

`GET /admin/ai/conversations` lists sessions with status, intent, message count, token
spend and escalation state. `GET /admin/ai/conversations/{id}` replays the full
transcript including the tool calls made, so a salesperson picking up an escalated
conversation can see exactly what the visitor was told.
