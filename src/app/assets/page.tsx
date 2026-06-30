'use client';

import { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ASSETS, ASSET_KPIS } from '@/lib/mock/assets';

const RISK_COLOR = (s: number) => s >= 75 ? 'text-red-600' : s >= 60 ? 'text-amber-600' : 'text-emerald-600';
const AGENT_BADGE: Record<string, string> = {
    Active: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-700/40',
    Inactive: 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-600',
    Warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-700/40',
};

export default function AssetsPage() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const types = ['All', ...Array.from(new Set(ASSETS.map(a => a.type)))];

    const filtered = useMemo(() => ASSETS.filter(a => {
        if (typeFilter !== 'All' && a.type !== typeFilter) return false;
        if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.ip.includes(search)) return false;
        return true;
    }), [search, typeFilter]);

    const detail = ASSETS.find(a => a.id === selectedId);

    return (
        <PageLayout title="Asset Inventory">
            <div className="space-y-4">
                <div>
                    <h1 className="text-lg font-black text-gray-900 dark:text-slate-100">Asset Inventory</h1>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Assets & Risk · Complete visibility across all managed assets</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                        { label: 'Total Assets', v: ASSET_KPIS.total.toLocaleString(), color: 'text-gray-900 dark:text-slate-100' },
                        { label: 'Online', v: ASSET_KPIS.online.toLocaleString(), color: 'text-emerald-600' },
                        { label: 'Critical Risk', v: ASSET_KPIS.critical, color: 'text-red-600' },
                        { label: 'Unmanaged', v: ASSET_KPIS.unmanaged, color: 'text-amber-600' },
                        { label: 'Internet-Facing', v: ASSET_KPIS.internetFacing, color: 'text-orange-600' },
                        { label: 'Avg Risk Score', v: ASSET_KPIS.avgRisk, color: 'text-blue-700 dark:text-blue-400' },
                    ].map(k => (
                        <div key={k.label} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl p-3">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-3 -mx-3 mb-2 rounded-t-xl" />
                            <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{k.label}</p>
                            <p className={`text-lg font-black ${k.color}`}>{k.v}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets, IPs…"
                        className="w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500" />
                    {types.map(t => (
                        <button key={t} onClick={() => setTypeFilter(t)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${typeFilter === t ? 'bg-blue-700 text-white border-blue-700' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}`}>{t}</button>
                    ))}
                </div>

                <div className={`grid gap-5 ${detail ? 'grid-cols-3' : 'grid-cols-1'}`}>
                    <div className={detail ? 'col-span-2' : 'col-span-1'}>
                        <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-slate-700">
                                            {['Asset Name', 'Type', 'IP Address', 'OS', 'Department', 'Risk Score', 'Agent', 'CVEs', 'Last Seen'].map(h => (
                                                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(a => (
                                            <tr key={a.id} onClick={() => setSelectedId(selectedId === a.id ? null : a.id)}
                                                className={`border-b border-gray-100 dark:border-slate-700/50 cursor-pointer transition-colors ${selectedId === a.id ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-700/20'}`}>
                                                <td className="px-4 py-2.5 font-bold text-gray-800 dark:text-slate-100 whitespace-nowrap">{a.name}</td>
                                                <td className="px-4 py-2.5 text-gray-500 dark:text-slate-400">{a.type}</td>
                                                <td className="px-4 py-2.5 font-mono text-gray-600 dark:text-slate-300 text-[10px]">{a.ip}</td>
                                                <td className="px-4 py-2.5 text-gray-500 dark:text-slate-400 text-[10px]">{a.os}</td>
                                                <td className="px-4 py-2.5 text-gray-500 dark:text-slate-400">{a.department}</td>
                                                <td className="px-4 py-2.5 font-black text-sm">
                                                    <span className={RISK_COLOR(a.riskScore)}>{a.riskScore}</span>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${AGENT_BADGE[a.agentStatus]}`}>{a.agentStatus}</span>
                                                </td>
                                                <td className="px-4 py-2.5 font-black text-[11px] text-orange-600 dark:text-orange-400">{a.openCves}</td>
                                                <td className="px-4 py-2.5 text-gray-400 dark:text-slate-500 whitespace-nowrap">{a.lastSeen}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                <p className="text-[10px] text-gray-400 dark:text-slate-500">Showing {filtered.length} of {ASSETS.length} assets</p>
                            </div>
                        </div>
                    </div>

                    {detail && (
                        <div className="col-span-1">
                            <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-sm font-black text-gray-900 dark:text-slate-100">{detail.name}</h3>
                                        <button onClick={() => setSelectedId(null)} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 text-xs">✕</button>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {[
                                            ['Type', detail.type],
                                            ['IP Address', detail.ip],
                                            ['OS', detail.os],
                                            ['Department', detail.department],
                                            ['Risk Score', String(detail.riskScore)],
                                            ['Wazuh Agent', detail.agentStatus],
                                            ['Open CVEs', String(detail.openCves)],
                                            ['Internet Facing', detail.internetFacing ? 'Yes' : 'No'],
                                            ['Last Seen', detail.lastSeen],
                                        ].map(([k, v]) => (
                                            <div key={k} className="flex justify-between text-[10px]">
                                                <span className="text-gray-400 dark:text-slate-500">{k}</span>
                                                <span className="font-semibold text-gray-700 dark:text-slate-200">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <button className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-[10px] font-bold rounded-lg transition-colors">View Full Details</button>
                                        <button className="w-full py-2 border border-orange-200 dark:border-orange-700/40 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">View CVEs ({detail.openCves})</button>
                                        <button className="w-full py-2 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 text-[10px] font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">View Recent Alerts</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
