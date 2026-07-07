export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import https from 'https';

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
    hits?: { hits?: WazuhHit[] };
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
                timeout: 8000,
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

export async function GET() {
    try {
        const res = await search({
            size: 20,
            sort: [{ timestamp: { order: 'desc' } }],
            query: {
                bool: {
                    must: [
                        { range: { 'rule.level': { gte: 5 } } },
                        { range: { timestamp: { gte: 'now-7d' } } },
                    ],
                },
            },
            _source: [
                'timestamp', 'rule.description', 'rule.level',
                'rule.groups', 'agent.name', 'agent.ip',
                'location', 'data.srcip', 'rule.mitre.technique',
            ],
        });

        const rawHits = res?.hits?.hits ?? [];
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

        const kpis = {
            total: incidents.length,
            critical: incidents.filter((i) => i.level >= 12).length,
            investigating: 0,
            escalated: 0,
            avgSla: '02:00:00',
        };

        return NextResponse.json({ incidents, kpis });
    } catch {
        return NextResponse.json(
            { incidents: [], kpis: { total: 0, critical: 0, investigating: 0, escalated: 0, avgSla: '00:00:00' } },
            { status: 502 }
        );
    }
}
