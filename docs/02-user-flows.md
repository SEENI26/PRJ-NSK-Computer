# 02 — User Flows

Five flows carry effectively all the value on this site. Each is specified with its
entry points, decision branches, failure states and the server-side effects it triggers.

---

## Flow 1 — Product enquiry (primary conversion)

**Entry:** organic search · category browse · related-product rail · AI assistant

```
/products  ──filter──▶  /products?category=memory
     │                          │
     │                          ▼
     └────────────────▶  /products/[slug]
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
          Enquire on WhatsApp          Call the counter
          (pre-composed)               (tel: — no form)
                    │
                    ▼
       WhatsApp opens with:
         product name · SKU · category
         "price and availability?"
```

**There is no form anywhere on the site.** A spares counter answers WhatsApp in
minutes; a form needs a backend running, an inbox someone watches, and a customer
willing to retype which part they were looking at. Removing it takes a step out of
the funnel *and* a dependency out of the stack.

**The message is composed for them.** `lib/enquiry.ts` builds every WhatsApp
message, so the first thing the shop receives already names the product and SKU.
That removes the single most common opening exchange ("which one?").

**Wholesale is a separate intent.** A distinct CTA composes a trade message with a
`Quantity required:` line, because a reseller and a walk-in customer need different
prices and the counter needs to know which is which from message one.

---

## Flow 2 — PC Builder

```
/build
  ├─ 1 Purpose        7 options       [required]
  ├─ 2 Budget         slider          [required]
  ├─ 3 Brand          4 options       [required]
  ├─ 4 Performance    4 levels        [required]
  ├─ 5 Accessories    5 multi-select  [optional]
  └─ 6 Review         ─────────────▶  WhatsApp, spec pre-composed
```

Step 6 is a **review**, not a details form. The configuration goes to WhatsApp
formatted as readable lines — purpose, budget, brand, performance level,
accessories — so the customer never types their own specification, and WhatsApp
supplies the identity the form used to collect.

**Live estimate.** A range appears once purpose *and* performance are chosen. It
is deliberately a range (±12%), because component pricing moves weekly and a
precise number would be a promise the counter cannot keep.

---

## Flow 3 — Contact

`/contact` carries no form. It offers:

- **WhatsApp** and **Call** as the two primary channels
- **Four pre-composed intents** — product/price, repair, CCTV, wholesale — each
  opening WhatsApp with the subject already written
- **Address, hours and a map link** for visiting the counter

The intent tiles matter: a bare "message us" link leaves the customer to compose
the enquiry, and a lot of them open with "hi" and nothing else.

---

## Flow 4 — AI assistant

```
Visitor opens widget (or 20s nudge)
     │
     ▼
POST /api/v1/ai/chat { session_id, message, page }
     │
     ├─ deterministic escalation check ─── trigger word or >24 turns ──▶ escalate
     │
     ▼
Anthropic Messages API (tools: search_products, create_enquiry, escalate_to_human)
     │
     ├─ tool: search_products ──▶ executed against MySQL, NOT the model's memory
     │                             (the model can never invent a price)
     ├─ recommendations rendered as product cards
     └─ quote rendered as a draft quotation card
     │
     ▼
Once name + (email OR phone) known ──▶ Enquiry created, conversation marked "converted"
     │
     ▼
Escalation ──▶ status: escalated · sales notified (DB + mail) · widget shows handoff notice
```

Failure of the model call is **not** a dead end: the catch branch escalates to a human and
tells the visitor the phone number. See `08-ai-assistant-flow.md` for the full design.

---

## Flow 5 — Admin enquiry lifecycle

```
Lead arrives (any source)
     │
     ▼
  [new] ──assign──▶ owned by a salesperson
     │
     ▼ first status change stamps first_response_at (stops the SLA clock)
  [contacted]
     │
     ├──▶ [quotation-sent] ──▶ [won] ──▶ [closed]
     │                     └──▶ [lost] ──▶ [closed]
     └──▶ [lost] / [closed]
```

**Transitions are validated in the enum, not the UI.** `EnquiryStatus::canTransitionTo()`
rejects illegal moves (Won → New, anything → itself) and the controller surfaces the
`DomainException` as a 422. A malicious or buggy client cannot corrupt the pipeline.

**Every transition writes a timeline row** (`enquiry_status_history`) with actor, from,
to and note. Reconstructing this from an audit log after the fact is unreliable, so it
is recorded as first-class data.

**SLA.** First-response targets come from `Priority::responseHours()` — 4h urgent, 8h high,
24h medium, 48h low. `Enquiry::scopeBreachedSla()` finds everything past target with no
response, which drives the dashboard breach counter.

**Visibility.** Sales staff see only their assigned leads plus unassigned ones, unless
granted `enquiries.view_all`. Admins see everything. Enforced in `EnquiryPolicy::view()`
*and* re-applied as a query constraint in the controller — defence in depth, because a
policy that is only checked per-record does not stop a list endpoint leaking.

---

## Error and empty states

| State | Treatment |
| --- | --- |
| No products match filters | Empty state + "clear filters" + "ask us to source it" |
| No blog results | Empty state + "clear search" + "ask us a question" |
| API unreachable (public page) | `withFallback()` serves local content; page still renders |
| API unreachable (form) | Explicit phone/WhatsApp fallback, never a silent failure |
| 404 | Branded page with the four most likely intended destinations |
| 500 | `error.tsx` with retry, digest reference and the phone number |
| Rate limited | Plain-language message with a wait instruction |

The governing principle: **a visitor who cannot complete a form must always be told how
else to reach a person.** A dead form is a lost lead.
