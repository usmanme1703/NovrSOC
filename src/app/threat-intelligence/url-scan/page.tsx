'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

const RECENT_SCANS = [
    { url: 'http://suspicious-site.com', verdict: 'Malicious', scanned: 'Today 14:22', by: 'Amaka Obi' },
    { url: 'https://paysta-ck.com/invoice', verdict: 'Malicious', scanned: 'Today 13:55', by: 'System' },
    { url: 'https://api.paystack.com', verdict: 'Clean', scanned: 'Today 12:30', by: 'Tunde Adeyemi' },
    { url: 'http://update-ng.net/pay', verdict: 'Malicious', scanned: 'Yesterday 16:00', by: 'Chidi Nwosu' },
    { url: 'https://zenith-bank.ng', verdict: 'Clean', scanned: 'Yesterday 10:00', by: 'Fatima Bello' },
];

const MOCK_RESULT = {
    url: 'http://suspicious-site.com',
    verdict: 'Malicious',
    vt: { engines: 32, total: 90, label: '32/90 engines flagged' },
    urlhaus: 'Listed — Malware distribution',
    category: 'Phishing / Credential Harvesting',
    ip: '185.220.101.42',
    country: 'Russia (AS12389)',
    firstSeen: '14 Jun 2026',
    tags: ['phishing', 'banking', 'credential-harvesting', 'nigeria-targeted'],
};

const VERDICT_STYLE = (v: string) =>
    v === 'Malicious' ? 'bg-red-50 text-red-600 border-red-200' :
    v === 'Suspicious' ? 'bg-amber-50 text-amber-600 border-amber-200' :
    'bg-emerald-50 text-emerald-600 border-emerald-200';

export default function URLScanPage() {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);
    const [scanning, setScanning] = useState(false);

    const scan = () => {
        if (!url.trim()) return;
        setScanning(true);
        setTimeout(() => { setResult(MOCK_RESULT); setScanning(false); }, 1500);
    };

    return (
        <PageLayout title="URL Scan">
            <div className="space-y-4">
                <div>
                    <h1 className="text-lg font-black text-gray-900">URL Scan Suite</h1>
                    <p className="text-xs text-gray-500">Threat Intelligence · Multi-engine URL reputation and malware analysis</p>
                </div>

                {/* Scan bar */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-6">
                        <p className="text-xs font-black text-gray-800 mb-3">Scan a URL for Threats</p>
                        <div className="flex gap-3">
                            <input value={url} onChange={e => setUrl(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && scan()}
                                placeholder="https://suspicious-url.com/path…"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 text-gray-700 placeholder:text-gray-400" />
                            <button onClick={scan} disabled={scanning || !url.trim()}
                                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-xs font-black rounded-lg transition-colors whitespace-nowrap">
                                {scanning ? '⏳ Scanning…' : '🔍 Scan Now'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result */}
                {result && (
                    <div className="bg-white border border-red-200 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-red-600 to-red-700" />
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 mb-1 font-mono">{result.url}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🔴</span>
                                        <span className="text-lg font-black text-red-600">MALICIOUS</span>
                                    </div>
                                </div>
                                <button onClick={() => setResult(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-3">
                                    {[
                                        ['VirusTotal', result.vt.label, 'text-red-600'],
                                        ['URLHaus', result.urlhaus, 'text-red-600'],
                                        ['Category', result.category, 'text-gray-700'],
                                        ['IP Address', result.ip, 'text-gray-700 font-mono'],
                                        ['Country / ASN', result.country, 'text-gray-700'],
                                        ['First Seen', result.firstSeen, 'text-gray-700'],
                                    ].map(([k, v, cls]) => (
                                        <div key={k} className="flex justify-between gap-2 text-[10px] border-b border-gray-50 pb-1.5">
                                            <span className="text-gray-400 flex-shrink-0">{k}</span>
                                            <span className={`font-bold ${cls}`}>{v}</span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {result.tags.map(t => (
                                            <span key={t} className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded">{t}</span>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                                        <p className="text-[10px] text-gray-400">Screenshot preview</p>
                                        <p className="text-2xl mt-2">🖼️</p>
                                        <p className="text-[9px] text-gray-300 mt-1">Screenshot capture unavailable</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent scans */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 border-b border-gray-100">
                        <p className="text-xs font-black text-gray-800">Recent Scans</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['URL', 'Verdict', 'Scanned', 'Scanned By'].map(h => (
                                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {RECENT_SCANS.map((s, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-4 py-2.5 font-mono text-gray-600 text-[10px] max-w-[260px] truncate">{s.url}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${VERDICT_STYLE(s.verdict)}`}>{s.verdict}</span>
                                        </td>
                                        <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap">{s.scanned}</td>
                                        <td className="px-4 py-2.5 text-gray-500">{s.by}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
