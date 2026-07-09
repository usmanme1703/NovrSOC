'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

type CtipStats = {
    total_iocs: number;
    iocs_last_24h: number;
    active_campaigns: number;
    exploitable_cves_this_week: number;
    sources_active: number;
    last_collector_run: string | null;
};

interface FeedStatus {
    collector_name: string;
    status: string;
    records_new: number;
    records_pulled: number;
    finished_at: string | null;
}

interface SearchMatch {
    id: string;
    ioc_type: string;
    value: string;
    source: string;
    confidence: number;
    malware_family: string | null;
    threat_type: string | null;
    country: string | null;
    first_seen: string | null;
    last_seen: string | null;
    mitre_techniques: string[];
}

function iocVerdict(confidence: number): string {
    if (confidence >= 80) return 'Malicious';
    if (confidence >= 50) return 'Suspicious';
    return 'Clean';
}
const verdictEmoji: Record<string, string> = { Malicious: '🔴', Suspicious: '🟠', Clean: '🟢' };

function formatSeen(ts: string | null): string {
    if (!ts) return '—';
    try { return new Date(ts).toLocaleString(); } catch { return ts; }
}

function feedDotColor(finishedAt: string | null): string {
    if (!finishedAt) return 'bg-red-500';
    const hrs = (Date.now() - new Date(finishedAt).getTime()) / 3600000;
    if (hrs < 1) return 'bg-emerald-500';
    if (hrs < 6) return 'bg-amber-500';
    return 'bg-red-500';
}

function feedDisplayName(collectorName: string, allFeeds: FeedStatus[]): string {
    const sortedNames = [...new Set(allFeeds.map(f => f.collector_name))].sort();
    const index = sortedNames.indexOf(collectorName);
    const letter = String.fromCharCode(65 + (index >= 0 ? index : 0));
    return `Intelligence Feed ${letter}`;
}

export default function CTIPage() {
    const [ctipStats, setCtipStats] = useState<CtipStats | null>(null);
    const [feeds, setFeeds] = useState<FeedStatus[]>([]);

    const [searchValue, setSearchValue] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<{ found: boolean; matches: SearchMatch[] } | null>(null);

    useEffect(() => {
        fetch('/api/threat-intel/stats')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((data: CtipStats) => setCtipStats(data))
            .catch(() => setCtipStats(null));

        fetch('/api/ctip/feed-status')
            .then(r => r.json())
            .then(data => setFeeds(Array.isArray(data?.feeds) ? data.feeds : []))
            .catch(() => setFeeds([]));
    }, []);

    const runSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        setSearching(true);
        setSearchResult(null);
        try {
            const res = await fetch(`/api/threat-intel/iocs/${encodeURIComponent(searchValue.trim())}`);
            const data = await res.json();
            setSearchResult({ found: Boolean(data?.found), matches: Array.isArray(data?.matches) ? data.matches : [] });
        } catch {
            setSearchResult({ found: false, matches: [] });
        } finally {
            setSearching(false);
        }
    };

    const kpiData = ctipStats ? [
        { label: 'Total IOCs', value: ctipStats.total_iocs.toLocaleString(), color: 'text-blue-700' },
        { label: 'New Today', value: ctipStats.iocs_last_24h.toLocaleString(), color: 'text-orange-600' },
        { label: 'Active Campaigns', value: ctipStats.active_campaigns.toLocaleString(), color: 'text-red-600' },
        { label: 'Active Sources', value: ctipStats.sources_active.toLocaleString(), color: 'text-violet-600' },
    ] : [
        { label: 'Total IOCs', value: '...', color: 'text-blue-700' },
        { label: 'New Today', value: '...', color: 'text-orange-600' },
        { label: 'Active Campaigns', value: '...', color: 'text-red-600' },
        { label: 'Active Sources', value: '...', color: 'text-violet-600' },
    ];

    return (
        <PageLayout title="Threat Intelligence">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Threat Intelligence — CTI Dashboard</h1>
                    <p className="text-xs text-gray-400">Threat Intelligence · Indicator search and feed health, powered by CTIP</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-4 gap-3">
                    {kpiData.map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-xl font-black ${k.color} truncate`}>{k.value}</p>
                        </div>
                    ))}
                </div>

                {/* IOC Search */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">IOC Enrichment Search</p>
                        <form onSubmit={runSearch} className="flex gap-2">
                            <input value={searchValue} onChange={e => setSearchValue(e.target.value)}
                                placeholder="Search by IP, domain, URL, or hash…"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                            <button type="submit" disabled={searching} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors">
                                {searching ? 'Searching…' : 'Search'}
                            </button>
                        </form>

                        {searchResult && !searchResult.found && (
                            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-xs text-gray-600">No intelligence found for this indicator. It may be clean or not yet in our database.</p>
                            </div>
                        )}

                        {searchResult?.found && searchResult.matches.map(m => {
                            const verdict = iocVerdict(m.confidence);
                            return (
                                <div key={m.id} className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-gray-800 font-mono">{m.value}</p>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${verdict === 'Malicious' ? 'bg-red-50 text-red-600 border-red-200' : verdict === 'Suspicious' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                            {verdictEmoji[verdict]} {verdict.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-gray-600">
                                        <span>Type: <span className="font-bold text-gray-800">{m.ioc_type}</span></span>
                                        <span>Confidence: <span className="font-bold text-gray-800">{m.confidence}%</span></span>
                                        <span>Country: <span className="font-bold text-gray-800">{m.country ?? 'Unknown'}</span></span>
                                        <span>Malware Family: <span className="font-bold text-gray-800">{m.malware_family ?? 'Unknown'}</span></span>
                                        <span>First Seen: <span className="font-bold text-gray-800">{formatSeen(m.first_seen ?? m.last_seen)}</span></span>
                                        {m.mitre_techniques.length > 0 && (
                                            <span className="col-span-2">MITRE: <span className="font-bold text-gray-800">{m.mitre_techniques.join(', ')}</span></span>
                                        )}
                                    </div>
                                    <button className="text-[10px] font-bold text-blue-700 hover:underline">+ Add to Watchlist</button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Feed Status */}
                <div className="grid grid-cols-4 gap-3">
                    {feeds.length === 0 ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 h-20 animate-pulse" />
                        ))
                    ) : (
                        feeds.map(f => (
                            <div key={f.collector_name} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-3 rounded-t-xl" />
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`w-2 h-2 rounded-full ${feedDotColor(f.finished_at)}`} />
                                    <p className="text-xs font-black text-gray-800">{feedDisplayName(f.collector_name, feeds)}</p>
                                </div>
                                <p className="text-[10px] text-gray-400">Last sync: {f.finished_at ? formatSeen(f.finished_at) : 'Never'}</p>
                                <p className="text-[11px] font-bold text-gray-700 mt-1">{f.records_pulled} pulled · {f.records_new} new</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
