import type { APIRoute } from 'astro';
import { getIncidents, toRecord } from '../../lib/incidents';

const COLUMNS = ['id', 'title', 'url', 'status', 'date_event', 'date_disclosed', 'date_updated', 'risk_type', 'risk_primary', 'risk_primary_name', 'risk_secondary', 'evidence_tier', 'evidence_tier_label', 'severity_if_scaled', 'oecd_label', 'actors', 'models', 'countries', 'resource_count', 'summary'] as const;

function cell(v: unknown) {
  const s = Array.isArray(v) ? v.join('; ') : v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const GET: APIRoute = async ({ site }) => {
  const rows = (await getIncidents()).map((i) => toRecord(i, site) as Record<string, unknown>);
  const csv = [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(','))].join('\n') + '\n';
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
};
