import { MetricItem } from '@/data/mockData';

const accents: Record<string, { bar: string; underline: string }> = {
    blue:   { bar: 'from-[#2563EB] to-[#60A5FA]', underline: 'from-[#2563EB] to-[#60A5FA]' },
    purple: { bar: 'from-[#7C3AED] to-[#A78BFA]', underline: 'from-[#7C3AED] to-[#A78BFA]' },
    orange: { bar: 'from-[#F59E0B] to-[#FCD34D]', underline: 'from-[#F59E0B] to-[#FCD34D]' },
};

function trendClasses(trend?: string) {
    if (!trend) return 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    if (trend.startsWith('+')) return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40';
    if (trend.startsWith('-')) return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40';
    return 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
}

export const KpiCard = ({ label, value, trend, type }: MetricItem) => {
    const accent = accents[type] ?? accents.blue;
    return (
        <div className="bg-white dark:bg-[#0B0F19] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:border-gray-700 transition-all duration-200 overflow-hidden group cursor-default">
            <div className={`h-[3px] bg-gradient-to-r ${accent.bar}`} />
            <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-snug">{label}</p>
                    {trend && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${trendClasses(trend)}`}>
                            {trend}
                        </span>
                    )}
                </div>
                <p className="text-[22px] font-black text-gray-900 dark:text-white tracking-tight leading-none">{value}</p>
                <div className={`h-0.5 rounded-full mt-3 bg-gradient-to-r ${accent.underline} transition-all duration-300 w-8 group-hover:w-14 opacity-40 group-hover:opacity-90`} />
            </div>
        </div>
    );
};
