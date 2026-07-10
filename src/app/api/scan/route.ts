export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { runScan } from '@/lib/scan';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const value: string = body?.value ?? '';
        if (!value.trim()) {
            return NextResponse.json({ error: 'Value is required' }, { status: 400 });
        }

        const result = await runScan(value, body?.type ?? 'auto');
        const orgId: number | null = typeof body?.orgId === 'number' ? body.orgId : null;

        // Best-effort persistence — never block the scan result on this.
        fetch(`${BACKEND_URL}/api/scan-history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                value: result.value, type: result.type, verdict: result.verdict, confidence: result.confidence,
                scanned_by: orgId ? 'Portal User' : 'Admin User', result_json: result, org_id: orgId,
            }),
        }).catch(() => {});

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
    }
}
