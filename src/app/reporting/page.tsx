'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { REPORT_TEMPLATES, SCHEDULED_REPORTS, REPORT_HISTORY } from '@/lib/mock/reports';

export default function ReportingPage() {
    const [generating, setGenerating] = useState<string | null>(null);

    const handleGenerate = (name: string) => {
        setGenerating(name);
        setTimeout(() => setGenerating(null), 2000);
    };

    return (
        <PageLayout title="Reporting Center">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Report Center</h1>
                    <p className="text-xs text-gray-400">Reporting · Generate, schedule, and download security reports</p>
                </div>

                {/* Templates */}
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Report Templates</p>
                    <div className="grid grid-cols-3 gap-4">
                        {REPORT_TEMPLATES.map(t => (
                            <div key={t.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-colors">
                                <div className="h-[3px] bg-gradient-to-r from-indigo-600 to-violet-600" />
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="font-bold text-gray-800 text-xs leading-tight flex-1">{t.name}</p>
                                        <span className="text-[9px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded ml-2 flex-shrink-0">{t.format}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mb-3">{t.description}</p>
                                    <div className="text-[10px] text-gray-500 mb-3">
                                        <p>Last generated: {t.lastGenerated}</p>
                                        <p>Est. time: {t.estimatedTime}</p>
                                    </div>
                                    <button onClick={() => handleGenerate(t.name)} disabled={generating === t.name}
                                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[10px] font-bold rounded-lg transition-colors">
                                        {generating === t.name ? '⏳ Generating…' : '⬇ Generate Report'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scheduled */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-indigo-600 to-violet-600" />
                    <div className="p-4 pb-0"><p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Scheduled Reports</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200">
                                {['Report Name', 'Frequency', 'Recipients', 'Format', 'Next Run', 'Status'].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                )}
                                <th className="px-4 py-2" />
                            </tr></thead>
                            <tbody>
                                {SCHEDULED_REPORTS.map(r => (
                                    <tr key={r.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-800">{r.name}</td>
                                        <td className="px-4 py-3 text-gray-500">{r.frequency}</td>
                                        <td className="px-4 py-3 font-mono text-gray-500 text-[10px]">{r.recipients}</td>
                                        <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-500 rounded">{r.format}</span></td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.nextRun}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold ${r.active ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                {r.active ? '✅ Active' : '⏸ Paused'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3"><button className="text-[10px] font-bold text-gray-400 hover:text-gray-700">Edit</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* History */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-indigo-600 to-violet-600" />
                    <div className="p-4 pb-0"><p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Report History</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200">
                                {['Report Name', 'Generated', 'Generated By', 'Size', 'Format', 'Download'].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                )}
                            </tr></thead>
                            <tbody>
                                {REPORT_HISTORY.map(r => (
                                    <tr key={r.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{r.name}</td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.generated}</td>
                                        <td className="px-4 py-3 text-gray-500">{r.by}</td>
                                        <td className="px-4 py-3 text-gray-500">{r.size}</td>
                                        <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-500 rounded">{r.format}</span></td>
                                        <td className="px-4 py-3">
                                            <button className="text-indigo-600 hover:text-indigo-300 transition-colors">⬇</button>
                                        </td>
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
