import { MetricItem } from '@/data/mockData';
import type { LucideIcon } from 'lucide-react';

const borderAccent: Record<string, string> = {
    blue:   'border-l-[#1d4ed8]',
    purple: 'border-l-purple-500',
    orange: 'border-l-red-500',
    red:    'border-l-red-600',
};

function trendClasses(trend?: string) {
    if (!trend) return 'text-slate-400 bg-slate-100 border-slate-200';
    if (trend.startsWith('+')) return 'text-green-600 bg-green-50 border-green-200';
    if (trend.startsWith('-')) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-slate-400 bg-slate-100 border-slate-200';
}

export interface KpiCardProps extends MetricItem {
    icon?: LucideIcon;
    subValue?: string;
}

export const KpiCard = ({ label, value, trend, type, icon: Icon, subValue }: KpiCardProps) => {
    const accent = borderAccent[type] ?? borderAccent.blue;
    return (
        <div className={`bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-default border-l-4 ${accent}`}>
            <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="text-sm text-slate-500 font-medium leading-snug flex items-center gap-1.5">
                        {Icon && <Icon size={14} className="text-slate-400 flex-shrink-0" />}
                        {label}
                    </p>
                    {trend && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${trendClasses(trend)}`}>
                            {trend.startsWith('+') ? '↑ ' : trend.startsWith('-') ? '↓ ' : ''}{trend}
                        </span>
                    )}
                </div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
                {subValue && <p className="text-[10px] text-slate-400 mt-1.5">{subValue}</p>}
            </div>
        </div>
    );
};
