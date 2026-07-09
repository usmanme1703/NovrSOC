export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { runScan } from '@/lib/scan';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

// Reads the orgId claim from the portal JWT without verifying the signature — this route
// only uses it to tag which org a scan belongs to; the backend independently verifies the
// token on every portal route that actually returns org-scoped data.
function unverifiedOrgId(authHeader: string | null): number | null {
    if (!authHeader?.startsWith('Bearer ')) return null;
    try {
        const payload = JSON.parse(Buffer.from(authHeader.slice(7).split('.')[1], 'base64').toString('utf8'));
        return typeof payload.orgId === 'number' ? payload.orgId : null;
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const value: string = body?.value ?? '';
        if (!value.trim()) {
            return NextResponse.json({ error: 'Value is required' }, { status: 400 });
        }

        const orgId = unverifiedOrgId(req.headers.get('authorization'));
        const result = await runScan(value, body?.type ?? 'auto');

        fetch(`${BACKEND_URL}/api/scan-history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                value: result.value, type: result.type, verdict: result.verdict, confidence: result.confidence,
                scanned_by: 'Portal User', result_json: result, org_id: orgId,
            }),
        }).catch(() => {});

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
    }
}
