'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CTI_KPIS, THREAT_FEEDS, CAMPAIGNS, THREAT_ACTORS, IOC_FEED } from '@/lib/mock/threats';

const sevBadge: Record<string, string> = {
    Critical: 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-700/40',
    High: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-700/40',
};
const verdictColor = (v: string) => v === 'Malicious' ? 'text-red-600' : 'text-amber-600';

export default function CTIPage() {
    const [iocSearch, setIocSearch] = useState('');
    const [iocResult, setIocResult] = useState(false);

    const handleIocSearch = (e: React.FormEvent) => { e.preventDefault(); if (iocSearch.trim()) setIocResult(true); };

    return (
        <PageLayout title="Threat Intelligence">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900 dark:text-slate-100">Threat Intelligence — CTI Dashboard</h1>
                    <p className="text-xs text-gray-400 dark:text-slate-400">Threat Intelligence · Live IOC feeds, campaigns, and threat actor tracking</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: 'IOC Count', value: CTI_KPIS.iocCount, color: 'text-blue-700 dark:text-blue-400' },
                        { label: 'Active Campaigns', value: CTI_KPIS.activeCampaigns, color: 'text-orange-600' },
                        { label: 'Emerging Threats', value: CTI_KPIS.emergingThreats, color: 'text-red-600' },
                        { label: 'Top Threat Actor', value: CTI_KPIS.topActor, color: 'text-violet-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-xl font-black ${k.color} truncate`}>{k.value}</p>
                        </div>
                    ))}
                </div>

                {/* IOC Search */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">IOC Enrichment Search</p>
                        <form onSubmit={handleIocSearch} className="flex gap-2">
                            <input value={iocSearch} onChange={e => setIocSearch(e.target.value)}
                                placeholder="Enter IP, domain, hash, or email address…"
                                className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                            <button type="submit" className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Search</button>
                        </form>
                        {iocResult && (
                            <div className="mt-3 bg-red-50 dark:bg-red-900/10 border border-red-300 dark:border-red-700/40 rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-gray-800 dark:text-slate-100">{iocSearch}</p>
                                    <span className="text-[10px] font-black bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-700/40 px-2 py-0.5 rounded-full">🔴 MALICIOUS</span>
                                </div>
                                {[['VirusTotal', '48/72 engines flagged', 'Malware distribution'], ['AbuseIPDB', 'Confidence 94% malicious', '312 reports'], ['AlienVault OTX', '3 threat pulses', 'Linked to Lazarus Group']].map(([src, det, ctx]) => (
                                    <div key={src} className="flex items-start gap-3 text-[10px]">
                                        <span className="text-blue-700 dark:text-blue-400 font-bold w-28 flex-shrink-0">{src}</span>
                                        <span className="text-gray-700 dark:text-slate-200">{det} — <span className="text-gray-400 dark:text-slate-500">{ctx}</span></span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Feeds */}
                <div className="grid grid-cols-4 gap-3">
                    {THREAT_FEEDS.map(f => (
                        <div key={f.name} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-3 rounded-t-xl" />
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${f.dot}`}><span className="animate-pulse" /></div>
                                <p className={`text-xs font-black ${f.color}`}>{f.name}</p>
                            </div>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500">Last sync: {f.lastSync}</p>
                            <p className="text-[11px] font-bold text-gray-700 dark:text-slate-200 mt-1">{f.newItems}</p>
                        </div>
                    ))}
                </div>

                {/* Campaigns */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-0">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Active Campaigns</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200 dark:border-slate-700">
                                {['Campaign', 'Threat Actor', 'Sector', 'TTPs', 'First Seen', 'Last Seen', 'Severity', 'IOCs'].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                )}
                            </tr></thead>
                            <tbody>
                                {CAMPAIGNS.map(c => (
                                    <tr key={c.name} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-800 dark:text-slate-100 whitespace-nowrap">{c.name}</td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-slate-200">{c.actor}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{c.sector}</td>
                                        <td className="px-4 py-3 font-mono text-orange-600 text-[10px]">{c.ttps}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-slate-400 whitespace-nowrap">{c.firstSeen}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{c.lastSeen}</td>
                                        <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sevBadge[c.severity] ?? ''}`}>{c.severity}</span></td>
                                        <td className="px-4 py-3 font-bold text-gray-700 dark:text-slate-200">{c.iocCount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Threat Actors */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-0"><p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Top Threat Actors</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200 dark:border-slate-700">
                                {['Actor', 'Origin', 'Target Sectors', 'Known TTPs', 'Last Active', 'Threat Level'].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                )}
                            </tr></thead>
                            <tbody>
                                {THREAT_ACTORS.map(a => (
                                    <tr key={a.name} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="px-4 py-3 font-bold text-gray-800 dark:text-slate-100">{a.name}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{a.origin}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{a.sectors}</td>
                                        <td className="px-4 py-3 font-mono text-orange-600 text-[10px]">{a.ttps}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{a.lastActive}</td>
                                        <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sevBadge[a.level] ?? ''}`}>{a.level}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* IOC Feed */}
                <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4 pb-0"><p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Live IOC Feed</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-200 dark:border-slate-700">
                                {['Type', 'Value', 'Source', 'First Seen', 'Verdict'].map(h =>
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                                )}
                            </tr></thead>
                            <tbody>
                                {IOC_FEED.map((ioc, i) => (
                                    <tr key={i} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="px-4 py-2"><span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 rounded">{ioc.type}</span></td>
                                        <td className="px-4 py-2 font-mono text-gray-700 dark:text-slate-200">{ioc.value}</td>
                                        <td className="px-4 py-2 text-gray-500 dark:text-slate-400">{ioc.source}</td>
                                        <td className="px-4 py-2 text-gray-400 dark:text-slate-500">{ioc.seen}</td>
                                        <td className={`px-4 py-2 font-bold ${verdictColor(ioc.verdict)}`}>
                                            {ioc.verdict === 'Malicious' ? '🔴' : '🟠'} {ioc.verdict}
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
