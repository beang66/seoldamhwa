"""Draw the main page bojagi bundle in a loose ink-illustration style:
brush-pen lines that swell and thin, some flowers filled solid black with pale streaks, others only outlined,
long thin stems crossing each other, and the indigo hem line kept as the one colour point.

Usage: python -I mockups/src/illust/draw_bojagi.py   -> writes bojagi-ink.svg next to this file
(The earlier pencil version is kept as bojagi-pencil.svg.)
"""
import math, os, re

INK = '#141413'      # build swaps this for currentColor
BLUE = '#2F56A8'
PAPER = '#FBFAF7'

def cubic(p0, p1, p2, p3, n):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out

def parse(d):
    """'M x y C x y x y x y ...' (absolute M/C/L only) -> list of points along the path."""
    tok = re.findall(r'[MLC]|-?\d*\.?\d+', d); i = 0; pts = []; cur = None; cmd = None
    while i < len(tok):
        if tok[i].isalpha(): cmd = tok[i]; i += 1; continue
        if cmd == 'M':
            cur = (float(tok[i]), float(tok[i+1])); pts.append(cur); i += 2; cmd = 'L'
        elif cmd == 'L':
            nxt = (float(tok[i]), float(tok[i+1])); pts += cubic(cur, cur, nxt, nxt, 6)[1:]; cur = nxt; i += 2
        elif cmd == 'C':
            a = (float(tok[i]), float(tok[i+1])); b = (float(tok[i+2]), float(tok[i+3])); c = (float(tok[i+4]), float(tok[i+5]))
            pts += cubic(cur, a, b, c, 18)[1:]; cur = c; i += 6
    return pts

def brush(d, w, seed=0.0, ends=0.15):
    """A brush-pen stroke along path d: thin at both ends, swelling in the middle, with a gentle hand wobble."""
    pts = parse(d)
    L = [0.0]
    for a, b in zip(pts, pts[1:]): L.append(L[-1] + math.dist(a, b))
    tot = L[-1] or 1
    left, right = [], []
    for i, p in enumerate(pts):
        a = pts[max(i-1, 0)]; b = pts[min(i+1, len(pts)-1)]
        dx, dy = b[0]-a[0], b[1]-a[1]; n = math.hypot(dx, dy) or 1
        f = L[i] / tot
        h = w/2 * (ends + (1-ends) * math.sin(math.pi*f) ** .55) * (1 + .22*math.sin(f*11 + seed) + .1*math.sin(f*29 + 2*seed))
        left.append((p[0] - dy/n*h, p[1] + dx/n*h)); right.append((p[0] + dy/n*h, p[1] - dx/n*h))
    poly = left + right[::-1]
    return 'M' + 'L'.join(f'{x:.0f} {y:.0f}' if w > 2.5 else f'{x:.1f} {y:.1f}' for x, y in poly) + 'Z'

def petal(x, y, ang, L, W, curl=0.0):
    """Closed petal / leaf outline as a path string (absolute M/C)."""
    a = math.radians(ang); ca, sa = math.cos(a), math.sin(a)
    def P(u, v):
        v += curl * L * (u / L) ** 2
        return f'{x + u*ca - v*sa:.1f} {y + u*sa + v*ca:.1f}'
    return (f'M {P(0,0)} C {P(L*.28, W*1.1)} {P(L*.72, W*.9)} {P(L,0)} '
            f'C {P(L*.72, -W*.8)} {P(L*.28, -W*1.0)} {P(0,0)}')

def streak(x, y, ang, L):
    a = math.radians(ang)
    return f'M {x + L*.18*math.cos(a):.1f} {y + L*.18*math.sin(a):.1f} L {x + L*.8*math.cos(a):.1f} {y + L*.8*math.sin(a):.1f}'

ink, fills, pale, blue = [], [], [], []

# ---- 보자기 ----
ink.append(brush('M146 372 C118 398 110 444 120 480 C126 502 146 512 172 514', 4.2, 1))
ink.append(brush('M172 514 C250 519 300 518 364 514', 3.2, 2))
ink.append(brush('M364 514 C390 512 410 500 414 476 C422 438 412 396 384 372', 4.2, 3))
ink.append(brush('M210 348 C200 392 198 448 206 510', 1.8, 4))
ink.append(brush('M326 348 C336 392 338 448 332 510', 1.8, 5))
ink.append(brush('M268 344 C266 400 266 460 268 508', 1.1, 6))
ink.append(brush('M248 318 C222 290 196 268 176 272 C160 276 166 300 190 310 C208 318 230 322 248 324', 3.4, 7))
ink.append(brush('M286 318 C312 290 340 270 358 276 C372 282 364 304 342 312 C324 318 304 322 286 324', 3.4, 8))
ink.append(brush('M196 294 C210 298 224 306 236 314', 1.4, 9))
ink.append(brush('M340 296 C326 300 312 307 300 315', 1.4, 10))
ink.append(brush('M88 524 C180 530 360 530 446 521', 1.5, 11, ends=.05))
ink.append(brush('M150 380 C124 404 118 446 126 482 C132 500 148 508 166 511', 1.3, 15, ends=.1))   # 겹쳐 그은 선
ink.append(brush('M380 378 C404 404 414 440 408 474 C404 494 392 504 372 510', 1.3, 16, ends=.1))
ink.append(brush('M190 516 C250 512 310 513 352 518', 1.0, 17, ends=.1))
fills.append('M246 316 C252 304 284 304 290 316 C296 331 283 342 268 342 C251 342 239 331 246 316 Z')   # 매듭: 먹으로 채움
pale.append(brush('M254 318 C262 312 276 312 282 320', 1.2, 12))
blue.append(brush('M250 334 C210 340 170 352 146 372', 3.6, 13))      # 쪽빛 한 줄: 보자기 윗단
blue.append(brush('M286 334 C324 340 360 352 384 372', 3.6, 14))

