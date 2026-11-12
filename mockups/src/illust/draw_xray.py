"""Draw the community plant (stem, top leaf cluster, two low leaves) in an x-ray botanical style:
translucent olive leaves, darker rims and veins, overlaps getting darker, a soft haze around it.

Usage: python -I mockups/src/illust/draw_xray.py   -> writes community-tall.svg next to this file
(The earlier black brush version is kept as community-tall-brush.svg.)
"""
import math, os

INK = '#3B4133'      # 짙은 올리브 회색: 윤곽, 줄기
LEAF = '#454C3A'     # 螺青绿 계열: 잎 면
PAPER = '#F3EFE8'    # 잎 가운데를 밝게 비우는 색 (바탕과 같은 톤)

def leaf(x, y, ang, L, W, curl=0.0):
    """Leaf outline and veins from base (x, y) pointing at angle ang (degrees), length L, half-width W.
    curl bends the tip sideways (fraction of L)."""
    a = math.radians(ang); ca, sa = math.cos(a), math.sin(a)
    def P(u, v):  # u along the leaf, v across it, in leaf space -> page space
        v += curl * L * (u / L) ** 2
        return (x + u * ca - v * sa, y + u * sa + v * ca)
    f = lambda p: f'{p[0]:.2f} {p[1]:.2f}'
    tip = P(L, 0)
    outline = (f'M{f(P(0,0))} C{f(P(L*.25, W*1.05))} {f(P(L*.7, W*.95))} {f(tip)} '
               f'C{f(P(L*.7, -W*.85))} {f(P(L*.25, -W*1.0))} {f(P(0,0))} Z')
    inner = (f'M{f(P(L*.12,0))} C{f(P(L*.3, W*.62))} {f(P(L*.65, W*.55))} {f(P(L*.86,0))} '
             f'C{f(P(L*.65, -W*.5))} {f(P(L*.3, -W*.6))} {f(P(L*.12,0))} Z')
    mid = f'M{f(P(0,0))} Q{f(P(L*.5, W*.08))} {f(P(L*.93,0))}'
    veins = []
    for t in (.2, .34, .48, .62):   # side veins stop inside the outline
        for s in (1, -1):
            veins.append(f'M{f(P(L*t,0))} Q{f(P(L*(t+.07), s*W*.32))} {f(P(L*(t+.13), s*W*.55))}')
    return outline, inner, mid, ' '.join(veins)

# same composition as the brush drawing (viewBox 0 0 200 280)
C = (117, 99)                     # where the top leaves meet
LEAVES = [  # (x, y, angle, length, half-width, curl)  sized like the brush leaves
    (*C, -160, 50, 13, -0.06),
    (*C, -108, 36, 10, 0.12),
    (*C, -30, 48, 12.5, 0.05),
    (*C, 16, 42, 10, -0.05),
    (*C, 160, 42, 11, 0.06),
    (*C, 120, 32, 9, 0.05),
    (95, 206, 190, 44, 12, -0.05),
    (96, 233, -14, 38, 9.5, 0.06),
]
STEM = 'M95.5 268 C95 236 93.6 204 96 172 C98.6 140 107 116 117 99'

parts = [leaf(*l) for l in LEAVES]
fills = ''.join(f'<path d="{o}"/>' for o, _, _, _ in parts)
centers = ''.join(f'<path d="{i}"/>' for _, i, _, _ in parts)
rims = ''.join(f'<path d="{o}"/>' for o, _, _, _ in parts)
mids = ''.join(f'<path d="{m}"/>' for _, _, m, _ in parts)
veins = ''.join(f'<path d="{v}"/>' for _, _, _, v in parts)

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280">
<defs>
  <filter id="xr-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".45"/></filter>
  <filter id="xr-haze" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>
<!-- 번진 그림자: X-ray 사진의 뿌연 기운 -->
<g filter="url(#xr-haze)" opacity=".3" fill="{LEAF}">{fills}<path d="{STEM}" fill="none" stroke="{LEAF}" stroke-width="5"/></g>
<!-- 줄기 -->
<path d="{STEM}" fill="none" stroke="{INK}" stroke-opacity=".78" stroke-width="2.6" stroke-linecap="round" filter="url(#xr-soft)"/>
<!-- 반투명한 잎 면: 겹친 곳은 투명도가 쌓여 더 짙어진다 -->
<g fill="{LEAF}" fill-opacity=".4">{fills}</g>
<!-- 잎 가운데를 밝게 비워 가장자리가 짙어 보이게 -->
<g fill="{PAPER}" fill-opacity=".3" filter="url(#xr-soft)">{centers}</g>
<!-- 윤곽, 가운데 잎맥, 곁 잎맥 -->
<g fill="none" stroke="{INK}" stroke-linecap="round" filter="url(#xr-soft)">
  <g stroke-opacity=".85" stroke-width=".9">{rims}</g>
  <g stroke-opacity=".7" stroke-width=".7">{mids}</g>
  <g stroke-opacity=".4" stroke-width=".45">{veins}</g>
</g>
</svg>
'''
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'community-tall.svg')
open(out, 'w', encoding='utf-8').write(svg)
print('wrote', out, len(svg) // 1024, 'KB')
