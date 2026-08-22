# 20 — Brands per category

The configurator at `/build` has brand filters built and working. They are
**invisible right now** because there is nothing to filter: almost every
catalogue entry is a multi-brand range page rather than a branded product.

Fill this in and the filters appear automatically — no code change.

---

## Why the filters are hidden rather than empty

`Configurator.jsx` derives the filter row from the products in each category and
drops anything whose brand is `Multi-brand`. Fewer than two named brands means
no filter row. An empty or single-option filter bar is worse than none: it
implies a choice that does not exist.

Current state:

| Category | Products | Named brands |
| --- | --- | --- |
| processors | 3 | Intel |
| cabinets-power | 3 | ANT Esport |
| motherboards | 1 | — |
| graphics-cards | 1 | — |
| monitors | 1 | — |
| gaming-gear | 1 | — |
| gaming-laptops | 1 | — |
| memory | 4 | — |
| storage | 3 | — |
| cooling | 1 | — |
| setup-furniture | 1 | — |

---

## What to send

Just the brands you actually stock or can reliably source, per category. Model
names are welcome but not required at this stage — brands alone switch the
filters on.

```
MOTHERBOARDS
  e.g. MSI, Gigabyte, ASUS, ASRock
  →

GRAPHICS CARDS
  e.g. ASUS, MSI, Gigabyte, Zotac, Inno3D, Colorful
  →

MONITORS
  e.g. LG, Samsung, Acer, BenQ, ViewSonic, Zebronics
  →

KEYBOARDS / MICE / HEADSETS  (gaming-gear)
  e.g. Logitech, Redragon, HyperX, Corsair, Ant Esport, Zebronics
  →

GAMING LAPTOPS
  e.g. ASUS, MSI, Lenovo, HP, Acer
  →

MEMORY
  You already list: Samsung, Hynix, Crucial, Lexar, Corsair, ANT Esport,
  Consistent, Micron, Frontech — confirm and I will split the range page
  into branded entries.
  →

STORAGE
  e.g. WD, Seagate, Samsung, Crucial, Kingston
  →

COOLING
  e.g. Deepcool, Cooler Master, ANT Esport, Corsair
  →

DESKS & CHAIRS
  e.g. Green Soul, Cellbell, Ant Esport
  →

CABINETS
  Already listed: ANT Esport. Others?
  →
```

---

## What happens next

For each category you fill, one of two things:

**A few brands, similar products** — the range page stays and gains a brand
field per variant. Lightest option.

**Distinct models worth their own page** — split into individual products. Better
for search, and lets the configurator show a real choice. This needs the spec
detail in `19-gaming-product-template.md`.

Either way the filter row appears as soon as a category holds two or more named
brands.

---

## One caution

Listing a brand here means the site says you stock it. That is ordinary
referential use and entirely fine — but it is **not** the same as claiming
authorised-dealer status, which the site must not do without a contract to point
at. See `18-content-audit.md` §9, where four such claims were removed.

So: brands you genuinely sell. Not brands you could get hold of if someone asked.
