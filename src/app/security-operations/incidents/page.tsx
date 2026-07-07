'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { INCIDENTS, INCIDENT_KPIS, type Incident } from '@/lib/mock/incidents';

type CtipStats = {
    total_iocs: number;
    iocs_last_24h: number;
    active_campaigns: number;
    exploitable_cves_this_week: number;
    sources_active: number;
    last_collector_run: string | null;
};

type DisplayIncident = Incident & { level?: number; rawTimestamp?: string };

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
    Contained: 'bg-blue-50 text-blue-600',
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

function normalizeReal(r: RealIncident): DisplayIncident {
    const dateTime = formatDateTime(r.timestamp);
    return {
        id: r.id,
        severity: r.severity,
        name: r.name,
        source: r.source,
        asset: r.asset,
        status: 'Open',
        analyst: r.analyst,
        sla: r.slaTime,
        slaMinutes: parseSlaMinutes(r.slaTime),
        mitre: r.mitre,
        description: r.name,
        affectedAssets: [r.asset],
        timeline: [{ time: dateTime, event: r.name, source: r.source }],
        suggestedActions: [
            'Review alert details and correlate with related events',
            'Verify source IP / agent activity for anomalies',
            'Escalate if part of a broader attack pattern',
            'Document findings and close if determined benign',
        ],
        created: dateTime,
        level: r.level,
        rawTimestamp: r.timestamp ?? undefined,
    };
}

function SkeletonRow() {
    return (
        <tr className="border-b border-gray-100">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: `${50 + (i % 3) * 15}%` }} />
                </td>
            ))}
        </tr>
    );
}

export default function IncidentsPage() {
    const [search, setSearch] = useState('');
    const [sevFilter, setSevFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [ctipStats, setCtipStats] = useState<CtipStats | null>(null);

    const [loading, setLoading] = useState(true);
    const [realIncidents, setRealIncidents] = useState<RealIncident[]>([]);
    const [kpis, setKpis] = useState<IncidentKpis | null>(null);

    useEffect(() => {
        fetch('/api/threat-intel/stats')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((data: CtipStats) => setCtipStats(data))
            .catch(() => setCtipStats(null));
    }, []);

    useEffect(() => {
        fetch('/api/wazuh/incidents', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data?.incidents) && data.incidents.length > 0) {
                    setRealIncidents(data.incidents);
                }
                if (data?.kpis) setKpis(data.kpis);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const usingReal = realIncidents.length > 0;
    const sourceIncidents: DisplayIncident[] = usingReal ? realIncidents.map(normalizeReal) : INCIDENTS;

    const filtered = sourceIncidents.filter(i => {
        const q = search.toLowerCase();
        const matchQ = !q || i.name.toLowerCase().includes(q) || i.asset.toLowerCase().includes(q) || i.source.toLowerCase().includes(q);
        const matchSev = sevFilter === 'All' || i.severity === sevFilter;
        const matchStatus = statusFilter === 'All' || i.status === statusFilter;
        return matchQ && matchSev && matchStatus;
    });

    const kpiValues = [
        { label: 'Total Open', value: loading ? '...' : String(usingReal ? kpis?.total ?? INCIDENT_KPIS.totalOpen : INCIDENT_KPIS.totalOpen), color: 'text-red-600' },
        { label: 'High+', value: loading ? '...' : String(kpis?.high ?? '...'), color: 'text-orange-600' },
        { label: 'Medium', value: loading ? '...' : String(kpis?.medium ?? '...'), color: 'text-violet-600' },
        { label: 'Low', value: loading ? '...' : String(kpis?.low ?? '...'), color: 'text-blue-600' },
        { label: 'Avg SLA Remaining', value: loading ? '...' : (usingReal ? kpis?.avgSla ?? `${INCIDENT_KPIS.avgSLA} mins` : `${INCIDENT_KPIS.avgSLA} mins`), color: 'text-emerald-600' },
    ];

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
                    {kpiValues.map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search incidents, assets, sources…"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 w-64" />
                    {[['Severity', ['All', 'Critical', 'High', 'Medium', 'Low'], sevFilter, setSevFilter],
                      ['Status', ['All', 'Open', 'Investigating', 'Escalated', 'Contained', 'Resolved'], statusFilter, setStatusFilter]
                    ].map(([label, opts, val, setter]) => (
                        <select key={String(label)} value={String(val)} onChange={e => (setter as (v: string) => void)(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20">
                            {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                        </select>
                    ))}
                    <span className="ml-auto text-[10px] text-gray-400">
                        {loading ? 'Loading…' : `${filtered.length} incidents${usingReal ? ' · live Wazuh data' : ''}`}
                    </span>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['Severity', 'Incident', 'Source', 'Asset', 'Status', 'Analyst', 'SLA'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                                ) : (
                                    filtered.map(inc => (
                                        <>
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
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusColor[inc.status]}`}>{inc.status}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{inc.analyst}</td>
                                                <td className={`px-4 py-3 font-mono font-bold ${inc.slaMinutes < 30 && inc.slaMinutes > 0 ? 'text-red-600' : 'text-gray-700'}`}>{inc.sla}</td>
                                            </tr>
                                            {expanded === inc.id && (
                                                <tr key={`${inc.id}-detail`} className="border-b border-gray-200 bg-gray-50">
                                                    <td colSpan={7} className="px-6 py-4">
                                                        <IncidentDetail inc={inc} />
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

function IncidentDetail({ inc }: { inc: DisplayIncident }) {
    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Timeline</h4>
                <div className="space-y-2 border-l-2 border-blue-200 pl-3">
                    {inc.timeline.map((t, i) => (
                        <div key={i}>
                            <p className="text-[10px] font-mono text-blue-700">{t.time}</p>
                            <p className="text-[11px] text-gray-700">{t.event}</p>
                            <p className="text-[10px] text-gray-400">{t.source}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Details</h4>
                <div className="space-y-2 text-xs">
                    {typeof inc.level === 'number' && (
                        <div><span className="text-gray-400">Level:</span> <span className="text-gray-700 font-mono">Level {inc.level} — {inc.severity}</span></div>
                    )}
                    {inc.rawTimestamp && (
                        <div><span className="text-gray-400">Detected:</span> <span className="text-gray-700 font-mono">{formatDateTime(inc.rawTimestamp)}</span></div>
                    )}
                    <div><span className="text-gray-400">MITRE:</span> <span className="text-orange-600 font-mono">{inc.mitre}</span></div>
                    <div><span className="text-gray-400">Assets:</span> <span className="text-gray-700">{inc.affectedAssets.join(', ')}</span></div>
                    <div><span className="text-gray-400">Description:</span> <span className="text-gray-700">{inc.description}</span></div>
                </div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2">Suggested Actions</h4>
                <ol className="space-y-1">
                    {inc.suggestedActions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-700">
                            <span className="text-blue-700 font-bold flex-shrink-0">{i + 1}.</span>{a}
                        </li>
                    ))}
                </ol>
            </div>
            <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Actions</h4>
                <button className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Assign to Me</button>
                <select className="w-full py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 px-2 focus:outline-none">
                    <option>Update Status…</option>
                    <option>Open</option>
                    <option>Investigating</option>
                    <option>Escalated</option>
                    <option>Contained</option>
                    <option>Resolved</option>
                </select>
                <button className="w-full py-2 border border-gray-200 text-gray-500 hover:text-gray-800 text-xs font-bold rounded-lg transition-colors">View Full Report</button>
            </div>
        </div>
    );
}
