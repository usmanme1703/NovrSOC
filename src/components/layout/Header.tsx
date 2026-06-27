interface HeaderProps {
    currentDashboard: string;
}

export const Header = ({ currentDashboard }: HeaderProps) => {
    return (
        <header className="h-[64px] bg-white border-b border-gray-200 sticky top-0 px-6 flex items-center justify-between z-20 shadow-sm">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
                <span className="font-black text-gray-900 text-sm tracking-tight">NovrSOC</span>
                <span className="text-gray-300 select-none">/</span>
                <span className="text-xs font-semibold text-gray-500 truncate">{currentDashboard}</span>
            </div>

            {/* Search — takes up the right side now that controls moved to right rail */}
            <div className="flex-1 max-w-xl ml-8 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search incidents, alerts, assets, threats…"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-12 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all text-gray-700 placeholder:text-gray-400"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 pointer-events-none">
                    ⌘K
                </kbd>
            </div>
        </header>
    );
};
