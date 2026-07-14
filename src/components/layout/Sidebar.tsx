'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, AlertTriangle, Monitor, Bell, Shield, Radio, Search,
    Building2, CheckSquare, Bug, Zap, FileText, Target, Users, UserCog, Settings,
    type LucideIcon,
} from 'lucide-react';
import { getPortalContext, type PortalContext } from '@/lib/portal-context';
import { portalSignOut } from '@/lib/portal-auth';
import { isAdminAuthenticated, adminSignOut } from '@/lib/admin-auth';

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

interface NavSection {
    section: string;
    items: NavItem[];
}

const ADMIN_SECTIONS: NavSection[] = [
    {
        section: 'Security Operations',
        items: [
            { label: 'Dashboard', href: '/', icon: LayoutDashboard },
            { label: 'Incidents', href: '/security-operations/incidents', icon: AlertTriangle },
            { label: 'Asset Inventory', href: '/assets', icon: Monitor },
        ],
    },
    {
        section: 'Threat Intelligence',
        items: [
            { label: 'Threat Advisory', href: '/threat-intelligence/advisory', icon: Bell },
            { label: 'Threat Management', href: '/threat-intelligence/threats', icon: Shield },
            { label: 'CTI Feed', href: '/threat-intelligence/cti', icon: Radio },
            { label: 'URL Scanner', href: '/threat-intelligence/url-scan', icon: Search },
        ],
    },
    {
        section: 'Risk & Compliance',
        items: [
            { label: 'Vendor Assessment', href: '/assets/vendors', icon: Building2 },
            { label: 'Compliance', href: '/compliance', icon: CheckSquare },
            { label: 'CVEs', href: '/exposure/cves', icon: Bug },
        ],
    },
    {
        section: 'Operations',
        items: [
            { label: 'SOAR', href: '/protection/soar', icon: Zap },
            { label: 'Reports', href: '/reporting', icon: FileText },
            { label: 'MITRE ATT&CK', href: '/security-operations/mitre', icon: Target },
        ],
    },
    {
        section: 'Administration',
        items: [
            { label: 'Customers', href: '/customers', icon: Users },
            { label: 'Users', href: '/admin/users', icon: UserCog },
            { label: 'Settings', href: '/admin/settings', icon: Settings },
        ],
    },
];

const PORTAL_SECTIONS: NavSection[] = [
    {
        section: '',
        items: [
            { label: 'Dashboard', href: '/', icon: LayoutDashboard },
            { label: 'Incidents', href: '/security-operations/incidents', icon: AlertTriangle },
            { label: 'Threat Advisory', href: '/threat-intelligence/advisory', icon: Bell },
            { label: 'Threat Management', href: '/threat-intelligence/threats', icon: Shield },
            { label: 'CTI Feed', href: '/threat-intelligence/cti', icon: Radio },
            { label: 'URL Scanner', href: '/threat-intelligence/url-scan', icon: Search },
        ],
    },
];

const NOT_PORTAL: PortalContext = { isPortal: false, orgId: null, orgName: null, orgIndustry: null, wazuhGroup: null, portalRole: null };

export const Sidebar = () => {
    const pathname = usePathname();
    const [portal, setPortal] = useState<PortalContext>(NOT_PORTAL);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setPortal(getPortalContext());
        setIsAdmin(isAdminAuthenticated());
    }, []);

    const sections = portal.isPortal ? PORTAL_SECTIONS : ADMIN_SECTIONS;
    const isActive = (href: string) => pathname === href;
    const signOut = portal.isPortal ? portalSignOut : adminSignOut;

    return (
        <aside className="w-[280px] bg-[#f8fafc] border-r border-slate-200 h-screen sticky top-0 flex flex-col z-30 select-none flex-shrink-0">

            {/* Logo */}
            <div className="h-[64px] border-b border-slate-200 px-4 flex items-center flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/novrsoc.png"
                    alt="NovrSOC"
                    className="h-8 w-auto object-contain"
                    style={{ maxWidth: '140px' }}
                />
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                {sections.map((navSection) => (
                    <div key={navSection.section || 'portal'}>
                        {navSection.section && (
                            <p className="uppercase text-xs text-slate-400 font-semibold px-3 mb-1 mt-4 first:mt-2 tracking-wide">
                                {navSection.section}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {navSection.items.map((item) => {
                                const active = isActive(item.href);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors duration-150 ${
                                            active
                                                ? 'bg-[#1d4ed8] text-white'
                                                : 'bg-transparent text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <Icon size={15} strokeWidth={2} className="flex-shrink-0" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-2 border-t border-slate-200 flex-shrink-0 space-y-2">
                {portal.isPortal && (
                    <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg">
                        <span className="block text-[11px] font-black text-slate-800 truncate">{portal.orgName}</span>
                        <span className="inline-block mt-1 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded leading-none">
                            Client Portal
                        </span>
                    </div>
                )}
                {(portal.isPortal || isAdmin) && (
                    <button
                        onClick={signOut}
                        className="w-full text-[11px] font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg px-3 py-2 transition-colors"
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </aside>
    );
};
