"""
Unbranded dual-chamber mid-tower cabinet.

Geometry follows docs/21-exploded-build-diagram.md — the silhouette and layout
are generic to this whole class of case. The manufacturer logos on the PSU
shroud and fan hubs in the reference are deliberately omitted: they are that
company's trademark, and this model has to be usable regardless of which
cabinets NSK stocks.

Units are metres, matching Blender's default. Real case dimensions:
  width (X)  0.24   depth (Y) 0.45   height (Z) 0.50
Origin sits at the centre of the floor, so the case stands on Z=0.
"""
import math

import bpy
import bmesh
from mathutils import Matrix

# ── Reset ───────────────────────────────────────────────────────────────────
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for block in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
    for item in list(block):
        block.remove(item)

W, D, H = 0.24, 0.45, 0.50
T = 0.004                      # panel thickness
FOOT = 0.020                   # ground clearance

# Reuse the collection rather than making a new one each run. Repeated runs
# previously left a trail of empty "Cabinet.001…005" collections behind.
for stale in [c for c in bpy.data.collections if c.name.startswith("Cabinet")]:
    bpy.data.collections.remove(stale)
COLL = bpy.data.collections.new("Cabinet")
bpy.context.scene.collection.children.link(COLL)


def box(name, size, loc, parent_to=COLL):
    """
    Axis-aligned box by centre + full size.

    Builds the mesh through bmesh rather than `primitive_cube_add` + scale +
    `transform_apply`. That operator route silently broke the first build:
    `transform_apply` bakes the transform into mesh data AND zeroes the object
    origin, so every part collapsed to (0,0,0), and `size=1` scaled by `size/2`
    produced boxes at half the intended dimensions.
    """
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    sx, sy, sz = size
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
    bm.to_mesh(mesh)
    bm.free()

    ob = bpy.data.objects.new(name, mesh)
    ob.location = loc
    parent_to.objects.link(ob)
    return ob


def disc(name, radius, depth, loc, axis="X", parent_to=COLL):
    """
    Flat cylinder, built the same bmesh way as `box` for the same reason.
    `axis` is the direction the cylinder's depth runs along.
    """
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=False, segments=48,
        radius1=radius, radius2=radius, depth=depth,
    )
    if axis == "X":
        rot = Matrix.Rotation(math.radians(90), 4, "Y")
    elif axis == "Y":
        rot = Matrix.Rotation(math.radians(90), 4, "X")
    else:
        rot = Matrix.Identity(4)
    bmesh.ops.transform(bm, matrix=rot, verts=bm.verts)
    bm.to_mesh(mesh)
    bm.free()

    ob = bpy.data.objects.new(name, mesh)
    ob.location = loc
    parent_to.objects.link(ob)
    return ob


def bevel(ob, width=0.0012, segments=2):
    m = ob.modifiers.new("Bevel", "BEVEL")
    m.width = width
    m.segments = segments
    m.limit_method = "ANGLE"
    m.angle_limit = 1.0


# ── Materials ───────────────────────────────────────────────────────────────
def mat_white():
    m = bpy.data.materials.new("CaseWhite")
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.92, 0.93, 0.95, 1)
    b.inputs["Roughness"].default_value = 0.55
    b.inputs["Metallic"].default_value = 0.0
    return m


def mat_glass():
    """
    Tinted alpha glass, NOT physical transmission.

    Transmission 0.94 without `use_raytrace_refraction` renders as fully
    invisible in EEVEE — the first pass lost the front panel entirely and the
    case read as an open box. Alpha blending gives a panel you can see *and* see
    through, which is what a diagram needs; physical caustics are irrelevant here.
    """
    m = bpy.data.materials.new("Glass")
    m.use_nodes = True
    m.blend_method = "BLEND"
    m.surface_render_method = "BLENDED"   # EEVEE Next's actual switch
    m.show_transparent_back = False       # stops the far pane double-darkening
    m.use_backface_culling = False
    b = m.node_tree.nodes["Principled BSDF"]
    # Dark smoked tint. At 0.30 alpha over a white interior the panel was
    # mathematically transparent but visually absent — nothing to see against a
    # bright ground. Smoked glass gives the panel its own presence, which is
    # also how these cases actually look on a shelf.
    b.inputs["Base Color"].default_value = (0.10, 0.14, 0.22, 1)
    b.inputs["Roughness"].default_value = 0.04
    b.inputs["Metallic"].default_value = 0.0
    b.inputs["Transmission Weight"].default_value = 0.0
    b.inputs["IOR"].default_value = 1.45
    b.inputs["Alpha"].default_value = 0.55
    b.inputs["Specular IOR Level"].default_value = 0.9
    return m


def mat_dark():
    m = bpy.data.materials.new("DarkInterior")
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.030, 0.035, 0.050, 1)
    b.inputs["Roughness"].default_value = 0.75
    return m


def mat_glow(strength=6.0):
    m = bpy.data.materials.new("FanGlow")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (0.80, 0.90, 1.0, 1)
    e.inputs["Strength"].default_value = strength
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(e.outputs["Emission"], out.inputs["Surface"])
    return m


WHITE, GLASS, DARK, GLOW = mat_white(), mat_glass(), mat_dark(), mat_glow()


def paint(ob, m):
    ob.data.materials.clear()
    ob.data.materials.append(m)


