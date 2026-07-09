'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

interface Campaign {
    name: string;
    ioc_count: number;
    threat_type: string;
    severity: 'Critical' | 'High' | 'Medium';
}

interface ThreatActor {
    name: string;
    level?: string;
    country?: string;
    flag?: string;
    sectors?: string[];
}

interface CtipIOC {
    id: string;
    ioc_type: string;
    value: string;
    confidence: number;
    threat_type: string | null;
    country: string | null;
    first_seen: string | null;
    last_seen: string | null;
}

const SEV: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High: 'bg-orange-50 text-orange-600 border-orange-200',
    Medium: 'bg-amber-50 text-amber-600 border-amber-200',
};

function iocVerdict(confidence: number): string {
    if (confidence >= 80) return 'Malicious';
    if (confidence >= 50) return 'Suspicious';
    return 'Clean';
}
const verdictColor: Record<string, string> = { Malicious: 'text-red-600', Suspicious: 'text-amber-600', Clean: 'text-emerald-600' };
const verdictEmoji: Record<string, string> = { Malicious: '🔴', Suspicious: '🟠', Clean: '🟢' };

function formatSeen(ts: string | null): string {
    if (!ts) return '—';
    try { return new Date(ts).toLocaleString(); } catch { return ts; }
}

export default function ThreatManagementPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [actors, setActors] = useState<ThreatActor[]>([]);
    const [iocs, setIocs] = useState<CtipIOC[]>([]);
    const [loading, setLoading] = useState(true);

    const [typeFilter, setTypeFilter] = useState('All');
    const [threatFilter, setThreatFilter] = useState('All');
    const [minConfidence, setMinConfidence] = useState(0);
    const [tableSearch, setTableSearch] = useState('');

    useEffect(() => {
        Promise.all([
            fetch('/api/ctip/campaigns').then(r => r.json()).catch(() => []),
            fetch('/api/ctip/actors').then(r => r.json()).catch(() => []),
            fetch('/api/threat-intel/iocs?limit=50').then(r => r.json()).catch(() => ({ items: [] })),
        ]).then(([c, a, i]) => {
            setCampaigns(Array.isArray(c) ? c : []);
            setActors(Array.isArray(a) ? a : []);
            setIocs(Array.isArray(i?.items) ? i.items : []);
            setLoading(false);
        });
    }, []);

    const filteredIocs = iocs.filter(ioc => {
        const matchType = typeFilter === 'All' || ioc.ioc_type.toLowerCase() === typeFilter.toLowerCase();
        const t = (ioc.threat_type || '').toLowerCase();
        const matchThreat = threatFilter === 'All' ||
            (threatFilter === 'Malware' && t.includes('malware')) ||
            (threatFilter === 'Phishing' && t.includes('phish')) ||
            (threatFilter === 'C2' && (t.includes('c2') || t.includes('command'))) ||
            (threatFilter === 'Botnet' && t.includes('botnet'));
        const matchConfidence = ioc.confidence >= minConfidence;
        const q = tableSearch.toLowerCase();
        const matchSearch = !q || ioc.value.toLowerCase().includes(q);
        return matchType && matchThreat && matchConfidence && matchSearch;
    });

    return (
        <PageLayout title="Threat Management">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Threat Management</h1>
                    <p className="text-xs text-gray-400">Threat Intelligence · Active campaigns, tracked actors, and the live IOC feed</p>
                </div>

                {/* Active Campaigns */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-3 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Campaigns</p>
                        <a href="/threat-intelligence/campaigns" className="text-[10px] font-bold text-blue-700 hover:underline">View All →</a>
                    </div>
                    {loading ? (
                        <div className="p-6 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
                    ) : campaigns.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-8">No active campaigns detected</p>
                    ) : (
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-100">
                                {['Campaign', 'Threat Type', 'Severity', 'IOC Count'].map(h => <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}
                            </tr></thead>
                            <tbody>
                                {campaigns.slice(0, 5).map(c => (
                                    <tr key={c.name} className="border-b border-gray-50">
                                        <td className="px-4 py-2 font-semibold text-gray-800">{c.name}</td>
                                        <td className="px-4 py-2 text-gray-500">{c.threat_type}</td>
                                        <td className="px-4 py-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEV[c.severity]}`}>{c.severity}</span></td>
                                        <td className="px-4 py-2 font-bold text-gray-700">{c.ioc_count.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Threat Actors */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-3 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Threat Actors</p>
                        <a href="/threat-intelligence/actors" className="text-[10px] font-bold text-blue-700 hover:underline">View All →</a>
                    </div>
                    {loading ? (
                        <div className="p-6 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
                    ) : actors.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-8">Threat actor attribution builds over time as intelligence feeds accumulate data.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-3 p-4 pt-0">
                            {actors.slice(0, 3).map(a => (
                                <div key={a.name} className="border border-gray-100 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-black text-gray-900">{a.name}</p>
                                        {a.level && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${SEV[a.level] ?? ''}`}>{a.level}</span>}
                                    </div>
                                    {a.country && <p className="text-[10px] text-gray-500 mt-1">{a.flag} {a.country}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Live IOC Feed */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-3 space-y-3">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Live IOC Feed</p>
                        <div className="flex items-center gap-3 flex-wrap">
                            <input value={tableSearch} onChange={e => setTableSearch(e.target.value)} placeholder="Filter loaded results…"
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] text-gray-800 focus:outline-none w-48" />
                            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] text-gray-700 focus:outline-none">
                                {['All', 'ip', 'domain', 'url', 'hash'].map(t => <option key={t}>{t}</option>)}
                            </select>
                            <select value={threatFilter} onChange={e => setThreatFilter(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] text-gray-700 focus:outline-none">
                                {['All', 'Malware', 'Phishing', 'C2', 'Botnet'].map(t => <option key={t}>{t}</option>)}
                            </select>
                            <label className="flex items-center gap-2 text-[10px] text-gray-500">
                                Min confidence: {minConfidence}%
                                <input type="range" min={0} max={100} value={minConfidence} onChange={e => setMinConfidence(Number(e.target.value))} className="w-24" />
                            </label>
                        </div>
                    </div>
                    {loading ? (
                        <div className="p-6 space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
                    ) : filteredIocs.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-xs text-gray-400">{iocs.length === 0 ? 'Intelligence feeds are initializing…' : 'No indicators match the current filters.'}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead><tr className="border-b border-gray-200">
                                    {['Type', 'Value', 'Country', 'Confidence', 'Threat Type', 'First Seen', 'Verdict'].map(h =>
                                        <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    )}
                                </tr></thead>
                                <tbody>
                                    {filteredIocs.map(ioc => {
                                        const verdict = iocVerdict(ioc.confidence);
                                        return (
                                            <tr key={ioc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-2"><span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{ioc.ioc_type}</span></td>
                                                <td className="px-4 py-2 font-mono text-gray-700 max-w-xs truncate">{ioc.value}</td>
                                                <td className="px-4 py-2 text-gray-500">{ioc.country ?? '—'}</td>
                                                <td className="px-4 py-2 text-gray-700 font-bold">{ioc.confidence}%</td>
                                                <td className="px-4 py-2 text-gray-500">{ioc.threat_type ?? '—'}</td>
                                                <td className="px-4 py-2 text-gray-400">{formatSeen(ioc.first_seen ?? ioc.last_seen)}</td>
                                                <td className={`px-4 py-2 font-bold ${verdictColor[verdict]}`}>{verdictEmoji[verdict]} {verdict}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
