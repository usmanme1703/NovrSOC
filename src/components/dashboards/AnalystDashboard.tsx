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
                {/* Threat Intel Feed */}
                <div className="bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 text-[11px] tracking-widest uppercase mb-4">Threat Intelligence Feed</h3>
                    <div className="flex-1 space-y-3">
                        <div className="p-3.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-full border border-red-200 dark:border-red-900/40">
                                Actor Flag
                            </span>
                            <p className="font-bold text-gray-900 dark:text-gray-200 text-xs mt-2">APT35 Mimikatz Variant</p>
                        </div>
                        <div className="p-3.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-xl">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-900/40">
                                IP Infrastructure
                            </span>
                            <p className="font-bold text-gray-900 dark:text-gray-200 text-xs mt-2">Malicious C2 Node</p>
                        </div>
                    </div>
                </div>

                {/* Correlation Chain */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 text-[11px] tracking-widest uppercase mb-4">Live Correlation Chain</h3>
                    <div className="p-4 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-800 h-56 flex flex-col justify-between font-mono text-xs">
                        <div className="p-3 bg-white dark:bg-[#0B0F19] border-l-4 border-l-red-500 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-sm">
                            <span className="text-red-600 dark:text-red-400 font-bold">[Step 1]</span>
                            <span className="text-gray-700 dark:text-gray-300 ml-1">External IP sweep hitting production gateway.</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#0B0F19] border-l-4 border-l-amber-500 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-bold">[Step 2]</span>
                            <span className="text-gray-700 dark:text-gray-300 ml-1">Failed logins logged via Wazuh server profile.</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-[#0B0F19] border-l-4 border-l-blue-500 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-sm">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">[Step 3]</span>
                            <span className="text-gray-700 dark:text-gray-300 ml-1">Endpoint isolated via local profile orchestrations.</span>
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                title="Immediate Investigation Queue"
                columns={['Alert Telemetry Target', 'Severity', 'Trigger Context', 'Timestamp', 'Remediation']}
                data={analystQueueData}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-200 text-xs">{row.alert}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.severity} /></td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{row.source}</td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-400 dark:text-gray-500">{row.time}</td>
                        <td className="px-6 py-4">
                            <button className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold transition-colors shadow-sm shadow-blue-500/20">
                                {row.action}
                            </button>
                        </td>
                    </tr>
                )}
            />
        </div>
    );
};
