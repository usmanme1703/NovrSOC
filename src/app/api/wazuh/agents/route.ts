export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getAgentsForGroup } from '@/lib/wazuh-group';

export async function GET(req: NextRequest) {
    try {
        const group = req.nextUrl.searchParams.get('group');
        const agents = await getAgentsForGroup(group);
        const active = agents.filter((a) => a.status === 'active').length;
        const total = agents.length;
        return NextResponse.json({ data: { connection: { active, total } } });
    } catch {
        return NextResponse.json(null, { status: 502 });
    }
}
