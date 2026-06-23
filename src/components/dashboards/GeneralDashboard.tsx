import React from 'react';
import { KpiCard } from '../shared/KpiCard';
import { ChartWrapper } from '../shared/ChartWrapper';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { globalMetrics, generalActivityLog } from '@/data/mockData';

export const GeneralDashboard = () => {
    const data = globalMetrics.general;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => (
                    <KpiCard key={idx} {...kpi} />
                ))}
            </div>

            <ChartWrapper title="Security Posture & Incident Activity Trends (Last 30 Days)">
                <div className="w-full h-full flex items-end space-x-3 pt-6">
                    {[40, 55, 30, 85, 42, 60, 70, 95, 45, 60, 80, 100].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div style={{ height: `${val}%` }} className="w-full bg-gradient-to-t from-[#2563EB] to-[#7C3AED] rounded-t opacity-80 group-hover:opacity-100 transition-all"></div>
                            <span className="text-[10px] text-gray-400 mt-2">W{i + 1}</span>
                        </div>
                    ))}
                </div>
            </ChartWrapper>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-4">Threat Vectors Distribution</h4>
                    <div className="space-y-3">
                        {[{ name: "Malware Activity", pct: "42%", color: "bg-[#2563EB]" }, { name: "Phishing Infrastructure", pct: "28%", color: "bg-[#7C3AED]" }, { name: "Ransomware Probing", pct: "18%", color: "bg-[#F59E0B]" }].map((t, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1"><span>{t.name}</span><span>{t.pct}</span></div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className={`${t.color} h-full`} style={{ width: t.pct }}></div></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-4">Monitored Assets Proportions</h4>
                    <div className="space-y-3">
                        {[{ name: "Cloud Production Assets", pct: "50%", color: "bg-[#7C3AED]" }, { name: "Enterprise Workstations", pct: "25%", color: "bg-[#2563EB]" }, { name: "On-Prem Infrastructure", pct: "15%", color: "bg-[#F59E0B]" }].map((a, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-medium text-gray-700 mb-1"><span>{a.name}</span><span>{a.pct}</span></div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className={`${a.color} h-full`} style={{ width: a.pct }}></div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DataTable
                title="Real-Time Global Activity Feed"
                columns={["Time", "Telemetry Event Details", "Severity", "Ingestion Source", "Status"]}
                data={generalActivityLog}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{row.time}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{row.event}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.severity} /></td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-600">{row.source}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.status} /></td>
                    </tr>
                )}
            />
        </div>
    );
};