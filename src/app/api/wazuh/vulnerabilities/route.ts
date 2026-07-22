export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { getAgentNamesForGroup } from '@/lib/wazuh-group';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;

interface VulnHit {
    _source?: {
        vulnerability?: {
            id?: string;
            description?: string;
            severity?: string;
            under_evaluation?: boolean;
            score?: { base?: number };
        };
        package?: { name?: string; version?: string };
        agent?: { name?: string };
    };
}

interface SearchResponse {
    hits?: { hits?: VulnHit[] };
    aggregations?: { by_severity?: { buckets?: { key: string; doc_count: number }[] } };
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
                path: '/wazuh-states-vulnerabilities-*/_search',
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

export async function GET(req: NextRequest) {
    try {
        const group = req.nextUrl.searchParams.get('group');
        const severity = req.nextUrl.searchParams.get('severity');
        const agentNames = group ? await getAgentNamesForGroup(group) : null;

        const groupFilters: Record<string, unknown>[] = [];
        if (agentNames) groupFilters.push({ terms: { 'agent.name': agentNames } });

        const aggsQuery = groupFilters.length ? { bool: { must: groupFilters } } : { match_all: {} };

        const hitsFilters = [...groupFilters];
        if (severity) hitsFilters.push({ term: { 'vulnerability.severity': severity } });
        const hitsQuery = hitsFilters.length ? { bool: { must: hitsFilters } } : { match_all: {} };

        const [hitsRes, aggsRes] = await Promise.allSettled([
            search({
                size: 50,
                sort: [{ 'vulnerability.score.base': { order: 'desc' } }],
                _source: [
                    'vulnerability.id',
                    'vulnerability.description',
                    'vulnerability.severity',
                    'vulnerability.score.base',
                    'vulnerability.under_evaluation',
                    'package.name',
                    'package.version',
                    'agent.name',
                ],
                query: hitsQuery,
            }),
            search({
                size: 0,
                query: aggsQuery,
                aggs: { by_severity: { terms: { field: 'vulnerability.severity' } } },
            }),
        ]).then((results) => results.map((r) => (r.status === 'fulfilled' ? r.value : null)));

        const vulnerabilities = (hitsRes?.hits?.hits ?? []).map((h) => {
            const v = h._source?.vulnerability;
            return {
                cve: v?.id ?? '',
                title: v?.description ?? '',
                severity: v?.severity ?? '',
                cvss_score: v?.score?.base ?? null,
                package: h._source?.package?.name ?? '',
                version: h._source?.package?.version ?? '',
                agent: h._source?.agent?.name ?? '',
                status: v?.under_evaluation ? 'Under Evaluation' : 'Confirmed',
            };
        });

        const buckets = aggsRes?.aggregations?.by_severity?.buckets ?? [];
        const countFor = (label: string) =>
            buckets.find((b) => b.key?.toLowerCase() === label)?.doc_count ?? 0;

        const summary = {
            critical: countFor('critical'),
            high: countFor('high'),
            medium: countFor('medium'),
            low: countFor('low'),
            total: buckets.reduce((sum, b) => sum + (b.doc_count ?? 0), 0),
        };

        return NextResponse.json({ vulnerabilities, summary });
    } catch {
        return NextResponse.json(
            { vulnerabilities: [], summary: { critical: 0, high: 0, medium: 0, low: 0, total: 0 } },
            { status: 502 }
        );
    }
}
