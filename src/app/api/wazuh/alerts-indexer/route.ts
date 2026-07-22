export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { getAgentNamesForGroup } from '@/lib/wazuh-group';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;

interface SearchResponse {
    hits?: {
        total?: { value?: number };
        hits?: { _source?: unknown }[];
    };
}

function search(body: unknown): Promise<SearchResponse | null> {
    return new Promise((resolve, reject) => {
        if (!INDEXER_PASS) {
            reject(new Error('WAZUH_INDEXER_PASS environment variable is not set'));
            return;
        }
        const payload = JSON.stringify(body);
        const auth = 'Basic ' + Buffer.from(`${INDEXER_USER}:${INDEXER_PASS}`).toString('base64');
        const req = https.request(
            {
                hostname: INDEXER_HOST,
                port: INDEXER_PORT,
                path: '/wazuh-alerts-4.x-*/_search',
                method: 'POST',
                headers: {
                    Authorization: auth,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload),
                },
                rejectUnauthorized: false,
                timeout: 15000,
            },
            (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch {
                        resolve(null);
                    }
                });
            }
        );
        req.on('timeout', () => req.destroy(new Error('Wazuh indexer request timed out')));
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

function countByLevel(minLevel: number, agentNames: string[] | null) {
    const must: unknown[] = [
        { range: { 'rule.level': { gte: minLevel } } },
        { range: { timestamp: { gte: 'now-24h' } } },
    ];
    if (agentNames) must.push({ terms: { 'agent.name': agentNames } });
    return search({ size: 0, track_total_hits: true, query: { bool: { must } } });
}

const RANGE_MAP: Record<string, string> = { '1h': 'now-1h', '24h': 'now-24h', '7d': 'now-7d' };

export async function GET(req: NextRequest) {
    try {
        const group = req.nextUrl.searchParams.get('group');
        const agentNames = group ? await getAgentNamesForGroup(group) : null;
        const minLevelParam = req.nextUrl.searchParams.get('minLevel');
        const minLevel = minLevelParam !== null ? Number(minLevelParam) : 7;
        const rangeParam = req.nextUrl.searchParams.get('range');
        const since = RANGE_MAP[rangeParam ?? '24h'] ?? RANGE_MAP['24h'];

        const hitsMust: unknown[] = [
            { range: { 'rule.level': { gte: minLevel } } },
            { range: { timestamp: { gte: since } } },
        ];
        if (agentNames) hitsMust.push({ terms: { 'agent.name': agentNames } });

        const [alertsRes, criticalRes, openRes] = await Promise.allSettled([
            search({
                size: 10,
                sort: [{ timestamp: { order: 'desc' } }],
                query: { bool: { must: hitsMust } },
                _source: ['timestamp', 'rule.description', 'rule.level', 'agent.name', 'agent.ip', 'location'],
            }),
            countByLevel(12, agentNames),
            countByLevel(7, agentNames),
        ]).then((results) => results.map((r) => (r.status === 'fulfilled' ? r.value : null)));

        const hits = (alertsRes?.hits?.hits ?? []).map((h) => h._source).filter(Boolean);
        const criticalCount = criticalRes?.hits?.total?.value ?? null;
        const openIncidentsCount = openRes?.hits?.total?.value ?? null;

        return NextResponse.json({ hits, criticalCount, openIncidentsCount });
    } catch {
        return NextResponse.json({ hits: [], criticalCount: null, openIncidentsCount: null }, { status: 502 });
    }
}
