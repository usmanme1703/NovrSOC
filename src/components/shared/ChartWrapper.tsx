import React from 'react';

interface ChartWrapperProps {
    title: string;
    height?: string;
    children: React.ReactNode;
}

export const ChartWrapper = ({ title, height = "h-64", children }: ChartWrapperProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">{title}</h3>
            </div>
            <div className={`${height} w-full bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center p-4 relative overflow-hidden`}>
                {children}
            </div>
        </div>
    );
};