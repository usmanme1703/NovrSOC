interface GaugeChartProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export const GaugeChart = ({ value, max = 100, size = 80, strokeWidth = 8, color }: GaugeChartProps) => {
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(value / max, 1);
    const dash = pct * circ;
    const gap = circ - dash;

    const resolvedColor = color ?? (pct >= 0.8 ? '#22c55e' : pct >= 0.6 ? '#eab308' : '#ef4444');

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={resolvedColor} strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
        </svg>
    );
};
