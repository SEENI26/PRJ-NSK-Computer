"""Report any internal part whose bounds fall outside the case shell."""
import bpy
from mathutils import Vector

W, D, H, T, FOOT = 0.24, 0.45, 0.50, 0.004, 0.020
z0 = FOOT
inner_h = H - FOOT
lim = {
    "X": (-W / 2 + T, W / 2 - T),
    "Y": (-D / 2 + T, D / 2 - T),
    "Z": (z0 + T, z0 + inner_h),
}

bad = 0
parts = sorted(
    [o for o in bpy.data.objects if o.name.startswith("Part_")], key=lambda x: x.name
)
for o in parts:
    corners = [o.matrix_world @ Vector(c) for c in o.bound_box]
    span = {
        "X": (min(c.x for c in corners), max(c.x for c in corners)),
        "Y": (min(c.y for c in corners), max(c.y for c in corners)),
        "Z": (min(c.z for c in corners), max(c.z for c in corners)),
    }
    out = [k for k in "XYZ" if span[k][0] < lim[k][0] - 1e-4 or span[k][1] > lim[k][1] + 1e-4]
    if out:
        bad += 1
        s = "  ".join(f"{k}[{span[k][0]:+.3f},{span[k][1]:+.3f}]" for k in "XYZ")
        print(f"  OUTSIDE {o.name:30} {','.join(out):5} {s}")

print(f"{bad} of {len(parts)} parts protrude" if bad else f"all {len(parts)} parts fit inside the shell")