# ---- 줄기 ----
for d, w, s in [('M262 308 C258 240 248 170 222 120', 2.0, 21), ('M268 308 C276 238 296 190 330 150', 1.8, 22),
                ('M265 308 C266 250 268 206 277 168', 1.6, 23), ('M258 308 C236 262 208 238 182 224', 1.7, 24),
                ('M271 308 C282 272 294 244 306 218', 1.4, 25)]:
    ink.append(brush(d, w, s, ends=.25))
# 잎: 하나는 먹으로 채운 긴 잎, 하나는 윤곽만
fills.append(petal(252, 262, -150, 54, 6.5, .05))
pale.append(brush(streak(252, 262, -150, 54), .9, 26))
ink.append(brush(petal(282, 252, -42, 48, 8, -.06), 1.5, 27, ends=.4))

# ---- 꽃 1: 먹으로 채운 백합 (위 왼쪽) ----
cx, cy = 222, 116
for ang, L, W, c in [(-164, 60, 11, .14), (-124, 66, 12.5, -.08), (-86, 54, 10, .1), (-44, 62, 11.5, -.16), (-2, 50, 9.5, .12), (160, 44, 9, -.1)]:
    fills.append(petal(cx, cy, ang, L, W, c))
    pale.append(brush(streak(cx, cy, ang, L), 1.1, ang))
for ang in (-130, -95, -60):  # 수술
    a = math.radians(ang); ex, ey = cx + 40*math.cos(a), cy + 40*math.sin(a)
    pale.append(brush(f'M {cx} {cy} L {ex:.1f} {ey:.1f}', .9, ang, ends=.6))
    fills.append(f'M {ex+2.2:.1f} {ey:.1f} A 2.2 2.2 0 1 0 {ex-2.2:.1f} {ey:.1f} A 2.2 2.2 0 1 0 {ex+2.2:.1f} {ey:.1f} Z')

# ---- 꽃 2: 윤곽만 그린 국화 (위 오른쪽) ----
cx, cy = 334, 146
for i in range(13):
    ang = -205 + i * 19 + (7 if i % 2 else -4)
    L = 44 + (11 if i % 3 == 0 else 0) - (8 if i % 4 == 1 else 0)
    W = 6.5 + (2.5 if i % 3 == 1 else 0)
    ink.append(brush(petal(cx, cy, ang, L, W, (.2 if i % 2 else -.16) * (1 + (i % 3) * .3)), 1.5, i, ends=.3))
ink.append(brush('M327 146 C327 139 341 139 341 146 C341 153 327 153 327 146', 1.6, 31, ends=.6))

# ---- 꽃 3: 먹으로 채운 작은 데이지 (가운데) ----
cx, cy = 278, 166
for i in range(12):
    fills.append(petal(cx, cy, i * 30 + 8, 26 + (5 if i % 2 else 0), 4.2, .08 if i % 2 else -.06))
fills.append(f'M {cx+4} {cy} A 4 4 0 1 0 {cx-4} {cy} A 4 4 0 1 0 {cx+4} {cy} Z')

# ---- 꽃 4: 윤곽 아네모네 + 먹 꽃술 (왼쪽 아래) ----
cx, cy = 180, 222
for ang, L, W, c in [(-172, 40, 17, .1), (-112, 36, 15, -.08), (-52, 34, 14, .12), (128, 38, 16, -.1), (192, 30, 13, .08)]:
    ink.append(brush(petal(cx, cy, ang, L, W, c), 1.8, ang, ends=.35))
for i in range(9):
    a = math.radians(i * 40 + 10); r = 12 + (4 if i % 2 else 0)
    ink.append(brush(f'M {cx} {cy} L {cx + r*math.cos(a):.1f} {cy + r*math.sin(a):.1f}', 1.8, i, ends=.3))
fills.append(f'M {cx+6.5} {cy} A 6.5 6.5 0 1 0 {cx-6.5} {cy} A 6.5 6.5 0 1 0 {cx+6.5} {cy} Z')

# ---- 봉오리 ----
fills.append('M306 218 C298 206 300 192 308 184 C316 194 316 208 306 218 Z')
ink.append(brush('M298 214 C300 206 302 200 304 196', 1.0, 41))

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 560">'
       f'<g fill="{INK}">' + ''.join(f'<path d="{d}"/>' for d in ink + fills) + '</g>'
       f'<g fill="{PAPER}" opacity=".9">' + ''.join(f'<path d="{d}"/>' for d in pale) + '</g>'
       f'<g fill="{BLUE}">' + ''.join(f'<path d="{d}"/>' for d in blue) + '</g></svg>\n')
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bojagi-ink.svg')
open(out, 'w', encoding='utf-8').write(svg)
print('wrote', out, len(svg) // 1024, 'KB')
