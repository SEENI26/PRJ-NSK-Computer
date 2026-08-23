#!/usr/bin/env python3
"""WCAG contrast for a colourway's text scale.

A new colourway cannot inherit the dark scale's steps. The dark palette leans
on glow for hierarchy, so its faintest step is far below AA once there is no
glow to help — on paper it measures 3.2:1, which fails on the 11px uppercase
labels that use it. This checks every step against both the page ground and a
card, because a token that passes on one often fails on the other.

    python3 contrast.py                       # check the shipped colourways
    python3 contrast.py "#F6F6F3" "#565C6B"   # ad hoc: background, then foreground(s)
"""
import sys


def _lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = rgb
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)


def ratio(fg, bg):
    a, b = luminance(fg), luminance(bg)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)


def parse(value):
    """Accept '#RRGGBB', 'RRGGBB' or 'r g b'."""
    value = value.strip()
    if value.startswith("#") or len(value.replace(" ", "")) == 6 and "," not in value and " " not in value:
        h = value.lstrip("#")
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    parts = value.replace(",", " ").split()
    return tuple(int(p) for p in parts[:3])


def verdict(r, small_text=True):
    if r >= 7:
        return "AAA"
    if r >= 4.5:
        return "AA"
    if r >= 3:
        return "AA large only" + ("  <-- fails for 11-14px" if small_text else "")
    return "FAIL"


def report(name, bg, fgs):
    print(f"\n{name}  (ground {bg})")
    print("-" * 58)
    for label, fg in fgs:
        r = ratio(parse(fg), parse(bg))
        print(f"  {label:<16} {fg:<10} {r:5.2f}:1   {verdict(r)}")


COLOURWAYS = {
    "dark (:root)": (
        "#080808",
        [("ink", "#FFFFFF"), ("ink-muted", "#A8ACB2"),
         ("ink-subtle", "#7A7F86"), ("ink-faint", "#54585F"),
         ("accent cyan", "#22D3EE")],
    ),
    "professional (.theme-pro) on paper": (
        "#F6F6F3",
        [("ink", "#12141A"), ("ink-muted", "#565C6B"),
         ("ink-subtle", "#606773"), ("ink-faint", "#686E7B"),
         ("accent navy", "#211D71")],
    ),
    "professional (.theme-pro) on card": (
        "#FFFFFF",
        [("ink", "#12141A"), ("ink-muted", "#565C6B"),
         ("ink-subtle", "#606773"), ("ink-faint", "#686E7B"),
         ("accent navy", "#211D71")],
    ),
    "gaming (.theme-gaming)": (
        "#060608",
        [("ink", "#FFFFFF"), ("ink-muted", "#A8ACB2"),
         ("fps-good", "#4ADE80"), ("fps-mid", "#FACC15"),
         ("fps-low", "#F87171"), ("accent cyan", "#22D3EE")],
    ),
}


def main():
    args = sys.argv[1:]
    if args:
        bg, *fgs = args
        report("ad hoc", bg, [(f"fg{i + 1}", f) for i, f in enumerate(fgs)])
    else:
        for name, (bg, fgs) in COLOURWAYS.items():
            report(name, bg, fgs)
    print("\nAA needs 4.5:1 for body and small labels, 3:1 for >=18.66px bold "
          "or >=24px.\nThe faint step matters most: it is what 11px uppercase "
          "labels are set in.\n")


if __name__ == "__main__":
    main()
