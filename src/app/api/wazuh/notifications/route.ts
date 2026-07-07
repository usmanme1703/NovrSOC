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
        rule?: { description?: string; level?: number };
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

function timeAgo(iso?: string): string {
    if (!iso) return '—';
    const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
}

function truncate(s: string, max: number): string {
    return s.length > max ? s.slice(0, max - 3) + '...' : s;
}

export async function GET() {
    try {
        const res = await search({
            size: 6,
            sort: [
                { 'rule.level': { order: 'desc' } },
                { timestamp: { order: 'desc' } },
            ],
            query: { range: { 'rule.level': { gte: 5 } } },
            _source: ['timestamp', 'rule.description', 'rule.level', 'agent.name'],
        });

        const hits = res?.hits?.hits ?? [];
        const notifications = hits.map((h) => {
            const level = h._source.rule?.level ?? 0;
            const description = h._source.rule?.description ?? 'Wazuh alert';
            return {
                id: h._id,
                type: level >= 10 ? 'critical' : level >= 7 ? 'warning' : 'info',
                title: truncate(description, 60),
                description: 'Detected on ' + (h._source.agent?.name ?? 'unknown agent'),
                time: timeAgo(h._source.timestamp),
                read: false,
            };
        });

        return NextResponse.json(notifications);
    } catch {
        return NextResponse.json([], { status: 502 });
    }
}
