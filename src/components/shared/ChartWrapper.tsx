import React from 'react';

interface ChartWrapperProps {
    title: string;
    height?: string;
    children: React.ReactNode;
}

export const ChartWrapper = ({ title, height = "h-64", children }: ChartWrapperProps) => {
    return (
        <div className="bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="font-bold text-gray-700 dark:text-gray-300 text-xs tracking-wide uppercase">{title}</h3>
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">Live</span>
                </div>
            </div>
            <div className={`${height} w-full p-5 relative overflow-hidden bg-white dark:bg-[#0B0F19]`}>
                {children}
            </div>
        </div>
    );
};
