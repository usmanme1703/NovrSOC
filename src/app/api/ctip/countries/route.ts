export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const CTIP_URL = process.env.CTIP_API_URL || 'http://138.197.188.132:8001';

const COUNTRY_MAP: Record<string, { name: string; flag: string }> = {
    CN: { name: 'China', flag: '🇨🇳' },
    RU: { name: 'Russia', flag: '🇷🇺' },
    US: { name: 'USA', flag: '🇺🇸' },
    BR: { name: 'Brazil', flag: '🇧🇷' },
    IN: { name: 'India', flag: '🇮🇳' },
    DE: { name: 'Germany', flag: '🇩🇪' },
    NL: { name: 'Netherlands', flag: '🇳🇱' },
    FR: { name: 'France', flag: '🇫🇷' },
    GB: { name: 'UK', flag: '🇬🇧' },
    UA: { name: 'Ukraine', flag: '🇺🇦' },
};

interface IOCItem {
    country?: string | null;
}

export async function GET() {
    try {
        // The CTIP API caps `limit` at 500 (a literal 1000 request 422s), and the
        // unfiltered/most-recent IOC stream is ~100% null-country (dominated by a
        // URL-based malware feed with no geolocation). Filtering to type=ip yields
        // real, populated country data instead.
        const res = await fetch(`${CTIP_URL}/api/ctip/iocs?type=ip&limit=500`, { cache: 'no-store' });
        const data = await res.json();
        const items: IOCItem[] = Array.isArray(data?.items) ? data.items : [];

        const counts: Record<string, number> = {};
        for (const item of items) {
            if (item.country) counts[item.country] = (counts[item.country] ?? 0) + 1;
        }

        const top5 = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([code, count]) => {
                const info = COUNTRY_MAP[code] ?? { name: code, flag: '🌐' };
                return { country: code, name: info.name, count, flag: info.flag };
            });

        return NextResponse.json(top5);
    } catch {
        return NextResponse.json([], { status: 502 });
    }
}
