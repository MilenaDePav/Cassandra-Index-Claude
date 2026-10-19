#!/usr/bin/env python3
"""Fold new research rounds into the editor's review list and the incident entry.

Usage:
  python3 research/tools/build_review.py <review_dir> <round_dir> [<round_dir> ...]

<review_dir> holds sources.json and coverage.json for the review app. Every *.json file in each
<round_dir> (protocol schema) is read; sources whose URL is already listed are skipped. New
sources get an automatic recommendation (they have not had the independent reviewer pass) and a
"Round N" marker. Checklists are added to coverage.json. Then the incident YAML is rebuilt from
every source not recommended for exclusion.
"""
import hashlib, json, re, sys
from pathlib import Path
from urllib.parse import urlsplit

import yaml

review, rounds = Path(sys.argv[1]), [Path(p) for p in sys.argv[2:]]
ROOT = Path(__file__).resolve().parents[2]
ENTRY = ROOT / 'src/data/incidents/2026-openai-hugging-face-evaluation-breakout.yaml'

TYPES = {'primary-disclosure': 'Primary disclosure', 'official': 'Official', 'legislation': 'Legislation', 'advisory': 'Security advisory', 'paper': 'Peer-reviewed paper',
         'preprint': 'Preprint', 'report': 'Report', 'think-tank': 'Think tank', 'newsletter': 'Newsletter', 'blog-expert': 'Expert blog', 'forum-expert': 'Expert forum post',
         'news': 'News', 'explainer': 'Explainer', 'podcast': 'Podcast', 'video': 'Video or talk', 'repository': 'Repository', 'dataset': 'Dataset'}
CATS = {'official': ['official', 'legislation', 'advisory'], 'disclosures': ['primary-disclosure'], 'reports': ['report', 'paper', 'preprint'], 'think-tanks': ['think-tank'],
        'commentary': ['newsletter', 'blog-expert', 'forum-expert', 'explainer'], 'news': ['news'], 'media': ['podcast', 'video'], 'data': ['dataset', 'repository']}
T2C = {t: c for c, ts in CATS.items() for t in ts}
DISC = {'technical-safety', 'cybersecurity', 'governance-policy', 'law-regulation', 'ethics-philosophy', 'security-geopolitics', 'general'}
THEMES = {'ai-oversight-of-ai', 'agent-evaluation', 'containment-and-control', 'multi-agent-risk', 'reward-hacking', 'internal-deployment', 'incident-reporting',
          'liability-for-agents', 'ai-cyber-offence', 'ml-supply-chain'}
EXCLUDED_HOSTS = [l.split('|')[1].strip().lower() for l in (ROOT / 'research/EXCLUDED.md').read_text().splitlines()
                  if l.startswith('|') and '.' in l.split('|')[1] and ' ' not in l.split('|')[1].strip()]
DATE = re.compile(r'^\d{4}-\d{2}(-\d{2})?$')


def norm(u):
    p = urlsplit(u.strip())
    return (p.netloc.lower().removeprefix('www.') + re.sub(r'/+$', '', p.path)).lower()


def map_type(t):
    if t in TYPES:
        return t
    t = (t or '').lower()
    for k in ('think', 'podcast', 'video', 'news', 'newsletter', 'legisl', 'advis', 'preprint', 'paper', 'dataset', 'repo', 'forum', 'blog', 'official'):
        if k in t:
            return {'think': 'think-tank', 'legisl': 'legislation', 'advis': 'advisory', 'repo': 'repository', 'forum': 'forum-expert', 'blog': 'blog-expert'}.get(k, k)
    return 'report'


