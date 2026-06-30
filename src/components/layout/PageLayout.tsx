import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RightRail } from './RightRail';
import React from 'react';

interface PageLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const PageLayout = ({ title, children }: PageLayoutProps) => (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-gray-900 dark:text-slate-100 flex font-sans antialiased">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
            <Header currentDashboard={title} />
            <div className="p-6 flex-1 overflow-y-auto scrollbar-thin">
                {children}
            </div>
        </div>
        <RightRail />
    </div>
);
