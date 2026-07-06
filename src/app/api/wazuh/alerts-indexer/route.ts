export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import https from 'https';

const INDEXER_HOST = process.env.WAZUH_INDEXER_HOST || '164.92.203.205';
const INDEXER_PORT = Number(process.env.WAZUH_INDEXER_PORT || 9200);
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || 'admin';
const INDEXER_PASS = process.env.WAZUH_INDEXER_PASS || 'iUZ+5tCMwaAAwbrBdr3doguGil.eS5Wh';

function searchAlerts(): Promise<{ status: number; json: unknown }> {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({ size: 10, sort: [{ '@timestamp': { order: 'desc' } }] });
        const auth = 'Basic ' + Buffer.from(`${INDEXER_USER}:${INDEXER_PASS}`).toString('base64');
        const req = https.request(
            {
                hostname: INDEXER_HOST,
                port: INDEXER_PORT,
                path: '/wazuh-alerts-*/_search',
                method: 'GET',
                headers: {
                    Authorization: auth,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                },
                rejectUnauthorized: false,
                timeout: 8000,
            },
            (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    try {
                        resolve({ status: res.statusCode ?? 500, json: JSON.parse(data) });
                    } catch {
                        resolve({ status: res.statusCode ?? 500, json: null });
                    }
                });
            }
        );
        req.on('timeout', () => req.destroy(new Error('Wazuh indexer request timed out')));
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

export async function GET() {
    try {
        const { status, json } = await searchAlerts();
        const hits = (json as { hits?: { hits?: unknown[] } } | null)?.hits?.hits ?? [];
        return NextResponse.json({ hits }, { status });
    } catch {
        return NextResponse.json({ hits: [] }, { status: 502 });
    }
}
