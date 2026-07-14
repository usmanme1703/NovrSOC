'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { getPortalContext } from '@/lib/portal-context';

interface Agent {
    id: string;
    name: string;
    ip: string | null;
    status: string;
    lastSeen: string | null;
    os: string | null;
    group: string;
}

const STATUS_BADGE: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    disconnected: 'bg-gray-100 text-gray-500 border-gray-200',
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    never_connected: 'bg-gray-100 text-gray-500 border-gray-200',
};

function formatLastSeen(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function AssetsPage() {
    const [search, setSearch] = useState('');
    const [agents, setAgents] = useState<Agent[] | null>(null);

    useEffect(() => {
        const group = getPortalContext().wazuhGroup;
        fetch(`/api/wazuh/agents${group ? `?group=${encodeURIComponent(group)}` : ''}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => setAgents(Array.isArray(data?.agents) ? data.agents : []))
            .catch(() => setAgents([]));
    }, []);

    const filtered = (agents ?? []).filter(a => {
        if (!search) return true;
        const q = search.toLowerCase();
        return a.name.toLowerCase().includes(q) || (a.ip ?? '').includes(q);
    });

    const loading = agents === null;
    const total = agents?.length ?? 0;
    const online = agents?.filter(a => a.status === 'active').length ?? 0;

    return (
        <PageLayout title="Asset Inventory">
            <div className="space-y-4">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Asset Inventory</h1>
                    <p className="text-xs text-gray-500">Assets & Risk · Endpoints registered via the Wazuh agent</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Total Assets', v: loading ? '...' : String(total), color: 'text-gray-900' },
                        { label: 'Online', v: loading ? '...' : String(online), color: 'text-emerald-600' },
                        { label: 'Offline', v: loading ? '...' : String(total - online), color: 'text-gray-500' },
                    ].map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-3">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-3 -mx-3 mb-2 rounded-t-xl" />
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{k.label}</p>
                            <p className={`text-lg font-black ${k.color}`}>{k.v}</p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets, IPs…"
                    className="w-56 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-gray-700 placeholder:text-gray-400" />

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    {loading ? (
                        <div className="p-6 space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
                    ) : filtered.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-16">No assets registered yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        {['Asset Name', 'IP', 'OS', 'Group', 'Status', 'Last Seen'].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(a => (
                                        <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2.5 font-bold text-gray-800 whitespace-nowrap">{a.name}</td>
                                            <td className="px-4 py-2.5 font-mono text-gray-600 text-[10px]">{a.ip ?? '—'}</td>
                                            <td className="px-4 py-2.5 text-gray-500 text-[10px]">{a.os ?? '—'}</td>
                                            <td className="px-4 py-2.5 text-gray-500">{a.group}</td>
                                            <td className="px-4 py-2.5">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_BADGE[a.status] ?? STATUS_BADGE.disconnected}`}>{a.status}</span>
                                            </td>
                                            <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap">{formatLastSeen(a.lastSeen)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!loading && filtered.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-100">
                            <p className="text-[10px] text-gray-400">Showing {filtered.length} of {total} assets</p>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
