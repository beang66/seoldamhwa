"""Trace high-res renders of the main page brush graphics into clean vector SVGs.

Usage: python -I mockups/src/trace_illust.py
Reads  mockups/.render/<name>.png and mockups/.render/meta.json (viewBox of each original graphic)
Writes mockups/src/illust/<name>.svg  (one filled path, same viewBox as the original graphic)
"""
import json, os
import numpy as np
import potrace
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RENDER = os.path.join(HERE, '..', '.render')
OUT = os.path.join(HERE, 'illust')
os.makedirs(OUT, exist_ok=True)
meta = json.load(open(os.path.join(RENDER, 'meta.json'), encoding='utf-8'))

def fmt(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')

for name, m in meta.items():
    im = Image.open(os.path.join(RENDER, name + '.png')).convert('L')
    W, H = im.size
    vx, vy, vw, vh = m['vb']
    sx, sy = vw / W, vh / H
    pt = lambda p: fmt(vx + p.x * sx) + ' ' + fmt(vy + p.y * sy)
    ink = np.array(im) >= 128  # potracer fills the False side, so pass paper as True
    paths = potrace.Bitmap(ink).trace(turdsize=6, alphamax=1.0, opticurve=True, opttolerance=0.3)
    d = []
    for curve in paths:
        d.append('M' + pt(curve.start_point))
        for seg in curve.segments:
            if seg.is_corner:
                d.append('L' + pt(seg.c) + 'L' + pt(seg.end_point))
            else:
                d.append('C' + pt(seg.c1) + ' ' + pt(seg.c2) + ' ' + pt(seg.end_point))
        d.append('Z')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{fmt(vx)} {fmt(vy)} {fmt(vw)} {fmt(vh)}">'
           f'<path fill="#141413" fill-rule="evenodd" d="{"".join(d)}"/></svg>\n')
    open(os.path.join(OUT, name + '.svg'), 'w', encoding='utf-8').write(svg)
    print(name, 'curves', len(paths), 'KB', len(svg) // 1024)
