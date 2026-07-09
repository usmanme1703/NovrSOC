'use client';

import { useEffect, useState } from 'react';
import { getPortalToken } from '@/lib/portal-auth';

interface Advisory {
    id: number;
    title: string;
    summary: string | null;
    severity: string;
    sectors: string[] | null;
    recommended_actions: string[] | null;
    published_at: string;
}

const SEV_STYLE: Record<string, string> = {
    Critical: 'border-l-red-600 bg-red-50',
    High: 'border-l-orange-500 bg-orange-50',
    Medium: 'border-l-amber-500 bg-amber-50',
    Low: 'border-l-blue-500 bg-blue-50',
};
const SEV_BADGE: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High: 'bg-orange-50 text-orange-600 border-orange-200',
    Medium: 'bg-amber-50 text-amber-600 border-amber-200',
    Low: 'bg-blue-50 text-blue-600 border-blue-200',
};

export default function PortalAdvisoriesPage() {
    const [advisories, setAdvisories] = useState<Advisory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getPortalToken();
        fetch('/api/portal/advisories', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
            .then((r) => r.json())
            .then((d) => setAdvisories(Array.isArray(d?.advisories) ? d.advisories : []))
            .catch(() => setAdvisories([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-black text-gray-900">Advisories</h1>
                <p className="text-xs text-gray-500">Threat advisories relevant to your sector</p>
            </div>

            {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse" />)}</div>
            ) : advisories.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
                    <p className="text-sm text-gray-400">No advisories for your sector currently. Check back regularly.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {advisories.map((a) => (
                        <div key={a.id} className={`border-l-4 ${SEV_STYLE[a.severity] ?? SEV_STYLE.Medium} rounded-r-xl p-4 border border-gray-200 border-l-4`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEV_BADGE[a.severity] ?? SEV_BADGE.Medium}`}>{a.severity}</span>
                                <span className="text-[10px] text-gray-400">· Cybernovr Threat Intelligence</span>
                                <span className="text-[10px] text-gray-400">· {new Date(a.published_at).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-sm font-black text-gray-900 mb-1">{a.title}</h3>
                            {a.summary && <p className="text-[11px] text-gray-600 leading-relaxed">{a.summary}</p>}
                            {a.recommended_actions && a.recommended_actions.length > 0 && (
                                <p className="text-[9px] font-bold text-blue-700 mt-2">→ {a.recommended_actions[0]}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
