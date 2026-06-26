import React from 'react';

interface DataTableProps<T> {
    title: string;
    columns: string[];
    data: T[];
    renderRow: (row: T, idx: number) => React.ReactNode;
}

export function DataTable<T>({ title, columns, data, renderRow }: DataTableProps<T>) {
    return (
        <div className="bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{title}</h3>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{data.length} entries</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/80 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                    Real-time
                </span>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/80 dark:bg-[#111827]/60 border-b border-gray-200 dark:border-gray-800">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60 text-sm">
                        {data.map((row, idx) => renderRow(row, idx))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
