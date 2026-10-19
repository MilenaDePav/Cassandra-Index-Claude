import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ALL_SUBCATEGORY_CODES, DISCIPLINES, RESOURCE_TYPES, CREDIBILITY } from './data/taxonomy';

const keysOf = <T extends object>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

const isoDate = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'Use YYYY-MM-DD (or YYYY-MM if the day is unknown)');

const resource = z.object({
  title: z.string(),
  url: z.string().url(),
  publisher: z.string(),
  author: z.string().optional(),
  date: isoDate.optional(),
  discipline: z.enum(keysOf(DISCIPLINES)),
  alsoRelevantTo: z.array(z.enum(keysOf(DISCIPLINES))).default([]),
  type: z.enum(keysOf(RESOURCE_TYPES)),
  // about-incident: discusses this incident; background: what a researcher needs to analyse it.
  relation: z.enum(['about-incident', 'background']).default('about-incident'),
  credibility: z.enum(keysOf(CREDIBILITY)),
  essential: z.boolean().default(false), // the few sources to read first
  note: z.string().max(300).optional(),
  paywalled: z.boolean().optional(),
  peerReviewed: z.boolean().optional(),
  archived: z.string().url().optional(),
});

const incidents = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/data/incidents' }),
  schema: z.object({
    id: z.string().regex(/^CAS-\d{4}-\d{4}$/),
    title: z.string().max(90),
    status: z.enum(['draft', 'review', 'published', 'corrected']),
    dateEvent: isoDate,
    dateEventEnd: isoDate.optional(),
    dateDisclosed: isoDate,
    dateAdded: isoDate,
    dateUpdated: isoDate,
    risk: z.object({
      primary: z.enum(ALL_SUBCATEGORY_CODES),
      secondary: z.array(z.enum(ALL_SUBCATEGORY_CODES)).default([]),
    }),
    tier: z.enum(['T1', 'T2', 'T3', 'T4']),
    oecd: z.enum(['incident', 'hazard']),
    severity: z.enum(['low', 'significant', 'severe', 'catastrophic']),
    actors: z.array(z.object({ name: z.string(), role: z.enum(['developer', 'deployer', 'affected', 'state', 'other']) })),
    models: z.array(z.string()).default([]),
    countries: z.array(z.string().length(3)).min(1), // ISO 3166-1 alpha-3, or 'WLD' for global
    // Public level
    summary: z.string(), // plain language, max 150 words (checked below)
    whyItMatters: z.string(),
    whatItIsNot: z.string(),
    // Research level
    timeline: z.array(z.object({ date: isoDate, event: z.string() })).default([]),
    unknowns: z.array(z.string()).default([]),
    governance: z
      .array(
        z.object({
          instrument: z.string(),
          jurisdiction: z.string(),
          provision: z.string().optional(),
          verdict: z.enum(['triggered', 'not-triggered', 'unclear', 'gap']),
          note: z.string(),
          url: z.string().url().optional(),
        }),
      )
      .default([]),
    resources: z.array(resource).min(1),
    updateLog: z.array(z.object({ date: isoDate, note: z.string() })).default([]),
  }).refine((d) => d.summary.trim().split(/\s+/).length <= 150, {
    message: 'Public summary must be 150 words or fewer',
    path: ['summary'],
  }).refine((d) => d.tier !== 'T4' || d.resources.filter((r) => r.credibility !== 'commentary').length >= 2, {
    message: 'T4 (confirmed harm) needs at least two non-commentary sources',
    path: ['tier'],
  }),
});

export const collections = { incidents };
