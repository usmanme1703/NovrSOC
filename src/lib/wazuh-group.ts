import https from 'https';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;

export interface WazuhAgent {
    id: string;
    name: string;
    status: string;
    os: string | null;
    ip: string | null;
    lastKeepAlive: string | null;
    group: string[];
}

interface MonitoringHit {
    _source: {
        id?: string;
        name?: string;
        status?: string;
        group?: string[];
        ip?: string;
        lastKeepAlive?: string;
        os?: { name?: string; version?: string };
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
                timeout: 15000,
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

/**
 * Wazuh alert/vulnerability documents only carry agent.name / agent.id — there is no
 * agent.groups field to filter on directly. Group membership only exists in the
 * wazuh-monitoring-* index, so filtering "by group" is a two-step process: resolve the
 * group's agent names here first, then filter other indices by those names.
 *
 * Agent id "000" is the Wazuh manager itself (novrsoc-wazuh) and never appears in
 * wazuh-monitoring (it doesn't check in to itself). It always belongs to "default".
 */
export async function getAgentsForGroup(group: string | null): Promise<WazuhAgent[]> {
    const res = await search({
        size: 0,
        aggs: {
            agents: {
                terms: { field: 'id', size: 200 },
                aggs: { latest: { top_hits: { size: 1, sort: [{ timestamp: { order: 'desc' } }] } } },
            },
        },
    });

    const buckets = res?.aggregations?.agents?.buckets ?? [];
    let agents: WazuhAgent[] = buckets
        .map((b) => b.latest?.hits?.hits?.[0]?._source)
        .filter((a): a is NonNullable<typeof a> => Boolean(a))
        .map((a) => ({
            id: a.id ?? '',
            name: a.name ?? 'Unknown',
            status: a.status ?? 'unknown',
            os: a.os?.name ? `${a.os.name} ${a.os.version ?? ''}`.trim() : null,
            ip: a.ip ?? null,
            lastKeepAlive: a.lastKeepAlive ?? null,
            group: a.group ?? [],
        }));

    if (group) {
        agents = agents.filter((a) => a.group.includes(group));
    }

    if (!group || group === 'default') {
        agents.unshift({
            id: '000', name: 'novrsoc-wazuh', status: 'active', os: 'Ubuntu 22.04 LTS',
            ip: null, lastKeepAlive: new Date().toISOString(), group: ['default'],
        });
    }
    return agents;
}

export async function getAgentNamesForGroup(group: string | null): Promise<string[]> {
    const agents = await getAgentsForGroup(group);
    return agents.map((a) => a.name);
}
