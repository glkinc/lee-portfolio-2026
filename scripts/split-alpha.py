"""Split an RGBA PNG into an RGB PNG (transparent areas filled with `bg`) and
a greyscale alpha PNG used as an SVG luminance mask.

usage: python3 -I split-alpha.py in.png out-rgb.png out-alpha.png [#rrggbb]
Pure standard library (no Pillow) so it runs on a stock macOS python3.
"""
import struct, sys, zlib

src, rgb_out, alpha_out = sys.argv[1:4]
hexbg = (sys.argv[4] if len(sys.argv) > 4 else "#000000").lstrip("#")
bg = tuple(int(hexbg[i : i + 2], 16) for i in (0, 2, 4))

data = open(src, "rb").read()
i, idat, w, h, ctype = 8, b"", 0, 0, 6
while i < len(data):
    n = struct.unpack(">I", data[i : i + 4])[0]
    kind = data[i + 4 : i + 8]
    if kind == b"IHDR":
        w, h, depth, ctype = struct.unpack(">IIBB", data[i + 8 : i + 18])
        if depth != 8 or ctype not in (2, 6):
            sys.exit("expected 8-bit RGB/RGBA png")
    elif kind == b"IDAT":
        idat += data[i + 8 : i + 8 + n]
    i += 12 + n

bpp = 4 if ctype == 6 else 3
raw, stride = zlib.decompress(idat), w * bpp
prev, p = bytearray(stride), 0
rgb, alpha = bytearray(), bytearray()
for _ in range(h):
    f = raw[p]
    p += 1
    line = bytearray(raw[p : p + stride])
    p += stride
    for x in range(stride):
        a = line[x - bpp] if x >= bpp else 0
        b = prev[x]
        c = prev[x - bpp] if x >= bpp else 0
        if f == 1:
            line[x] = (line[x] + a) & 255
        elif f == 2:
            line[x] = (line[x] + b) & 255
        elif f == 3:
            line[x] = (line[x] + ((a + b) >> 1)) & 255
        elif f == 4:
            pp = a + b - c
            pa, pb, pc = abs(pp - a), abs(pp - b), abs(pp - c)
            line[x] = (line[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
    prev = line
    rgb.append(0)
    alpha.append(0)
    for x in range(w):
        r, g, bl = line[x * bpp : x * bpp + 3]
        al = line[x * bpp + 3] if bpp == 4 else 255
        k = al / 255
        rgb += bytes(round(v * k + bgv * (1 - k)) for v, bgv in zip((r, g, bl), bg))
        alpha.append(al)


def png(path, color_type, body):
    def chunk(t, b):
        return struct.pack(">I", len(b)) + t + b + struct.pack(">I", zlib.crc32(t + b) & 0xFFFFFFFF)

    head = struct.pack(">IIBBBBB", w, h, 8, color_type, 0, 0, 0)
    open(path, "wb").write(
        b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", head) + chunk(b"IDAT", zlib.compress(bytes(body), 9)) + chunk(b"IEND", b"")
    )


png(rgb_out, 2, rgb)
png(alpha_out, 0, alpha)
