'use client';

function nextMonthFirst(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 1, 1);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PortalReportsPage() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-black text-gray-900">Reports</h1>
                <p className="text-xs text-gray-500">Monthly security summaries for your organisation</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl py-20 text-center">
                <p className="text-3xl mb-3">📊</p>
                <p className="text-sm font-bold text-gray-700">Monthly security reports will appear here.</p>
                <p className="text-xs text-gray-400 mt-1">Your next report is scheduled for {nextMonthFirst()}.</p>
            </div>
        </div>
    );
}
