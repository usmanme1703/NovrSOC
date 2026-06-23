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
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-gray-200">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                        {data.map((row, idx) => renderRow(row, idx))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}