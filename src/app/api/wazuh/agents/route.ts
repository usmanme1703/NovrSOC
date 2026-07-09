export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import https from 'https';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;

interface MonitoringHit {
    _source: {
        id?: string;
        name?: string;
        status?: string;
        group?: string[];
        lastKeepAlive?: string;
    };
}

interface SearchResponse {
    aggregations?: { agents?: { buckets?: { key: string; latest?: { hits?: { hits?: MonitoringHit[] } } }[] } };
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
                path: '/wazuh-monitoring-*/_search',
                method: 'POST',
                headers: { Authorization: auth, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
                rejectUnauthorized: false,
                timeout: 8000,
            },
            (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    try { resolve(JSON.parse(data)); } catch { resolve(null); }
                });
            }
        );
        req.on('timeout', () => req.destroy(new Error('Wazuh indexer request timed out')));
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

// The Wazuh Manager API (port 55000) is unreachable from this deployment's network path,
// so agent state is derived from the Indexer's wazuh-monitoring-* index instead — it holds
// periodic status snapshots for every *enrolled* agent. Agent id "000" is the manager itself
// (novrsoc-wazuh) and never appears in wazuh-monitoring (it doesn't check in to itself), so
// it's added explicitly: if the Indexer answered this request at all, the manager is up.
export async function GET() {
    try {
        const res = await search({
            size: 0,
            aggs: {
                agents: {
                    terms: { field: 'id', size: 100 },
                    aggs: { latest: { top_hits: { size: 1, sort: [{ timestamp: { order: 'desc' } }] } } },
                },
            },
        });

        const buckets = res?.aggregations?.agents?.buckets ?? [];
        const enrolledAgents = buckets
            .map((b) => b.latest?.hits?.hits?.[0]?._source)
            .filter((a): a is NonNullable<typeof a> => Boolean(a));

        const active = enrolledAgents.filter((a) => a.status === 'active').length + 1; // +1 for the manager (id "000")
        const total = enrolledAgents.length + 1;

        return NextResponse.json({ data: { connection: { active, total } } });
    } catch {
        return NextResponse.json(null, { status: 502 });
    }
}
