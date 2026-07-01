'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { GaugeChart } from '@/components/shared/GaugeChart';

const TRAFFIC_LIGHTS = [
    { item: 'Threat Level', status: '🟡 Elevated', color: 'text-amber-600', detail: 'Active phishing campaign targeting your sector' },
    { item: 'Compliance Status', status: '🟢 Good', color: 'text-emerald-600', detail: 'All major frameworks within acceptable range' },
    { item: 'Incident Response', status: '🟢 On Track', color: 'text-emerald-600', detail: 'All incidents within SLA' },
    { item: 'Vulnerability Exposure', status: '🟡 Attention Required', color: 'text-amber-600', detail: '12 high-priority patches pending' },
    { item: 'Data Protection', status: '🟢 Good', color: 'text-emerald-600', detail: 'NDPA compliance at 88%' },
    { item: 'Business Continuity', status: '🟢 Good', color: 'text-emerald-600', detail: 'Last DR test passed' },
];

const BIZ_UNITS = [
    { name: 'Finance', count: 3, color: '#ef4444' },
    { name: 'IT Operations', count: 2, color: '#f97316' },
    { name: 'HR', count: 1, color: '#eab308' },
    { name: 'Executive Office', count: 1, color: '#eab308' },
    { name: 'External Partners', count: 1, color: '#3b82f6' },
];

const COMPLIANCE_DEADLINES = [
    { date: '30 Jun 2026', event: 'NCC quarterly report due', urgent: true },
    { date: '15 Jul 2026', event: 'ISO 27001 surveillance audit', urgent: false },
    { date: '01 Sep 2026', event: 'CBN annual assessment', urgent: false },
    { date: '15 Sep 2026', event: 'NDPA annual review', urgent: false },
];

const RISK_TREND = [68, 71, 70, 72, 69, 73, 74, 72, 75, 74, 73, 74];

export default function ExecutivePage() {
    return (
        <PageLayout title="Executive Dashboard">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Executive Security Dashboard</h1>
                    <p className="text-xs text-gray-400">For CISO and CEO · Strategic security overview, non-technical</p>
                </div>

                {/* Security Health Score */}
                <div className="bg-white border border-emerald-300 rounded-2xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500" />
                    <div className="p-6 flex items-center gap-8">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <GaugeChart value={74} size={120} strokeWidth={12} color="#22c55e" />
                                <span className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-emerald-600">74</span>
                                    <span className="text-xs text-gray-400">/100</span>
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">Security Health Score</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-xl font-black text-gray-900">Your organization's overall security health is <span className="text-emerald-600">GOOD</span></p>
                            <p className="text-sm text-gray-500 mt-2">Score improved by <span className="text-emerald-600 font-bold">+4 points</span> since last month. Continue current security investments for sustained improvement.</p>
                            <div className="mt-3 flex gap-4">
                                {[['0–40', 'Critical Risk', '#ef4444'], ['41–70', 'Needs Attention', '#eab308'], ['71–100', 'Good Standing', '#22c55e']].map(([r, l, c]) => (
                                    <div key={r} className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                                        <span className="text-[10px] text-gray-500">{r}: {l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business impact callout */}
                <div className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-2xl p-6">
                    <p className="text-lg font-black text-gray-900">
                        This month, NovrSOC blocked <span className="text-blue-700">3,451 attacks</span> that could have caused an estimated <span className="text-emerald-600">₦2.4 billion</span> in damages to your organization.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Based on average industry incident costs for organizations of your size and sector in Nigeria.</p>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    {/* Traffic light panel */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                        <div className="p-4">
                            <p className="text-xs font-black text-gray-800 mb-3">Security Posture Overview</p>
                            <div className="space-y-2">
                                {TRAFFIC_LIGHTS.map(t => (
                                    <div key={t.item} className="flex items-start gap-3 py-2 border-b border-gray-100">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold text-gray-700">{t.item}</p>
                                            <p className="text-[10px] text-gray-400">{t.detail}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold whitespace-nowrap ${t.color}`}>{t.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Risk trend */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4">
                                <p className="text-xs font-black text-gray-800 mb-1">Security Score Trend</p>
                                <p className="text-[10px] text-gray-400 mb-3">90-day view</p>
                                <div className="flex items-end gap-1 h-20">
                                    {RISK_TREND.map((v, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center">
                                            <div className="w-full rounded-t bg-gradient-to-t from-blue-700 to-emerald-500" style={{ height: `${(v / 100) * 100}%`, opacity: 0.7 + (i / RISK_TREND.length) * 0.3 }} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                                    <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                                </div>
                            </div>
                        </div>

                        {/* Open incidents by BU */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4">
                                <p className="text-xs font-black text-gray-800 mb-3">Open Issues by Business Unit</p>
                                <div className="space-y-2">
                                    {BIZ_UNITS.map(u => {
                                        const max = BIZ_UNITS[0].count;
                                        return (
                                            <div key={u.name} className="flex items-center gap-3">
                                                <span className="text-[10px] text-gray-500 w-28 flex-shrink-0">{u.name}</span>
                                                <div className="flex-1 bg-gray-200 h-2 rounded-full">
                                                    <div className="h-full rounded-full" style={{ width: `${(u.count / max) * 100}%`, backgroundColor: u.color }} />
                                                </div>
                                                <span className="text-[11px] font-black text-gray-700 w-4">{u.count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Summary + Compliance Deadlines */}
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <p className="text-xs font-black text-gray-800">Monthly Security Summary</p>
                                <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">AI Generated</span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                                June 2026 was a moderately active threat month. Your security posture improved by <strong className="text-emerald-600">4 points</strong> compared to May. The most significant event was a contained ransomware attempt on June 14th, which was blocked within 8 minutes by our automated SOAR playbook. Two compliance gaps were identified in your CBN access control audit and are currently being remediated. <strong className="text-amber-600">No data breaches occurred.</strong> Recommend prioritizing the 12 outstanding vulnerability patches before end of July.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                        <div className="p-4">
                            <p className="text-xs font-black text-gray-800 mb-3">Upcoming Compliance Deadlines</p>
                            <div className="space-y-2">
                                {COMPLIANCE_DEADLINES.map(d => (
                                    <div key={d.event} className={`border rounded-lg px-3 py-2 ${d.urgent ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-700">{d.event}</span>
                                            <span className={`text-[10px] font-bold ${d.urgent ? 'text-red-600' : 'text-gray-400'}`}>{d.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
