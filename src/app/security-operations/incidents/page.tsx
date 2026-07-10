'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { getPortalContext } from '@/lib/portal-context';

type CtipStats = {
    total_iocs: number;
    iocs_last_24h: number;
    active_campaigns: number;
    exploitable_cves_this_week: number;
    sources_active: number;
    last_collector_run: string | null;
};

interface RealIncident {
    id: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    name: string;
    source: string;
    asset: string;
    status: string;
    analyst: string;
    slaTime: string;
    mitre: string;
    timestamp: string | null;
    level: number;
}

interface IncidentKpis {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    investigating: number;
    escalated: number;
    avgSla: string;
}

const sevColor: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High: 'bg-orange-50 text-orange-600 border-orange-200',
    Medium: 'bg-amber-50 text-amber-600 border-amber-200',
    Low: 'bg-blue-50 text-blue-600 border-blue-200',
};
const statusColor: Record<string, string> = {
    Open: 'bg-red-50 text-red-600',
    Investigating: 'bg-orange-50 text-orange-600',
    Escalated: 'bg-violet-50 text-violet-600',
    Resolved: 'bg-emerald-50 text-emerald-600',
};

function parseSlaMinutes(sla: string): number {
    const [h, m] = sla.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

function formatDateTime(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
}

function SkeletonRow() {
    return (
        <tr className="border-b border-gray-100">
            {Array.from({ length: 8 }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: `${50 + (i % 3) * 15}%` }} />
                </td>
            ))}
        </tr>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className="text-emerald-500 mb-4">
                <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="text-sm font-bold text-gray-900 mb-1">No Active Incidents</h3>
            <p className="text-xs text-gray-400 max-w-sm mb-4">
                No security incidents detected in the last 7 days. Deploy Wazuh agents to start monitoring your endpoints.
            </p>
            <Link href="/admin/integrations"
                className="text-xs font-bold px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors">
                Deploy Agent
            </Link>
        </div>
    );
}

