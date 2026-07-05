'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CTI_KPIS, THREAT_FEEDS, CAMPAIGNS, THREAT_ACTORS, IOC_FEED } from '@/lib/mock/threats';

type CtipStats = {
    total_iocs: number;
    iocs_last_24h: number;
    active_campaigns: number;
    exploitable_cves_this_week: number;
    sources_active: number;
    last_collector_run: string | null;
};

type CtipIOC = {
    id: string;
    ioc_type: string;
    value: string;
    source: string;
    confidence: number;
    malware_family: string | null;
    threat_type: string | null;
    country: string | null;
    last_seen: string | null;
    mitre_techniques: string[];
    tags: string[];
};

const sevBadge: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High: 'bg-orange-50 text-orange-600 border-orange-200',
};
const verdictColor = (v: string) => v === 'Malicious' ? 'text-red-600' : v === 'Suspicious' ? 'text-amber-600' : 'text-yellow-600';

function iocVerdict(confidence: number): string {
    if (confidence >= 90) return 'Malicious';
    if (confidence >= 60) return 'Suspicious';
    return 'Low Risk';
}

function iocVerdictEmoji(confidence: number): string {
    if (confidence >= 90) return '🔴';
    if (confidence >= 60) return '🟠';
    return '🟡';
}

function formatSeen(ts: string | null): string {
    if (!ts) return '—';
    try {
        return new Date(ts).toLocaleString();
    } catch {
        return ts;
    }
}

