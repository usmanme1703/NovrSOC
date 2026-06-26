import React from 'react';

interface DataTableProps<T> {
    title: string;
    columns: string[];
    data: T[];
    renderRow: (row: T, idx: number) => React.ReactNode;
}

export function DataTable<T>({ title, columns, data, renderRow }: DataTableProps<T>) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{data.length} entries</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                    Real-time
                </span>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-200">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {data.map((row, idx) => renderRow(row, idx))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
