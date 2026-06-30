'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CASES, CASE_KPIS } from '@/lib/mock/cases';

const PRIORITY_BADGE: Record<string, string> = {
    P1: 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-700/40',
    P2: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-700/40',
    P3: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-700/40',
    P4: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-700/40',
};
const STATUS_BADGE: Record<string, string> = {
    Open: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300',
    Investigating: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    Escalated: 'bg-red-50 dark:bg-red-900/20 text-red-600',
    Contained: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700',
    Resolved: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
};

export default function CasesPage() {
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const detail = CASES.find(c => c.id === selected);

    return (
        <PageLayout title="Cases">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-black text-gray-900 dark:text-slate-100">Case Management</h1>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Security Operations · Incident case tracking and investigation</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">+ New Case</button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {[
                        { label: 'Total Cases', v: CASE_KPIS.total, color: 'text-gray-900 dark:text-slate-100' },
                        { label: 'Open', v: CASE_KPIS.open, color: 'text-gray-600 dark:text-slate-300' },
                        { label: 'Investigating', v: CASE_KPIS.investigating, color: 'text-amber-600' },
                        { label: 'Escalated', v: CASE_KPIS.escalated, color: 'text-red-600' },
                        { label: 'Contained', v: CASE_KPIS.contained, color: 'text-blue-700' },
                        { label: 'Resolved', v: CASE_KPIS.resolved, color: 'text-emerald-600' },
                        { label: 'Avg Resolution', v: CASE_KPIS.avgResolutionTime, color: 'text-violet-600' },
                        { label: 'SLA Compliance', v: CASE_KPIS.slaCompliance, color: 'text-emerald-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl p-3">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-3 -mx-3 mb-2 rounded-t-xl" />
                            <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{k.label}</p>
                            <p className={`text-base font-black ${k.color}`}>{k.v}</p>
                        </div>
                    ))}
                </div>

                <div className={`grid gap-5 ${detail ? 'grid-cols-3' : 'grid-cols-1'}`}>
                    {/* Cases table */}
                    <div className={detail ? 'col-span-2' : 'col-span-1'}>
                        <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-slate-700">
                                            {['Case ID', 'Title', 'Priority', 'Status', 'Assigned', 'Alerts', 'Created', 'Updated'].map(h => (
                                                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CASES.map(c => (
                                            <tr key={c.id} onClick={() => setSelected(selected === c.id ? null : c.id)}
                                                className={`border-b border-gray-100 dark:border-slate-700/50 cursor-pointer transition-colors ${selected === c.id ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-700/20'}`}>
                                                <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 font-bold text-[10px]">{c.id}</td>
                                                <td className="px-4 py-3 font-semibold text-gray-800 dark:text-slate-100 max-w-[200px] truncate">{c.title}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PRIORITY_BADGE[c.priority]}`}>{c.priority}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_BADGE[c.status]}`}>{c.status}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{c.analyst}</td>
                                                <td className="px-4 py-3 text-center font-black text-gray-700 dark:text-slate-200">{c.linkedAlerts}</td>
                                                <td className="px-4 py-3 text-gray-400 dark:text-slate-500 whitespace-nowrap">{c.created}</td>
                                                <td className="px-4 py-3 text-gray-400 dark:text-slate-500 whitespace-nowrap">{c.updated}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Detail panel */}
                    {detail && (
                        <div className="col-span-1 space-y-3">
                            <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <p className="text-[10px] font-mono text-blue-700 dark:text-blue-400">{detail.id}</p>
                                        <button onClick={() => setSelected(null)} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 text-xs">✕</button>
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 dark:text-slate-100 mb-2">{detail.title}</h3>
                                    <p className="text-[10px] text-gray-500 dark:text-slate-400 mb-3">{detail.description}</p>

                                    <div className="space-y-2 mb-4">
                                        {[
                                            ['Priority', detail.priority],
                                            ['Status', detail.status],
                                            ['Analyst', detail.analyst],
                                            ['Linked Alerts', String(detail.linkedAlerts)],
                                            ['MITRE Technique', detail.mitreTag],
                                            ['Created', detail.created],
                                            ['Updated', detail.updated],
                                        ].map(([k, v]) => (
                                            <div key={k} className="flex justify-between text-[10px]">
                                                <span className="text-gray-400 dark:text-slate-500">{k}</span>
                                                <span className="font-semibold text-gray-700 dark:text-slate-200">{v}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <select className="w-full text-[10px] bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-700 dark:text-slate-200 focus:outline-none">
                                            <option>Update status…</option>
                                            {['Open', 'Investigating', 'Escalated', 'Contained', 'Resolved'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        <button className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-[10px] font-bold rounded-lg transition-colors">Assign to Me</button>
                                        <button className="w-full py-2 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 text-[10px] font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Add Note</button>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                                <div className="p-4">
                                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Case Timeline</p>
                                    <div className="space-y-3">
                                        {[
                                            { time: '14:12', event: 'Case created', actor: 'Amaka Obi' },
                                            { time: '14:18', event: 'Alert ALT-001 linked', actor: 'System' },
                                            { time: '14:22', event: 'Endpoint isolated', actor: 'Amaka Obi' },
                                            { time: '14:35', event: 'Escalated to P1', actor: 'Chidi Nwosu' },
                                            { time: '14:55', event: 'Evidence collection started', actor: 'Amaka Obi' },
                                        ].map((e, i) => (
                                            <div key={i} className="flex gap-3 text-[10px]">
                                                <span className="font-mono text-gray-400 dark:text-slate-500 flex-shrink-0 w-10">{e.time}</span>
                                                <div>
                                                    <p className="font-semibold text-gray-700 dark:text-slate-200">{e.event}</p>
                                                    <p className="text-gray-400 dark:text-slate-500">{e.actor}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Case Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-slate-700 w-full max-w-md shadow-2xl">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 rounded-t-2xl" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-gray-900 dark:text-slate-100">New Case</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300">✕</button>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Title', type: 'text', ph: 'Case title…' },
                                    { label: 'Description', type: 'textarea', ph: 'Describe the incident…' },
                                ].map(f => (
                                    <div key={f.label}>
                                        <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-1">{f.label}</label>
                                        {f.type === 'textarea'
                                            ? <textarea placeholder={f.ph} rows={3} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                                            : <input type="text" placeholder={f.ph} className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                                        }
                                    </div>
                                ))}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Priority</label>
                                    <select className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-slate-200 focus:outline-none">
                                        {['P1 — Critical', 'P2 — High', 'P3 — Medium', 'P4 — Low'].map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Assign To</label>
                                    <select className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-slate-200 focus:outline-none">
                                        <option>Unassigned</option>
                                        {['Amaka Obi', 'Chidi Nwosu', 'Tunde Adeyemi', 'Fatima Bello'].map(a => <option key={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-5">
                                <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                                <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Create Case</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}
