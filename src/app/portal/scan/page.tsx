'use client';

import { useEffect, useState } from 'react';
import { getPortalToken } from '@/lib/portal-auth';

interface ScanResult {
    value: string;
    verdict: 'Malicious' | 'Suspicious' | 'Clean' | 'Unknown';
    confidence: number;
    country: string | null;
    malware_family: string | null;
}

interface ScanHistoryItem {
    id: number;
    value: string;
    verdict: string | null;
    created_at: string;
}

const VERDICT_STYLE: Record<string, string> = {
    Malicious: 'bg-red-50 text-red-600 border-red-200',
    Suspicious: 'bg-amber-50 text-amber-600 border-amber-200',
    Clean: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Unknown: 'bg-gray-50 text-gray-500 border-gray-200',
};
const VERDICT_EMOJI: Record<string, string> = { Malicious: '🔴', Suspicious: '🟠', Clean: '🟢', Unknown: '⚪' };

export default function PortalScanPage() {
    const [value, setValue] = useState('');
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [history, setHistory] = useState<ScanHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const loadHistory = () => {
        const token = getPortalToken();
        fetch('/api/portal/scan/history', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
            .then((r) => r.json())
            .then((d) => setHistory(Array.isArray(d?.scans) ? d.scans : []))
            .catch(() => setHistory([]))
            .finally(() => setLoadingHistory(false));
    };

    useEffect(loadHistory, []);

    const scan = async () => {
        if (!value.trim()) return;
        setScanning(true);
        setResult(null);
        try {
            const token = getPortalToken();
            const res = await fetch('/api/portal/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ value: value.trim(), type: 'auto' }),
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
                loadHistory();
            }
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-black text-gray-900">URL Scanner</h1>
                <p className="text-xs text-gray-500">Check if a link, IP, or file is safe before you open it</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex gap-3">
                    <input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && scan()}
                        placeholder="Paste a URL, IP address, or link here…"
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700" />
                    <button onClick={scan} disabled={scanning || !value.trim()}
                        className="px-6 py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap">
                        {scanning ? 'Checking…' : 'Check Now'}
                    </button>
                </div>

                {result && (
                    <div className={`mt-5 rounded-lg border p-4 ${VERDICT_STYLE[result.verdict]}`}>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{VERDICT_EMOJI[result.verdict]}</span>
                            <div>
                                <p className="text-base font-black">{result.verdict === 'Clean' ? 'This looks safe' : result.verdict === 'Malicious' ? 'This is dangerous' : result.verdict === 'Suspicious' ? 'This looks suspicious' : 'Unable to determine'}</p>
                                <p className="text-[11px] opacity-80">{result.confidence}% confidence{result.country ? ` · ${result.country}` : ''}{result.malware_family ? ` · ${result.malware_family}` : ''}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100"><p className="text-xs font-black text-gray-800">Recent Checks</p></div>
                {loadingHistory ? (
                    <div className="p-6 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />)}</div>
                ) : history.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-10">No recent scans. Enter a URL or IP above to begin.</p>
                ) : (
                    <table className="w-full text-xs">
                        <tbody>
                            {history.map((h) => (
                                <tr key={h.id} className="border-b border-gray-50">
                                    <td className="px-4 py-2.5 font-mono text-gray-600 max-w-xs truncate">{h.value}</td>
                                    <td className="px-4 py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${VERDICT_STYLE[h.verdict ?? 'Unknown']}`}>{h.verdict ?? 'Unknown'}</span></td>
                                    <td className="px-4 py-2.5 text-gray-400 text-right">{new Date(h.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
