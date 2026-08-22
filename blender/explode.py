"""
Lay the build out in assembly order.

Components pull out along -Y (toward the viewer/front) by a distance
proportional to their build order, so the sequence reads left-to-right as depth:
what goes in first sits deepest, what goes in last floats furthest out.

That ordering is not decorative — it mirrors DESKTOP_STEPS in
configurator.js. Each stage constrains the next (a cooler that will not clear
the cabinet, a card the PSU cannot feed), and the diagram exists to make that
legible.

The glass panels are hidden in the exploded view: they occlude the parts the
diagram is meant to explain.
"""
import bpy

# Build order → how far out along -Y each group travels, in metres.
# Groups share a step key so a part and its sub-parts move together.
OFFSETS = {
    "motherboard": 0.28,
    "memory": 0.44,
    "cooling": 0.58,
    "graphics": 0.76,
    "storage": 0.92,
    "psu": 1.06,
}

# Everything is centred on this height so the row reads as one baseline. Parts
# previously kept their in-case Z and stepped up and down across the frame.
DECK = 0.30


def group_of(name):
    """Part_motherboard_socket -> motherboard"""
    stem = name[len("Part_"):]
    for key in OFFSETS:
        if stem == key or stem.startswith(key + "_"):
            return key
    return None


# Mid-height of each group, so recentring preserves internal offsets
# (a heatsink stays on its board rather than being flattened onto the deck).
GROUP_MID = {}
_acc = {}
for ob in bpy.data.objects:
    if ob.name.startswith("Part_"):
        k = group_of(ob.name)
        h = ob.get("home")
        if k and h:
            _acc.setdefault(k, []).append(h[2])
for k, zs in _acc.items():
    GROUP_MID[k] = (min(zs) + max(zs)) / 2

moved = 0
for ob in bpy.data.objects:
    if not ob.name.startswith("Part_"):
        continue
    key = group_of(ob.name)
    if key is None:
        continue
    home = ob.get("home")
    if home is None:
        continue
    # Also lift everything to a common working height so parts do not sink
    # through the floor plane once they leave the case.
    # Keep each group's internal Z relationship, but recentre the group on DECK.
    ob.location = (home[0] + OFFSETS[key], home[1], home[2] - GROUP_MID[key] + DECK)
    moved += 1

# Glass would sit between the camera and every exploded part.
for name in ("Glass_Front", "Glass_Left"):
    g = bpy.data.objects.get(name)
    if g:
        g.hide_render = True
        g.hide_viewport = True

# The dark backdrop panel is also in the way once parts are pulled forward.
shade = bpy.data.objects.get("InteriorShade")
if shade:
    shade.hide_render = False   # keep — it is the ground the parts read against

print(f"OK exploded | {moved} parts moved, glass hidden")
