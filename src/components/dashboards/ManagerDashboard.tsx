import React from 'react';
import { KpiCard } from '../shared/KpiCard';
import { ChartWrapper } from '../shared/ChartWrapper';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { globalMetrics, operationsQueueData } from '@/data/mockData';

export const ManagerDashboard = () => {
    const data = globalMetrics.socManager;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => (
                    <KpiCard key={idx} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartWrapper title="Daily Queue Intake Velocity & Ingestion Load">
                        <div className="w-full h-full flex items-end space-x-1.5 pt-4">
                            {[30, 45, 35, 70, 60, 50, 80, 95, 110, 85, 65, 40].map((val, i) => (
                                <div key={i} className="flex-1 bg-[#7C3AED] opacity-75 hover:opacity-100 rounded-t" style={{ height: `${val}%` }}></div>
                            ))}
                        </div>
                    </ChartWrapper>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase mb-4">Analyst Workload Distribution</h3>
                    <div className="space-y-4">
                        {[{ name: "Mubarak A.", count: "4 Active Cases", width: "80%", color: "bg-[#2563EB]" }, { name: "Brain O.", count: "3 Active Cases", width: "60%", color: "bg-[#7C3AED]" }].map((a, i) => (
                            <div key={i} className="text-xs">
                                <div className="flex justify-between font-medium text-gray-700 mb-1"><span>{a.name}</span><span className="text-gray-500">{a.count}</span></div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className={`h-full ${a.color}`} style={{ width: a.width }}></div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DataTable
                title="Active Operational Response Queue"
                columns={["Incident Identifier", "Assigned Specialist", "Severity Level", "Workflow Status", "SLA Clock Remaining"]}
                data={operationsQueueData}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-900">{row.incident}</td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-700">{row.analyst}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.priority} /></td>
                        <td className="px-6 py-4"><StatusBadge value={row.status} /></td>
                        <td className="px-6 py-4 font-mono text-xs text-red-600 font-bold">{row.sla}</td>
                    </tr>
                )}
            />
        </div>
    );
};