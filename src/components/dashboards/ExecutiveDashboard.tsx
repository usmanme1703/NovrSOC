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
                            <div className="flex justify-end gap-2 text-xs font-semibold">
                                <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-900/40">30 Days</span>
                                <span className="px-2.5 py-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">60 Days</span>
                                <span className="px-2.5 py-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">90 Days</span>
                            </div>
                            <div className="w-full h-36 flex items-end">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#2563EB" />
                                            <stop offset="100%" stopColor="#7C3AED" />
                                        </linearGradient>
                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
                                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,25 Q25,18 50,12 T100,4" fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M0,25 Q25,18 50,12 T100,4 L100,30 L0,30 Z" fill="url(#areaGrad)" />
                                </svg>
                            </div>
                        </div>
                    </ChartWrapper>
                </div>

                <div className="bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 text-[11px] tracking-widest uppercase mb-5">Business Footprint Impact Analysis</h3>
                    <div className="space-y-3 text-xs">
                        <div className="p-3.5 bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
                            <p className="font-bold text-red-900 dark:text-red-400">Revenue Stream Impact</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Isolated. 0 active disruptions detected.</p>
                        </div>
                        <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                            <p className="font-bold text-emerald-900 dark:text-emerald-400">Compliance Alignment</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Metrics healthy across all tracking frameworks.</p>
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                title="Business Functional Unit Risk Matrix"
                columns={['Organizational Unit', 'Security Risk Index', 'Active Incidents', 'Regulatory Compliance', 'Vector Trend']}
                data={executiveSummaryData}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-sm">{row.unit}</td>
                        <td className="px-6 py-4 font-mono text-sm dark:text-gray-300">{row.risk}</td>
                        <td className="px-6 py-4 text-xs font-semibold dark:text-gray-300">{row.incidents}</td>
                        <td className="px-6 py-4 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.compliance}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.trend} /></td>
                    </tr>
                )}
            />
        </div>
    );
};
