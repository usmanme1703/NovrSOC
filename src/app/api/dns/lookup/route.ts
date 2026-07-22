export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import {
    DNS_RECORD_TYPES,
    DnsRecordType,
    normalizeDomain,
    resolveRecords,
    fetchCertificates,
} from '@/lib/dns-intel';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

function saveScanHistory(domain: string, resultJson: unknown, orgId: number | null) {
    fetch(`${BACKEND_URL}/api/scan-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            value: domain,
            type: 'dns',
            verdict: null,
            confidence: null,
            scanned_by: orgId ? 'Portal User' : 'Admin User',
            result_json: resultJson,
            org_id: orgId,
        }),
    }).catch(() => {});
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const domain = normalizeDomain(String(body?.domain ?? ''));
        if (!domain) {
            return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
        }

        const requested: string[] = Array.isArray(body?.record_types) ? body.record_types : [...DNS_RECORD_TYPES];
        const types = DNS_RECORD_TYPES.filter((t) => requested.includes(t)) as DnsRecordType[];
        const typesToQuery = types.length > 0 ? types : [...DNS_RECORD_TYPES];

        const [records, certificates] = await Promise.all([
            resolveRecords(domain, typesToQuery),
            fetchCertificates(domain),
        ]);

        const now = Date.now();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const expired_certs = certificates.filter((c) => c.expired).length;
        const expiring_soon = certificates.filter((c) => !c.expired && new Date(c.not_after).getTime() - now <= thirtyDays).length;

        const total_records =
            records.A.length + records.AAAA.length + records.MX.length + records.TXT.length +
            records.NS.length + records.CNAME.length + records.SOA.length;

        const result = {
            domain,
            records,
            certificates,
            summary: {
                total_records,
                total_certs: certificates.length,
                expired_certs,
                expiring_soon,
            },
        };

        const orgId: number | null = typeof body?.orgId === 'number' ? body.orgId : null;
        saveScanHistory(domain, result, orgId);

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: 'DNS lookup failed' }, { status: 500 });
    }
}
