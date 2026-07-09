'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getPortalUser, isPortalAuthenticated, portalSignOut, type PortalUser } from '@/lib/portal-auth';
import { PortalSidebar } from '@/components/portal/PortalSidebar';

function PortalHeader({ user }: { user: PortalUser }) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center gap-2.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-black text-gray-900 text-sm">NovrSOC <span className="font-medium text-gray-400">Security Portal</span></span>
            </div>
            <div className="text-sm font-bold text-gray-700">{user.orgName}</div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-800">{user.name}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full uppercase tracking-wide">{user.portalRole.replace('_', ' ')}</span>
                </div>
                <button onClick={portalSignOut} className="text-xs font-bold text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                    Sign Out
                </button>
            </div>
        </header>
    );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<PortalUser | null>(null);
    const [checked, setChecked] = useState(false);
    const isLoginPage = pathname === '/portal/login';

    useEffect(() => {
        if (isLoginPage) {
            setChecked(true);
            return;
        }
        if (!isPortalAuthenticated()) {
            router.replace('/portal/login');
            return;
        }
        setUser(getPortalUser());
        setChecked(true);
    }, [isLoginPage, router]);

    if (isLoginPage) {
        return <div className="min-h-screen bg-white">{children}</div>;
    }

    if (!checked || !user) {
        return <div className="min-h-screen bg-white flex items-center justify-center text-sm text-gray-400">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PortalHeader user={user} />
            <div className="flex flex-1 min-h-0">
                <PortalSidebar portalRole={user.portalRole} />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
            </div>
        </div>
    );
}
