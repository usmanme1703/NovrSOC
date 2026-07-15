export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { getAgentNamesForGroup } from '@/lib/wazuh-group';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;

const THREAT_RULE_GROUPS = [
    'authentication_failed',
    'attacks',
    'exploit',
    'malware',
    'web-attack',
    'intrusion_detection',
    'firewall-drop',
    'ids',
    'sshd',
];

interface SearchResponse {
    hits?: { total?: { value?: number } };
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

export async function GET(req: NextRequest) {
    try {
        const group = req.nextUrl.searchParams.get('group');
        const agentNames = group ? await getAgentNamesForGroup(group) : null;

        const must: unknown[] = [
            { terms: { 'rule.groups': THREAT_RULE_GROUPS } },
            { range: { timestamp: { gte: 'now-30d' } } },
        ];
        if (agentNames) must.push({ terms: { 'agent.name': agentNames } });

        const res = await search({ size: 0, track_total_hits: true, query: { bool: { must } } });
        const threatsBlocked = res?.hits?.total?.value ?? 0;

        return NextResponse.json({ threats_blocked: threatsBlocked, period: 'last 30 days' });
    } catch {
        return NextResponse.json({ threats_blocked: 0, period: 'last 30 days' }, { status: 502 });
    }
}