# ── Shell ───────────────────────────────────────────────────────────────────
# Dual chamber: the front ~72% of depth is the component bay, the rear strip is
# the cable/PSU chamber behind an internal divider.
z0 = FOOT
inner_h = H - FOOT

floor = box("Floor", (W, D, T), (0, 0, z0 + T / 2))
top = box("Top", (W, D, T), (0, 0, z0 + inner_h - T / 2))
right = box("SidePanel_R", (T, D, inner_h), (W / 2 - T / 2, 0, z0 + inner_h / 2))
backp = box("BackPanel", (W, T, inner_h), (0, D / 2 - T / 2, z0 + inner_h / 2))

for ob in (floor, top, right, backp):
    paint(ob, WHITE)
    bevel(ob)

# Motherboard tray — divides the two chambers.
tray_y = -D / 2 + D * 0.72
tray = box("MoboTray", (W - 2 * T, T, inner_h - 2 * T), (0, tray_y, z0 + inner_h / 2))
paint(tray, WHITE)

# A dark backdrop panel against the tray, NOT a solid volume. The first version
# filled the entire component bay and occluded the fans and shroud completely.
inner = box("InteriorShade", (W - 2.4 * T, 0.002, inner_h - 2.4 * T),
            (0, tray_y - 0.003, z0 + inner_h / 2))
paint(inner, DARK)

# ── Panoramic glass ─────────────────────────────────────────────────────────
# Front + left, no corner pillar — the defining feature of this case class.
gh = inner_h - 0.012
gz = z0 + inner_h / 2
glass_front = box("Glass_Front", (W, 0.003, gh), (0, -D / 2 + 0.0015, gz))
glass_left = box("Glass_Left", (0.003, D * 0.72, gh),
                 (-W / 2 + 0.0015, -D / 2 + D * 0.36, gz))
for g in (glass_front, glass_left):
    paint(g, GLASS)

# ── PSU shroud ──────────────────────────────────────────────────────────────
shroud_h = inner_h * 0.22
shroud = box("PSUShroud", (W - 2.2 * T, D * 0.70, shroud_h),
             (0, -D / 2 + D * 0.35, z0 + T + shroud_h / 2))
paint(shroud, WHITE)
bevel(shroud)

# Two light strips on the shroud face + one below it.
strip_y = -D / 2 + 0.004
for i, (sx, sw) in enumerate([(-0.055, 0.075), (0.030, 0.075)]):
    s = box(f"ShroudStrip_{i}", (sw, 0.002, 0.010),
            (sx, strip_y, z0 + T + shroud_h - 0.016))
    paint(s, GLOW)

low = box("LowerStrip", (0.130, 0.002, 0.009), (0.020, strip_y, z0 + T + 0.012))
paint(low, GLOW)

# ── Side intake fans — three 120 mm, vertical column ────────────────────────
FAN = 0.120
fan_x = W / 2 - T - 0.012
GAP = 0.003
col_h = 3 * FAN + 2 * GAP
col_bottom = z0 + T + shroud_h + 0.004
# Centre the three-fan column in the headroom above the shroud.
head = (z0 + inner_h - 0.006) - col_bottom
col_bottom += max(0.0, (head - col_h) / 2)
for i in range(3):
    cz = col_bottom + FAN / 2 + i * (FAN + GAP)
    fy = -D / 2 + D * 0.34
    # Square housing first, then a smaller lit ring inset into it — the earlier
    # version had frame and ring at the same size, which read as two discs.
    frame = box(f"FanFrame_{i}", (0.022, FAN + 0.006, FAN + 0.006), (fan_x, fy, cz))
    paint(frame, WHITE)
    ring = disc(f"Fan_{i}", FAN / 2 - 0.006, 0.026, (fan_x - 0.004, fy, cz), axis="X")
    paint(ring, GLOW)
    hub = disc(f"FanHub_{i}", 0.020, 0.030, (fan_x - 0.006, fy, cz), axis="X")
    paint(hub, WHITE)

# Rear exhaust, upper-left of the back panel.
rear = disc("Fan_Rear", FAN / 2, 0.022,
            (-W / 2 + 0.075, D / 2 - T - 0.012, z0 + inner_h - 0.085), axis="Y")
paint(rear, GLOW)

# ── Expansion slots — seven, horizontal ─────────────────────────────────────
slot_x = -W / 2 + 0.030
for i in range(7):
    sz = z0 + T + shroud_h + 0.030 + i * 0.019
    s = box(f"Slot_{i}", (0.055, 0.003, 0.014), (slot_x, tray_y + 0.010, sz))
    paint(s, WHITE)

# ── Feet ────────────────────────────────────────────────────────────────────
for sx in (-1, 1):
    for sy in (-1, 1):
        f = box("Foot", (0.028, 0.028, FOOT),
                (sx * (W / 2 - 0.022), sy * (D / 2 - 0.030), FOOT / 2))
        paint(f, WHITE)
        bevel(f, 0.003, 3)

# ── Front I/O ───────────────────────────────────────────────────────────────
io = box("FrontIO", (0.100, 0.020, 0.008), (0, -D / 2 + 0.012, z0 * 0.55))
paint(io, WHITE)

print(f"OK cabinet built | objects: {len(COLL.objects)}")
