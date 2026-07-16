export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { getAgentNamesForGroup } from '@/lib/wazuh-group';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;
const CTIP_URL = process.env.CTIP_API_URL || 'http://138.197.188.132:8001';

const PRIVATE_PREFIXES = ['10.', '192.168.', '172.'];

interface AggBucket { key: string; doc_count: number }
interface RawHit {
    _source: {
        data?: { srcip?: string; dstip?: string; dstport?: string; srcport?: string };
    };
}
interface SearchResponse {
    hits?: { hits?: RawHit[] };
    aggregations?: { top_ips?: { buckets?: AggBucket[] } };
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

interface CtipMatch { confidence?: number; country?: string | null }

async function lookupIoc(ip: string): Promise<{ verdict: 'Malicious' | 'Suspicious' | 'Unknown'; country: string | null }> {
    try {
        const res = await fetch(`${CTIP_URL}/api/ctip/iocs/${encodeURIComponent(ip)}`, { cache: 'no-store' });
        const data = await res.json();
        const match: CtipMatch | undefined = Array.isArray(data?.matches) ? data.matches[0] : undefined;
        if (!data?.found || !match) return { verdict: 'Unknown', country: null };
        const verdict = (match.confidence ?? 0) >= 80 ? 'Malicious' : 'Suspicious';
        return { verdict, country: match.country ?? null };
    } catch {
        return { verdict: 'Unknown', country: null };
    }
}

function networkLabel(ip: string): string {
    if (ip.startsWith('10.')) return '10.x Corporate';
    if (ip.startsWith('192.168.')) {
        const parts = ip.split('.');
        return `192.168.${parts[2] ?? '0'}.x LAN`;
    }
    if (ip.startsWith('172.')) return '172.x LAN';
    return 'Private Network';
}

function ipAggQuery(field: 'data.srcip' | 'data.dstip', agentFilter: unknown[], scope: 'external' | 'internal') {
    const must: unknown[] = [{ exists: { field } }, { range: { timestamp: { gte: 'now-24h' } } }, ...agentFilter];
    const query =
        scope === 'external'
            ? { bool: { must, must_not: PRIVATE_PREFIXES.map((p) => ({ prefix: { [field]: p } })) } }
            : { bool: { must, should: PRIVATE_PREFIXES.map((p) => ({ prefix: { [field]: p } })), minimum_should_match: 1 } };
    return search({ size: 0, query, aggs: { top_ips: { terms: { field, size: 10 } } } });
}

export async function GET(req: NextRequest) {
    try {
        const group = req.nextUrl.searchParams.get('group');
        const agentNames = group ? await getAgentNamesForGroup(group) : null;
        const agentFilter = agentNames ? [{ terms: { 'agent.name': agentNames } }] : [];

        const [extSrcRes, extDstRes, intSrcRes, intDstRes, rawRes] = await Promise.allSettled([
            ipAggQuery('data.srcip', agentFilter, 'external'),
            ipAggQuery('data.dstip', agentFilter, 'external'),
            ipAggQuery('data.srcip', agentFilter, 'internal'),
            ipAggQuery('data.dstip', agentFilter, 'internal'),
            search({
                size: 40,
                query: {
                    bool: {
                        must: [
                            { bool: { should: [{ exists: { field: 'data.srcip' } }, { exists: { field: 'data.dstip' } }] } },
                            { range: { timestamp: { gte: 'now-24h' } } },
                            ...agentFilter,
                        ],
                    },
                },
                _source: ['data.srcip', 'data.dstip', 'data.dstport', 'data.srcport'],
            }),
        ]);

        const bucketsOf = (r: PromiseSettledResult<SearchResponse | null>) =>
            r.status === 'fulfilled' ? r.value?.aggregations?.top_ips?.buckets ?? [] : [];

        const extSrcBuckets = bucketsOf(extSrcRes);
        const extDstBuckets = bucketsOf(extDstRes);
        const intSrcBuckets = bucketsOf(intSrcRes);
        const intDstBuckets = bucketsOf(intDstRes);
        const rawHits = rawRes.status === 'fulfilled' ? rawRes.value?.hits?.hits ?? [] : [];

        const portForIp = (ip: string, field: 'srcip' | 'dstip', portField: 'dstport' | 'srcport') => {
            const hit = rawHits.find((h) => h._source.data?.[field] === ip);
            return hit?._source.data?.[portField] ?? '—';
        };

        const allIps = Array.from(
            new Set([
                ...extSrcBuckets.map((b) => b.key),
                ...extDstBuckets.map((b) => b.key),
                ...intSrcBuckets.map((b) => b.key),
                ...intDstBuckets.map((b) => b.key),
            ])
        );
        const lookups = await Promise.allSettled(allIps.map((ip) => lookupIoc(ip)));
        const verdictByIp = new Map<string, { verdict: 'Malicious' | 'Suspicious' | 'Unknown'; country: string | null }>();
        allIps.forEach((ip, i) => {
            const r = lookups[i];
            verdictByIp.set(ip, r.status === 'fulfilled' ? r.value : { verdict: 'Unknown', country: null });
        });

        const externalInbound = extSrcBuckets.map((b) => ({
            ip: b.key,
            count: b.doc_count,
            verdict: verdictByIp.get(b.key)?.verdict ?? 'Unknown',
            country: verdictByIp.get(b.key)?.country ?? '—',
            port: portForIp(b.key, 'srcip', 'dstport'),
        }));

        const externalOutbound = extDstBuckets.map((b) => ({
            ip: b.key,
            count: b.doc_count,
            verdict: verdictByIp.get(b.key)?.verdict ?? 'Unknown',
            country: verdictByIp.get(b.key)?.country ?? '—',
            port: portForIp(b.key, 'dstip', 'srcport'),
        }));

        // Private IPs are internal by definition; only override the "Internal" badge if CTIP
        // somehow flags the address (rare, but a compromised internal host could still show up).
        const internalInbound = intSrcBuckets.map((b) => ({
            ip: b.key,
            count: b.doc_count,
            verdict: verdictByIp.get(b.key)?.verdict === 'Malicious' || verdictByIp.get(b.key)?.verdict === 'Suspicious'
                ? verdictByIp.get(b.key)!.verdict
                : ('Internal' as const),
            network: networkLabel(b.key),
            port: portForIp(b.key, 'srcip', 'dstport'),
        }));

        const internalOutbound = intDstBuckets.map((b) => ({
            ip: b.key,
            count: b.doc_count,
            verdict: verdictByIp.get(b.key)?.verdict === 'Malicious' || verdictByIp.get(b.key)?.verdict === 'Suspicious'
                ? verdictByIp.get(b.key)!.verdict
                : ('Internal' as const),
            network: networkLabel(b.key),
            port: portForIp(b.key, 'dstip', 'srcport'),
        }));

        const maliciousDetected = [...externalInbound, ...externalOutbound, ...internalInbound, ...internalOutbound].filter(
            (c) => c.verdict === 'Malicious'
        ).length;

        return NextResponse.json({
            external: { inbound: externalInbound, outbound: externalOutbound },
            internal: { inbound: internalInbound, outbound: internalOutbound },
            summary: {
                total_external_inbound: externalInbound.reduce((s, c) => s + c.count, 0),
                total_external_outbound: externalOutbound.reduce((s, c) => s + c.count, 0),
                total_internal: internalInbound.reduce((s, c) => s + c.count, 0) + internalOutbound.reduce((s, c) => s + c.count, 0),
                malicious_detected: maliciousDetected,
            },
        });
    } catch {
        return NextResponse.json(
            {
                external: { inbound: [], outbound: [] },
                internal: { inbound: [], outbound: [] },
                summary: { total_external_inbound: 0, total_external_outbound: 0, total_internal: 0, malicious_detected: 0 },
            },
            { status: 502 }
        );
    }
}
