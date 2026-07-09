export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

export async function GET(req: NextRequest) {
    try {
        const auth = req.headers.get('authorization') ?? '';
        const res = await fetch(`${BACKEND_URL}/api/portal/assets`, {
            headers: { Authorization: auth },
            cache: 'no-store',
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
    }
}
