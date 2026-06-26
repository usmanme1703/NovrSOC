'use client';

const statusClass = (status: string) => {
    if (status === 'Healthy' || status === 'Operational') {
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400';
    }
    if (status === 'Warning') {
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
    }
    return 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400';
};

const accountRows = [
    { label: 'Organization', value: 'CyberNovr Technologies' },
    { label: 'Subscription', value: 'Enterprise Plan' },
    { label: 'SOC Tier', value: 'Premium' },
    { label: 'Users', value: '24 Active' },
    { label: 'API Integrations', value: '8 Connected' },
    { label: 'License Status', value: 'Active' },
    { label: 'Next Renewal', value: '15 September 2026' },
];

const healthRows: { label: string; status?: string; value?: string }[] = [
    { label: 'Wazuh Manager', status: 'Healthy' },
    { label: 'Elastic Cluster', status: 'Healthy' },
    { label: 'API Gateway', status: 'Operational' },
    { label: 'Database', status: 'Healthy' },
    { label: 'Collectors', value: '12 Online' },
    { label: 'Last Synchronization', value: '2 minutes ago' },
    { label: 'Version', value: 'NovrSOC v1.0' },
];

const quickActions = [
    { icon: '＋', label: 'Add Organization' },
    { icon: '＋', label: 'Invite User' },
    { icon: '⚡', label: 'Create API Key' },
    { icon: '📊', label: 'Generate Report' },
    { icon: '📥', label: 'Export Dashboard' },
    { icon: '⚙', label: 'Platform Settings' },
    { icon: '🛡', label: 'Run Security Scan' },
];

const CardShell = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[300px]">
        <div className="h-[5px] bg-gradient-to-r from-[#2563EB] to-[#7C3AED] flex-shrink-0" />
        {children}
    </div>
);

export const InfoCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            {/* Card 1 — Account Overview */}
            <CardShell>
                <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">🏢</span>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Account Overview</h3>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Current tenant and account information.</p>
                </div>
                <div className="px-6 py-4 flex-1 overflow-y-auto space-y-2.5 min-h-0">
                    {accountRows.map((row) => (
                        <div key={row.label} className="flex items-start justify-between gap-3">
                            <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">{row.label}</span>
                            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 text-right">{row.value}</span>
                        </div>
                    ))}
                </div>
                <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <button className="text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 hover:underline transition-colors">
                        Manage Account →
                    </button>
                </div>
            </CardShell>

            {/* Card 2 — Platform Health */}
            <CardShell>
                <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">🟢</span>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Platform Health</h3>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Overall platform status.</p>
                </div>
                <div className="px-6 py-4 flex-1 overflow-y-auto space-y-2.5 min-h-0">
                    {healthRows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-3">
                            <span className="text-[11px] text-gray-500 dark:text-gray-400">{row.label}</span>
                            {row.status ? (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${statusClass(row.status)}`}>
                                    {row.status}
                                </span>
                            ) : (
                                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 text-right">{row.value}</span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <button className="text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 hover:underline transition-colors">
                        View System Status →
                    </button>
                </div>
            </CardShell>

            {/* Card 3 — Quick Actions */}
            <CardShell>
                <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">⚡</span>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Quick Actions</h3>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Frequently used administrative tasks.</p>
                </div>
                <div className="px-6 py-4 flex-1 overflow-y-auto space-y-1 min-h-0">
                    {quickActions.map((action) => (
                        <button
                            key={action.label}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-150 group text-left"
                        >
                            <span className="text-sm w-5 text-center flex-shrink-0 leading-none">{action.icon}</span>
                            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                                {action.label}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <button className="text-[11px] font-semibold text-[#2563EB] dark:text-blue-400 hover:underline transition-colors">
                        View All Actions →
                    </button>
                </div>
            </CardShell>

        </div>
    );
};
