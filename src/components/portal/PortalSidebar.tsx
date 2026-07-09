'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { portalSignOut } from '@/lib/portal-auth';

const NAV_ITEMS = [
    { icon: '🏠', label: 'Dashboard', href: '/portal/dashboard' },
    { icon: '🚨', label: 'Incidents', href: '/portal/incidents' },
    { icon: '💻', label: 'Assets', href: '/portal/assets' },
    { icon: '📋', label: 'Advisories', href: '/portal/advisories' },
    { icon: '🔍', label: 'URL Scanner', href: '/portal/scan' },
    { icon: '📊', label: 'Reports', href: '/portal/reports' },
    { icon: '👥', label: 'Team', href: '/portal/team', orgAdminOnly: true },
];

export function PortalSidebar({ portalRole }: { portalRole: string }) {
    const pathname = usePathname();
    const items = NAV_ITEMS.filter((item) => !item.orgAdminOnly || portalRole === 'org_admin');

    return (
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
            <nav className="flex-1 p-3 space-y-1">
                {items.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                                active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                            }`}>
                            <span className="text-sm">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-3 border-t border-gray-100">
                <button onClick={portalSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <span className="text-sm">🚪</span> Sign Out
                </button>
            </div>
        </aside>
    );
}
