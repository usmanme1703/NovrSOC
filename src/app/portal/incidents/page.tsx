'use client';

import { useEffect, useState } from 'react';
import { getPortalToken } from '@/lib/portal-auth';

interface Incident {
    id: string;
    severity: string;
    name: string;
    source: string;
    asset: string;
    status: string;
    timestamp: string | null;
}

const SEV_BADGE: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High: 'bg-orange-50 text-orange-600 border-orange-200',
    Medium: 'bg-amber-50 text-amber-600 border-amber-200',
    Low: 'bg-blue-50 text-blue-600 border-blue-200',
};

export default function PortalIncidentsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getPortalToken();
        fetch('/api/portal/incidents', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
            .then((r) => r.json())
            .then((d) => setIncidents(Array.isArray(d?.incidents) ? d.incidents : []))
            .catch(() => setIncidents([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-black text-gray-900">Incidents</h1>
                <p className="text-xs text-gray-500">Security incidents detected on your monitored endpoints</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
                ) : incidents.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-16">No incidents detected for your organisation</p>
                ) : (
                    <table className="w-full text-xs">
                        <thead><tr className="border-b border-gray-100">
                            {['Severity', 'Incident Name', 'Source', 'Asset', 'Status', 'Time'].map((h) => (
                                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {incidents.map((inc) => (
                                <tr key={inc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEV_BADGE[inc.severity] ?? SEV_BADGE.Low}`}>{inc.severity}</span></td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">{inc.name}</td>
                                    <td className="px-4 py-3 text-gray-500 font-mono">{inc.source}</td>
                                    <td className="px-4 py-3 text-gray-500 font-mono">{inc.asset}</td>
                                    <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600">{inc.status}</span></td>
                                    <td className="px-4 py-3 text-gray-400">{inc.timestamp ? new Date(inc.timestamp).toLocaleString() : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
