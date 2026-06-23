import React from 'react';

export const Header = ({ currentDashboard }: { currentDashboard: string }) => {
    return (
        <header className="h-[72px] bg-white border-b border-gray-200 sticky top-0 px-8 flex items-center justify-between z-20 shadow-sm/55">
            <div className="flex items-center space-x-2 text-xs font-medium text-gray-400">
                <span className="text-gray-900 font-semibold text-sm">Enterprise Platform</span>
                <span>/</span>
                <span className="capitalize">{currentDashboard} Dashboard</span>
            </div>

            <div className="w-96 relative">
                <input
                    type="text"
                    placeholder="Search domains, incidents, assets, alerts, threats..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] focus:bg-white transition-all text-gray-800"
                />
                <div className="absolute right-3 top-2.5 text-gray-400 text-xs pointer-events-none">⌘K</div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="h-8 px-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                    🌍 Cloud Engine Node
                </div>
            </div>
        </header>
    );
};