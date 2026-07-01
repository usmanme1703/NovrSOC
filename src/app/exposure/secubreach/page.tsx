'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { GaugeChart } from '@/components/shared/GaugeChart';
import { CVES, VULN_ASSET_EXPOSURE, REMEDIATION_BOARD } from '@/lib/mock/cves';

const priorityColor: Record<string, string> = {
    P1: 'bg-red-50 text-red-600 border-red-200',
    P2: 'bg-orange-50 text-orange-600 border-orange-200',
    P3: 'bg-amber-50 text-amber-600 border-amber-200',
    P4: 'bg-blue-50 text-blue-600 border-blue-200',
};

const KANBAN_COLS = [
    { key: 'todo', label: 'To Do', color: 'border-red-300' },
    { key: 'inProgress', label: 'In Progress', color: 'border-amber-300' },
    { key: 'patched', label: 'Patched', color: 'border-emerald-300' },
    { key: 'acceptedRisk', label: 'Accepted Risk', color: 'border-gray-300' },
] as const;

const sevCardColor = (s: string) =>
    s === 'Critical' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50';

export default function SecuBreachPage() {
    const [showAll, setShowAll] = useState(false);

    return (
        <PageLayout title="SecuBreach">
            <div className="space-y-5">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black text-gray-900">SecuBreach — Vulnerability & Exposure Management</h1>
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-full">Powered by SecuBreach</span>
                        </div>
                        <p className="text-xs text-gray-400">Vulnerability Management · Risk-prioritized CVE tracking and remediation</p>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                        <div className="relative">
                            <GaugeChart value={63} size={72} strokeWidth={8} color="#f97316" />
                            <span className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-base font-black text-orange-600">63</span>
                                <span className="text-[8px] text-gray-400">/100</span>
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Exposure Score</p>
                            <p className="text-xs font-bold text-orange-600 mt-1">Elevated Risk</p>
                        </div>
                    </div>
                    {[
                        { label: 'Critical CVEs', value: 3, color: 'text-red-600' },
                        { label: 'Exploitable This Week', value: 12, color: 'text-red-600', hero: true },
                        { label: 'Remediation Rate', value: '74%', color: 'text-emerald-600' },
                    ].map(k => (
                        <div key={k.label} className={`bg-white border rounded-xl p-4 ${k.hero ? 'border-red-300' : 'border-gray-200'}`}>
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
                            {k.hero && <p className="text-[9px] text-red-600/80 mt-1">Immediate action required</p>}
                        </div>
                    ))}
                </div>

                {/* Priority banner */}
                <div className="bg-red-50 border border-red-300 rounded-xl px-5 py-3 flex items-center gap-4">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-sm font-bold text-red-600">
                        12 vulnerabilities assessed as likely to be exploited this week — prioritized for immediate action
                    </p>
                </div>

                {/* CVE Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-0 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Risk-Prioritized CVE List</p>
                        <span className="text-[10px] text-gray-400">{CVES.length} vulnerabilities shown</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200">
                                {['CVE ID', 'CVSS', 'Asset', 'Description', 'Exploit', 'Patch', 'Days', 'Priority', ''].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                )}
                            </tr></thead>
                            <tbody>
                                {CVES.slice(0, showAll ? undefined : 6).map(cve => (
                                    <tr key={cve.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-blue-700 font-bold">{cve.id}</td>
                                        <td className={`px-4 py-3 font-black ${cve.cvss >= 9 ? 'text-red-600' : 'text-orange-600'}`}>{cve.cvss}</td>
                                        <td className="px-4 py-3 font-mono text-gray-700">{cve.asset}</td>
                                        <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{cve.description}</td>
                                        <td className="px-4 py-3">{cve.exploitAvail ? '✅' : '❌'}</td>
                                        <td className="px-4 py-3">{cve.patchAvail ? '✅' : '❌'}</td>
                                        <td className={`px-4 py-3 font-bold ${cve.daysExposed > 14 ? 'text-red-600' : 'text-gray-700'}`}>{cve.daysExposed}</td>
                                        <td className="px-4 py-3"><span className={`text-[10px] font-black px-2 py-0.5 rounded border ${priorityColor[cve.priority]}`}>{cve.priority}</span></td>
                                        <td className="px-4 py-3"><button className="text-[10px] font-bold text-blue-700 hover:underline">Remediate →</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 border-t border-gray-200">
                        <button onClick={() => setShowAll(!showAll)} className="text-[10px] font-bold text-blue-700 hover:underline">
                            {showAll ? '▲ Show fewer' : `▼ Show all ${CVES.length} vulnerabilities (+112 lower priority)`}
                        </button>
                    </div>
                </div>

                {/* Asset exposure */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">Asset Exposure Map</p>
                        <div className="space-y-2">
                            {VULN_ASSET_EXPOSURE.map(a => {
                                const max = VULN_ASSET_EXPOSURE[0].count;
                                return (
                                    <div key={a.asset} className="flex items-center gap-3">
                                        <span className="font-mono text-[10px] text-gray-500 w-40 flex-shrink-0">{a.asset}</span>
                                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-blue-700 to-red-600" style={{ width: `${(a.count / max) * 100}%` }} />
                                        </div>
                                        <span className="text-[11px] font-black text-gray-700 w-8 text-right">{a.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Remediation Kanban */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">Remediation Tracker</p>
                        <div className="grid grid-cols-4 gap-3">
                            {KANBAN_COLS.map(col => (
                                <div key={col.key} className={`border ${col.color} rounded-lg p-2 space-y-2 min-h-[120px]`}>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{col.label}</p>
                                    {REMEDIATION_BOARD[col.key].map(card => (
                                        <div key={card.id} className={`border rounded-lg p-2 text-[10px] ${sevCardColor(card.severity)}`}>
                                            <p className="font-mono font-bold text-gray-800">{card.id}</p>
                                            <p className="text-gray-500 mt-0.5">{card.asset}</p>
                                            <div className="flex justify-between mt-1 text-gray-400">
                                                <span>{card.analyst}</span>
                                                <span>{card.due}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
