'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { INCIDENTS, INCIDENT_KPIS, type Incident } from '@/lib/mock/incidents';

const sevColor: Record<string, string> = {
    Critical: 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-700/40',
    High: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-700/40',
    Medium: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-700/40',
    Low: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-700/40',
};
const statusColor: Record<string, string> = {
    Open: 'bg-red-50 dark:bg-red-900/20 text-red-600',
    Investigating: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
    Escalated: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600',
    Contained: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    Resolved: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
};

export default function IncidentsPage() {
    const [search, setSearch] = useState('');
    const [sevFilter, setSevFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expanded, setExpanded] = useState<string | null>(null);

    const filtered = INCIDENTS.filter(i => {
        const q = search.toLowerCase();
        const matchQ = !q || i.name.toLowerCase().includes(q) || i.asset.toLowerCase().includes(q) || i.source.toLowerCase().includes(q);
        const matchSev = sevFilter === 'All' || i.severity === sevFilter;
        const matchStatus = statusFilter === 'All' || i.status === statusFilter;
        return matchQ && matchSev && matchStatus;
    });

    return (
        <PageLayout title="Incident Queue">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900 dark:text-slate-100">Incident Queue</h1>
                    <p className="text-xs text-gray-400 dark:text-slate-400">Security Operations · Real-time incident tracking and response management</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-5 gap-3">
                    {[
                        { label: 'Total Open', value: INCIDENT_KPIS.totalOpen, color: 'text-red-600' },
                        { label: 'Investigating', value: INCIDENT_KPIS.investigating, color: 'text-orange-600' },
                        { label: 'Escalated', value: INCIDENT_KPIS.escalated, color: 'text-violet-600' },
                        { label: 'Contained', value: INCIDENT_KPIS.contained, color: 'text-blue-600' },
                        { label: 'Avg SLA Remaining', value: `${INCIDENT_KPIS.avgSLA} mins`, color: 'text-emerald-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search incidents, assets, sources…"
                        className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-700/20 w-64" />
                    {[['Severity', ['All', 'Critical', 'High', 'Medium', 'Low'], sevFilter, setSevFilter],
                      ['Status', ['All', 'Open', 'Investigating', 'Escalated', 'Contained', 'Resolved'], statusFilter, setStatusFilter]
                    ].map(([label, opts, val, setter]) => (
                        <select key={String(label)} value={String(val)} onChange={e => (setter as (v: string) => void)(e.target.value)}
                            className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-700/20">
                            {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                        </select>
                    ))}
                    <span className="ml-auto text-[10px] text-gray-400 dark:text-slate-500">{filtered.length} incidents</span>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-slate-700">
                                    {['Severity', 'Incident', 'Source', 'Asset', 'Status', 'Analyst', 'SLA'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(inc => (
                                    <>
                                        <tr key={inc.id} onClick={() => setExpanded(expanded === inc.id ? null : inc.id)}
                                            className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/20 cursor-pointer transition-colors">
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sevColor[inc.severity]}`}>{inc.severity}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-gray-800 dark:text-slate-100">{inc.name}</p>
                                                <p className="text-[10px] text-gray-400 dark:text-slate-500">{inc.id}</p>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-gray-500 dark:text-slate-400">{inc.source}</td>
                                            <td className="px-4 py-3 font-mono text-gray-700 dark:text-slate-200">{inc.asset}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusColor[inc.status]}`}>{inc.status}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{inc.analyst}</td>
                                            <td className={`px-4 py-3 font-mono font-bold ${inc.slaMinutes < 30 && inc.slaMinutes > 0 ? 'text-red-600' : 'text-gray-700 dark:text-slate-200'}`}>{inc.sla}</td>
                                        </tr>
                                        {expanded === inc.id && (
                                            <tr key={`${inc.id}-detail`} className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60">
                                                <td colSpan={7} className="px-6 py-4">
                                                    <IncidentDetail inc={inc} />
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

function IncidentDetail({ inc }: { inc: Incident }) {
    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Timeline</h4>
                <div className="space-y-2 border-l-2 border-blue-200 dark:border-blue-700/40 pl-3">
                    {inc.timeline.map((t, i) => (
                        <div key={i}>
                            <p className="text-[10px] font-mono text-blue-700 dark:text-blue-400">{t.time}</p>
                            <p className="text-[11px] text-gray-700 dark:text-slate-200">{t.event}</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500">{t.source}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Details</h4>
                <div className="space-y-2 text-xs">
                    <div><span className="text-gray-400 dark:text-slate-500">MITRE:</span> <span className="text-orange-600 font-mono">{inc.mitre}</span></div>
                    <div><span className="text-gray-400 dark:text-slate-500">Assets:</span> <span className="text-gray-700 dark:text-slate-200">{inc.affectedAssets.join(', ')}</span></div>
                    <div><span className="text-gray-400 dark:text-slate-500">Description:</span> <span className="text-gray-700 dark:text-slate-200">{inc.description}</span></div>
                </div>
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mt-4 mb-2">Suggested Actions</h4>
                <ol className="space-y-1">
                    {inc.suggestedActions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-700 dark:text-slate-200">
                            <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">{i + 1}.</span>{a}
                        </li>
                    ))}
                </ol>
            </div>
            <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Actions</h4>
                <button className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Assign to Me</button>
                <select className="w-full py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs text-gray-700 dark:text-slate-200 px-2 focus:outline-none">
                    <option>Update Status…</option>
                    <option>Open</option>
                    <option>Investigating</option>
                    <option>Escalated</option>
                    <option>Contained</option>
                    <option>Resolved</option>
                </select>
                <button className="w-full py-2 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-100 text-xs font-bold rounded-lg transition-colors">View Full Report</button>
            </div>
        </div>
    );
}
