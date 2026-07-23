export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { getAgentNamesForGroup } from '@/lib/wazuh-group';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS;

interface Bucket {
    key: string;
    doc_count: number;
    top_groups?: { buckets?: { key: string }[] };
}

interface SearchResponse {
    aggregations?: { top_countries?: { buckets?: Bucket[] } };
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

// Excludes RFC1918 / loopback / link-local so internal agent-to-agent traffic
// never shows up disguised as an "attack".
const PRIVATE_PREFIXES = [
    '10.', '127.', '192.168.', '169.254.',
    ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.`),
];

const NAME_TO_ISO: Record<string, string> = {
    'United States': 'US', 'United Kingdom': 'GB', 'China': 'CN', 'Russia': 'RU',
    'Germany': 'DE', 'Netherlands': 'NL', 'France': 'FR', 'Brazil': 'BR', 'India': 'IN',
    'Ukraine': 'UA', 'South Korea': 'KR', 'Indonesia': 'ID', 'Japan': 'JP', 'Vietnam': 'VN',
    'Poland': 'PL', 'Romania': 'RO', 'Turkey': 'TR', 'Iran': 'IR', 'Singapore': 'SG',
    'Hong Kong': 'HK', 'Taiwan': 'TW', 'Mexico': 'MX', 'Italy': 'IT', 'Spain': 'ES',
    'Sweden': 'SE', 'Switzerland': 'CH', 'Australia': 'AU', 'South Africa': 'ZA',
    'Nigeria': 'NG', 'Egypt': 'EG', 'Israel': 'IL', 'Thailand': 'TH', 'Malaysia': 'MY',
    'Philippines': 'PH', 'Pakistan': 'PK', 'Bangladesh': 'BD', 'Argentina': 'AR',
    'Colombia': 'CO', 'Chile': 'CL', 'Belgium': 'BE', 'Austria': 'AT', 'Czechia': 'CZ',
    'Czech Republic': 'CZ', 'Portugal': 'PT', 'Ireland': 'IE', 'Norway': 'NO', 'Denmark': 'DK',
    'Finland': 'FI', 'Greece': 'GR', 'Hungary': 'HU', 'Bulgaria': 'BG', 'Moldova': 'MD',
    'Belarus': 'BY', 'Kazakhstan': 'KZ', 'Uzbekistan': 'UZ', 'Iraq': 'IQ', 'Saudi Arabia': 'SA',
    'United Arab Emirates': 'AE', 'Morocco': 'MA', 'Algeria': 'DZ', 'Kenya': 'KE',
    'Venezuela': 'VE', 'Peru': 'PE', 'Ecuador': 'EC', 'Panama': 'PA', 'Costa Rica': 'CR',
    'Cuba': 'CU', 'Lithuania': 'LT', 'Latvia': 'LV', 'Estonia': 'EE', 'Slovakia': 'SK',
    'Slovenia': 'SI', 'Croatia': 'HR', 'Serbia': 'RS', 'Canada': 'CA', 'New Zealand': 'NZ',
};

function isoCode(countryName: string): string {
    return NAME_TO_ISO[countryName] ?? countryName.slice(0, 2).toUpperCase();
}

// Classifies the dominant attack pattern for a country's alerts from the
// rule.groups Wazuh itself assigned, rather than guessing from the description text.
function classify(groups: string[]): string {
    const set = new Set(groups);
    if (set.has('sshd') || set.has('authentication_failed') || set.has('invalid_login')) return 'Brute Force';
    if (set.has('web') || set.has('attack') || set.has('sqlinjection') || set.has('xss')) return 'Web Attack';
    if (set.has('recon') || set.has('nmap') || set.has('portscan') || set.has('scan')) return 'Scanning';
    if (set.has('malware') || set.has('virus') || set.has('rootkit')) return 'Malware';
    if (set.has('firewall') || set.has('ids') || set.has('firewall_drop')) return 'Intrusion Attempt';
    return 'Suspicious Activity';
}

export async function GET(req: NextRequest) {
    try {
        const group = req.nextUrl.searchParams.get('group');
        const agentNames = group ? await getAgentNamesForGroup(group) : null;

        const must: unknown[] = [
            { exists: { field: 'data.srcip' } },
            { range: { timestamp: { gte: 'now-24h' } } },
        ];
        if (agentNames) must.push({ terms: { 'agent.name': agentNames } });

        const res = await search({
            size: 0,
            query: {
                bool: {
                    must,
                    must_not: PRIVATE_PREFIXES.map((p) => ({ prefix: { 'data.srcip': p } })),
                },
            },
            aggs: {
                top_countries: {
                    terms: { field: 'GeoLocation.country_name', size: 5 },
                    aggs: {
                        top_groups: { terms: { field: 'rule.groups', size: 6 } },
                    },
                },
            },
        });

        const buckets = res?.aggregations?.top_countries?.buckets ?? [];
        const origins = buckets.map((b) => ({
            country: isoCode(b.key),
            name: b.key,
            count: b.doc_count,
            label: classify((b.top_groups?.buckets ?? []).map((g) => g.key)),
        }));

        return NextResponse.json(origins);
    } catch {
        return NextResponse.json([], { status: 502 });
    }
}
