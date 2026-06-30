'use client';

import { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ALERTS, ALERT_KPIS } from '@/lib/mock/alerts';

const SEV_BADGE: Record<string, string> = {
    Critical: 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-700/40',
    High: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-700/40',
    Medium: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-700/40',
    Low: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-700/40',
};
const STATUS_BADGE: Record<string, string> = {
    New: 'bg-red-50 dark:bg-red-900/20 text-red-600',
    Assigned: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700',
    Investigating: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    Resolved: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
    Suppressed: 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400',
};

export default function AlertsPage() {
    const [search, setSearch] = useState('');
    const [sevFilter, setSevFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selected, setSelected] = useState<string[]>([]);

    const filtered = useMemo(() => ALERTS.filter(a => {
        if (sevFilter !== 'All' && a.severity !== sevFilter) return false;
        if (statusFilter !== 'All' && a.status !== statusFilter) return false;
        if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
            !a.asset.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [search, sevFilter, statusFilter]);

    const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    const allSelected = filtered.length > 0 && filtered.every(a => selected.includes(a.id));

    return (
        <PageLayout title="Alerts">
            <div className="space-y-4">
                <div>
                    <h1 className="text-lg font-black text-gray-900 dark:text-slate-100">Alert Queue</h1>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Security Operations · Real-time security alert management</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {[
                        { label: 'Total Alerts', v: ALERT_KPIS.total, color: 'text-gray-900 dark:text-slate-100' },
                        { label: 'New Today', v: ALERT_KPIS.newToday, color: 'text-blue-700 dark:text-blue-400' },
                        { label: 'Critical', v: ALERT_KPIS.critical, color: 'text-red-600' },
                        { label: 'High', v: ALERT_KPIS.high, color: 'text-orange-600' },
                        { label: 'Medium', v: ALERT_KPIS.medium, color: 'text-amber-600' },
                        { label: 'Low', v: ALERT_KPIS.low, color: 'text-blue-600' },
                        { label: 'Suppressed', v: ALERT_KPIS.autoSuppressed, color: 'text-gray-400 dark:text-slate-500' },
                        { label: 'Avg TTD', v: ALERT_KPIS.avgTtd, color: 'text-emerald-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl p-3">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-3 -mx-3 mb-2 rounded-t-xl" />
                            <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{k.label}</p>
                            <p className={`text-lg font-black ${k.color}`}>{k.v}</p>
                        </div>
                    ))}
                </div>

                {/* Filters + Bulk actions */}
                <div className="flex items-center gap-3 flex-wrap">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alerts, assets…"
                        className="w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500" />
                    {['All', 'Critical', 'High', 'Medium', 'Low'].map(s => (
                        <button key={s} onClick={() => setSevFilter(s)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${sevFilter === s ? 'bg-blue-700 text-white border-blue-700' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}`}>{s}</button>
                    ))}
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1.5 text-gray-500 dark:text-slate-400 focus:outline-none">
                        <option>All</option>
                        {['New', 'Assigned', 'Investigating', 'Resolved', 'Suppressed'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    {selected.length > 0 && (
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">{selected.length} selected</span>
                            <button className="text-[10px] font-bold px-3 py-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">Assign</button>
                            <button className="text-[10px] font-bold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Mark Reviewed</button>
                            <button className="text-[10px] font-bold px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">Create Case</button>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-slate-700">
                                    <th className="px-4 py-3">
                                        <input type="checkbox" checked={allSelected}
                                            onChange={() => setSelected(allSelected ? [] : filtered.map(a => a.id))}
                                            className="rounded border-gray-300 dark:border-slate-600" />
                                    </th>
                                    {['Severity', 'Alert Name', 'Source', 'Asset', 'MITRE', 'Tactic', 'Time', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(a => (
                                    <tr key={a.id} className={`border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors ${selected.includes(a.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                        <td className="px-4 py-2.5">
                                            <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)}
                                                className="rounded border-gray-300 dark:border-slate-600" />
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEV_BADGE[a.severity]}`}>{a.severity}</span>
                                        </td>
                                        <td className="px-4 py-2.5 font-semibold text-gray-800 dark:text-slate-100 max-w-[180px] truncate">{a.name}</td>
                                        <td className="px-4 py-2.5 font-mono text-gray-500 dark:text-slate-400 text-[10px]">{a.source}</td>
                                        <td className="px-4 py-2.5 font-mono text-gray-700 dark:text-slate-200 text-[10px]">{a.asset}</td>
                                        <td className="px-4 py-2.5 font-mono text-orange-600 dark:text-orange-400 text-[10px]">{a.mitre}</td>
                                        <td className="px-4 py-2.5 text-gray-500 dark:text-slate-400 text-[10px]">{a.tactic}</td>
                                        <td className="px-4 py-2.5 font-mono text-gray-400 dark:text-slate-500 text-[10px]">{a.time}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_BADGE[a.status]}`}>{a.status}</span>
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button className="text-[10px] font-bold text-blue-700 dark:text-blue-400 hover:underline">Assign</button>
                                                <button className="text-[10px] font-bold text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200">Suppress</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="text-center py-12 text-gray-400 dark:text-slate-500">
                                <p className="text-2xl mb-2">🔍</p>
                                <p className="text-sm font-semibold">No alerts match the current filters</p>
                            </div>
                        )}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">Showing {filtered.length} of {ALERTS.length} alerts</p>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(p => (
                                <button key={p} className={`w-6 h-6 text-[10px] font-bold rounded ${p === 1 ? 'bg-blue-700 text-white' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>{p}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
