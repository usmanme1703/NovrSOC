export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

export async function GET() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/ctip/feed-status`, { cache: 'no-store' });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ feeds: [] }, { status: 502 });
    }
}