export default function IncidentsPage() {
    const [search, setSearch] = useState('');
    const [sevFilter, setSevFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [ctipStats, setCtipStats] = useState<CtipStats | null>(null);

    const [loading, setLoading] = useState(true);
    const [incidents, setIncidents] = useState<RealIncident[]>([]);
    const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});
    const [kpis, setKpis] = useState<IncidentKpis | null>(null);

    useEffect(() => {
        fetch('/api/threat-intel/stats')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((data: CtipStats) => setCtipStats(data))
            .catch(() => setCtipStats(null));
    }, []);

    useEffect(() => {
        const group = getPortalContext().wazuhGroup;
        fetch(`/api/wazuh/incidents${group ? `?group=${encodeURIComponent(group)}` : ''}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data?.incidents)) setIncidents(data.incidents);
                if (data?.kpis) setKpis(data.kpis);
            })
            .catch(() => setIncidents([]))
            .finally(() => setLoading(false));
    }, []);

    const displayIncidents = incidents.map(inc => ({ ...inc, status: statusOverrides[inc.id] ?? inc.status }));

    const filtered = displayIncidents.filter(i => {
        const q = search.toLowerCase();
        const matchQ = !q || i.name.toLowerCase().includes(q) || i.asset.toLowerCase().includes(q) || i.source.toLowerCase().includes(q);
        const matchSev = sevFilter === 'All' || i.severity === sevFilter;
        const matchStatus = statusFilter === 'All' || i.status === statusFilter;
        return matchQ && matchSev && matchStatus;
    });

    const kpiValues = [
        { label: 'Total Open', value: loading ? '...' : String(kpis?.total ?? 0), color: 'text-red-600' },
        { label: 'High+', value: loading ? '...' : String(kpis?.high ?? 0), color: 'text-orange-600' },
        { label: 'Medium', value: loading ? '...' : String(kpis?.medium ?? 0), color: 'text-violet-600' },
        { label: 'Low', value: loading ? '...' : String(kpis?.low ?? 0), color: 'text-blue-600' },
        { label: 'Avg SLA Remaining', value: loading ? '...' : (kpis?.avgSla ?? '00:00:00'), color: 'text-emerald-600' },
    ];

    const isEmpty = !loading && incidents.length === 0;
    const selected = displayIncidents.find(i => i.id === expanded) ?? null;

    return (
        <PageLayout title="Incident Queue">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Incident Queue</h1>
                    <p className="text-xs text-gray-400">Security Operations · Real-time incident tracking and response management</p>
                </div>

                {/* Live Threat Context widget — only rendered when CTIP responds with data */}
                {ctipStats && ctipStats.total_iocs > 0 && (
                    <div className="bg-slate-50 rounded-xl border-l-4 border-blue-700 border border-slate-200 p-4 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="font-semibold text-slate-800 text-sm">Live Threat Context</span>
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">Powered by CTIP</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { value: ctipStats.total_iocs.toLocaleString(), label: 'IOCs in Database' },
                                { value: ctipStats.iocs_last_24h.toLocaleString(), label: 'New Last 24hrs' },
                                { value: ctipStats.active_campaigns.toLocaleString(), label: 'Active Campaigns' },
                                { value: ctipStats.exploitable_cves_this_week.toLocaleString(), label: 'Exploitable CVEs' },
                            ].map(chip => (
                                <div key={chip.label} className="bg-white rounded-lg border border-slate-200 shadow-sm px-4 py-3">
                                    <p className="text-xl font-bold text-slate-900">{chip.value}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{chip.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* KPIs */}
                <div className="grid grid-cols-5 gap-3">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="h-[3px] bg-gray-100 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                                <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse mb-2" />
                                <div className="h-6 w-10 bg-gray-100 rounded animate-pulse" />
                            </div>
                        ))
                    ) : (
                        kpiValues.map(k => (
                            <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                                <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search incidents, assets, sources…"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 w-64" />
                    {[['Severity', ['All', 'Critical', 'High', 'Medium', 'Low'], sevFilter, setSevFilter],
                      ['Status', ['All', 'Open', 'Investigating', 'Escalated', 'Resolved'], statusFilter, setStatusFilter]
                    ].map(([label, opts, val, setter]) => (
                        <select key={String(label)} value={String(val)} onChange={e => (setter as (v: string) => void)(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20">
                            {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                        </select>
                    ))}
                    <span className="ml-auto text-[10px] text-gray-400">
                        {loading ? 'Loading…' : `${filtered.length} incidents · live Wazuh data`}
                    </span>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    {isEmpty ? (
                        <EmptyState />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        {['Severity', 'Incident Name', 'Source', 'Asset', 'Status', 'Analyst', 'SLA', 'MITRE Tag'].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                                    ) : (
                                        filtered.map(inc => (
                                            <tr key={inc.id} onClick={() => setExpanded(expanded === inc.id ? null : inc.id)}
                                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sevColor[inc.severity]}`}>{inc.severity}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-gray-800">{inc.name}</p>
                                                    <p className="text-[10px] text-gray-400">{inc.id}</p>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-gray-500">{inc.source}</td>
                                                <td className="px-4 py-3 font-mono text-gray-700">{inc.asset}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusColor[inc.status] ?? statusColor.Open}`}>{inc.status}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{inc.analyst}</td>
                                                <td className={`px-4 py-3 font-mono font-bold ${parseSlaMinutes(inc.slaTime) < 30 ? 'text-red-600' : 'text-gray-700'}`}>{inc.slaTime}</td>
                                                <td className="px-4 py-3 font-mono text-orange-600">{inc.mitre}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Drawer */}
                {selected && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-900">{selected.name}</h3>
                            <button onClick={() => setExpanded(null)} className="text-gray-400 hover:text-gray-700 text-xs font-bold">Close ✕</button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2 text-xs">
                                <div><span className="text-gray-400">Severity:</span> <span className={`ml-1 font-bold px-2 py-0.5 rounded border ${sevColor[selected.severity]}`}>{selected.severity}</span></div>
                                <div><span className="text-gray-400">Asset:</span> <span className="text-gray-700 font-mono">{selected.asset}</span></div>
                                <div><span className="text-gray-400">Time Detected:</span> <span className="text-gray-700 font-mono">{formatDateTime(selected.timestamp)}</span></div>
                                <div><span className="text-gray-400">MITRE Technique:</span> <span className="text-orange-600 font-mono">{selected.mitre || 'Unknown'}</span></div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</label>
                                <select
                                    value={selected.status}
                                    onChange={e => setStatusOverrides(prev => ({ ...prev, [selected.id]: e.target.value }))}
                                    className="w-full py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 px-2 focus:outline-none"
                                >
                                    {['Open', 'Investigating', 'Escalated', 'Resolved'].map(s => <option key={s}>{s}</option>)}
                                </select>
                                <button className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Assign to Me</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
