'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NOTIFICATIONS, TYPE_CONFIG } from '@/data/notifications';
import React from 'react';

/* ─── card data ─── */
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
    { label: 'Wazuh Manager',   status: 'Healthy' },
    { label: 'Elastic Cluster', status: 'Healthy' },
    { label: 'API Gateway',     status: 'Operational' },
    { label: 'Database',        status: 'Healthy' },
    { label: 'Collectors',      value: '12 Online' },
    { label: 'Last Sync',       value: '2 min ago' },
    { label: 'Version',         value: 'NovrSOC v1.0' },
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

/* ─── helpers ─── */
function statusColor(status: string) {
    if (['Healthy', 'Operational'].includes(status)) return 'text-emerald-600';
    if (status === 'Warning') return 'text-amber-600';
    return 'text-red-600';
}
function statusDot(status: string) {
    if (['Healthy', 'Operational'].includes(status)) return 'bg-emerald-500';
    if (status === 'Warning') return 'bg-amber-500';
    return 'bg-red-500';
}

const AccentBar = () => (
    <div className="h-[3px] bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" />
);

const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white">
        <AccentBar />
        {children}
    </div>
);

/* ─── component ─── */
export const RightRail = () => {
    const [panelOpen, setPanelOpen] = useState(false);
    const [seen,      setSeen]      = useState(false);
    const [allRead,   setAllRead]   = useState(false);

    const unreadCount = allRead ? 0 : NOTIFICATIONS.filter(n => !n.read).length;

    const openPanel = () => { setPanelOpen(true); setSeen(true); };
    const closePanel = () => setPanelOpen(false);

    return (
        <>
            <aside className="w-[305px] bg-white border-l border-gray-200 h-screen sticky top-0 flex flex-col z-30 flex-shrink-0">

                {/* Top controls — mirrors header height */}
                <div className="h-[64px] border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0">
                    {/* Cloud Engine Node */}
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">Cloud Node</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notification bell */}
                        <button
                            onClick={openPanel}
                            className="relative w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            {!seen && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            )}
                        </button>

                        {/* User avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center cursor-pointer flex-shrink-0">
                            <span className="text-[10px] font-black text-white">MA</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable cards */}
                <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">

                    {/* Account Overview */}
                    <Card>
                        <div className="p-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-xs">🏢</span>
                                <h4 className="text-[11px] font-bold text-gray-700">Account Overview</h4>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-3">Current tenant and account information.</p>
                            <div className="space-y-2">
                                {accountRows.map((row) => (
                                    <div key={row.label} className="flex items-start justify-between gap-2">
                                        <span className="text-[10px] text-gray-400 flex-shrink-0">{row.label}</span>
                                        <span className="text-[10px] font-semibold text-gray-700 text-right">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <button className="text-[10px] font-semibold text-[#2563EB] hover:underline transition-colors">
                                    Manage Account →
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* Platform Health */}
                    <Card>
                        <div className="p-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-xs">🟢</span>
                                <h4 className="text-[11px] font-bold text-gray-700">Platform Health</h4>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-3">Overall platform status.</p>
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
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <button className="text-[10px] font-semibold text-[#2563EB] hover:underline transition-colors">
                                    View System Status →
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <div className="p-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-xs">⚡</span>
                                <h4 className="text-[11px] font-bold text-gray-700">Quick Actions</h4>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-3">Frequently used administrative tasks.</p>
                            <div className="space-y-0.5">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.label}
                                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all duration-150 group text-left"
                                    >
                                        <span className="text-xs w-4 text-center flex-shrink-0 leading-none">{action.icon}</span>
                                        <span className="text-[10px] font-semibold text-gray-600 group-hover:text-[#2563EB] transition-colors">
                                            {action.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <button className="text-[10px] font-semibold text-[#2563EB] hover:underline transition-colors">
                                    View All Actions →
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </aside>

            {/* Overlay */}
            <div
                onClick={closePanel}
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Slide-in notification panel */}
            <div className={`fixed inset-y-0 right-0 w-[380px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Panel header */}
                <div className="h-[56px] border-b border-gray-200 px-5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <h2 className="font-bold text-gray-900 text-sm">Notifications</h2>
                        {unreadCount > 0 && (
                            <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {!allRead && (
                            <button
                                onClick={() => setAllRead(true)}
                                className="text-[11px] font-semibold text-[#2563EB] hover:underline transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                        <button
                            onClick={closePanel}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Notification list */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {NOTIFICATIONS.map((notif) => {
                        const cfg    = TYPE_CONFIG[notif.type];
                        const isRead = notif.read || allRead;
                        return (
                            <div
                                key={notif.id}
                                className={`border-l-[4px] ${cfg.border} ${isRead ? 'bg-white' : cfg.unreadBg} px-4 py-4 border-b border-gray-100 cursor-pointer hover:brightness-[0.97] transition-all`}
                            >
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                                        {cfg.label}
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex-shrink-0">{notif.time}</span>
                                </div>
                                <p className={`text-xs font-bold mb-1 ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                    {notif.title}
                                </p>
                                <p className="text-[11px] text-gray-500 leading-snug">{notif.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Panel footer */}
                <div className="border-t border-gray-100 px-5 py-3 flex-shrink-0">
                    <Link
                        href="/notifications"
                        onClick={closePanel}
                        className="text-[11px] font-semibold text-[#2563EB] hover:underline transition-colors"
                    >
                        View all notifications →
                    </Link>
                </div>
            </div>
        </>
    );
};
