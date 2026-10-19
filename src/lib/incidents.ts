import { getCollection, type CollectionEntry } from 'astro:content';
import { RISK_TYPES, riskTypeOf, subcategory, TIERS, SEVERITIES } from '../data/taxonomy';
import { countryName } from '../data/countries';

export type Incident = CollectionEntry<'incidents'>;

// Production shows only reviewed entries. Preview builds (PUBLIC_SHOW_UNREVIEWED=true)
// also show entries in draft or review, clearly marked, so the editor can check them.
export const SHOW_UNREVIEWED = import.meta.env.PUBLIC_SHOW_UNREVIEWED === 'true';

export function isReviewed(i: Incident) {
  return i.data.status === 'published' || i.data.status === 'corrected';
}

export async function getIncidents(): Promise<Incident[]> {
  const all = await getCollection('incidents');
  return all
    .filter((i) => SHOW_UNREVIEWED || isReviewed(i))
    .sort((a, b) => b.data.dateDisclosed.localeCompare(a.data.dateDisclosed));
}

export function incidentsByRiskType(incidents: Incident[]) {
  return RISK_TYPES.map((rt) => ({
    riskType: rt,
    incidents: incidents.filter((i) => riskTypeOf(i.data.risk.primary).code === rt.code),
    related: incidents.filter(
      (i) => riskTypeOf(i.data.risk.primary).code !== rt.code && i.data.risk.secondary.some((c) => riskTypeOf(c).code === rt.code),
    ),
  }));
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatDate(d: string, short = false) {
  const [y, m, day] = d.split('-');
  const month = MONTHS[Number(m) - 1];
  const mm = short ? month.slice(0, 3) : month;
  return day ? `${Number(day)} ${mm} ${y}` : `${mm} ${y}`;
}

// A flat, export-friendly record used by the JSON and CSV feeds.
export function toRecord(i: Incident, site: URL | undefined) {
  const d = i.data;
  return {
    id: d.id,
    title: d.title,
    url: new URL(`/incidents/${i.id}/`, site ?? 'https://cassandraindex.com').href,
    status: d.status,
    date_event: d.dateEvent,
    date_event_end: d.dateEventEnd ?? null,
    date_disclosed: d.dateDisclosed,
    date_updated: d.dateUpdated,
    risk_type: riskTypeOf(d.risk.primary).name,
    risk_primary: d.risk.primary,
    risk_primary_name: subcategory(d.risk.primary).name,
    risk_secondary: d.risk.secondary,
    evidence_tier: d.tier,
    evidence_tier_label: TIERS[d.tier].label,
    severity_if_scaled: SEVERITIES[d.severity],
    oecd_label: d.oecd,
    actors: d.actors.map((a) => a.name),
    models: d.models,
    countries: d.countries.map(countryName),
    summary: d.summary,
    resource_count: d.resources.length,
    resources: d.resources.map((r) => ({ title: r.title, url: r.url, publisher: r.publisher, date: r.date ?? null, discipline: r.discipline, type: r.type, relation: r.relation, credibility: r.credibility, essential: r.essential })),
  };
}
