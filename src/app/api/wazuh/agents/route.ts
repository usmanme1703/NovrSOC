export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getAgentsForGroup } from '@/lib/wazuh-group';

export async function GET(req: NextRequest) {
    try {
        const group = req.nextUrl.searchParams.get('group');
        const agents = await getAgentsForGroup(group);
        const active = agents.filter((a) => a.status === 'active').length;
        const total = agents.length;
        const agentDetails = agents.map((a) => ({
            id: a.id,
            name: a.name,
            ip: a.ip,
            status: a.status,
            lastSeen: a.lastKeepAlive,
            os: a.os,
            group: a.group.join(', ') || 'default',
        }));
        return NextResponse.json({
            active,
            total,
            agents: agentDetails,
            data: { connection: { active, total } },
        });
    } catch {
        return NextResponse.json(null, { status: 502 });
    }
}
