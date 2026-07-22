export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { getAgentNamesForGroup } from '@/lib/wazuh-group';
import { FRAMEWORKS } from '@/lib/mock/compliance';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;
const CTIP_URL = process.env.CTIP_API_URL || 'http://138.197.188.132:8001';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

interface ReportRequestBody {
    orgId: number;
    orgName: string;
    wazuhGroup: string | null;
    month: string;
    period_start: string;
    period_end: string;
}

function indexerSearch(index: string, body: unknown): Promise<Record<string, unknown> | null> {
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
                path: `/${index}/_search`,
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

function countResult(res: Record<string, unknown> | null): number {
    const hits = res?.hits as { total?: { value?: number } } | undefined;
    return hits?.total?.value ?? 0;
}

export async function POST(req: NextRequest) {
    let body: ReportRequestBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { orgId, orgName, wazuhGroup, month, period_start, period_end } = body;
    if (!orgId || !orgName || !month || !period_start || !period_end) {
        return NextResponse.json({ error: 'orgId, orgName, month, period_start, and period_end are required' }, { status: 400 });
    }

    const agentNames = wazuhGroup ? await getAgentNamesForGroup(wazuhGroup) : null;
    const periodRange = { range: { timestamp: { gte: period_start, lte: period_end } } };
    const alertsMust: unknown[] = [periodRange];
    if (agentNames) alertsMust.push({ terms: { 'agent.name': agentNames } });
    const alertsQuery = { bool: { must: alertsMust } };

    const vulnQuery = agentNames ? { bool: { must: [{ terms: { 'agent.name': agentNames } }] } } : { match_all: {} };

    const [
        totalRes,
        criticalRes,
        highRes,
        mediumRes,
        topIncidentsRes,
        activeAssetsRes,
        dailyRes,
        vulnCountRes,
        vulnTopRes,
        ctipRes,
        vendorRes,
        scanRes,
        advisoriesRes,
    ] = await Promise.allSettled([
        indexerSearch('wazuh-alerts-4.x-*', { size: 0, track_total_hits: true, query: alertsQuery }),
        indexerSearch('wazuh-alerts-4.x-*', {
            size: 0,
            track_total_hits: true,
            query: { bool: { must: [...alertsMust, { range: { 'rule.level': { gte: 12 } } }] } },
        }),
        indexerSearch('wazuh-alerts-4.x-*', {
            size: 0,
            track_total_hits: true,
            query: { bool: { must: [...alertsMust, { range: { 'rule.level': { gte: 10 } } }] } },
        }),
        indexerSearch('wazuh-alerts-4.x-*', {
            size: 0,
            track_total_hits: true,
            query: { bool: { must: [...alertsMust, { range: { 'rule.level': { gte: 7, lte: 9 } } }] } },
        }),
        indexerSearch('wazuh-alerts-4.x-*', {
            size: 0,
            query: alertsQuery,
            aggs: {
                top: {
                    terms: { field: 'rule.description', size: 5 },
                    aggs: {
                        max_level: { max: { field: 'rule.level' } },
                        top_agent: { terms: { field: 'agent.name', size: 1 } },
                    },
                },
            },
        }),
        indexerSearch('wazuh-alerts-4.x-*', {
            size: 0,
            query: alertsQuery,
            aggs: { distinct_assets: { cardinality: { field: 'agent.name' } } },
        }),
        indexerSearch('wazuh-alerts-4.x-*', {
            size: 0,
            query: alertsQuery,
            aggs: {
                per_day: {
                    date_histogram: { field: 'timestamp', calendar_interval: 'day', min_doc_count: 0 },
                },
            },
        }),
        indexerSearch('wazuh-states-vulnerabilities-*', { size: 0, track_total_hits: true, query: vulnQuery }),
        indexerSearch('wazuh-states-vulnerabilities-*', {
            size: 10,
            sort: [{ 'vulnerability.score.base': { order: 'desc' } }],
            _source: ['vulnerability.id', 'vulnerability.severity', 'vulnerability.score.base', 'vulnerability.under_evaluation', 'package.name', 'package.version'],
            query: vulnQuery,
        }),
        fetch(`${CTIP_URL}/api/ctip/stats`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null),
        fetch(`${BACKEND_URL}/api/vendor-assessments?org_id=${orgId}`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null),
        fetch(`${BACKEND_URL}/api/scan-history?org_id=${orgId}`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null),
        fetch(`${BACKEND_URL}/api/advisories`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null),
    ]).then((results) => results.map((r) => (r.status === 'fulfilled' ? r.value : null)));

    type TopIncidentBucket = {
        key: string;
        doc_count: number;
        max_level?: { value?: number };
        top_agent?: { buckets?: { key: string }[] };
    };
    const topIncidentBuckets = (topIncidentsRes?.aggregations as { top?: { buckets?: TopIncidentBucket[] } } | undefined)?.top?.buckets ?? [];
    const severityForLevel = (level: number) => (level >= 12 ? 'Critical' : level >= 10 ? 'High' : level >= 7 ? 'Medium' : 'Low');
    const top_incidents = topIncidentBuckets.map((b) => ({
        description: b.key,
        count: b.doc_count,
        severity: severityForLevel(b.max_level?.value ?? 0),
        agent: b.top_agent?.buckets?.[0]?.key ?? '—',
    }));

    const active_assets = (activeAssetsRes?.aggregations as { distinct_assets?: { value?: number } } | undefined)?.distinct_assets?.value ?? 0;

    const dailyBuckets = (dailyRes?.aggregations as { per_day?: { buckets?: { key_as_string?: string; doc_count: number }[] } } | undefined)?.per_day?.buckets ?? [];
    const daily_alerts = dailyBuckets.map((b) => ({
        date: b.key_as_string ? new Date(b.key_as_string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—',
        count: b.doc_count,
    }));

    const vulnHits = (vulnTopRes?.hits as { hits?: { _source?: Record<string, unknown> }[] } | undefined)?.hits ?? [];
    const top_vulnerabilities = vulnHits.map((h) => {
        const v = h._source?.vulnerability as Record<string, unknown> | undefined;
        const pkg = h._source?.package as Record<string, unknown> | undefined;
        return {
            cve: (v?.id as string) ?? '',
            severity: (v?.severity as string) ?? '',
            cvss_score: ((v?.score as Record<string, unknown> | undefined)?.base as number) ?? null,
            package: pkg?.name ? `${pkg.name as string} ${(pkg.version as string) ?? ''}`.trim() : '',
            status: v?.under_evaluation ? 'Under Evaluation' : 'Confirmed',
        };
    });

    const ctipStats = ctipRes as { total_iocs?: number; active_campaigns?: number; exploitable_cves_this_week?: number } | null;

    const report = {
        orgId,
        orgName,
        wazuhGroup: wazuhGroup ?? null,
        month,
        period_start,
        period_end,
        generated_at: new Date().toISOString(),
        wazuh: {
            total_alerts: countResult(totalRes),
            critical_alerts: countResult(criticalRes),
            high_alerts: countResult(highRes),
            medium_alerts: countResult(mediumRes),
            top_incidents,
            active_assets,
            vulnerability_count: countResult(vulnCountRes),
            daily_alerts,
            top_vulnerabilities,
        },
        ctip: {
            total_iocs: ctipStats?.total_iocs ?? 0,
            active_campaigns: ctipStats?.active_campaigns ?? 0,
            exploitable_cves: ctipStats?.exploitable_cves_this_week ?? 0,
        },
        postgres: {
            vendor_assessments: Array.isArray((vendorRes as { assessments?: unknown[] } | null)?.assessments)
                ? (vendorRes as { assessments: unknown[] }).assessments.length
                : 0,
            scans_performed: Array.isArray((scanRes as { scans?: unknown[] } | null)?.scans)
                ? (scanRes as { scans: unknown[] }).scans.length
                : 0,
            advisories_count: Array.isArray((advisoriesRes as { advisories?: unknown[] } | null)?.advisories)
                ? (advisoriesRes as { advisories: unknown[] }).advisories.length
                : 0,
        },
        compliance: FRAMEWORKS,
    };

    // Best-effort: persist to report history via the backend service. The backend
    // does not yet expose this endpoint (see report for details) — failures here
    // must never block returning the report data to the client.
    fetch(`${BACKEND_URL}/api/report-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ org_id: orgId, period: month, generated_by: 'portal', data_json: report }),
    }).catch(() => {});

    return NextResponse.json(report);
}
