"""
Studio setup + render.

Three-quarter view matching the reference photograph's angle: front-left, very
slightly above, so the panoramic corner reads and the interior is visible
through both glass panels.
"""
import bpy
import math
from mathutils import Vector

OUT = "/private/tmp/claude-501/-Applications-XAMPP-xamppfiles-htdocs-NKS-computers-Website/de8c2dca-f320-4baa-a9a8-27d975dc60cd/scratchpad/cabinet_render.png"

scene = bpy.context.scene

# ── World: dark navy, matching the site's --bg #060818 ──────────────────────
world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.020, 0.026, 0.070, 1)
bg.inputs["Strength"].default_value = 0.22

# ── Camera ──────────────────────────────────────────────────────────────────
for ob in [o for o in bpy.data.objects if o.type in {"CAMERA", "LIGHT"}]:
    bpy.data.objects.remove(ob, do_unlink=True)

cam_data = bpy.data.cameras.new("Cam")
cam_data.lens = 55          # mild tele — keeps verticals from splaying
cam = bpy.data.objects.new("Cam", cam_data)
scene.collection.objects.link(cam)
cam.location = (-0.95, -1.30, 0.62)
scene.camera = cam

target = Vector((0, 0, 0.26))
direction = target - cam.location
cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

# ── Lights ──────────────────────────────────────────────────────────────────
def area(name, loc, energy, size, rot=(0, 0, 0), color=(1, 1, 1)):
    d = bpy.data.lights.new(name, "AREA")
    d.energy = energy
    d.size = size
    d.color = color
    o = bpy.data.objects.new(name, d)
    o.location = loc
    o.rotation_euler = rot
    scene.collection.objects.link(o)
    return o


# Key, front-left high.
area("Key", (-0.85, -1.00, 1.05), 38, 1.1,
     rot=(math.radians(52), 0, math.radians(-42)))
# Fill, right, cool and soft.
area("Fill", (1.05, -0.55, 0.55), 14, 1.4,
     rot=(math.radians(76), 0, math.radians(66)), color=(0.82, 0.88, 1.0))
# Rim from behind to separate the case from the dark ground.
area("Rim", (0.45, 0.95, 0.80), 26, 0.8,
     rot=(math.radians(115), 0, math.radians(160)), color=(0.75, 0.85, 1.0))

# ── Ground ──────────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0, 0))
ground = bpy.context.active_object
ground.name = "Ground"
gm = bpy.data.materials.new("Ground")
gm.use_nodes = True
gb = gm.node_tree.nodes["Principled BSDF"]
gb.inputs["Base Color"].default_value = (0.028, 0.034, 0.075, 1)
gb.inputs["Roughness"].default_value = 0.42
ground.data.materials.append(gm)

# ── Render settings ─────────────────────────────────────────────────────────
scene.view_settings.view_transform = "AgX"   # rolls off highlights instead of clipping
scene.view_settings.look = "AgX - Base Contrast"
scene.render.engine = "BLENDER_EEVEE_NEXT"
ee = scene.eevee
ee.taa_render_samples = 96
try:
    ee.use_raytracing = True          # screen-space reflections/refraction
except AttributeError:
    pass                               # older EEVEE without the toggle
scene.render.resolution_x = 1400
scene.render.resolution_y = 1600
scene.render.film_transparent = False
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = OUT

bpy.ops.render.render(write_still=True)
print(f"OK rendered -> {OUT}")
