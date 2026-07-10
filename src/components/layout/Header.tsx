'use client';

import { useState, useEffect } from 'react';
import { getPortalContext, type PortalContext } from '@/lib/portal-context';
import { portalSignOut } from '@/lib/portal-auth';

interface HeaderProps {
    currentDashboard: string;
}

const NOT_PORTAL: PortalContext = { isPortal: false, orgId: null, orgName: null, orgIndustry: null, wazuhGroup: null, portalRole: null };

export const Header = ({ currentDashboard }: HeaderProps) => {
    const [portal, setPortal] = useState<PortalContext>(NOT_PORTAL);

    useEffect(() => {
        setPortal(getPortalContext());
    }, []);

    return (
        <header className="h-[64px] bg-white border-b border-slate-200 sticky top-0 px-6 flex items-center justify-between z-20 shadow-sm">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
                {portal.isPortal ? (
                    <>
                        <span className="font-black text-slate-900 text-sm tracking-tight truncate">{portal.orgName}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full flex-shrink-0">Portal</span>
                    </>
                ) : (
                    <span className="font-black text-slate-900 text-sm tracking-tight">NovrSOC</span>
                )}
                <span className="text-slate-300 select-none">/</span>
                <span className="text-xs font-semibold text-slate-500 truncate">{currentDashboard}</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl ml-8 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search incidents, alerts, assets, threats…"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-8 pr-12 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
                    ⌘K
                </kbd>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <span className="text-[10px] font-bold bg-[#16a34a] text-white px-2.5 py-1 rounded-full">
                    Telemetry Online
                </span>
                {portal.isPortal ? (
                    <button onClick={portalSignOut}
                        className="text-[10px] font-bold text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors">
                        Sign Out
                    </button>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1d4ed8] to-[#7c3aed] flex items-center justify-center cursor-pointer flex-shrink-0">
                        <span className="text-[10px] font-black text-white">MA</span>
                    </div>
                )}
            </div>
        </header>
    );
};
