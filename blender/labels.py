"""
Callout labels for the exploded diagram.

Wording comes straight from DESKTOP_STEPS in configurator.js. That is the whole
point of the diagram: a visitor who has just clicked through those steps should
recognise the same words here.

Each callout is a numbered step marker, the part name, and a one-line note —
plus a hairline leader dropping to the part. Numbering is legitimate here
because the content genuinely is a sequence: each choice constrains the next.

Text is built as flat mesh facing the camera rather than 3D extruded type,
which stays crisp and avoids lighting the letterforms.
"""
import bpy
import bmesh
from mathutils import Vector

COLL = bpy.data.collections.get("Cabinet")
if COLL is None:
    raise RuntimeError("Run cabinet.py + internals.py + explode.py first")

# Clear any previous label pass.
for ob in [o for o in bpy.data.objects if o.name.startswith("Label_")]:
    bpy.data.objects.remove(ob, do_unlink=True)
for c in [c for c in bpy.data.curves if c.name.startswith("LabelTxt_")]:
    bpy.data.curves.remove(c)

# ── Materials ───────────────────────────────────────────────────────────────
def flat(name, colour, emit=1.0):
    m = bpy.data.materials.get(name)
    if m is None:
        m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*colour, 1)
    e.inputs["Strength"].default_value = emit
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(e.outputs["Emission"], out.inputs["Surface"])
    return m


# Site tokens: --ink #EDF2FF, --tone-accent #67E8F9, --ink-faint #7684AC
INK = flat("LabelInk", (0.93, 0.95, 1.00), 1.6)
ACCENT = flat("LabelAccent", (0.40, 0.91, 0.98), 2.2)
FAINT = flat("LabelFaint", (0.46, 0.52, 0.68), 1.0)

# ── Callouts ────────────────────────────────────────────────────────────────
# (step number, group key, label, note). Labels match configurator step names.
CALLOUTS = [
    ("01", "cabinet", "Cabinet", "Airflow first, lighting second"),
    ("02", "motherboard", "Motherboard", "Must match the processor socket"),
    ("03", "memory", "Memory", "16 GB baseline, 32 GB for editing"),
    ("04", "cooling", "Cooling", "Sized to the chip and the case"),
    ("05", "graphics", "Graphics card", "Sized to the resolution you play at"),
    ("06", "storage", "Storage", "NVMe for the system drive"),
    ("07", "psu", "Power supply", "Rated properly, so it stays stable"),
]

# X positions must track explode.py's OFFSETS. Cabinet stays at origin.
GROUP_X = {
    "cabinet": 0.0,
    "motherboard": 0.28,
    "memory": 0.44,
    "cooling": 0.58,
    "graphics": 0.76,
    "storage": 0.92,
    "psu": 1.06,
}

DECK = 0.30          # the common baseline explode.py centres parts on
TEXT_Y = -0.30       # in front of the parts, toward the camera

# Parts sit 0.14–0.18 m apart, but a label needs roughly 0.30 m of width. Set on
# one line they overlapped into mush. Alternating between two heights doubles
# the room each callout has while keeping the reading order left-to-right.
TIERS = (0.78, 0.60)


def text(name, body, loc, size, mat, align="LEFT"):
    cu = bpy.data.curves.new(f"LabelTxt_{name}", type="FONT")
    cu.body = body
    cu.size = size
    cu.align_x = align
    cu.align_y = "CENTER"
    cu.space_character = 1.05
    ob = bpy.data.objects.new(f"Label_{name}", cu)
    ob.location = loc
    # Stand the text upright facing -Y, i.e. square to the camera.
    ob.rotation_euler = (1.5708, 0, 0)
    COLL.objects.link(ob)
    ob.data.materials.append(mat)
    return ob


def leader(name, x, z_top, z_bottom):
    """Hairline vertical rule from the callout down toward the part."""
    mesh = bpy.data.meshes.new(f"Label_{name}")
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= 0.0012
        v.co.y *= 0.0012
        v.co.z *= (z_top - z_bottom)
    bm.to_mesh(mesh)
    bm.free()
    ob = bpy.data.objects.new(f"Label_{name}", mesh)
    ob.location = (x, TEXT_Y, (z_top + z_bottom) / 2)
    COLL.objects.link(ob)
    ob.data.materials.append(FAINT)
    return ob


made = 0
for i, (num, key, name, note) in enumerate(CALLOUTS):
    x = GROUP_X[key]
    base = TIERS[i % 2]

    # Step number — accent, small.
    text(f"num_{key}", num, (x, TEXT_Y, base + 0.070), 0.024, ACCENT)
    # Part name — the thing being identified.
    text(f"name_{key}", name.upper(), (x, TEXT_Y, base + 0.034), 0.030, INK)
    # One-line note.
    text(f"note_{key}", note, (x, TEXT_Y, base), 0.0165, FAINT)
    # Leader runs from just under the note down to the part row.
    leader(f"lead_{key}", x, base - 0.018, DECK + 0.11)
    made += 1

# ── Title ───────────────────────────────────────────────────────────────────
text("title", "HOW A BUILD GOES TOGETHER", (0.0, TEXT_Y, 1.02), 0.050, INK)
text("sub", "Each choice constrains the next — which is why the order matters",
     (0.0, TEXT_Y, 0.962), 0.022, FAINT)

print(f"OK labels built | {made} callouts")
