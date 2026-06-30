'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SOAR_KPIS, PLAYBOOKS, EXECUTION_LOG, ACTIVE_RESPONSES } from '@/lib/mock/soar';

export default function SoarPage() {
    const [playbookStates, setPlaybookStates] = useState<boolean[]>(PLAYBOOKS.map(p => p.active));

    return (
        <PageLayout title="SOAR & Automation">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900 dark:text-slate-100">SOAR & Automation Dashboard</h1>
                    <p className="text-xs text-gray-400 dark:text-slate-400">Protection & Automation · Playbook management and execution monitoring</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-5 gap-3">
                    {[
                        { label: 'Playbooks Today', value: SOAR_KPIS.playbooksToday, color: 'text-blue-700 dark:text-blue-400' },
                        { label: 'Tickets Auto-Closed', value: SOAR_KPIS.ticketsAutoClosed, color: 'text-blue-600' },
                        { label: 'Auto-Contained', value: SOAR_KPIS.autoContained, color: 'text-emerald-600' },
                        { label: 'Mean Auto-Respond', value: SOAR_KPIS.mttaRespond, color: 'text-amber-600' },
                        { label: 'Success Rate', value: SOAR_KPIS.successRate, color: 'text-emerald-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
                        </div>
                    ))}
                </div>

                {/* Active responses */}
                <div className="bg-white dark:bg-[#1e293b] border border-amber-300 dark:border-amber-700/40 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-amber-500 to-orange-500" />
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <p className="text-xs font-black text-gray-800 dark:text-slate-100">Active Response Queue</p>
                        </div>
                        <div className="space-y-3">
                            {ACTIVE_RESPONSES.map(r => (
                                <div key={r.name}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-gray-700 dark:text-slate-200">{r.name}</span>
                                        <span className="text-gray-400 dark:text-slate-500">{r.description} — {r.pct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000" style={{ width: `${r.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Playbooks */}
                <div>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Playbook Library</p>
                    <div className="grid grid-cols-2 gap-3">
                        {PLAYBOOKS.map((p, i) => (
                            <div key={p.name} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-700/40 transition-colors">
                                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 dark:text-slate-100 text-xs">{p.name}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Trigger: {p.trigger}</p>
                                        </div>
                                        <button onClick={() => { const n = [...playbookStates]; n[i] = !n[i]; setPlaybookStates(n); }}
                                            className={`ml-3 flex-shrink-0 w-10 h-5 rounded-full transition-colors relative ${playbookStates[i] ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-slate-600'}`}>
                                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${playbookStates[i] ? 'left-5' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex gap-3 text-[10px] text-gray-400 dark:text-slate-500">
                                            <span>Last: {p.lastRun}</span>
                                            <span>{p.runsThisWeek} runs</span>
                                            <span className="text-emerald-600">{p.successRate}% success</span>
                                        </div>
                                        <button className="text-[10px] font-bold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700/40 px-2 py-0.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">▶ Run</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Execution log */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-0"><p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Execution Log</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200 dark:border-slate-700">
                                {['Playbook', 'Trigger Event', 'Asset', 'Outcome', 'Duration', 'Timestamp', 'Override'].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                )}
                            </tr></thead>
                            <tbody>
                                {EXECUTION_LOG.map((e, i) => (
                                    <tr key={i} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="px-4 py-2 font-bold text-gray-800 dark:text-slate-100 whitespace-nowrap">{e.playbook}</td>
                                        <td className="px-4 py-2 text-gray-500 dark:text-slate-400 max-w-[160px] truncate">{e.trigger}</td>
                                        <td className="px-4 py-2 font-mono text-gray-700 dark:text-slate-200">{e.asset}</td>
                                        <td className="px-4 py-2 font-bold">{e.outcome === 'Success' ? <span className="text-emerald-600">✅ Success</span> : <span className="text-red-600">❌ Failed</span>}</td>
                                        <td className="px-4 py-2 font-mono text-gray-500 dark:text-slate-400">{e.duration}</td>
                                        <td className="px-4 py-2 font-mono text-gray-400 dark:text-slate-500">{e.timestamp}</td>
                                        <td className="px-4 py-2">{e.override ? <span className="text-amber-600 text-[10px]">👤 Manual</span> : <span className="text-gray-500 dark:text-slate-500 text-[10px]">Auto</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