sources = json.loads((review / 'sources.json').read_text())
coverage = json.loads((review / 'coverage.json').read_text())
seen = {norm(s['url']) for s in sources if s.get('url')}
next_round = max(s.get('round', 1) for s in sources) + 1
added = 0
for rd in rounds:
    for f in sorted(rd.glob('*.json')):
        data = json.loads(f.read_text())
        label = f"{rd.name}: {f.stem}".replace('-', ' ')
        if data.get('checklist'):
            coverage[label] = [{'name': c.get('name') or c.get('org'), 'outlet': c.get('outlet', ''), 'found': bool(c.get('found')),
                                'urls': c.get('urls') or c.get('items') or [], 'note': c.get('note', '')} for c in data['checklist']]
        for s in data.get('sources', []):
            url = (s.get('url') or '').strip()
            key = norm(url) if url else 'title:' + s['title'].lower()
            if key in seen:
                continue
            seen.add(key)
            t = map_type(s.get('type'))
            disc = s.get('discipline') if s.get('discipline') in DISC else 'general'
            sc = s.get('scores') or {}
            tot = sum(sc.get(k, 0) for k in ('authority', 'evidence', 'relevance'))
            flags, rec, reason = [f'Round {next_round}: not yet independently reviewed'], 'include', ''
            depth = s.get('read_depth', 'full')
            if depth != 'full':
                rec = 'include-caveat'; flags.append(f'Read depth: {depth}')
            if s.get('paywalled'):
                rec = 'include-caveat'; flags.append('Paywalled')
            if not url:
                rec = 'include-caveat'; flags.append('No public URL yet')
            if any(h and h in url.lower() for h in EXCLUDED_HOSTS):
                rec, reason = 'exclude', 'Publisher is on the exclusion list'
            elif tot and tot < 6:
                rec, reason = 'exclude', f'Scored {tot}/9, below the threshold'
            sources.append({'id': 's' + hashlib.sha1((url or s['title']).encode()).hexdigest()[:10], 'title': s['title'], 'url': url,
                            'publisher': s.get('publisher', ''), 'author': s.get('author') or '', 'date': s.get('date') or '', 'discipline': disc,
                            'alsoRelevantTo': [d for d in (s.get('also_relevant_to') or []) if d in DISC and d != disc],
                            'type': t, 'typeLabel': TYPES[t], 'category': T2C[t], 'credibility': s.get('credibility') if s.get('credibility') in ('primary', 'verified', 'reported', 'commentary') else 'commentary',
                            'relation': 'background' if s.get('relation') == 'background' else 'about-incident',
                            'theme': s.get('theme') if s.get('theme') in THEMES else None, 'suppliedBy': s.get('suppliedBy'),
                            'essential': False, 'score': tot or None, 'note': s.get('note', ''), 'recommendation': rec, 'reason': reason, 'flags': flags,
                            'round': next_round, 'found_by': f.stem})
            added += 1

(review / 'sources.json').write_text(json.dumps(sources, ensure_ascii=False))
(review / 'coverage.json').write_text(json.dumps(coverage, ensure_ascii=False))

# Rebuild the entry's resource library from everything not recommended for exclusion.
doc = yaml.safe_load(ENTRY.read_text())
res = []
for s in sources:
    if s['recommendation'] == 'exclude' or not s.get('url'):
        continue
    d = s.get('date') or ''
    if d and not DATE.match(d):
        m = re.match(r'^(\d{4}-\d{2}(-\d{2})?)', d); d = m.group(1) if m else ''
    r = {'title': s['title'].strip(), 'url': s['url'], 'publisher': s.get('publisher') or 'Unknown'}
    if s.get('author'): r['author'] = s['author']
    if d: r['date'] = d
    r['discipline'] = s['discipline'] if s['discipline'] in DISC else 'general'
    also = sorted({x for x in (s.get('alsoRelevantTo') or []) if x in DISC and x != r['discipline']})
    if also: r['alsoRelevantTo'] = also
    r['type'] = s['type']
    r['relation'] = s.get('relation') or 'about-incident'
    if s.get('theme'): r['theme'] = s['theme']
    if s.get('essential'): r['essential'] = True
    r['credibility'] = s['credibility']
    note = (s.get('note') or '').strip()
    if note:
        r['note'] = note if len(note) <= 300 else note[:297].rsplit(' ', 1)[0] + '…'
    if 'Paywalled' in (s.get('flags') or []): r['paywalled'] = True
    res.append(r)
# Keep entry resources that never came through research (e.g. added by hand).
listed = {norm(s['url']) for s in sources if s.get('url')}
res += [r for r in doc.get('resources', []) if norm(r['url']) not in listed]
doc['resources'] = res
ENTRY.write_text(yaml.dump(doc, Dumper=yaml.SafeDumper, sort_keys=False, allow_unicode=True, width=1000))
print(f'added {added} new sources (round {next_round}); review list {len(sources)}; entry resources {len(res)}')
