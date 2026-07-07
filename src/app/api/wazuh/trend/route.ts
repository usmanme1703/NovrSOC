export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import https from 'https';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;

interface Bucket {
    key_as_string?: string;
    doc_count?: number;
    high_severity?: { doc_count?: number };
}

interface SearchResponse {
    aggregations?: { alerts_per_day?: { buckets?: Bucket[] } };
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

export async function GET() {
    try {
        const res = await search({
            size: 0,
            aggs: {
                alerts_per_day: {
                    date_histogram: {
                        field: 'timestamp',
                        calendar_interval: 'day',
                        min_doc_count: 0,
                        extended_bounds: { min: 'now-12d/d', max: 'now/d' },
                    },
                    aggs: {
                        high_severity: { filter: { range: { 'rule.level': { gte: 7 } } } },
                    },
                },
            },
        });

        const buckets = res?.aggregations?.alerts_per_day?.buckets ?? [];
        const trend = buckets.slice(-12).map((b) => {
            const date = b.key_as_string ? new Date(b.key_as_string) : null;
            return {
                week: date ? date.toLocaleDateString('en-US', { weekday: 'short' }) : '—',
                alerts: b.doc_count ?? 0,
                incidents: b.high_severity?.doc_count ?? 0,
            };
        });

        return NextResponse.json(trend);
    } catch {
        return NextResponse.json([], { status: 502 });
    }
}
