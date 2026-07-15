export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { getAgentNamesForGroup } from '@/lib/wazuh-group';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;
const CTIP_URL = process.env.CTIP_API_URL || 'http://138.197.188.132:8001';

const PRIVATE_PREFIXES = [{ prefix: '10.' }, { prefix: '192.168.' }, { prefix: '172.' }, { prefix: '127.' }];

interface AggBucket { key: string; doc_count: number }
interface RawHit {
    _source: {
        timestamp?: string;
        data?: { srcip?: string; dstip?: string; dstport?: string; srcport?: string };
        rule?: { description?: string; level?: number };
        agent?: { name?: string };
    };
}
interface SearchResponse {
    hits?: { hits?: RawHit[]; total?: { value?: number } };
    aggregations?: { top_sources?: { buckets?: AggBucket[] }; top_destinations?: { buckets?: AggBucket[] } };
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

export async function GET(req: NextRequest) {
    try {
        const group = req.nextUrl.searchParams.get('group');
        const agentNames = group ? await getAgentNamesForGroup(group) : null;
        const agentFilter = agentNames ? [{ terms: { 'agent.name': agentNames } }] : [];

        const [sourcesRes, destinationsRes, connectionsRes] = await Promise.allSettled([
            search({
                size: 0,
                query: {
                    bool: {
                        must: [{ exists: { field: 'data.srcip' } }, { range: { timestamp: { gte: 'now-24h' } } }, ...agentFilter],
                        must_not: PRIVATE_PREFIXES.map((p) => ({ prefix: { 'data.srcip': p.prefix } })),
                    },
                },
                aggs: { top_sources: { terms: { field: 'data.srcip', size: 10 } } },
            }),
            search({
                size: 0,
                query: {
                    bool: {
                        must: [{ exists: { field: 'data.dstip' } }, { range: { timestamp: { gte: 'now-24h' } } }, ...agentFilter],
                        must_not: PRIVATE_PREFIXES.map((p) => ({ prefix: { 'data.dstip': p.prefix } })),
                    },
                },
                aggs: { top_destinations: { terms: { field: 'data.dstip', size: 10 } } },
            }),
            search({
                size: 20,
                query: {
                    bool: {
                        must: [
                            { bool: { should: [{ exists: { field: 'data.srcip' } }, { exists: { field: 'data.dstip' } }] } },
                            { range: { timestamp: { gte: 'now-24h' } } },
                            ...agentFilter,
                        ],
                    },
                },
                _source: ['timestamp', 'data.srcip', 'data.dstip', 'data.dstport', 'data.srcport', 'rule.description', 'rule.level', 'agent.name'],
                sort: [{ timestamp: { order: 'desc' } }],
            }),
        ]);

        const sourceBuckets = sourcesRes.status === 'fulfilled' ? sourcesRes.value?.aggregations?.top_sources?.buckets ?? [] : [];
        const destBuckets = destinationsRes.status === 'fulfilled' ? destinationsRes.value?.aggregations?.top_destinations?.buckets ?? [] : [];
        const rawHits = connectionsRes.status === 'fulfilled' ? connectionsRes.value?.hits?.hits ?? [] : [];

        const portForIp = (ip: string, field: 'srcip' | 'dstip', portField: 'dstport' | 'srcport') => {
            const hit = rawHits.find((h) => h._source.data?.[field] === ip);
            return hit?._source.data?.[portField] ?? '—';
        };

        const uniqueIps = Array.from(new Set([...sourceBuckets.map((b) => b.key), ...destBuckets.map((b) => b.key)]));
        const lookups = await Promise.allSettled(uniqueIps.map((ip) => lookupIoc(ip)));
        const verdictByIp = new Map<string, { verdict: 'Malicious' | 'Suspicious' | 'Unknown'; country: string | null }>();
        uniqueIps.forEach((ip, i) => {
            const r = lookups[i];
            verdictByIp.set(ip, r.status === 'fulfilled' ? r.value : { verdict: 'Unknown', country: null });
        });

        const inbound = sourceBuckets.map((b) => ({
            ip: b.key,
            count: b.doc_count,
            verdict: verdictByIp.get(b.key)?.verdict ?? 'Unknown',
            country: verdictByIp.get(b.key)?.country ?? '—',
            port: portForIp(b.key, 'srcip', 'dstport'),
        }));

        const outbound = destBuckets.map((b) => ({
            ip: b.key,
            count: b.doc_count,
            verdict: verdictByIp.get(b.key)?.verdict ?? 'Unknown',
            country: verdictByIp.get(b.key)?.country ?? '—',
            port: portForIp(b.key, 'dstip', 'srcport'),
        }));

        const connections = rawHits.map((h) => {
            const srcip = h._source.data?.srcip ?? null;
            const dstip = h._source.data?.dstip ?? null;
            return {
                timestamp: h._source.timestamp ?? null,
                srcip,
                dstip,
                dstport: h._source.data?.dstport ?? null,
                description: h._source.rule?.description ?? 'Network event',
                level: h._source.rule?.level ?? 0,
                agent: h._source.agent?.name ?? 'Unknown',
                direction: srcip ? ('inbound' as const) : ('outbound' as const),
            };
        });

        const maliciousDetected = [...inbound, ...outbound].filter((c) => c.verdict === 'Malicious').length;

        return NextResponse.json({
            inbound,
            outbound,
            connections,
            summary: {
                total_inbound: inbound.reduce((s, c) => s + c.count, 0),
                total_outbound: outbound.reduce((s, c) => s + c.count, 0),
                malicious_detected: maliciousDetected,
            },
        });
    } catch {
        return NextResponse.json(
            { inbound: [], outbound: [], connections: [], summary: { total_inbound: 0, total_outbound: 0, malicious_detected: 0 } },
            { status: 502 }
        );
    }
}
