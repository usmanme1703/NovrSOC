'use client';

import { useTheme } from '@/components/providers/ThemeProvider';

interface HeaderProps {
    currentDashboard: string;
}

export const Header = ({ currentDashboard }: HeaderProps) => {
    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';

    return (
        <header className="h-[64px] bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-slate-700 sticky top-0 px-6 flex items-center justify-between z-20 shadow-sm">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
                <span className="font-black text-gray-900 dark:text-slate-100 text-sm tracking-tight">NovrSOC</span>
                <span className="text-gray-300 dark:text-slate-600 select-none">/</span>
                <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 truncate">{currentDashboard}</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl ml-8 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search incidents, alerts, assets, threats…"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg pl-8 pr-12 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 focus:bg-white dark:focus:bg-slate-700 transition-all text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-600 pointer-events-none">
                    ⌘K
                </kbd>
            </div>

            {/* Theme toggle */}
            <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className="ml-4 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-200 transition-colors flex-shrink-0"
            >
                {isDark ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                )}
            </button>
        </header>
    );
};
