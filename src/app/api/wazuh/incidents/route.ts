export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { getAgentNamesForGroup } from '@/lib/wazuh-group';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;

interface WazuhHit {
    _id: string;
    _source: {
        timestamp?: string;
        rule?: { description?: string; level?: number; mitre?: { technique?: string[] } };
        agent?: { name?: string };
    };
}

interface SearchResponse {
    hits?: { hits?: WazuhHit[]; total?: { value?: number } };
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

function severityFor(level: number): 'Critical' | 'High' | 'Medium' | 'Low' {
    return level >= 12 ? 'Critical' : level >= 10 ? 'High' : level >= 7 ? 'Medium' : 'Low';
}

function slaTimeFor(level: number): string {
    return level >= 12 ? '00:30:00' : level >= 7 ? '02:00:00' : '06:00:00';
}

function countInRange(minLevel: number, maxLevelExclusive: number | undefined, agentNames: string[] | null) {
    const levelRange: { gte: number; lt?: number } = { gte: minLevel };
    if (maxLevelExclusive !== undefined) levelRange.lt = maxLevelExclusive;
    const must: unknown[] = [
        { range: { 'rule.level': levelRange } },
        { range: { timestamp: { gte: 'now-7d' } } },
    ];
    if (agentNames) must.push({ terms: { 'agent.name': agentNames } });
    return search({ size: 0, track_total_hits: true, query: { bool: { must } } });
}

export async function GET(req: NextRequest) {
    try {
        const group = req.nextUrl.searchParams.get('group');
        const agentNames = group ? await getAgentNamesForGroup(group) : null;

        const mainMust: unknown[] = [
            { range: { 'rule.level': { gte: 3 } } },
            { range: { timestamp: { gte: 'now-7d' } } },
        ];
        if (agentNames) mainMust.push({ terms: { 'agent.name': agentNames } });

        const [alertsRes, criticalRes, highRes, mediumRes, lowRes] = await Promise.allSettled([
            search({
                size: 20,
                sort: [
                    { 'rule.level': { order: 'desc' } },
                    { timestamp: { order: 'desc' } },
                ],
                query: { bool: { must: mainMust } },
                _source: [
                    'timestamp', 'rule.description', 'rule.level',
                    'rule.groups', 'agent.name', 'agent.ip',
                    'location', 'data.srcip', 'rule.mitre.technique',
                ],
            }),
            countInRange(12, undefined, agentNames),
            countInRange(10, 12, agentNames),
            countInRange(7, 10, agentNames),
            countInRange(3, 7, agentNames),
        ]).then((results) => results.map((r) => (r.status === 'fulfilled' ? r.value : null)));

        const rawHits = alertsRes?.hits?.hits ?? [];
        const incidents = rawHits.map((h) => {
            const level = h._source.rule?.level ?? 0;
            return {
                id: h._id,
                severity: severityFor(level),
                name: h._source.rule?.description ?? 'Wazuh alert',
                source: 'Wazuh-Agent',
                asset: h._source.agent?.name ?? 'Unknown',
                status: 'Open' as const,
                analyst: 'Unassigned',
                slaTime: slaTimeFor(level),
                mitre: h._source.rule?.mitre?.technique?.[0] ?? 'T1059',
                timestamp: h._source.timestamp ?? null,
                level,
            };
        });

        const critical = criticalRes?.hits?.total?.value ?? 0;
        const high = highRes?.hits?.total?.value ?? 0;
        const medium = mediumRes?.hits?.total?.value ?? 0;
        const low = lowRes?.hits?.total?.value ?? 0;

        const kpis = {
            total: critical + high + medium + low,
            critical,
            high,
            medium,
            low,
            investigating: 0,
            escalated: 0,
            avgSla: '02:00:00',
        };

        return NextResponse.json({ incidents, kpis });
    } catch {
        return NextResponse.json(
            {
                incidents: [],
                kpis: { total: 0, critical: 0, high: 0, medium: 0, low: 0, investigating: 0, escalated: 0, avgSla: '00:00:00' },
            },
            { status: 502 }
        );
    }
}
