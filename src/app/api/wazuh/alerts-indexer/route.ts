export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import https from 'https';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS || 'iUZ+5tCMwaAAwbrBdr3doguGil.eS5Wh';

interface SearchResponse {
    hits?: {
        total?: { value?: number };
        hits?: { _source?: unknown }[];
    };
}

function search(body: unknown): Promise<SearchResponse | null> {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(body);
        const auth = 'Basic ' + Buffer.from(`${INDEXER_USER}:${INDEXER_PASS}`).toString('base64');
        const req = https.request(
            {
                hostname: INDEXER_HOST,
                port: INDEXER_PORT,
                path: '/wazuh-alerts-*/_search',
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

function countByLevel(minLevel: number) {
    return search({
        size: 0,
        track_total_hits: true,
        query: {
            bool: {
                filter: [
                    { range: { timestamp: { gte: 'now-24h' } } },
                    { range: { 'rule.level': { gte: minLevel } } },
                ],
            },
        },
    });
}

export async function GET() {
    try {
        const [alertsRes, criticalRes, openRes] = await Promise.all([
            search({
                size: 10,
                sort: [{ timestamp: { order: 'desc' } }],
                query: { range: { timestamp: { gte: 'now-24h' } } },
            }),
            countByLevel(12),
            countByLevel(7),
        ]);

        const hits = (alertsRes?.hits?.hits ?? []).map((h) => h._source).filter(Boolean);
        const criticalCount = criticalRes?.hits?.total?.value ?? null;
        const openIncidentsCount = openRes?.hits?.total?.value ?? null;

        return NextResponse.json({ hits, criticalCount, openIncidentsCount });
    } catch {
        return NextResponse.json({ hits: [], criticalCount: null, openIncidentsCount: null }, { status: 502 });
    }
}
