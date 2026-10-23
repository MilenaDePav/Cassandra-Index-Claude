# Working on the Cassandra Index

Editor: Milena (lawyer, AI governance). She approves every entry; never set `status: published` yourself.

## Adding an incident
1. Create `src/data/incidents/<yyyy>-<short-slug>.yaml`, next free id `CAS-2026-NNNN`.
2. Only include if it plausibly maps to a catastrophic-risk pathway (see /methodology). Coverage starts 2026.
3. Open every source you cite. Summaries in our own words, max 150 words, plain language. Never copy source text.
4. Credibility: `primary` (party involved), `verified` (independent analysis / official body that checked evidence), `reported` (journalism), `commentary` (newsletters, posts, explainers).
5. Grade the tier on the strongest claim sources support. T4 needs 2+ non-commentary sources (enforced).
6. Governance verdicts you are unsure of: `unclear`, with "Editor to confirm" in the note.
7. Set `status: review` and add an `updateLog` line.
8. Run `npm run build:preview` to validate.

## Rules
- No hazard uplift: describe capabilities, never methods.
- Name only public actors acting in role.

## Current plan and decisions
Read `docs/DECISIONS.md` before changing the schema or site: it records the editor's verdicts on every planned change, the build order, and the rule that every judgement field is attributed (basis + assessor: sources / editor / reviewer / not-determinable). Research state and gaps: `research/BACKLOG.md`. Research method: `research/PROTOCOL.md`.
