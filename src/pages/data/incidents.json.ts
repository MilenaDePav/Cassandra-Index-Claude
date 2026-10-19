import type { APIRoute } from 'astro';
import { getIncidents, toRecord } from '../../lib/incidents';

export const GET: APIRoute = async ({ site }) => {
  const incidents = await getIncidents();
  const body = {
    name: 'The Cassandra Index',
    description: 'A checked record of AI incidents connected to catastrophic risk.',
    licence: 'CC BY 4.0',
    url: site?.href ?? 'https://cassandraindex.com/',
    count: incidents.length,
    incidents: incidents.map((i) => toRecord(i, site)),
  };
  return new Response(JSON.stringify(body, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
