'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

const MONITORED = [
    { domain: 'cybernovr.com', status: 'Active', ssl: 'Valid', expiry: '180 days', lastChecked: '2 min ago', risk: 'Low', riskLevel: 'low' },
    { domain: 'novrsoc.com', status: 'Active', ssl: 'Valid', expiry: '90 days', lastChecked: '2 min ago', risk: 'Low', riskLevel: 'low' },
    { domain: 'cybernovr.ng', status: 'Active', ssl: 'Valid', expiry: '45 days', lastChecked: '5 min ago', risk: 'Medium', riskLevel: 'medium' },
    { domain: 'cybernovr.africa', status: 'Active', ssl: 'Valid', expiry: '220 days', lastChecked: '5 min ago', risk: 'Low', riskLevel: 'low' },
    { domain: 'novrsoc.ng', status: 'Active', ssl: 'Valid', expiry: '65 days', lastChecked: '10 min ago', risk: 'Low', riskLevel: 'low' },
];

const TYPOSQUATS = [
    { domain: 'cybern0vr.com', status: 'Active — Suspicious', registered: '15 Jun 2026', action: 'Alert sent', risk: 'Critical' },
    { domain: 'cybernovrsoc.com', status: 'Registered — Monitor', registered: '01 Jun 2026', action: 'Monitoring', risk: 'High' },
    { domain: 'cyber-novr.com', status: 'Registered — Monitor', registered: '10 May 2026', action: 'Monitoring', risk: 'Medium' },
    { domain: 'cybernovr-ng.com', status: 'Registered — Monitor', registered: '22 May 2026', action: 'Takedown requested', risk: 'High' },
];

const RISK_BADGE: Record<string, string> = {
    low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    Critical: 'text-red-600 bg-red-50 border-red-200',
    High: 'text-orange-600 bg-orange-50 border-orange-200',
    Medium: 'text-amber-600 bg-amber-50 border-amber-200',
};

export default function DomainsPage() {
    const [showAdd, setShowAdd] = useState(false);

    return (
        <PageLayout title="Domain Monitoring">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-black text-gray-900">Domain Monitoring</h1>
                        <p className="text-xs text-gray-500">Threat Intelligence · Monitor owned domains and detect typosquatting impersonators</p>
                    </div>
                    <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">+ Add Domain</button>
                </div>

                {/* Monitored domains */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 border-b border-gray-100">
                        <p className="text-xs font-black text-gray-800">Monitored Domains ({MONITORED.length})</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['Domain', 'Status', 'SSL', 'Expiry', 'Last Checked', 'Risk', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {MONITORED.map(d => (
                                    <tr key={d.domain} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-mono font-bold text-gray-800">{d.domain}</td>
                                        <td className="px-4 py-3"><span className="text-emerald-600 font-bold text-[10px]">🟢 {d.status}</span></td>
                                        <td className="px-4 py-3"><span className="text-emerald-600 text-[10px]">✅ {d.ssl}</span></td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold ${parseInt(d.expiry) < 60 ? 'text-amber-600' : 'text-gray-600'}`}>{d.expiry}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400">{d.lastChecked}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${RISK_BADGE[d.riskLevel]}`}>{d.risk}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-[10px] font-bold text-blue-700 hover:underline">Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Typosquat monitoring */}
                <div className="bg-white border border-orange-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-orange-500 to-red-600" />
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-black text-gray-800">Typosquat Detection</p>
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-full">{TYPOSQUATS.length} potential impersonators</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Domains registered that may be impersonating Cybernovr brands</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Domain', 'Status', 'Date Registered', 'Action Taken', 'Risk', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {TYPOSQUATS.map(d => (
                                    <tr key={d.domain} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-mono font-bold text-red-600">{d.domain}</td>
                                        <td className="px-4 py-3 text-orange-600 font-bold text-[10px]">{d.status}</td>
                                        <td className="px-4 py-3 text-gray-500">{d.registered}</td>
                                        <td className="px-4 py-3 text-gray-600">{d.action}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${RISK_BADGE[d.risk]}`}>{d.risk}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button className="text-[10px] font-bold text-red-600 hover:underline">Takedown</button>
                                                <button className="text-[10px] font-bold text-gray-400 hover:text-gray-700">Monitor</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showAdd && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md shadow-2xl">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 rounded-t-2xl" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-gray-900">Add Domain to Monitor</h3>
                                <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Domain</label>
                                    <input type="text" placeholder="yourdomain.com" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Monitoring Type</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none">
                                        <option>SSL + Uptime + Typosquat</option>
                                        <option>SSL + Uptime only</option>
                                        <option>Typosquat detection only</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-5">
                                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Add Domain</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}
