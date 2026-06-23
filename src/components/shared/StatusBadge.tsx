import React from 'react';

export const StatusBadge = ({ value }: { value: string }) => {
    const normalized = value.toLowerCase();
    let styles = "bg-gray-100 text-gray-800 border-gray-200";

    if (["critical", "high", "mitigated", "isolated", "improving"].includes(normalized)) {
        styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if (["medium", "investigating", "triaging", "stable"].includes(normalized)) {
        styles = "bg-amber-50 text-amber-700 border-amber-200";
    } else if (["low", "queued", "archived"].includes(normalized)) {
        styles = "bg-blue-50 text-blue-700 border-blue-200";
    }

    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide inline-block border ${styles}`}>
            {value}
        </span>
    );
};