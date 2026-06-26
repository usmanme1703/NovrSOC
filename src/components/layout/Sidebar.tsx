'use client';

import { useState } from 'react';
import Image from 'next/image';

const featureNavigation = [
    {
        group: 'Threat Intelligence',
        icon: '🛰️',
        items: ['CTI', 'Threat Advisory', 'URL Scan', 'DNS Tracker', 'Domain Monitoring'],
    },
    {
        group: 'Security Operations',
        icon: '⚔️',
        items: ['Threat Management', 'Incident Response', 'Alert Communication', 'Executive Monitoring'],
    },
    {
        group: 'Assets & Risk',
        icon: '🗂️',
        items: ['Asset Management', 'Vendor Assessment'],
    },
    {
        group: 'Exposure Monitoring',
        icon: '🔭',
        items: ['Social Monitoring', 'Website Scanning', 'Brand Monitoring'],
    },
    {
        group: 'Protection & Automation',
        icon: '⚡',
        items: ['Messaging Security', 'Mobile App Protection', 'Data Recovery', 'DMARC Enforcer', 'copyiD', 'phishiD', 'WebLogic'],
    },
];

const accountRows = [
    { label: 'Organization',     value: 'CyberNovr Technologies' },
    { label: 'Subscription',     value: 'Enterprise Plan' },
    { label: 'SOC Tier',         value: 'Premium' },
    { label: 'Users',            value: '24 Active' },
    { label: 'API Integrations', value: '8 Connected' },
    { label: 'License Status',   value: 'Active' },
    { label: 'Next Renewal',     value: '15 Sep 2026' },
];

const healthRows: { label: string; status?: string; value?: string }[] = [
    { label: 'Wazuh Manager',  status: 'Healthy' },
    { label: 'Elastic Cluster',status: 'Healthy' },
    { label: 'API Gateway',    status: 'Operational' },
    { label: 'Database',       status: 'Healthy' },
    { label: 'Collectors',     value: '12 Online' },
    { label: 'Last Sync',      value: '2 min ago' },
    { label: 'Version',        value: 'NovrSOC v1.0' },
];

const quickActions = [
    { icon: '＋', label: 'Add Organization' },
    { icon: '＋', label: 'Invite User' },
    { icon: '⚡', label: 'Create API Key' },
    { icon: '📊', label: 'Generate Report' },
    { icon: '📥', label: 'Export Dashboard' },
    { icon: '⚙',  label: 'Platform Settings' },
    { icon: '🛡',  label: 'Run Security Scan' },
];

function statusColor(status?: string) {
    if (!status) return '';
    if (['Healthy', 'Operational'].includes(status)) return 'text-emerald-600';
    if (status === 'Warning') return 'text-amber-600';
    return 'text-red-600';
}

function statusDot(status?: string) {
    if (!status) return 'bg-gray-300';
    if (['Healthy', 'Operational'].includes(status)) return 'bg-emerald-500';
    if (status === 'Warning') return 'bg-amber-500';
    return 'bg-red-500';
}

const AccentBar = () => (
    <div className="h-[3px] bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" />
);

export const Sidebar = () => {
    const [openGroup, setOpenGroup] = useState<string | null>('Threat Intelligence');

    return (
        <aside className="w-[260px] bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col z-30 select-none">

            {/* Brand */}
            <div className="h-[72px] border-b border-gray-200 px-5 flex items-center justify-between flex-shrink-0">
                <div className="relative h-7 w-28">
                    <Image src="/novrsoc.png" alt="NOVRSOC" fill priority className="object-contain object-left" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded-md border border-blue-700">
                    MSSP
                </span>
            </div>

            {/* Scrollable body: nav + info cards */}
            <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin space-y-1.5">

                {/* Feature navigation */}
                {featureNavigation.map((navGroup) => {
                    const isOpen = openGroup === navGroup.group;
                    return (
                        <div key={navGroup.group} className="rounded-xl overflow-hidden border border-gray-100">
                            <button
                                onClick={() => setOpenGroup(isOpen ? null : navGroup.group)}
                                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors duration-150 ${
                                    isOpen ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center space-x-2.5">
                                    <span className="text-sm leading-none">{navGroup.icon}</span>
                                    <span className="text-[11px] font-bold tracking-wide text-gray-700">{navGroup.group}</span>
                                </div>
                                <span className={`text-[9px] text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            {isOpen && (
                                <div className="border-t border-gray-100 bg-gray-50/60 px-2 py-1.5 space-y-0.5">
                                    {navGroup.items.map((item) => (
                                        <div
                                            key={item}
                                            className="group px-3 py-2 rounded-lg cursor-pointer hover:bg-white hover:shadow-sm transition-all duration-150 border border-transparent hover:border-gray-100"
                                        >
                                            <p className="text-[11px] font-semibold text-gray-600 group-hover:text-[#2563EB] transition-colors">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Section divider */}
                <div className="pt-3 pb-1">
                    <div className="h-px bg-gray-100" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mt-3 mb-1 px-1">Workspace</p>
                </div>

                {/* Card 1 — Account Overview */}
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <AccentBar />
                    <div className="p-3.5">
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-xs">🏢</span>
                            <h4 className="text-[11px] font-bold text-gray-700">Account Overview</h4>
                        </div>
                        <div className="space-y-2">
                            {accountRows.map((row) => (
                                <div key={row.label} className="flex items-start justify-between gap-2">
                                    <span className="text-[10px] text-gray-400 flex-shrink-0">{row.label}</span>
                                    <span className="text-[10px] font-semibold text-gray-700 text-right">{row.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-gray-100">
                            <button className="text-[10px] font-semibold text-[#2563EB] hover:underline transition-colors">
                                Manage Account →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 2 — Platform Health */}
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <AccentBar />
                    <div className="p-3.5">
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-xs">🟢</span>
                            <h4 className="text-[11px] font-bold text-gray-700">Platform Health</h4>
                        </div>
                        <div className="space-y-2">
                            {healthRows.map((row) => (
                                <div key={row.label} className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] text-gray-400">{row.label}</span>
                                    {row.status ? (
                                        <span className={`flex items-center gap-1 text-[10px] font-semibold ${statusColor(row.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(row.status)}`} />
                                            {row.status}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-semibold text-gray-700">{row.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-gray-100">
                            <button className="text-[10px] font-semibold text-[#2563EB] hover:underline transition-colors">
                                View System Status →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 3 — Quick Actions */}
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <AccentBar />
                    <div className="p-3.5">
                        <div className="flex items-center gap-1.5 mb-2.5">
                            <span className="text-xs">⚡</span>
                            <h4 className="text-[11px] font-bold text-gray-700">Quick Actions</h4>
                        </div>
                        <div className="space-y-0.5">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all duration-150 group text-left"
                                >
                                    <span className="text-xs w-4 text-center flex-shrink-0 leading-none">{action.icon}</span>
                                    <span className="text-[10px] font-semibold text-gray-600 group-hover:text-[#2563EB] transition-colors">
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-2 pt-2.5 border-t border-gray-100">
                            <button className="text-[10px] font-semibold text-[#2563EB] hover:underline transition-colors">
                                View All Actions →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom breathing room */}
                <div className="h-2" />
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center space-x-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <p className="text-[10px] font-bold text-gray-500 tracking-wide">Telemetry Feed Online</p>
                </div>
            </div>
        </aside>
    );
};
