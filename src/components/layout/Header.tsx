interface HeaderProps {
    currentDashboard: string;
}

export const Header = ({ currentDashboard }: HeaderProps) => {
    return (
        <header className="h-[64px] bg-white border-b border-gray-200 sticky top-0 px-6 flex items-center justify-between z-20 shadow-sm">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
                <span className="font-black text-gray-900 text-sm tracking-tight">NovrSOC</span>
                <span className="text-gray-300 select-none">/</span>
                <span className="text-xs font-semibold text-gray-500 truncate">{currentDashboard}</span>
            </div>

            {/* Search */}
            <div className="w-72 xl:w-96 relative hidden md:block">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search incidents, alerts, assets…"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-12 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all text-gray-700 placeholder:text-gray-400"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 pointer-events-none">
                    ⌘K
                </kbd>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
                {/* Live node badge */}
                <div className="hidden lg:flex items-center gap-2 h-8 px-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-bold text-gray-600">Cloud Engine Node</span>
                </div>

                {/* Notifications */}
                <button className="relative w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                {/* User avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center cursor-pointer flex-shrink-0">
                    <span className="text-[10px] font-black text-white">MA</span>
                </div>
            </div>
        </header>
    );
};
