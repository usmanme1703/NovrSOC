'use client';

import { PageLayout } from '@/components/layout/PageLayout';

const ANNEX_DOMAINS = [
    { name: 'Organisational Controls', total: 37, compliant: 32, partial: 4, nonCompliant: 1, score: 87 },
    { name: 'People Controls',         total: 8,  compliant: 7,  partial: 1, nonCompliant: 0, score: 91 },
    { name: 'Physical Controls',       total: 14, compliant: 11, partial: 2, nonCompliant: 1, score: 80 },
    { name: 'Technological Controls',  total: 34, compliant: 27, partial: 5, nonCompliant: 2, score: 81 },
];

function scoreColor(s: number) { return s >= 85 ? 'text-emerald-600' : s >= 70 ? 'text-amber-600' : 'text-red-600'; }
function barColor(s: number)   { return s >= 85 ? 'bg-emerald-500'   : s >= 70 ? 'bg-amber-500'   : 'bg-red-500'; }

export default function ISO27001Page() {
    const overall = Math.round(ANNEX_DOMAINS.reduce((sum, d) => sum + d.score, 0) / ANNEX_DOMAINS.length);

    return (
        <PageLayout title="ISO 27001">
            <div className="space-y-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-black text-gray-900">ISO 27001:2022</h1>
                        <p className="text-xs text-gray-400">Compliance · Information Security Management System</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center min-w-[100px]">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-3 rounded-t-xl" />
                        <p className={`text-3xl font-black ${scoreColor(overall)}`}>{overall}%</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Overall Score</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['Annex A Domain', 'Controls', 'Compliant', 'Partial', 'Non-Compliant', 'Score'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ANNEX_DOMAINS.map(d => (
                                    <tr key={d.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-800">{d.name}</td>
                                        <td className="px-4 py-3 text-gray-500">{d.total}</td>
                                        <td className="px-4 py-3 text-emerald-600 font-bold">{d.compliant}</td>
                                        <td className="px-4 py-3 text-amber-600 font-bold">{d.partial}</td>
                                        <td className="px-4 py-3 text-red-600 font-bold">{d.nonCompliant}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full">
                                                    <div className={`h-1.5 rounded-full ${barColor(d.score)}`} style={{ width: `${d.score}%` }} />
                                                </div>
                                                <span className={`font-black text-sm ${scoreColor(d.score)}`}>{d.score}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Certification Details</p>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Certification Body',  value: 'BSI Group' },
                                { label: 'Certificate Number',  value: 'IS 123456' },
                                { label: 'First Certified',     value: '10 Jun 2025' },
                                { label: 'Valid Until',         value: '10 Jun 2028' },
                                { label: 'Surveillance Audit',  value: '10 Jun 2026' },
                                { label: 'Audit Result',        value: 'Passed ✅' },
                            ].map(r => (
                                <div key={r.label}>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">{r.label}</p>
                                    <p className="text-xs font-bold text-gray-800">{r.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
