# 19 — Gaming product content template

Fill one block per model you stock, send it back, and it becomes a live product
page. The field names match `frontend/src/data/products.js` exactly, so nothing
needs translating.

---

## Why this is a form and not generated content

The brief asked for specifications "verified from official manufacturer sources"
and "never fabricated". Those two requirements are the same requirement, and it
cannot be met by writing from memory:

- **Model names outlive their internals.** An "ASUS TUF Gaming F15" has shipped
  with several different GPUs, panels and cooling assemblies across refreshes.
  Recalled specs are a coin flip on which year you get.
- **A wrong spec is worse than no spec.** A customer who reads "RTX 4060, 165 Hz"
  here and collects a 144 Hz machine has been misled by your website, whatever
  the intention was.
- **Regional SKUs differ.** Indian retail configurations frequently differ from
  the US listings that dominate search results.

So: the specs come off the box, the supplier sheet, or the manufacturer's own
India page. Everything else — the writing, the performance analysis, the pros,
the formatting, the SEO — is done for you once the facts are in.

---

## What to send

Copy this block once per model. Leave anything you are unsure of **blank** rather
than guessing — a blank row is omitted from the page; a wrong row is published.

```
MODEL BLOCK
────────────────────────────────────────────────
Brand:              (ASUS / MSI / Lenovo / HP / Acer …)
Model name:         (exactly as printed on the box)
Model number/SKU:   (e.g. FX507VV4-LP287WS — this is what makes it unambiguous)
Type:               laptop | desktop

CPU:                (full string, e.g. Intel Core i7-13620H)
GPU:                (e.g. NVIDIA GeForce RTX 4060 8 GB GDDR6)
GPU TGP:            (watts, if the sheet states it — matters a lot, often omitted)
RAM:                (e.g. 16 GB DDR5-4800, 2 slots, 1 free)
Storage:            (e.g. 512 GB PCIe 4.0 NVMe, second M.2 slot free)

— Laptops —
Display size:       (e.g. 15.6")
Resolution:         (e.g. 1920 × 1080)
Refresh rate:       (e.g. 144 Hz)
Panel type:         (IPS / VA / OLED)
Brightness/gamut:   (e.g. 250 nits, 45% NTSC — if stated)
Battery:            (e.g. 56 Wh)
Weight:             (e.g. 2.2 kg)
Ports:              (list what is actually on it)

— Desktops —
Motherboard:        (chipset and form factor, e.g. B760M micro-ATX)
Power supply:       (wattage and rating, e.g. 650 W 80+ Bronze)
Cabinet:            (model, and whether tempered glass / mesh)

Cooling:            (e.g. dual fan, 4 heat pipes / 240 mm AIO / tower air cooler)
OS:                 (e.g. Windows 11 Home, or "no OS")
Warranty:           (e.g. 1 year onsite — as the manufacturer states it)

In stock:           yes | no | to order
Notes for us:       (anything a customer asks at the counter — noisy fan,
                     upgrade headroom, panel varies by batch, etc.)
────────────────────────────────────────────────
```

---

## What we write from it

You supply facts; the page copy is produced here in the site's existing voice:

| Section | Source |
| --- | --- |
| Tagline and description | Written from your specs |
| Performance analysis | Derived from the CPU/GPU/panel combination |
| Key features | Written from the spec sheet |
| Best for | Gaming / streaming / editing / CAD, judged on the actual hardware |
| Pros | Written — honest ones, including where a cheaper model would do |
| Enquiry CTA | Automatic — WhatsApp and phone, no price |

**Prices are never shown.** The site renders "Price on request" throughout, which
is already how the rest of the catalogue works and matches the brief.

---

## Images

Manufacturer product photography is copyrighted. Using it on a commercial site
generally requires a dealer agreement, and the site must not imply authorised
dealer status it cannot evidence — see `18-content-audit.md` §3.

**For now:** generic category imagery, not implying a specific SKU.

**The fix:** photograph the units you hold. A phone on a clean surface near a
window is enough. That is always the correct machine, always yours to use, and
shows the customer what they will actually collect. Upload through
`/admin/product-images`.

If you do hold dealer permission for particular brands, say which and we will
wire their approved assets in.

---

## Worked example — what a finished page looks like

Using **placeholder** specs to show the shape. Do not treat these as real.

```
Brand:            ASUS
Model name:       TUF Gaming F15
Model number/SKU: FX507ZC4-HN116W
Type:             laptop
CPU:              Intel Core i5-12500H
GPU:              NVIDIA GeForce RTX 3050 4 GB GDDR6
RAM:              16 GB DDR4-3200, 2 slots, 0 free
Storage:          512 GB PCIe 3.0 NVMe, second M.2 slot free
Display:          15.6", 1920 × 1080, 144 Hz, IPS
Cooling:          Dual fan, self-cleaning, 4 heat pipes
Warranty:         1 year onsite
In stock:         yes
```

→ becomes a page with: an honest performance summary (1080p high settings in
most titles, not a 1440p machine), the upgrade note that both RAM slots are
occupied so an upgrade means replacing sticks, best-for guidance, and a WhatsApp
enquiry CTA. No price, no invented benchmark numbers.

---

## Checklist before a model goes live

- [ ] Specs transcribed from box, supplier sheet or the manufacturer's India page
- [ ] Model number recorded — this is what disambiguates a refresh
- [ ] Image is our own photograph, or a confirmed-permitted asset, or generic
- [ ] Nothing stated that the source does not support
- [ ] Warranty wording matches the manufacturer's, not a paraphrase
