"""
Render the exploded view.

Framing differs from the assembled shot: the exploded layout runs ~0.7 m along
-Y, so the camera pulls back and swings toward the side to see the separation
rather than looking down the axis of it.
"""
import bpy
import math
from mathutils import Vector

OUT = "/private/tmp/claude-501/-Applications-XAMPP-xamppfiles-htdocs-NKS-computers-Website/de8c2dca-f320-4baa-a9a8-27d975dc60cd/scratchpad/exploded_render.png"

scene = bpy.context.scene

# ── World ───────────────────────────────────────────────────────────────────
world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.020, 0.026, 0.070, 1)   # site --bg #060818
bg.inputs["Strength"].default_value = 0.22

# ── Camera ──────────────────────────────────────────────────────────────────
for ob in [o for o in bpy.data.objects if o.type in {"CAMERA", "LIGHT"}]:
    bpy.data.objects.remove(ob, do_unlink=True)

cam_data = bpy.data.cameras.new("Cam")
cam_data.lens = 45   # holds the spread plus the callout band above it
cam = bpy.data.objects.new("Cam", cam_data)
scene.collection.objects.link(cam)
# Well off to the left and forward, so the -Y separation reads as spread rather
# than as parts stacked behind one another.
# Front-on and centred over the spread. The camera was previously off to the
# left looking down the -Y axis, which made the parts overlap instead of
# reading as a sequence.
cam.location = (0.52, -2.75, 0.62)
scene.camera = cam

# Aim at the middle of the exploded spread, not the case centre.
target = Vector((0.52, 0.02, 0.58))  # centred between parts row and callout band
cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()

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


area("Key", (-0.40, -1.80, 1.40), 90, 2.2,
     rot=(math.radians(42), 0, math.radians(-16)))
area("Fill", (1.90, -1.20, 0.70), 34, 2.0,
     rot=(math.radians(70), 0, math.radians(40)), color=(0.82, 0.88, 1.0))
area("Rim", (0.35, 0.85, 0.85), 34, 1.0,
     rot=(math.radians(115), 0, math.radians(160)), color=(0.75, 0.85, 1.0))

# ── Ground ──────────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
ground = bpy.context.active_object
ground.name = "Ground"
gm = bpy.data.materials.get("Ground") or bpy.data.materials.new("Ground")
gm.use_nodes = True
gb = gm.node_tree.nodes["Principled BSDF"]
gb.inputs["Base Color"].default_value = (0.028, 0.034, 0.075, 1)
gb.inputs["Roughness"].default_value = 0.42
ground.data.materials.clear()
ground.data.materials.append(gm)

# ── Render ──────────────────────────────────────────────────────────────────
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Base Contrast"
scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.eevee.taa_render_samples = 128
try:
    scene.eevee.use_raytracing = True
except AttributeError:
    pass

scene.render.resolution_x = 2000
scene.render.resolution_y = 1150
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = OUT

bpy.ops.render.render(write_still=True)
print(f"OK rendered -> {OUT}")
