export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const CTIP_URL = process.env.CTIP_API_URL || 'http://138.197.188.132:8001';

export async function GET() {
    try {
        const res = await fetch(`${CTIP_URL}/api/ctip/threat-actors`, { cache: 'no-store' });
        const data = await res.json();
        return NextResponse.json(Array.isArray(data) ? data : []);
    } catch {
        return NextResponse.json([], { status: 502 });
    }
}
