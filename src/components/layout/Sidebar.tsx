'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ShieldLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="shield-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1d4ed8"/>
                <stop offset="50%" stopColor="#7c3aed"/>
                <stop offset="100%" stopColor="#dc2626"/>
            </linearGradient>
        </defs>
        <path d="M16 2L4 7v8c0 7.18 5.16 13.9 12 15.5C22.84 28.9 28 22.18 28 15V7L16 2z" fill="url(#shield-grad)"/>
        <path d="M12 16l2.5 2.5L20 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const NAV = [
    {
        group: 'Dashboard', icon: '🏠', items: [
            { label: 'Overview', href: '/' },
            { label: 'Executive View', href: '/executive' },
        ],
    },
    {
        group: 'Threat Intelligence', icon: '🛰️', items: [
            { label: 'IOC Feed', href: '/threat-intelligence/cti' },
            { label: 'Threat Advisory', href: '/threat-intelligence/advisory' },
            { label: 'URL Scan', href: '/threat-intelligence/url-scan' },
            { label: 'DNS Tracker', href: '/threat-intelligence/dns' },
            { label: 'Domain Monitoring', href: '/threat-intelligence/domains' },
        ],
    },
    {
        group: 'Security Operations', icon: '⚔️', items: [
            { label: 'Incidents', href: '/security-operations/incidents' },
            { label: 'Alerts', href: '/security-operations/alerts' },
            { label: 'Cases', href: '/security-operations/cases' },
            { label: 'MITRE ATT&CK', href: '/security-operations/mitre' },
            { label: 'Threat Hunting', href: '/security-operations/hunting' },
            { label: 'Analyst Workbench', href: '/security-operations/workbench' },
        ],
    },
    {
        group: 'Assets & Risk', icon: '🗂️', items: [
            { label: 'Asset Inventory', href: '/assets' },
            { label: 'Vendor Assessment', href: '/assets/vendors' },
        ],
    },
    {
        group: 'Exposure Monitoring', icon: '🔭', items: [
            { label: 'SecuBreach', href: '/exposure/secubreach' },
            { label: 'Exposure Scores', href: '/exposure/scores' },
            { label: 'CVE Tracker', href: '/exposure/secubreach' },
        ],
    },
    {
        group: 'Compliance', icon: '📋', items: [
            { label: 'Overview', href: '/compliance' },
            { label: 'NDPA', href: '/compliance/ndpa' },
            { label: 'CBN Framework', href: '/compliance/cbn' },
            { label: 'NCC Framework', href: '/compliance/ncc' },
            { label: 'ISO 27001', href: '/compliance/iso27001' },
            { label: 'PCI-DSS', href: '/compliance/pcidss' },
        ],
    },
    {
        group: 'SOAR Automation', icon: '⚡', items: [
            { label: 'Playbooks & Automation', href: '/protection/soar' },
        ],
    },
    {
        group: 'Reporting', icon: '📊', items: [
            { label: 'Report Center', href: '/reporting' },
        ],
    },
    {
        group: 'Customers', icon: '👥', items: [
            { label: 'MSSP Portfolio', href: '/customers' },
        ],
    },
    {
        group: 'NovrAI', icon: '🤖', items: [
            { label: 'AI SOC Analyst', href: '/novr-ai' },
        ],
    },
    {
        group: 'Administration', icon: '⚙️', items: [
            { label: 'Users & Roles', href: '/admin/users' },
            { label: 'API Keys', href: '/admin/api-keys' },
            { label: 'Integrations', href: '/admin/integrations' },
            { label: 'Subscription', href: '/admin/subscription' },
            { label: 'Platform Settings', href: '/admin/settings' },
        ],
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const defaultOpen = NAV.find(g =>
        g.items.some(i => i.href !== '/' && pathname.startsWith(i.href)) ||
        (pathname === '/' && g.group === 'Dashboard')
    )?.group ?? 'Dashboard';
    const [openGroup, setOpenGroup] = useState<string | null>(defaultOpen);

    return (
        <aside className="w-[280px] bg-[#f8fafc] border-r border-slate-200 h-screen sticky top-0 flex flex-col z-30 select-none flex-shrink-0">

            {/* Brand */}
            <div className="h-[64px] border-b border-slate-200 px-4 flex items-center gap-3 flex-shrink-0">
                <ShieldLogo />
                <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                        <p className="text-sm font-black leading-none tracking-tight text-[#1d4ed8]">
                            NovrSOC
                        </p>
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#1d4ed8] text-white rounded leading-none flex-shrink-0">
                            MSSP
                        </span>
                    </div>
                    <p className="text-[10px] font-medium text-[#7c3aed] mt-0.5 leading-none">by CyberNovr</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin space-y-0.5">
                {NAV.map((navGroup) => {
                    const isOpen = openGroup === navGroup.group;
                    const isActive = navGroup.items.some(i =>
                        i.href === '/' ? pathname === '/' : pathname.startsWith(i.href)
                    );
                    return (
                        <div key={navGroup.group}>
                            <button
                                onClick={() => setOpenGroup(isOpen ? null : navGroup.group)}
                                className={`w-full px-3 py-2 flex items-center justify-between text-left rounded-lg transition-colors duration-150 ${
                                    isOpen || isActive
                                        ? 'bg-slate-100 text-slate-900'
                                        : 'text-slate-500 hover:bg-[#eff6ff] hover:text-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm leading-none">{navGroup.icon}</span>
                                    <span className="text-[11px] font-bold tracking-wide">{navGroup.group}</span>
                                </div>
                                <span className={`text-[9px] text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            {isOpen && (
                                <div className="ml-2 mt-0.5 mb-1 border-l border-slate-200 pl-3 space-y-0.5">
                                    {navGroup.items.map((item) => {
                                        const active = item.href === '/' ? pathname === '/' : pathname === item.href;
                                        return (
                                            <Link
                                                key={`${item.href}-${item.label}`}
                                                href={item.href}
                                                className={`block px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                                                    active
                                                        ? 'bg-[#1d4ed8] text-white'
                                                        : 'text-slate-500 hover:bg-[#eff6ff] hover:text-slate-700'
                                                }`}
                                            >
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-2 border-t border-slate-200 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <p className="text-[10px] font-bold text-slate-500 tracking-wide">Telemetry Online</p>
                </div>
            </div>
        </aside>
    );
};
