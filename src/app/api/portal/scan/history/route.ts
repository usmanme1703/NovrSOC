export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

function unverifiedOrgId(authHeader: string | null): number | null {
    if (!authHeader?.startsWith('Bearer ')) return null;
    try {
        const payload = JSON.parse(Buffer.from(authHeader.slice(7).split('.')[1], 'base64').toString('utf8'));
        return typeof payload.orgId === 'number' ? payload.orgId : null;
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const orgId = unverifiedOrgId(req.headers.get('authorization'));
        const qs = orgId ? `?org_id=${orgId}` : '';
        const res = await fetch(`${BACKEND_URL}/api/scan-history${qs}`, { cache: 'no-store' });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ scans: [] }, { status: 502 });
    }
}
