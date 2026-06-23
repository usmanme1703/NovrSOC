import React from 'react';
import { KpiCard } from '../shared/KpiCard';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { globalMetrics, analystQueueData } from '@/data/mockData';

export const AnalystDashboard = () => {
    const data = globalMetrics.socAnalyst;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => (
                    <KpiCard key={idx} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase mb-4">Threat Intelligence Feed</h3>
                    <div className="flex-1 space-y-3 max-h-72 text-xs">
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg"><span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded">Actor Flag</span><p className="font-semibold text-gray-900 mt-1.5">APT35 Mimikatz Variant</p></div>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg"><span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">IP Infrastructure</span><p className="font-semibold text-gray-900 mt-1.5">Malicious C2 Node</p></div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase mb-3">Live Correlation Chain</h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-64 flex flex-col justify-between text-xs font-mono">
                        <div className="p-2.5 bg-white border border-l-4 border-l-red-500 rounded shadow-sm"><span className="text-red-600 font-bold">[Step 1]</span> External IP sweep hitting production gateway.</div>
                        <div className="p-2.5 bg-white border border-l-4 border-l-amber-500 rounded shadow-sm"><span className="text-amber-600 font-bold">[Step 2]</span> Failed logins logged via Wazuh server profile.</div>
                        <div className="p-2.5 bg-white border border-l-4 border-l-blue-500 rounded shadow-sm"><span className="text-blue-600 font-bold">[Step 3]</span> Endpoint isolated via local profile orchestrations.</div>
                    </div>
                </div>
            </div>

            <DataTable
                title="Immediate Investigation Queue"
                columns={["Alert Telemetry Target", "Severity", "Trigger Context", "Timestamp", "Contextual Remediation"]}
                data={analystQueueData}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900 text-xs">{row.alert}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.severity} /></td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-600">{row.source}</td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{row.time}</td>
                        <td className="px-6 py-4">
                            <button className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-xs font-medium transition-colors">
                                {row.action}
                            </button>
                        </td>
                    </tr>
                )}
            />
        </div>
    );
};