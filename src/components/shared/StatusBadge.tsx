export const StatusBadge = ({ value }: { value: string }) => {
    const n = value.toLowerCase();

    let ring = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    let dot  = 'bg-gray-400 dark:bg-gray-500';

    if (['critical', 'high'].includes(n)) {
        ring = 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40';
        dot  = 'bg-red-500';
    } else if (['medium', 'investigating', 'triaging', 'warning', 'pending'].includes(n)) {
        ring = 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40';
        dot  = 'bg-amber-500';
    } else if (['low', 'mitigated', 'isolated', 'improving', 'stable', 'healthy', 'compliant', 'resolved', 'operational', 'active'].includes(n)) {
        ring = 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40';
        dot  = 'bg-emerald-500';
    } else if (['queued', 'archived', 'online'].includes(n)) {
        ring = 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40';
        dot  = 'bg-blue-500';
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${ring}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
            {value}
        </span>
    );
};
