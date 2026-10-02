#!/usr/bin/env python3
"""Static page builder for the Robann's site.
Each file in src/pages/ starts with a header block:
<!--
title: ...
desc: ...
css: home
js: home
nav: home
-->
Output goes to the site root (index.html, collection.html, ...)."""
import os, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
part = lambda n: (SRC / 'partials' / f'{n}.html').read_text()
NAV = [('collection', 'collection.html', 'Collection'), ('bridal', 'collection.html?c=bridal', 'Bridal'),
       ('custom', 'custom.html', 'Custom Design'), ('watches', 'collection.html?c=watches', 'Watches'),
       ('story', 'story.html', 'Our Story'), ('services', 'services.html', 'Services')]
for f in sorted((SRC / 'pages').glob('*.html')):
    raw = f.read_text()
    m = re.match(r'<!--(.*?)-->\s*', raw, re.S)
    meta = dict(l.split(':', 1) for l in m.group(1).strip().splitlines())
    meta = {k.strip(): v.strip() for k, v in meta.items()}
    body = raw[m.end():]
    links = '\n'.join(
        f'      <li data-fx style="--d:{.1 + i * .06:.2f}s"><a href="{h}"{" aria-current=\"page\"" if meta.get("nav") == k else ""}>{t}</a></li>'
        for i, (k, h, t) in enumerate(NAV))
    css = ''.join(f'\n<link rel="stylesheet" href="assets/css/{c.strip()}.css">' for c in meta.get('css', '').split(',') if c.strip())
    js = ''.join(f'\n<script src="assets/js/{j.strip()}.js" defer></script>' for j in meta.get('js', '').split(',') if j.strip())
    html = (part('head').replace('{{title}}', meta['title']).replace('{{desc}}', meta['desc']).replace('{{css}}', css).replace('{{js}}', js)
            + part('nav').replace('{{links}}', links) + body + part('foot'))
    def merge(m):
        tag = m.group(0); st = re.findall(r'\sstyle="([^"]*)"', tag)
        if len(st) < 2: return tag
        tag = re.sub(r'\sstyle="[^"]*"', '', tag)
        return tag[:-1] + ' style="' + ';'.join(x.strip(';') for x in st) + '">'
    html = re.sub(r'<[a-zA-Z][^<>]*>', merge, html)
    assert '—' not in html, f'em dash in {f.name}'
    (ROOT / f.name).write_text(html)
    print('built', f.name, len(html))
