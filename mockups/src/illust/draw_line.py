"""Draw the community plant as a pencil line drawing, matching the bojagi pencil sketch on the main page:
thin even strokes (#3b3a37), leaves as outlines with a faint midrib, no fills.

Usage: python -I mockups/src/illust/draw_line.py   -> writes community-tall.svg next to this file
(The black brush version is kept as community-tall-brush.svg.)
"""
import math, os

STROKE = '#3b3a37'

def leaf(x, y, ang, L, W, curl=0.0):
    a = math.radians(ang); ca, sa = math.cos(a), math.sin(a)
    def P(u, v):
        v += curl * L * (u / L) ** 2
        return f'{x + u*ca - v*sa:.1f} {y + u*sa + v*ca:.1f}'
    outline = (f'M{P(0,0)} C{P(L*.28, W*1.05)} {P(L*.72, W*.9)} {P(L,0)} '
               f'C{P(L*.72, -W*.85)} {P(L*.28, -W*1.0)} {P(0,0)} Z')
    mid = f'M{P(L*.06,0)} Q{P(L*.5, W*.1)} {P(L*.86,0)}'
    return outline, mid

C = (117, 99)
LEAVES = [(*C, -160, 50, 12, -0.06), (*C, -108, 36, 9, 0.12), (*C, -30, 48, 11.5, 0.05),
          (*C, 16, 42, 9.5, -0.05), (*C, 160, 42, 10, 0.06), (*C, 120, 32, 8.5, 0.05),
          (95, 206, 190, 44, 11, -0.05), (96, 233, -14, 38, 9, 0.06)]
STEM = 'M95.5 268 C95 236 93.6 204 96 172 C98.6 140 107 116 117 99'

parts = [leaf(*l) for l in LEAVES]
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280">'
       f'<g fill="none" stroke="{STROKE}" stroke-width="1.2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round">'
       f'<path d="{STEM}"/>' + ''.join(f'<path d="{o}"/>' for o, _ in parts) + '</g>'
       f'<g fill="none" stroke="{STROKE}" stroke-width=".8" vector-effect="non-scaling-stroke" stroke-linecap="round" opacity=".6">' + ''.join(f'<path d="{m}"/>' for _, m in parts) + '</g>'
       f'<path d="M70 270 C90 273 112 273 130 270" fill="none" stroke="{STROKE}" stroke-width=".8" vector-effect="non-scaling-stroke" opacity=".45" stroke-linecap="round"/>'
       '</svg>\n')
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'community-tall.svg')
open(out, 'w', encoding='utf-8').write(svg)
print('wrote', out, len(svg), 'bytes')
