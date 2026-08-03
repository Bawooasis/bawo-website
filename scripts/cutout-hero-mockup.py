"""Cut the flat black backdrop off the hero phone mockup and crop to the device.

Flood-fills near-black inward from the image border so the dark app screen stays
opaque, then emits a 2x asset. The screenshot only carries ~324px of real device
width, so the upscale is Lanczos + unsharp: the browser then *downsamples* the
asset at the size we render it, which is far sharper than letting it upscale.

Usage: python3 scripts/cutout-hero-mockup.py <source> <destination>
"""

import sys
from collections import deque

from PIL import Image, ImageFilter

SRC, DST = sys.argv[1], sys.argv[2]
THRESHOLD = 46  # max channel value still treated as backdrop black
PAD = 6
SCALE = 2

img = Image.open(SRC).convert("RGB")
w, h = img.size
px = img.load()

background = bytearray(w * h)
queue = deque()


def is_dark(x, y):
    r, g, b = px[x, y]
    return max(r, g, b) <= THRESHOLD


for x in range(w):
    for y in (0, h - 1):
        if not background[y * w + x] and is_dark(x, y):
            background[y * w + x] = 1
            queue.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if not background[y * w + x] and is_dark(x, y):
            background[y * w + x] = 1
            queue.append((x, y))

while queue:
    x, y = queue.popleft()
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and not background[ny * w + nx] and is_dark(nx, ny):
            background[ny * w + nx] = 1
            queue.append((nx, ny))

alpha = Image.frombytes("L", (w, h), bytes(255 if not v else 0 for v in background))

bbox = alpha.getbbox()
box = (
    max(bbox[0] - PAD, 0),
    max(bbox[1] - PAD, 0),
    min(bbox[2] + PAD, w),
    min(bbox[3] + PAD, h),
)

rgb = img.crop(box)
mask = alpha.crop(box)
cw, ch = rgb.size
target = (cw * SCALE, ch * SCALE)

rgb = rgb.resize(target, Image.LANCZOS)
# Recovers edge definition the JPEG + upscale softened, without haloing the UI text.
rgb = rgb.filter(ImageFilter.UnsharpMask(radius=1.6, percent=115, threshold=3))

mask = mask.resize(target, Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.8))

out = rgb.convert("RGBA")
out.putalpha(mask)

if DST.endswith(".webp"):
    # Lossless alpha PNG of this device runs ~1.4MB; WebP q92 holds the UI text
    # crisp at a fraction of that.
    out.save(DST, "WEBP", quality=92, method=6)
else:
    out.save(DST, optimize=True)

print(f"source {w}x{h} -> device {cw}x{ch} -> emitted {target[0]}x{target[1]}")