export default function CTIPage() {
    const [iocSearch, setIocSearch] = useState('');
    const [iocResult, setIocResult] = useState(false);
    const [ctipStats, setCtipStats] = useState<CtipStats | null>(null);
    const [ctipIocs, setCtipIocs] = useState<CtipIOC[] | null>(null);

    useEffect(() => {
        fetch('/api/threat-intel/stats')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((data: CtipStats) => setCtipStats(data))
            .catch(() => setCtipStats(null));

        fetch('/api/threat-intel/iocs?limit=20')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((data: { total: number; items: CtipIOC[] }) => setCtipIocs(data.items))
            .catch(() => setCtipIocs(null));
    }, []);

    const handleIocSearch = (e: React.FormEvent) => { e.preventDefault(); if (iocSearch.trim()) setIocResult(true); };

    const kpiData = ctipStats ? [
        { label: 'IOCs Tracked', value: ctipStats.total_iocs.toLocaleString(), color: 'text-blue-700' },
        { label: 'New Today', value: ctipStats.iocs_last_24h.toLocaleString(), color: 'text-orange-600' },
        { label: 'Active Campaigns', value: ctipStats.active_campaigns.toLocaleString(), color: 'text-red-600' },
        { label: 'Active Sources', value: ctipStats.sources_active.toLocaleString(), color: 'text-violet-600' },
    ] : [
        { label: 'IOC Count', value: CTI_KPIS.iocCount, color: 'text-blue-700' },
        { label: 'Active Campaigns', value: CTI_KPIS.activeCampaigns, color: 'text-orange-600' },
        { label: 'Emerging Threats', value: CTI_KPIS.emergingThreats, color: 'text-red-600' },
        { label: 'Top Threat Actor', value: CTI_KPIS.topActor, color: 'text-violet-600' },
    ];

    const iocRows = ctipIocs
        ? ctipIocs.map(ioc => ({
              type: ioc.ioc_type,
              value: ioc.value,
              source: ioc.source,
              seen: formatSeen(ioc.last_seen),
              verdict: iocVerdict(ioc.confidence),
              confidence: ioc.confidence,
          }))
        : IOC_FEED.map(ioc => ({
              type: ioc.type,
              value: ioc.value,
              source: ioc.source,
              seen: ioc.seen,
              verdict: ioc.verdict,
              confidence: ioc.verdict === 'Malicious' ? 95 : 65,
          }));

    return (
        <PageLayout title="Threat Intelligence">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Threat Intelligence — CTI Dashboard</h1>
                    <p className="text-xs text-gray-400">Threat Intelligence · Live IOC feeds, campaigns, and threat actor tracking</p>
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
                        <form onSubmit={handleIocSearch} className="flex gap-2">
                            <input value={iocSearch} onChange={e => setIocSearch(e.target.value)}
                                placeholder="Enter IP, domain, hash, or email address…"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                            <button type="submit" className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Search</button>
                        </form>
                        {iocResult && (
                            <div className="mt-3 bg-red-50 border border-red-300 rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-gray-800">{iocSearch}</p>
                                    <span className="text-[10px] font-black bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">🔴 MALICIOUS</span>
                                </div>
                                {[['VirusTotal', '48/72 engines flagged', 'Malware distribution'], ['AbuseIPDB', 'Confidence 94% malicious', '312 reports'], ['AlienVault OTX', '3 threat pulses', 'Linked to Lazarus Group']].map(([src, det, ctx]) => (
                                    <div key={src} className="flex items-start gap-3 text-[10px]">
                                        <span className="text-blue-700 font-bold w-28 flex-shrink-0">{src}</span>
                                        <span className="text-gray-700">{det} — <span className="text-gray-400">{ctx}</span></span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Feeds */}
                <div className="grid grid-cols-4 gap-3">
                    {THREAT_FEEDS.map(f => (
                        <div key={f.name} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-3 rounded-t-xl" />
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${f.dot}`}><span className="animate-pulse" /></div>
                                <p className={`text-xs font-black ${f.color}`}>{f.name}</p>
                            </div>
                            <p className="text-[10px] text-gray-400">Last sync: {f.lastSync}</p>
                            <p className="text-[11px] font-bold text-gray-700 mt-1">{f.newItems}</p>
                        </div>
                    ))}
                </div>

                {/* Campaigns */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-0">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Active Campaigns</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200">
                                {['Campaign', 'Threat Actor', 'Sector', 'TTPs', 'First Seen', 'Last Seen', 'Severity', 'IOCs'].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                )}
                            </tr></thead>
                            <tbody>
                                {CAMPAIGNS.map(c => (
                                    <tr key={c.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{c.name}</td>
                                        <td className="px-4 py-3 text-gray-700">{c.actor}</td>
                                        <td className="px-4 py-3 text-gray-500">{c.sector}</td>
                                        <td className="px-4 py-3 font-mono text-orange-600 text-[10px]">{c.ttps}</td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.firstSeen}</td>
                                        <td className="px-4 py-3 text-gray-500">{c.lastSeen}</td>
                                        <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sevBadge[c.severity] ?? ''}`}>{c.severity}</span></td>
                                        <td className="px-4 py-3 font-bold text-gray-700">{c.iocCount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Threat Actors */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-0"><p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Top Threat Actors</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200">
                                {['Actor', 'Origin', 'Target Sectors', 'Known TTPs', 'Last Active', 'Threat Level'].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                )}
                            </tr></thead>
                            <tbody>
                                {THREAT_ACTORS.map(a => (
                                    <tr key={a.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-gray-800">{a.name}</td>
                                        <td className="px-4 py-3 text-gray-500">{a.origin}</td>
                                        <td className="px-4 py-3 text-gray-500">{a.sectors}</td>
                                        <td className="px-4 py-3 font-mono text-orange-600 text-[10px]">{a.ttps}</td>
                                        <td className="px-4 py-3 text-gray-500">{a.lastActive}</td>
                                        <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sevBadge[a.level] ?? ''}`}>{a.level}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* IOC Feed */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-0"><p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Live IOC Feed</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200">
                                {['Type', 'Value', 'Source', 'First Seen', 'Verdict'].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                )}
                            </tr></thead>
                            <tbody>
                                {iocRows.map((ioc, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-2"><span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{ioc.type}</span></td>
                                        <td className="px-4 py-2 font-mono text-gray-700">{ioc.value}</td>
                                        <td className="px-4 py-2 text-gray-500">{ioc.source}</td>
                                        <td className="px-4 py-2 text-gray-400">{ioc.seen}</td>
                                        <td className={`px-4 py-2 font-bold ${verdictColor(ioc.verdict)}`}>
                                            {iocVerdictEmoji(ioc.confidence)} {ioc.verdict}
                                        </td>
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
