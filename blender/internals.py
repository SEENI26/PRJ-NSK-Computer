"""
Internal components for the exploded build diagram.

Each part is a separate object named `Part_<key>`, where <key> matches a step in
frontend/src/data/configurator.js DESKTOP_STEPS. That link is deliberate: the
diagram exists to make the configurator's ordering legible, so the two must not
drift apart.

Every part also carries its assembled position in a custom property, so the
explode pass can interpolate between assembled and separated without hard-coding
positions twice.

Run AFTER cabinet.py — this adds to the existing Cabinet collection.
"""
import math

import bpy
import bmesh
from mathutils import Matrix

COLL = bpy.data.collections.get("Cabinet")
if COLL is None:
    raise RuntimeError("Run cabinet.py first — no Cabinet collection")

# Case constants, mirroring cabinet.py.
W, D, H = 0.24, 0.45, 0.50
T = 0.004
FOOT = 0.020
z0 = FOOT
inner_h = H - FOOT
shroud_h = inner_h * 0.22
tray_y = -D / 2 + D * 0.72
shroud_top = z0 + T + shroud_h


def box(name, size, loc):
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
    COLL.objects.link(ob)
    # Remember where this belongs when assembled.
    ob["home"] = list(loc)
    return ob


def disc(name, radius, depth, loc, axis="Z"):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=32,
                          radius1=radius, radius2=radius, depth=depth)
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
    COLL.objects.link(ob)
    ob["home"] = list(loc)
    return ob


# ── Materials ───────────────────────────────────────────────────────────────
def simple(name, colour, rough=0.5, metal=0.0):
    m = bpy.data.materials.get(name)
    if m is None:
        m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*colour, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    return m


PCB = simple("PCB", (0.045, 0.075, 0.060), 0.62)          # board green-black
HEATSINK = simple("Heatsink", (0.52, 0.55, 0.60), 0.34, 0.85)
GPU_SHELL = simple("GPUShell", (0.10, 0.11, 0.13), 0.42)
RAM_PCB = simple("RamPCB", (0.09, 0.10, 0.13), 0.55)
SSD = simple("SSD", (0.16, 0.17, 0.20), 0.45)
PSU_BODY = simple("PSUBody", (0.12, 0.13, 0.16), 0.40)
COOLER = simple("CoolerMetal", (0.62, 0.65, 0.70), 0.28, 0.90)

ACCENT = bpy.data.materials.get("FanGlow")  # reuse the emissive from cabinet.py


def paint(ob, m):
    ob.data.materials.clear()
    ob.data.materials.append(m)


# Remove any previous run's parts so this is re-runnable.
for ob in [o for o in COLL.objects if o.name.startswith("Part_")]:
    bpy.data.objects.remove(ob, do_unlink=True)

# ── Motherboard (step: motherboard) ─────────────────────────────────────────
# ATX is 305 × 244 mm. Mounted flat against the tray, standing vertically.
MB_W, MB_H = 0.244, 0.244
mb_y = tray_y - 0.008
mb_z = shroud_top + MB_H / 2 + 0.010
mb = box("Part_motherboard", (MB_W * 0.92, 0.003, MB_H), (0, mb_y, mb_z))
paint(mb, PCB)

# CPU socket area + VRM heatsinks, so the board is not a bare slab.
sock = box("Part_motherboard_socket", (0.045, 0.006, 0.045), (0.010, mb_y - 0.004, mb_z + 0.045))
paint(sock, HEATSINK)
vrm = box("Part_motherboard_vrm", (0.014, 0.006, 0.070), (0.070, mb_y - 0.004, mb_z + 0.040))
paint(vrm, HEATSINK)
chip = box("Part_motherboard_chipset", (0.030, 0.005, 0.030), (0.010, mb_y - 0.004, mb_z - 0.070))
paint(chip, HEATSINK)

# ── Memory (step: memory) ───────────────────────────────────────────────────
# Two DIMMs, 133 × 31 mm, stood on edge beside the socket.
for i in range(2):
    r = box(f"Part_memory_{i}", (0.006, 0.004, 0.031),
            (-0.030 + i * 0.011, mb_y - 0.006, mb_z + 0.055))
    paint(r, RAM_PCB)
    lit = box(f"Part_memory_lit_{i}", (0.005, 0.005, 0.004),
              (-0.030 + i * 0.011, mb_y - 0.006, mb_z + 0.072))
    paint(lit, ACCENT)

# ── CPU cooler (step: cooling) ──────────────────────────────────────────────
# Tower air cooler over the socket — the sensible default for most builds.
cool_body = box("Part_cooling", (0.075, 0.062, 0.090), (0.010, mb_y - 0.045, mb_z + 0.048))
paint(cool_body, COOLER)
cool_fan = disc("Part_cooling_fan", 0.048, 0.020, (0.010, mb_y - 0.088, mb_z + 0.048), axis="Y")
paint(cool_fan, ACCENT)

# ── Graphics card (step: graphics) ──────────────────────────────────────────
# 300 × 130 mm dual-slot, horizontal in the top PCIe slot.
gpu_z = mb_z - 0.020
gpu = box("Part_graphics", (0.148, 0.115, 0.040), (-0.005, mb_y - 0.062, gpu_z))
paint(gpu, GPU_SHELL)
for i in range(2):
    gf = disc(f"Part_graphics_fan_{i}", 0.030, 0.008,
              (-0.040 + i * 0.070, mb_y - 0.062, gpu_z + 0.021), axis="Z")
    paint(gf, ACCENT)

# ── Storage (step: storage) ─────────────────────────────────────────────────
# M.2 NVMe lying flat on the board below the GPU.
nvme = box("Part_storage", (0.022, 0.004, 0.080), (0.045, mb_y - 0.006, mb_z - 0.030))
paint(nvme, SSD)

# ── Power supply (not a configurator step, but part of the build) ───────────
# ATX PSU in the shroud basement, rear-mounted.
psu = box("Part_psu", (0.150, 0.086, 0.130), (0, -D / 2 + 0.150, z0 + T + 0.067))
paint(psu, PSU_BODY)
psu_fan = disc("Part_psu_fan", 0.052, 0.014, (0, -D / 2 + 0.150, z0 + T + 0.128), axis="Z")
paint(psu_fan, ACCENT)

parts = [o for o in COLL.objects if o.name.startswith("Part_")]
print(f"OK internals built | {len(parts)} parts")
