#!/usr/bin/env python3
"""Turn dist/ into a folder that works as a private claude.ai artifact preview.

Usage: python3 scripts/artifact-preview.py dist <out_dir>
Rewrites root-relative links to relative ones, points directory links at index.html,
renames _astro/ to assets/ (names starting with _ are reserved), strips the root page's
document skeleton, and writes <out_dir>/../preview-files.json mapping published paths.
"""
import json, os, re, shutil, sys
src, out = sys.argv[1], sys.argv[2]
shutil.rmtree(out, ignore_errors=True)
shutil.copytree(src, out)
if os.path.isdir(f'{out}/_astro'):
    os.rename(f'{out}/_astro', f'{out}/assets')
for d, _, fs in os.walk(f'{out}/assets'):
    for f in fs:
        if f.startswith('_'):
            os.rename(os.path.join(d, f), os.path.join(d, f.lstrip('_')))

def fix(html, rel_dir):
    up = '../' * (0 if rel_dir in ('', '.') else rel_dir.count('/') + 1)
    def rep(m):
        attr, q, url = m.group(1), m.group(2), m.group(3)
        if url.startswith('//'):
            return m.group(0)
        path, sep, frag = re.match(r'([^#?]*)([#?]?)(.*)', url[1:]).groups()
        if path == '' or path.endswith('/'):
            path += 'index.html'
        path = re.sub(r'^_astro/_?', 'assets/', path) if path.startswith('_astro/') else path
        return f'{attr}={q}{up}{path}{sep}{frag}{q}'
    return re.sub(r'\b(href|src)=(["\'])(/[^"\']*)\2', rep, html)

files = {}
for d, _, fs in os.walk(out):
    for f in fs:
        p = os.path.join(d, f)
        rel = os.path.relpath(p, out)
        if f == 'CNAME':
            os.remove(p); continue
        if f.endswith('.html'):
            s = fix(open(p, encoding='utf-8').read(), os.path.dirname(rel))
            if rel == 'index.html':
                s = re.sub(r'<!doctype html>|</?html[^>]*>|</?head>|</?body[^>]*>', '', s, flags=re.I)
            open(p, 'w', encoding='utf-8').write(s)
        if rel != 'index.html':
            files[rel] = rel
json.dump(files, open(os.path.join(os.path.dirname(out.rstrip('/')), 'preview-files.json'), 'w'), indent=1)
print(len(files), 'supporting files')
