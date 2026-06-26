export const StatusBadge = ({ value }: { value: string }) => {
    const n = value.toLowerCase();

    let ring = 'bg-gray-100 text-gray-600 border-gray-200';
    let dot  = 'bg-gray-400';

    if (['critical', 'high'].includes(n)) {
        ring = 'bg-red-50 text-red-700 border-red-200';
        dot  = 'bg-red-500';
    } else if (['medium', 'investigating', 'triaging', 'warning', 'pending'].includes(n)) {
        ring = 'bg-amber-50 text-amber-700 border-amber-200';
        dot  = 'bg-amber-500';
    } else if (['low', 'mitigated', 'isolated', 'improving', 'stable', 'healthy', 'compliant', 'resolved', 'operational', 'active'].includes(n)) {
        ring = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        dot  = 'bg-emerald-500';
    } else if (['queued', 'archived', 'online'].includes(n)) {
        ring = 'bg-blue-50 text-blue-700 border-blue-200';
        dot  = 'bg-blue-500';
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${ring}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
            {value}
        </span>
    );
};
