#!/usr/bin/env python3
"""Generate public/og.png — 1200x630 paper-and-ink OG card."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og.png"

W, H = 1200, 630
BG = (247, 246, 242)          # paper
INK = (11, 14, 19)             # graphite
INK_MUTED = (75, 80, 90)
COPPER = (199, 107, 58)        # accent
RULE = (210, 205, 195)

def font(paths, size):
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()

MONO = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
]
SANS_BOLD = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
SANS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# Top rule + tiny meta line (editorial / defense-industry feel)
d.line([(80, 80), (W - 80, 80)], fill=RULE, width=1)
meta_font = font(MONO, 18)
d.text((80, 50), "CBR·LABS  —  HARDWARE REDACTION  —  ALEXANDRIA, VA", fill=INK_MUTED, font=meta_font)

# Wordmark (mono, tracked, with copper dot separator)
mark_font = font(MONO, 64)
mark_left = "CBR"
mark_dot = "·"
mark_right = "LABS"
x = 80
y = 130
gap = 18  # extra padding around dot
lw = d.textlength(mark_left, font=mark_font)
dw = d.textlength(mark_dot, font=mark_font)
d.text((x, y), mark_left, fill=INK, font=mark_font)
d.text((x + lw + gap, y), mark_dot, fill=COPPER, font=mark_font)
d.text((x + lw + gap + dw + gap, y), mark_right, fill=INK, font=mark_font)

# Headline — wrap manually for control
head_font = font(SANS_BOLD, 70)
head_lines = [
    "Hardware Redaction",
    "for iPad & Android Tablets.",
]
y = 250
for line in head_lines:
    d.text((80, y), line, fill=INK, font=head_font)
    y += 84

# Subhead
sub_font = font(SANS, 30)
sub = "Permanent, silicon-level removal of cameras, microphones,\nand wireless radios. Audit-ready chain of custody."
y_sub = y + 12
for line in sub.split("\n"):
    d.text((80, y_sub), line, fill=INK_MUTED, font=sub_font)
    y_sub += 40

# Bottom rule + footer tags
d.line([(80, H - 90), (W - 80, H - 90)], fill=RULE, width=1)
foot_font = font(MONO, 20)
d.text((80, H - 60), "SCIF  ·  COURTROOM  ·  HOSPITAL  ·  CORRECTIONS", fill=INK_MUTED, font=foot_font)
right = "cbr-labs.com"
rw = d.textlength(right, font=foot_font)
d.text((W - 80 - rw, H - 60), right, fill=COPPER, font=foot_font)

img.save(OUT, "PNG", optimize=True)
print(f"wrote {OUT}  ({OUT.stat().st_size:,} bytes)")
