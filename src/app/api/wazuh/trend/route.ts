export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { getAgentNamesForGroup } from '@/lib/wazuh-group';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;

interface Bucket {
    key_as_string?: string;
    doc_count?: number;
    high_severity?: { doc_count?: number };
    critical?: { doc_count?: number };
}

interface SearchResponse {
    aggregations?: { alerts_over_time?: { buckets?: Bucket[] } };
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

const RANGE_CONFIG: Record<string, { interval: 'hour' | 'day'; min: string; count: number }> = {
    '24h': { interval: 'hour', min: 'now-24h', count: 24 },
    '7d': { interval: 'day', min: 'now-7d', count: 7 },
    '30d': { interval: 'day', min: 'now-30d', count: 30 },
};

export async function GET(req: NextRequest) {
    try {
        const rangeParam = req.nextUrl.searchParams.get('range');
        const config = RANGE_CONFIG[rangeParam ?? '7d'] ?? RANGE_CONFIG['7d'];
        const group = req.nextUrl.searchParams.get('group');
        const agentNames = group ? await getAgentNamesForGroup(group) : null;

        const must: unknown[] = [{ range: { timestamp: { gte: config.min } } }];
        if (agentNames) must.push({ terms: { 'agent.name': agentNames } });
        const query = { bool: { must } };

        const res = await search({
            size: 0,
            query,
            aggs: {
                alerts_over_time: {
                    date_histogram: {
                        field: 'timestamp',
                        calendar_interval: config.interval,
                        min_doc_count: 0,
                        extended_bounds: { min: config.min, max: 'now' },
                    },
                    aggs: {
                        high_severity: { filter: { range: { 'rule.level': { gte: 7 } } } },
                        critical: { filter: { range: { 'rule.level': { gte: 12 } } } },
                    },
                },
            },
        });

        const buckets = res?.aggregations?.alerts_over_time?.buckets ?? [];
        const trend = buckets.slice(-config.count).map((b) => {
            const date = b.key_as_string ? new Date(b.key_as_string) : null;
            const label = date
                ? config.interval === 'hour'
                    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '—';
            return {
                label,
                alerts: b.doc_count ?? 0,
                incidents: b.high_severity?.doc_count ?? 0,
                critical: b.critical?.doc_count ?? 0,
            };
        });

        return NextResponse.json(trend);
    } catch {
        return NextResponse.json([], { status: 502 });
    }
}
