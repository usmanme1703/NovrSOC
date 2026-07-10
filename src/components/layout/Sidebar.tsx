'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPortalContext, type PortalContext } from '@/lib/portal-context';

const PORTAL_HIDDEN_GROUPS = ['Customers', 'Administration'];

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

const NOT_PORTAL: PortalContext = { isPortal: false, orgId: null, orgName: null, orgIndustry: null, wazuhGroup: null, portalRole: null };

export const Sidebar = () => {
    const pathname = usePathname();
    const [portal, setPortal] = useState<PortalContext>(NOT_PORTAL);

    useEffect(() => {
        setPortal(getPortalContext());
    }, []);

    const nav = portal.isPortal ? NAV.filter(g => !PORTAL_HIDDEN_GROUPS.includes(g.group)) : NAV;

    const defaultOpen = nav.find(g =>
        g.items.some(i => i.href !== '/' && pathname.startsWith(i.href)) ||
        (pathname === '/' && g.group === 'Dashboard')
    )?.group ?? 'Dashboard';
    const [openGroup, setOpenGroup] = useState<string | null>(defaultOpen);

    return (
        <aside className="w-[280px] bg-[#f8fafc] border-r border-slate-200 h-screen sticky top-0 flex flex-col z-30 select-none flex-shrink-0">

            {/* Brand */}
            <div className="h-[64px] border-b border-slate-200 px-4 flex items-center gap-3 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/novrsoc.png" alt="NovrSOC" width={32} height={32} className="object-contain flex-shrink-0" />
                {portal.isPortal ? (
                    <span className="text-[11px] font-black text-slate-800 truncate">{portal.orgName}</span>
                ) : (
                    <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#1d4ed8] text-white rounded leading-none flex-shrink-0">
                        MSSP
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin space-y-0.5">
                {nav.map((navGroup) => {
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
