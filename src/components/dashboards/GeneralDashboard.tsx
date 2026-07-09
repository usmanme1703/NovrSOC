'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { KpiCard } from '../shared/KpiCard';
import { ChartWrapper } from '../shared/ChartWrapper';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { GaugeChart } from '../shared/GaugeChart';
import { globalMetrics, generalActivityLog } from '@/data/mockData';
import { FRAMEWORKS } from '@/lib/mock/compliance';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${className}`}>
        <div className="h-[3px] bg-[#1d4ed8]" />
        {children}
    </div>
);

const SectionHeader = ({ title, badge }: { title: string; badge?: string }) => (
    <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-2 border-l-2 border-[#1d4ed8] pl-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h3>
        </div>
        {badge && <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full uppercase tracking-wide">{badge}</span>}
    </div>
);

/* ── 1A: Global Threat Map ── */
interface AttackOrigin { country: string; x: number; y: number; count: string; label: string; color: string; dashed: string }
const NIGERIA_X = 500, NIGERIA_Y = 240;

const THREAT_VECTORS_FALLBACK: { label: string; pct: number; color: string }[] = [
    { label: 'Malware Activity', pct: 42, color: '#dc2626' },
    { label: 'Phishing Infrastructure', pct: 28, color: '#7c3aed' },
    { label: 'Ransomware Probing', pct: 18, color: '#ea580c' },
];

const GlobalThreatMap = ({ ctipStats }: {
    ctipStats: { total_iocs: number } | null;
}) => {
    const [timeRange, setTimeRange] = useState('Last 24hr');
    // No real IP-to-country resolution exists yet for Wazuh alert source IPs,
    // so arcs stay empty until that pipeline is built — never show placeholder countries.
    const attackOrigins: AttackOrigin[] = [];
    return (
        <Card>
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <SectionHeader title="Global Threat Map — Live Attack Activity" />
                        <p className="text-[10px] text-slate-500">Inbound attacks targeting NovrSOC-protected clients</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right mr-2">
                            <p className="text-[10px] text-slate-500">Attacks blocked today</p>
                            <p className="text-sm font-black text-red-600">{ctipStats ? ctipStats.total_iocs.toLocaleString() : '...'}</p>
                        </div>
                        {['Last 1hr', 'Last 24hr', 'Last 7 days'].map(r => (
                            <button key={r} onClick={() => setTimeRange(r)}
                                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                                    timeRange === r
                                        ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]'
                                        : 'bg-white border-slate-300 text-slate-600 hover:text-slate-800'
                                }`}>
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative bg-[#f8fafc] rounded-lg overflow-hidden border border-slate-200">
                    <svg viewBox="0 0 900 380" className="w-full h-[220px]">
                        <ellipse cx="140" cy="170" rx="110" ry="90" fill="#1e3a5f" opacity="0.7" />
                        <ellipse cx="220" cy="310" rx="60" ry="80" fill="#1e3a5f" opacity="0.7" />
                        <ellipse cx="490" cy="120" rx="70" ry="55" fill="#1e3a5f" opacity="0.7" />
                        <ellipse cx="490" cy="255" rx="75" ry="100" fill="#1e3a5f" opacity="0.8" />
                        <ellipse cx="700" cy="155" rx="140" ry="90" fill="#1e3a5f" opacity="0.7" />
                        <ellipse cx="770" cy="300" rx="60" ry="40" fill="#1e3a5f" opacity="0.6" />
                        {[100, 200, 300].map(y => <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4 8" />)}
                        {[150, 300, 450, 600, 750].map(x => <line key={x} x1={x} y1="0" x2={x} y2="380" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4 8" />)}
                        {attackOrigins.map((o, i) => {
                            const mx = (o.x + NIGERIA_X) / 2;
                            const my = Math.min(o.y, NIGERIA_Y) - 60 - i * 10;
                            return (
                                <g key={i}>
                                    <path d={`M ${o.x} ${o.y} Q ${mx} ${my} ${NIGERIA_X} ${NIGERIA_Y}`}
                                        fill="none" stroke={o.color} strokeWidth="1.5" strokeDasharray={o.dashed} opacity="0.7">
                                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                                    </path>
                                    <circle cx={o.x} cy={o.y} r="5" fill={o.color} opacity="0.9">
                                        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                </g>
                            );
                        })}
                        <circle cx={NIGERIA_X} cy={NIGERIA_Y} r="10" fill="none" stroke="#16a34a" strokeWidth="2">
                            <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={NIGERIA_X} cy={NIGERIA_Y} r="4" fill="#16a34a" />
                        <text x={NIGERIA_X + 14} y={NIGERIA_Y + 4} fill="#16a34a" fontSize="9" fontWeight="bold">🇳🇬 Nigeria</text>
                    </svg>
                </div>

                <div className="flex items-center gap-4 mt-3 flex-wrap">
                    {[['#dc2626', 'Ransomware'], ['#ea580c', 'Phishing'], ['#ca8a04', 'Brute Force'], ['#7c3aed', 'APT/Nation-state']].map(([c, l]) => (
                        <div key={l} className="flex items-center gap-1.5">
                            <div className="w-3 h-0.5" style={{ backgroundColor: c }} />
                            <span className="text-[10px] text-slate-500">{l}</span>
                        </div>
                    ))}
                </div>

                {attackOrigins.length > 0 ? (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                        {attackOrigins.map(o => (
                            <div key={o.country} className="bg-white rounded-lg p-2 border border-slate-200 text-center">
                                <p className="text-[11px] font-bold text-slate-700">{o.country}</p>
                                <p className="text-[10px] font-black mt-0.5" style={{ color: o.color }}>{o.count}</p>
                                <p className="text-[9px] text-slate-500">{o.label}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-3 text-center py-3">
                        <p className="text-[10px] text-slate-400">No active attack data</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

/* ── 1B: Nigeria Threat Heatmap ── */
const NIGERIA_FEED = [
    { source: 'National Threat Advisory', type: 'Phishing Campaign', sector: 'Banking', severity: 'Critical', time: '14 mins ago' },
    { source: 'National Threat Advisory', type: 'Ransomware Advisory', sector: 'Government', severity: 'High', time: '1 hr ago' },
    { source: 'Financial Sector Intelligence', type: 'BEC Attack', sector: 'Financial', severity: 'Critical', time: '2 hrs ago' },
    { source: 'National Threat Advisory', type: 'DDoS Attempt', sector: 'Telecom', severity: 'Medium', time: '3 hrs ago' },
    { source: 'National Threat Advisory', type: 'Credential Stuffing', sector: 'Fintech', severity: 'High', time: '5 hrs ago' },
];
const INDUSTRIES = [
    { label: '🏦 Banking & Finance', pct: 38, color: '#dc2626' },
    { label: '📱 Telecom', pct: 24, color: '#ea580c' },
    { label: '🏛️ Government', pct: 18, color: '#ca8a04' },
    { label: '⛽ Oil & Gas', pct: 12, color: '#2563eb' },
    { label: '🏥 Healthcare', pct: 8, color: '#16a34a' },
];
const sevColor = (s: string) => s === 'Critical' ? '#dc2626' : s === 'High' ? '#ea580c' : '#ca8a04';

const NigeriaThreatMap = () => {
    const [view, setView] = useState<'attacks' | 'outbound'>('attacks');
    return (
        <Card>
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <SectionHeader title="Nigeria National Threat Activity" />
                        <p className="text-[10px] text-slate-500">State-level threat activity across Nigeria</p>
                    </div>
                    <div className="flex gap-1">
                        {[['attacks', 'Attacks on Nigeria'], ['outbound', 'Outbound Threats']].map(([v, l]) => (
                            <button key={v} onClick={() => setView(v as 'attacks' | 'outbound')}
                                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                                    view === v
                                        ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]'
                                        : 'bg-white border-slate-300 text-slate-600 hover:text-slate-800'
                                }`}>
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f8fafc] rounded-lg p-3 border border-slate-200 relative">
                        <svg viewBox="0 0 300 300" className="w-full h-[180px]">
                            <path d="M 60 60 L 240 60 L 250 80 L 240 180 L 220 240 L 180 280 L 150 290 L 120 280 L 80 240 L 50 180 L 40 100 Z"
                                fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
                            <ellipse cx="80" cy="240" rx="30" ry="25" fill="#dc2626" opacity="0.7" />
                            <ellipse cx="145" cy="165" rx="25" ry="22" fill="#ea580c" opacity="0.7" />
                            <ellipse cx="160" cy="250" rx="25" ry="22" fill="#ea580c" opacity="0.7" />
                            <ellipse cx="100" cy="200" rx="22" ry="18" fill="#ca8a04" opacity="0.6" />
                            <ellipse cx="200" cy="230" rx="22" ry="18" fill="#ca8a04" opacity="0.6" />
                            <ellipse cx="120" cy="120" rx="25" ry="20" fill="#ca8a04" opacity="0.6" />
                            {[[80, 240], [145, 165], [160, 250]].map(([x, y], i) => (
                                <g key={i}>
                                    <circle cx={x} cy={y} r="6" fill="none" stroke="#dc2626" strokeWidth="1.5">
                                        <animate attributeName="r" values="4;10;4" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                                        <animate attributeName="opacity" values="1;0;1" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
                                    </circle>
                                    <circle cx={x} cy={y} r="3" fill="#dc2626" />
                                </g>
                            ))}
                            <text x="52" y="272" fill="#dc2626" fontSize="7" fontWeight="bold">Lagos</text>
                            <text x="120" y="158" fill="#ea580c" fontSize="7" fontWeight="bold">FCT</text>
                            <text x="140" y="270" fill="#ea580c" fontSize="7" fontWeight="bold">Rivers</text>
                        </svg>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {[['#dc2626', 'Critical'], ['#ea580c', 'High'], ['#ca8a04', 'Medium'], ['#d1d5db', 'Low']].map(([c, l]) => (
                                <div key={l} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />
                                    <span className="text-[9px] text-slate-500">{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Top Targeted Industries</p>
                            <div className="space-y-1.5">
                                {INDUSTRIES.map(ind => (
                                    <div key={ind.label}>
                                        <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                                            <span>{ind.label}</span>
                                            <span className="font-bold text-blue-700">{ind.pct}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1 rounded-full">
                                            <div className="h-full rounded-full" style={{ width: `${ind.pct}%`, backgroundColor: ind.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nigerian Threat Feed</p>
                            <div className="space-y-1">
                                {NIGERIA_FEED.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 py-1 border-b border-slate-100" style={{ borderLeftColor: sevColor(f.severity) }}>
                                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sevColor(f.severity) }} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] text-slate-800 font-semibold truncate">{f.source} — {f.type}</p>
                                            <p className="text-[8px] text-slate-500">{f.sector} · {f.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

/* ── 1C: Compliance Snapshot ── */
const ComplianceCard = ({ f }: { f: { name: string; score: number; status: string } }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center text-center hover:border-blue-200 transition-colors group shadow-sm">
        <div className="relative mb-1">
            <GaugeChart value={f.score} size={56} strokeWidth={6} />
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-slate-900">{f.score}%</span>
        </div>
        <p className="text-[9px] font-medium text-slate-600 mt-1 leading-tight">{f.name}</p>
        <span className={`mt-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${f.status === 'Compliant' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
            {f.status}
        </span>
        <Link href="/compliance" className="mt-1.5 text-[8px] text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">Details →</Link>
    </div>
);

const ComplianceSnapshot = () => (
    <Card>
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <SectionHeader title="Compliance Snapshot" />
                <Link href="/compliance" className="text-[10px] font-semibold text-blue-700 hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
                {FRAMEWORKS.slice(0, 4).map(f => <ComplianceCard key={f.name} f={f} />)}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
                {FRAMEWORKS.slice(4).map(f => <ComplianceCard key={f.name} f={f} />)}
            </div>
        </div>
    </Card>
);

/* ── 1E: MSSP Client Portfolio ── */
const MSSPPanel = ({ role, openIncidents, totalAssets }: { role: string; openIncidents: number | null; totalAssets: number | null }) => {
    if (role !== 'SOC Manager') return null;
    return (
        <Card>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <SectionHeader title="MSSP Client Portfolio" badge="1 Active Client" />
                        <p className="text-[10px] text-slate-500">Cross-tenant security posture overview</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-[10px] font-bold px-3 py-1.5 bg-[#1d4ed8] text-white rounded-lg hover:bg-[#1e40af] transition-colors">+ Add Client</button>
                        <Link href="/customers" className="text-[10px] font-semibold text-blue-700 hover:underline">View All →</Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {['Client', 'Industry', 'Risk Score', 'Active Incidents', 'Agents', 'Status'].map(h => (
                                    <th key={h} className="text-left py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                ))}
                                <th className="py-2 px-3" />
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-2 px-3 font-semibold text-slate-800">🛡️ Cybernovr</td>
                                <td className="py-2 px-3 text-slate-500">Cybersecurity</td>
                                <td className="py-2 px-3"><span className="font-black text-blue-700">Active</span></td>
                                <td className="py-2 px-3 font-bold text-slate-700">{openIncidents ?? '...'}</td>
                                <td className="py-2 px-3 text-slate-500">{totalAssets !== null ? totalAssets.toLocaleString() : '...'}</td>
                                <td className="py-2 px-3"><span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">🟢 Active</span></td>
                                <td className="py-2 px-3">
                                    <Link href="/customers" className="text-[10px] font-bold text-blue-700 hover:underline">View →</Link>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={7} className="py-3 px-3 text-center text-[10px] text-slate-400">More clients coming soon</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};

/* ── Main ── */
export const GeneralDashboard = ({ role = 'SOC Manager' }: { role?: string }) => {
    const [ctipStats, setCtipStats] = useState<{
        total_iocs: number;
        iocs_last_24h: number;
        active_campaigns: number;
        exploitable_cves_this_week: number;
        sources_active: number;
    } | null>(null);

    const [wazuhAgents, setWazuhAgents] = useState<{ active: number; total: number } | null>(null);

    useEffect(() => {
        fetch('/api/threat-intel/stats', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => setCtipStats(data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        fetch('/api/wazuh/agents', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const conn = data?.data?.connection;
                if (conn) setWazuhAgents({ active: conn.active, total: conn.total });
            })
            .catch(() => {});
    }, []);

    const [wazuhAlerts, setWazuhAlerts] = useState<typeof generalActivityLog | null>(null);
    const [criticalAlertsCount, setCriticalAlertsCount] = useState<number | null>(null);
    const [openIncidentsCount, setOpenIncidentsCount] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/wazuh/alerts-indexer', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const hits = data?.hits;
                if (Array.isArray(hits) && hits.length > 0) {
                    setWazuhAlerts(hits.map((a: { timestamp?: string; rule?: { description?: string; level?: number }; agent?: { name?: string } }) => {
                        const level = a.rule?.level ?? 0;
                        return {
                            time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString('en-GB') : '—',
                            event: a.rule?.description ?? 'Wazuh alert',
                            source: a.agent?.name ?? 'Wazuh-Agent',
                            severity: level >= 12 ? 'Critical' : level >= 7 ? 'High' : 'Medium',
                            status: 'Active',
                        };
                    }));
                }
                if (typeof data?.criticalCount === 'number') setCriticalAlertsCount(data.criticalCount);
                if (typeof data?.openIncidentsCount === 'number') setOpenIncidentsCount(data.openIncidentsCount);
            })
            .catch(() => {});
    }, []);

    const [threatVectors, setThreatVectors] = useState<{ label: string; pct: number; color: string }[] | null>(null);

    useEffect(() => {
        fetch('/api/threat-intel/iocs?limit=500', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const items = data?.items;
                if (Array.isArray(items) && items.length > 0) {
                    const colors: Record<string, string> = { Malware: '#dc2626', Phishing: '#7c3aed', 'C2/Ransomware': '#ea580c', Scanning: '#ca8a04', Other: '#2563eb' };
                    const buckets: Record<string, number> = { Malware: 0, Phishing: 0, 'C2/Ransomware': 0, Scanning: 0, Other: 0 };
                    for (const item of items as { threat_type?: string | null }[]) {
                        const t = (item.threat_type || '').toLowerCase();
                        if (t.includes('malware')) buckets.Malware++;
                        else if (t.includes('phish')) buckets.Phishing++;
                        else if (t.includes('c2') || t.includes('ransomware')) buckets['C2/Ransomware']++;
                        else if (t.includes('scan')) buckets.Scanning++;
                        else buckets.Other++;
                    }
                    setThreatVectors(
                        Object.entries(buckets)
                            .filter(([, n]) => n > 0)
                            .map(([label, n]) => ({ label, pct: Math.round((n / items.length) * 100), color: colors[label] }))
                    );
                }
            })
            .catch(() => {});
    }, []);

    const [trendData, setTrendData] = useState<{ week: string; alerts: number; incidents: number }[] | null>(null);

    useEffect(() => {
        fetch('/api/wazuh/trend', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setTrendData(data);
            })
            .catch(() => {});
    }, []);

    const liveSystemMetrics = [
        {
            label: 'Threats Blocked',
            value: ctipStats ? ctipStats.total_iocs.toLocaleString() : '...',
            trend: ctipStats ? '+' + ctipStats.iocs_last_24h?.toLocaleString() + ' today' : '',
            type: 'orange' as const,
        },
        { label: 'Clients Protected Today', value: '42 Active', trend: '100%', type: 'blue' as const },
        { label: 'SIEM Ingestion Rate', value: '4.2k eps', trend: '+12%', type: 'purple' as const },
        {
            label: 'Wazuh Agent Syncs',
            value: wazuhAgents ? `${wazuhAgents.active}/${wazuhAgents.total} Active` : '...',
            trend: wazuhAgents ? `${Math.round((wazuhAgents.active / wazuhAgents.total) * 100)}%` : '',
            type: 'blue' as const,
        },
    ];

    const trendBars = trendData
        ? (() => {
            const maxAlerts = Math.max(...trendData.map(d => d.alerts), 1);
            return trendData.map(d => ({ heightPct: Math.max(4, Math.round((d.alerts / maxAlerts) * 100)), label: d.week }));
        })()
        : [40, 55, 30, 85, 42, 60, 70, 95, 45, 60, 80, 100].map((val, i) => ({ heightPct: val, label: `W${i + 1}` }));

    const data = globalMetrics.general;
    const generalCards = Object.entries(data).map(([key, val]) => {
        if (key === 'totalAssets' && wazuhAgents) return { ...val, value: wazuhAgents.total.toLocaleString() };
        if (key === 'activeThreats') return { ...val, value: String(ctipStats?.active_campaigns ?? '...') };
        if (key === 'riskScore') {
            const value = ctipStats
                ? Math.min(100, (ctipStats.exploitable_cves_this_week * 10) + (ctipStats.active_campaigns * 5)) + '/100'
                : '...';
            return { ...val, value };
        }
        if (key === 'criticalAlerts' && criticalAlertsCount !== null) return { ...val, value: String(criticalAlertsCount) };
        if (key === 'openIncidents' && openIncidentsCount !== null) return { ...val, value: String(openIncidentsCount) };
        return val;
    });
    const allCards = [...generalCards, ...liveSystemMetrics];

    return (
        <div className="space-y-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider -mb-2">Aggregated across all onboarded clients</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {allCards.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>

            <GlobalThreatMap ctipStats={ctipStats} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <NigeriaThreatMap />
                <ComplianceSnapshot />
            </div>

            <MSSPPanel role={role} openIncidents={openIncidentsCount} totalAssets={wazuhAgents?.total ?? null} />

            <ChartWrapper title="Security Posture & Incident Activity Trends (Last 30 Days)">
                <div className="w-full h-full flex items-end gap-2 pt-4">
                    {trendBars.map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div style={{ height: `${bar.heightPct}%`, backgroundColor: '#1d4ed8' }} className="w-full rounded-t opacity-70 group-hover:opacity-100 transition-all duration-200" />
                            <span className="text-[9px] text-slate-500 mt-1.5 font-medium">{bar.label}</span>
                        </div>
                    ))}
                </div>
            </ChartWrapper>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                    <h4 className="font-bold text-[11px] text-slate-900 uppercase tracking-widest mb-5 border-l-2 border-[#1d4ed8] pl-2">Threat Vectors Distribution</h4>
                    <div className="space-y-4">
                        {(threatVectors ?? THREAT_VECTORS_FALLBACK).map(v => (
                            <div key={v.label}>
                                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5"><span>{v.label}</span><span>{v.pct}%</span></div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${v.pct}%`, backgroundColor: v.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                    <h4 className="font-bold text-[11px] text-slate-900 uppercase tracking-widest mb-5 border-l-2 border-[#1d4ed8] pl-2">Monitored Assets Proportions</h4>
                    <div className="space-y-4">
                        {[['Cloud Production Assets', '50%', '#1d4ed8'], ['Enterprise Workstations', '25%', '#7c3aed'], ['On-Prem Infrastructure', '15%', '#16a34a']].map(([n, p, c]) => (
                            <div key={n}>
                                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5"><span>{n}</span><span>{p}</span></div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: p, backgroundColor: c }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DataTable
                title="Real-Time Global Activity Feed"
                columns={['Time', 'Telemetry Event Details', 'Severity', 'Ingestion Source', 'Status']}
                data={wazuhAlerts ?? generalActivityLog}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{row.time}</td>
                        <td className="px-6 py-4 font-semibold text-xs text-slate-800">{row.event}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.severity} /></td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">{row.source}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.status} /></td>
                    </tr>
                )}
            />
        </div>
    );
};
