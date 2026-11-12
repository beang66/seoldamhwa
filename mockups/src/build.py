"""Build the mockup pages so they render however they are opened (file://, preview pane, server).

Usage: python -I mockups/src/build.py
- Pages:    mockups/src/*.html (files starting with "_" are partials, not pages)
- Partials: <!--@include _name.html-->  and  /*@include _name.css*/  are replaced by the file's content
- Vectors:  <!--@svginner illust/name.svg--> is replaced by the inner paths of that file
- Photos:   __IMG_name__ becomes url(data URI) for CSS, __SRC_name__ a bare data URI for <img src>
Writes mockups/<page name>.html            (with the reference photos, for working on the design)
   and mockups/<page name>-share.html      (photos swapped for plain placeholders, safe to send to others)
"""
import base64, glob, io, os, re
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PLACEHOLDER = (228, 225, 218)  # 사진 자리의 바탕색, 한지 톤
cache = {}

def data_uri(name, share=False):
    """A photo as a data URI. In the share build every photo becomes a plain placeholder of the same shape,
    because the reference photos in img/ belong to other people."""
    if (name, share) not in cache:
        im = Image.open(os.path.join(HERE, 'img', name + '.jpg')).convert('RGB')
        im.thumbnail((640, 640))
        if share:
            im = Image.new('RGB', im.size, PLACEHOLDER)
        buf = io.BytesIO()
        im.save(buf, 'JPEG', quality=70)
        cache[(name, share)] = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
    return cache[(name, share)]

def svginner(m):
    """Inner markup of a traced vector file, with its fill switched to currentColor."""
    svg = open(os.path.join(HERE, m.group(1)), encoding='utf-8').read()
    inner = svg[svg.index('>') + 1:svg.rindex('</svg>')]
    return inner.replace('fill="#141413"', 'fill="currentColor"')

def partial(m):
    return open(os.path.join(HERE, m.group(1)), encoding='utf-8').read().rstrip('\n')

for src in sorted(glob.glob(os.path.join(HERE, '*.html'))):
    if os.path.basename(src).startswith('_'):
        continue
    html = open(src, encoding='utf-8').read()
    for _ in range(5):  # partials may include other partials
        before = html
        html = re.sub(r'<!--@include (_[\w.-]+)-->', partial, html)
        html = re.sub(r'/\*@include (_[\w.-]+)\*/', partial, html)
        if html == before:
            break
    html = re.sub(r'<!--@svginner ([\w./-]+)-->', svginner, html)
    used = sorted(set(re.findall(r'__IMG_([\w-]+)__', html)))
    used += sorted(set(re.findall(r'__SRC_([\w-]+)__', html)) - set(used))
    for share in (False, True):
        page = re.sub(r'__IMG_([\w-]+)__', lambda m: 'url(' + data_uri(m.group(1), share) + ')', html)
        page = re.sub(r'__SRC_([\w-]+)__', lambda m: data_uri(m.group(1), share), page)
        name = os.path.splitext(os.path.basename(src))[0] + ('-share' if share else '') + '.html'
        out = os.path.join(HERE, '..', name)
        open(out, 'w', encoding='utf-8').write(page)
        print('wrote', os.path.normpath(out), len(page) // 1024, 'KB', used if not share else '(placeholders)')
