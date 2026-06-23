import React from 'react';
import { MetricItem } from '@/data/mockData';

export const KpiCard = ({ label, value, trend, type }: MetricItem) => {
    const accentBorders = {
        blue: "border-t-4 border-t-[#2563EB]",
        purple: "border-t-4 border-t-[#7C3AED]",
        orange: "border-t-4 border-t-[#F59E0B]"
    };

    return (
        <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm transition-all hover:shadow-md ${accentBorders[type] || 'border-t-gray-300'}`}>
            <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{trend}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3 tracking-tight">{value}</p>
        </div>
    );
};