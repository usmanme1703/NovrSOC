'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { VENDORS, VENDOR_KPIS } from '@/lib/mock/vendors';

const STATUS_CONFIG: Record<string, string> = {
    'Low Risk': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Medium Risk': 'bg-amber-50 text-amber-600 border-amber-200',
    'High Risk': 'bg-orange-50 text-orange-600 border-orange-200',
    'Critical': 'bg-red-50 text-red-600 border-red-200',
};
const CRIT_CONFIG: Record<string, string> = {
    Low: 'text-gray-500', Medium: 'text-blue-700',
    High: 'text-orange-600', Critical: 'text-red-600',
};

export default function VendorsPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <PageLayout title="Vendor Assessment">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-black text-gray-900">Vendor Risk Assessment</h1>
                        <p className="text-xs text-gray-500">Assets & Risk · Third-party vendor security posture management</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">+ New Assessment</button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                        { label: 'Total Vendors', v: VENDOR_KPIS.total, color: 'text-gray-900' },
                        { label: 'Critical Vendors', v: VENDOR_KPIS.criticalVendors, color: 'text-red-600' },
                        { label: 'Avg Risk Score', v: VENDOR_KPIS.avgRisk, color: 'text-amber-600' },
                        { label: 'Overdue Reviews', v: VENDOR_KPIS.overdueAssessments, color: 'text-orange-600' },
                        { label: 'High Risk', v: VENDOR_KPIS.highRisk, color: 'text-orange-600' },
                        { label: 'Critical Risk', v: VENDOR_KPIS.criticalRisk, color: 'text-red-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-3">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-3 -mx-3 mb-2 rounded-t-xl" />
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{k.label}</p>
                            <p className={`text-lg font-black ${k.color}`}>{k.v}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['Vendor', 'Category', 'Risk Score', 'Criticality', 'Last Assessment', 'Issues Found', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {VENDORS.map(v => (
                                    <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-gray-800">{v.name}</td>
                                        <td className="px-4 py-3 text-gray-500">{v.category}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-100 h-1.5 rounded-full">
                                                    <div className="h-full rounded-full" style={{ width: `${v.riskScore}%`, backgroundColor: v.riskScore >= 70 ? '#dc2626' : v.riskScore >= 50 ? '#ea580c' : v.riskScore >= 40 ? '#ca8a04' : '#16a34a' }} />
                                                </div>
                                                <span className={`font-black text-[11px] ${v.riskScore >= 70 ? 'text-red-600' : v.riskScore >= 50 ? 'text-orange-600' : 'text-amber-600'}`}>{v.riskScore}</span>
                                            </div>
                                        </td>
                                        <td className={`px-4 py-3 font-bold ${CRIT_CONFIG[v.criticality]}`}>{v.criticality}</td>
                                        <td className="px-4 py-3 text-gray-500">{v.lastAssessed}</td>
                                        <td className="px-4 py-3 font-black text-center">
                                            <span className={v.issuesFound > 3 ? 'text-red-600' : v.issuesFound > 0 ? 'text-amber-600' : 'text-emerald-600'}>{v.issuesFound}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_CONFIG[v.status]}`}>{v.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button className="text-[10px] font-bold text-blue-700 hover:underline">Assess</button>
                                                <button className="text-[10px] font-bold text-gray-400 hover:text-gray-700">Details</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md shadow-2xl">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 rounded-t-2xl" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-gray-900">New Vendor Assessment</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <div className="space-y-3">
                                {['Vendor Name', 'Category', 'Contact Email'].map(f => (
                                    <div key={f}>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{f}</label>
                                        <input type="text" placeholder={`${f}…`} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                                    </div>
                                ))}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Criticality</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none">
                                        {['Low', 'Medium', 'High', 'Critical'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-5">
                                <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Start Assessment</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}
