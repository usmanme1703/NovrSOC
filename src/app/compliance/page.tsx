'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { GaugeChart } from '@/components/shared/GaugeChart';
import { FRAMEWORKS, CBN_CONTROLS, NDPA_ITEMS, COMPLIANCE_TIMELINE } from '@/lib/mock/compliance';

const statusBadge = (s: string) => {
    if (s === 'Compliant' || s === 'Complete') return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40';
    if (s === 'Partial') return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/40';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40';
};
const controlDot = (s: string) => s === 'Compliant' ? '🟢' : s === 'Partial' ? '🟡' : '🔴';
const urgencyColor = (u: string) =>
    u === 'urgent' ? 'border-red-300 dark:border-red-700/40 bg-red-50 dark:bg-red-900/10' :
    u === 'upcoming' ? 'border-amber-300 dark:border-amber-700/40' : 'border-gray-200 dark:border-slate-600';

export default function CompliancePage() {
    return (
        <PageLayout title="Compliance">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900 dark:text-slate-100">Compliance Dashboard</h1>
                    <p className="text-xs text-gray-400 dark:text-slate-400">Compliance · Nigerian & international regulatory framework monitoring</p>
                </div>

                {/* Framework cards */}
                <div className="grid grid-cols-4 gap-4">
                    {FRAMEWORKS.map(f => (
                        <div key={f.name} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-700/40 transition-colors">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4 flex flex-col items-center text-center">
                                <div className="relative my-2">
                                    <GaugeChart value={f.score} size={72} strokeWidth={7} />
                                    <span className="absolute inset-0 flex items-center justify-center text-base font-black text-gray-800 dark:text-slate-100">{f.score}%</span>
                                </div>
                                <p className="text-xs font-black text-gray-800 dark:text-slate-100 mt-1">{f.name}</p>
                                <span className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusBadge(f.status)}`}>{f.status}</span>
                                <div className="mt-2 w-full text-[9px] text-gray-400 dark:text-slate-500 space-y-0.5">
                                    <p>Assessed: {f.lastAssessed}</p>
                                    <p>Next: {f.nextAudit}</p>
                                </div>
                                <button className="mt-2 text-[9px] font-bold text-blue-700 dark:text-blue-400 hover:underline">View Details →</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-5">
                    {/* CBN Monitor */}
                    <div className="bg-white dark:bg-[#1e293b] border border-amber-600/30 dark:border-amber-700/30 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-amber-500 to-orange-500" />
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <p className="text-xs font-black text-gray-800 dark:text-slate-100">CBN Compliance Monitor</p>
                                <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-700/40 rounded-full">Featured</span>
                            </div>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-3">Central Bank of Nigeria Cybersecurity Framework controls</p>
                            <div className="space-y-2">
                                {CBN_CONTROLS.map(c => (
                                    <div key={c.control} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700/50">
                                        <div className="flex items-center gap-2">
                                            <span>{controlDot(c.status)}</span>
                                            <span className="text-xs text-gray-700 dark:text-slate-200">{c.control}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge(c.status)}`}>{c.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* NDPA Tracker + Timeline */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4">
                                <p className="text-xs font-black text-gray-800 dark:text-slate-100 mb-1">NDPA Compliance Tracker</p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mb-3">Nigeria Data Protection Act 2023</p>
                                <div className="space-y-2">
                                    {NDPA_ITEMS.map(item => (
                                        <div key={item.item} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-700/50">
                                            <div className="flex items-center gap-2">
                                                <span>{controlDot(item.status)}</span>
                                                <span className="text-xs text-gray-700 dark:text-slate-200">{item.item}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 dark:text-slate-500">{item.note}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4">
                                <p className="text-xs font-black text-gray-800 dark:text-slate-100 mb-3">Compliance Timeline</p>
                                <div className="space-y-2">
                                    {COMPLIANCE_TIMELINE.map(t => (
                                        <div key={t.event} className={`border rounded-lg px-3 py-2 ${urgencyColor(t.urgency)}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{t.event}</span>
                                                <span className={`text-[10px] font-bold ${t.urgency === 'urgent' ? 'text-red-600' : 'text-gray-500 dark:text-slate-400'}`}>{t.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
