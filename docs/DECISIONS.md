# Cassandra Index: decisions on changes

Source: the editor's Executive Brief (Claude Doc, 20 Oct 2026), with her verdicts as recorded on 23 Oct 2026. This file is the working record for anyone building the site, including Claude Code. If a verdict here and the Doc disagree, ask the editor.

Full rationale and sources: Improvements Report (Claude Doc) and `research/BACKLOG.md`.

## 1. How judgements are made (applies to every change below)

The Index records and attributes findings; it does not make its own expert findings. Rules:

1. **Every judgement field carries a basis and an assessor.** Basis = references to sources in the entry's resource list. Assessor = one of:
   - `sources`: credible investigators or analysts said it (default for technical and causal judgements);
   - `editor`: the editor's own assessment (appropriate for legal analysis, her profession);
   - `reviewer`: checked by a named expert reviewer, credited on the entry;
   - `not-determinable`: no published finding yet. This is a valid, honest value.
2. **Disagreement is shown, not resolved.** Where credible sources disagree, record each position with its sources.
3. **Wording matches the method.** Use "investigators found", never "the cause was". The prevention section is titled "What investigators found".
4. **Facts, classifications and judgements are treated differently.** Facts: cited, conflicts shown. Classifications (risk type, causal tags, harm types, OECD label): coded against a published codebook with a one-line reason per code. Judgements (severity, prevention, legal verdicts): attributed as above.
5. **AI drafts, a human decides.** Claude may draft codes and run independent double-coding to flag disagreements; the editor approves. The methodology page says so.
6. **Expert review per field, not permanent collaborators.** Specialists review one section of one entry and are credited by name. Right of reply for named organisations; public corrections log.

## 2. Verdicts

### Incident record

| Change | From | To | Verdict |
| --- | --- | --- | --- |
| What caused it | Risk type only | Add causal tags: entity (AI or human), intent (intended or not), timing (before or after deployment), as in the MIT AI Risk Repository | Adopt now |
| What was harmed | Not recorded | Harm types from AIAAIC's taxonomy, each marked actual or potential | Adopt now |
| Severity scale | Own four steps, "if it scales" | MIT's 1–5 scale (negligible to catastrophic), keeping the "if it scales" judgement | Adopt now |
| Prevention | Not recorded | "What investigators found": missing safeguard and its maturity, test that would have caught it, warning signal, who could stop it. Attributed per section 1 | Adopt now |
| EU "serious incident" | Free-text legal notes | EU AI Act Art. 3(49) field: meets / does not meet / not determinable from the record | Adopt now |
| How it came to light, and the response | Timeline only | Fields for who disclosed first and how the organisation responded | Adopt now |
| What counts in totals | Every published entry | Only well-evidenced entries count in charts; others visible, marked | Adopt now |
| Actor roles | Developer, deployer, affected, state | Who acted, who was affected, who oversees | Adopt now |
| Small fixes | Exact dates; tracker entries as sources; no provenance note | Date precision as sources allow; tracker cross-references with a "checked on" date; "drafted by AI, reviewed by editor" label | Adopt now |
| Source verification | Link only | "Verified on" date and archived copy per source; policy register IDs | Adopt now |
| Background papers | Abstract-only reads cannot be "verified" | A separate "peer-reviewed" marker | Your call (undecided) |

### Website

| Change | From | To | Verdict |
| --- | --- | --- | --- |
| Reporting-duties grid | Law table per incident | Incidents × duties (EU AI Act Art. 55 and 73, SB 53, RAISE, GDPR), editor's verdict per cell | Later (once 3–5 incidents exist) |
| Related trackers | Not covered | One page linking AIID, OECD, AIAAIC, MIT, Raymond Sun, agent registers; risk-type pages link to FRI's AIRO | Adopt now |
| Limitations | Rules only | Limitations section: single editor, English and US bias, partial reads | Adopt now |
| Corrections | GitHub issues | Simple correction and suggestion form | Before launch |
| Model pages | None | Page per model or system | Later |
| Trends | Planned | Charts linking to records | Later |

### Data and intake

| Change | From | To | Verdict |
| --- | --- | --- | --- |
| Finding new incidents | Manual research rounds | Daily job (GitHub Actions or Cloudflare) reads AIID, the CC BY agent register and MIT, filters for catastrophic relevance, fills the review queue | Adopt now (after record changes) |
| Reusing others' data | No rule | Import only CC BY data with credit; AIAAIC by ID only (its text is CC BY-SA); link to all-rights-reserved trackers; ask AIID before importing | Adopt now |
| API | Free JSON and CSV | Free browsing; permissioned or paid bulk data | Later |

### Research method

| Change | From | To | Verdict |
| --- | --- | --- | --- |
| Researchers per round | Up to seven | Three at a time, fixed checklists, own search budgets | Adopt now |
| Independent review | Round 1 only | Reviewer pass on every round (~280 sources waiting) | Adopt now |
| Related incidents | Mixed into Hugging Face sources | Separate linked entries: German wiki swarm, Australian Medicare breach, UK AISI 4 Aug incidents, Anthropic 30 Jul incidents | Adopt now |
| Hard-to-reach sites | Search only | Direct visits to 22 named sites (list in `research/BACKLOG.md`, round 3) | Adopt now |
| Grading reliability | One editor | Advisers grade a sample; publish agreement | Later |

### Licensing and hosting

| Change | From | To | Verdict |
| --- | --- | --- | --- |
| Licence | CC BY 4.0 | All rights reserved on text and analysis (reading, linking, citing, short quotation allowed); data under CC BY-NC 4.0; new Terms of use page; update Open data, About, footer, README | Adopt now |
| Repository | Public | Private until launch | Adopt now (editor does this in GitHub settings) |
| Hosting | GitHub Pages, manual deploys | Cloudflare Pages behind Cloudflare Access until launch | Adopt now (editor connects Cloudflare's newer full-API connector first) |

## 3. Build order

1. Schema: causal tags, harms (actual/potential), MIT severity, prevention ("What investigators found"), Art. 3(49), disclosure and response, actor roles, date precision, cross-references, provenance, verified-on and archive fields. Every judgement field with basis + assessor. Apply to CAS-2026-0001.
2. Codebook page in Methodology, plus Limitations section.
3. Related trackers page and AIRO links.
4. Licence change and Terms of use.
5. Split related incidents into linked entries.
6. Reviewer pass on rounds 2–4; direct-visit sweep of the 22 sites.
7. Daily intake.
8. Cloudflare hosting (after the editor connects the new connector).

## 4. Facts to verify before the incident text is final

See the Improvements Report and `research/pilot-openai-hf/REVIEW.md`: agent counts, start date and detection lag, which model, GPT-5.6 Sol release date, EU reporting duty, SB 53 exclusion, ExploitGym authorship, Hugging Face entry point, FTC/ICO/AI Office claims, LASST docket number.
