export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const CTIP_URL = process.env.CTIP_API_URL || 'http://138.197.188.132:8001';

interface IOCItem {
    malware_family?: string | null;
    threat_type?: string | null;
    last_seen?: string | null;
}

export async function GET() {
    try {
        const res = await fetch(`${CTIP_URL}/api/ctip/iocs?limit=500`, { cache: 'no-store' });
        const data = await res.json();
        const items: IOCItem[] = Array.isArray(data?.items) ? data.items : [];

        const groups: Record<string, IOCItem[]> = {};
        for (const item of items) {
            if (!item.malware_family) continue;
            (groups[item.malware_family] ??= []).push(item);
        }

        const campaigns = Object.entries(groups)
            .filter(([, group]) => group.length > 5)
            .map(([name, group]) => {
                const threatTypeCounts: Record<string, number> = {};
                for (const g of group) {
                    if (g.threat_type) threatTypeCounts[g.threat_type] = (threatTypeCounts[g.threat_type] ?? 0) + 1;
                }
                const threat_type = Object.entries(threatTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Unknown';
                const seenDates = group.map(g => g.last_seen).filter((d): d is string => Boolean(d)).sort();

                return {
                    name,
                    ioc_count: group.length,
                    threat_type,
                    first_seen: seenDates[0] ?? null,
                    last_seen: seenDates[seenDates.length - 1] ?? null,
                    severity: group.length > 50 ? 'Critical' : group.length > 20 ? 'High' : 'Medium',
                };
            })
            .sort((a, b) => b.ioc_count - a.ioc_count)
            .slice(0, 10);

        return NextResponse.json(campaigns);
    } catch {
        return NextResponse.json([], { status: 502 });
    }
}
