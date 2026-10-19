#!/usr/bin/env python3
"""Merge the per-discipline research files for one incident into a single deduplicated list.

Usage: python3 research/tools/merge.py research/pilot-openai-hf

Writes, inside that folder:
  merged.json   every unique source, with which researchers found it
  review.csv    one row per source, for the editor's approval sheet
  STATUS.md     what each researcher covered and what is still left to research
"""
import csv, json, re, sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

folder = Path(sys.argv[1])
DISCIPLINE_ORDER = ['technical-safety', 'cybersecurity', 'governance-policy', 'law-regulation', 'ethics-philosophy', 'security-geopolitics', 'aggregators', 'general']


def norm_url(u: str) -> str:
    p = urlsplit(u.strip())
    host = p.netloc.lower().removeprefix('www.')
    path = re.sub(r'/+$', '', p.path) or '/'
    query = '&'.join(q for q in p.query.split('&') if q and not q.startswith(('utm_', 'ref=', 'source=')))
    return urlunsplit(('https', host, path, query, ''))


files = sorted(f for f in folder.glob('*.json') if f.name != 'merged.json')
merged: dict[str, dict] = {}
reports = []
for f in files:
    data = json.loads(f.read_text())
    disc = data.get('discipline', f.stem)
    reports.append((disc, data))
    for s in data.get('sources', []):
        key = norm_url(s['url'])
        sc = s.get('scores', {})
        total = sum(sc.get(k, 0) for k in ('authority', 'evidence', 'relevance'))
        if key not in merged:
            merged[key] = {**s, 'found_by': [disc], 'score_total': total}
        else:
            m = merged[key]
            m['found_by'] = sorted(set(m['found_by'] + [disc]))
            m['also_relevant_to'] = sorted(set(m.get('also_relevant_to', []) + s.get('also_relevant_to', []) + [s.get('discipline', disc)]) - {m.get('discipline')})
            if total > m['score_total']:  # keep the strongest assessment's note and scores
                for k in ('note', 'scores', 'credibility', 'type'):
                    if k in s:
                        m[k] = s[k]
                m['score_total'] = total

sources = sorted(merged.values(), key=lambda s: (DISCIPLINE_ORDER.index(s.get('discipline', 'general')) if s.get('discipline') in DISCIPLINE_ORDER else 99, -s['score_total'], s.get('title', '')))
(folder / 'merged.json').write_text(json.dumps(sources, indent=1, ensure_ascii=False))

cols = ['decision', 'discipline', 'title', 'publisher', 'author', 'date', 'type', 'relation', 'credibility', 'authority', 'evidence', 'relevance', 'score_total', 'found_by', 'also_relevant_to', 'paywalled', 'note', 'url']
with open(folder / 'review.csv', 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh)
    w.writerow(cols)
    for s in sources:
        sc = s.get('scores', {})
        w.writerow(['', s.get('discipline', ''), s.get('title', ''), s.get('publisher', ''), s.get('author', ''), s.get('date', ''), s.get('type', ''), s.get('relation', ''), s.get('credibility', ''),
                    sc.get('authority', ''), sc.get('evidence', ''), sc.get('relevance', ''), s['score_total'], '; '.join(s['found_by']), '; '.join(s.get('also_relevant_to', [])), s.get('paywalled', ''), s.get('note', ''), s.get('url', '')])

lines = [f'# Research status: {folder.name}', '', f'{len(sources)} unique sources from {len(files)} researcher files.', '']
for disc, data in sorted(reports, key=lambda r: DISCIPLINE_ORDER.index(r[0]) if r[0] in DISCIPLINE_ORDER else 99):
    srcs = data.get('sources', [])
    about = sum(1 for s in srcs if s.get('relation') == 'about-incident')
    lines += [f'## {disc}', '', f"Status: {data.get('status', 'complete')}. Sources: {len(srcs)} ({about} about the incident, {len(srcs) - about} background).", '']
    if data.get('researcher_summary'):
        lines += ['**Summary.** ' + data['researcher_summary'], '']
    if data.get('findings'):
        lines += ['**Findings for the editor:**', ''] + [f'- {x}' for x in data['findings']] + ['']
    rem = data.get('remaining', [])
    if rem:
        lines += ['**Left to research:**', '']
        for r in rem:
            if isinstance(r, dict):
                q = '; '.join(r.get('suggested_queries', [])) if isinstance(r.get('suggested_queries'), list) else r.get('suggested_queries', '')
                lines.append(f"- {r.get('what', '')}. {r.get('why_it_matters', '')}" + (f" Queries: {q}" if q else ''))
            else:
                lines.append(f'- {r}')
        lines.append('')
(folder / 'STATUS.md').write_text('\n'.join(lines))
print(f'{len(sources)} unique sources from {len(files)} files')
