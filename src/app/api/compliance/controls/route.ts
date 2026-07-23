export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

export interface ComplianceControl {
    id: number;
    controlId: string;
    title: string;
    category: string;
    weight: number;
    status: string;
    notes: string | null;
}

export async function GET(req: NextRequest) {
    const frameworkId = req.nextUrl.searchParams.get('frameworkId');
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!frameworkId) return NextResponse.json({ error: 'frameworkId is required' }, { status: 400 });

    try {
        const params = new URLSearchParams({ frameworkId });
        if (orgId) params.set('orgId', orgId);
        const res = await fetch(`${BACKEND_URL}/api/compliance/controls?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('not available');
        const data = await res.json();
        return NextResponse.json(Array.isArray(data) ? data : []);
    } catch {
        // No compliance backend deployed yet — empty control list rather than fabricated rows.
        return NextResponse.json([]);
    }
}
