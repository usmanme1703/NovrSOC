export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { wazuhGet } from '@/lib/wazuh';

export async function GET() {
    try {
        const { status, json } = await wazuhGet('/alerts?limit=10&sort=-timestamp');
        return NextResponse.json(json, { status });
    } catch {
        return NextResponse.json(null, { status: 502 });
    }
}
