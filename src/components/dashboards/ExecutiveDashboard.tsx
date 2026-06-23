import React from 'react';
import { KpiCard } from '../shared/KpiCard';
import { ChartWrapper } from '../shared/ChartWrapper';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { globalMetrics, executiveSummaryData } from '@/data/mockData';

export const ExecutiveDashboard = () => {
    const data = globalMetrics.executive;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => (
                    <KpiCard key={idx} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartWrapper title="Enterprise Risk Reduction Journey (90 Days Tracking)">
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div className="flex justify-end space-x-2 text-xs font-medium">
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">30 Days</span>
                                <span className="px-2 py-1 text-gray-400">60 Days</span>
                                <span className="px-2 py-1 text-gray-400">90 Days</span>
                            </div>
                            <div className="w-full h-32 flex items-end">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                                    <path d="M0,25 Q25,18 50,12 T100,4" fill="none" stroke="#2563EB" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </ChartWrapper>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase mb-4">Business Footprint Impact Analysis</h3>
                    <div className="space-y-4 text-xs">
                        <div className="p-3 bg-red-50/60 border border-red-100 rounded-lg"><p className="font-semibold text-red-900">Revenue Stream Impact</p><p className="text-gray-600 mt-0.5">Isolated. 0 active disruptions detected.</p></div>
                        <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg"><p className="font-semibold text-emerald-900">Compliance Alignment</p><p className="text-gray-600 mt-0.5">Metrics healthy across all tracking frameworks.</p></div>
                    </div>
                </div>
            </div>

            <DataTable
                title="Business Functional Unit Risk Matrix"
                columns={["Organizational Unit", "Security Risk Index", "Active Incidents Tracked", "Regulatory Compliance status", "Vector Trend"]}
                data={executiveSummaryData}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{row.unit}</td>
                        <td className="px-6 py-4 font-mono">{row.risk}</td>
                        <td className="px-6 py-4 text-xs font-semibold">{row.incidents}</td>
                        <td className="px-6 py-4 text-xs font-mono font-bold text-emerald-600">{row.compliance}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.trend} /></td>
                    </tr>
                )}
            />
        </div>
    );
};