# The Cassandra Index

A checked reference hub of catastrophic AI incidents: [cassandraindex.com](https://cassandraindex.com).

Each incident gets a plain-language summary and a library of every credible technical, policy, legal and expert source on it, graded by an open method.

## How it works

- **Incidents** live as one YAML file each in `src/data/incidents/`. The schema (and its checks) is in `src/content.config.ts`.
- **Risk taxonomy, evidence tiers, lenses** are defined in `src/data/taxonomy.ts`.
- Entries with `status: draft` or `review` are **hidden on the public site**. Set `status: published` once the editor has checked an entry.
- Every push to `main` rebuilds and deploys the site through GitHub Pages.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local site at http://localhost:4321 (shows only published entries) |
| `npm run build:preview` | Build including entries awaiting review, marked as such |
| `npm run build` | Production build into `dist/` |

## Licence

Data: CC BY 4.0. Linked sources belong to their authors.
