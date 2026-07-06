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
import { CLIENTS } from '@/lib/mock/clients';

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
const ATTACK_ORIGINS = [
    { country: '🇨🇳 China',  x: 740, y: 160, count: '1,842', label: 'Ransomware',      color: '#dc2626', dashed: '8 4' },
    { country: '🇷🇺 Russia', x: 580, y: 110, count: '1,204', label: 'APT/Nation-state', color: '#7c3aed', dashed: '6 3' },
    { country: '🇧🇷 Brazil', x: 230, y: 290, count: '876',   label: 'Phishing',         color: '#ea580c', dashed: '5 4' },
    { country: '🇺🇸 USA',    x: 100, y: 160, count: '654',   label: 'Brute Force',      color: '#ca8a04', dashed: '4 3' },
    { country: '🇮🇳 India',  x: 680, y: 200, count: '412',   label: 'Phishing',         color: '#ea580c', dashed: '5 4' },
];
const NIGERIA_X = 500, NIGERIA_Y = 240;

const GlobalThreatMap = ({ ctipStats }: { ctipStats: { total_iocs: number } | null }) => {
    const [timeRange, setTimeRange] = useState('Last 24hr');
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
                        {ATTACK_ORIGINS.map((o, i) => {
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

                <div className="mt-3 grid grid-cols-5 gap-2">
                    {ATTACK_ORIGINS.map(o => (
                        <div key={o.country} className="bg-white rounded-lg p-2 border border-slate-200 text-center">
                            <p className="text-[11px] font-bold text-slate-700">{o.country}</p>
                            <p className="text-[10px] font-black mt-0.5" style={{ color: o.color }}>{o.count}</p>
                            <p className="text-[9px] text-slate-500">{o.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

/* ── 1B: Nigeria Threat Heatmap ── */
const NIGERIA_FEED = [
    { source: 'NCC-CSIRT', type: 'Phishing Campaign', sector: 'Banking', severity: 'Critical', time: '14 mins ago' },
    { source: 'NGCERT', type: 'Ransomware Advisory', sector: 'Government', severity: 'High', time: '1 hr ago' },
    { source: 'CBN-CSIRT', type: 'BEC Attack', sector: 'Financial', severity: 'Critical', time: '2 hrs ago' },
    { source: 'NCC-CSIRT', type: 'DDoS Attempt', sector: 'Telecom', severity: 'Medium', time: '3 hrs ago' },
    { source: 'NGCERT', type: 'Credential Stuffing', sector: 'Fintech', severity: 'High', time: '5 hrs ago' },
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
const ComplianceSnapshot = () => (
    <Card>
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <SectionHeader title="Compliance Snapshot" />
                <Link href="/compliance" className="text-[10px] font-semibold text-blue-700 hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
                {FRAMEWORKS.map(f => (
                    <div key={f.name} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center text-center hover:border-blue-200 transition-colors group shadow-sm">
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
                ))}
            </div>
        </div>
    </Card>
);

/* ── 1D: SecuBreach Snapshot ── */
const SecuBreachSnapshot = ({ ctipStats }: { ctipStats: { exploitable_cves_this_week: number } | null }) => (
    <Card>
        <div className="p-4">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <SectionHeader title="SecuBreach — Exposure Summary" />
                        <span className="text-[8px] font-bold px-2 py-0.5 bg-[#7c3aed] text-white rounded-full">Powered by SecuBreach</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Vulnerability &amp; exposure risk snapshot</p>
                </div>
                <Link href="/exposure/secubreach" className="text-[10px] font-semibold text-blue-700 hover:underline">Full Report →</Link>
            </div>

            <div className="bg-[#fef2f2] border-l-4 border-red-600 rounded-r-xl px-5 py-3 mb-4 flex items-center gap-4">
                <div className="text-4xl font-black text-red-600">{ctipStats?.exploitable_cves_this_week ?? '...'}</div>
                <div>
                    <p className="text-sm font-bold text-slate-700">vulnerabilities likely to be exploited this week</p>
                    <p className="text-[10px] text-slate-500">Prioritized for immediate action — do not delay patching</p>
                </div>
                <Link href="/exposure/secubreach" className="ml-auto text-[10px] font-bold text-red-600 border border-red-300 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap">
                    View Priority List →
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Severity Breakdown</p>
                    {[['#dc2626', 'Critical', 3], ['#ea580c', 'High', 9], ['#ca8a04', 'Medium', 34], ['#2563eb', 'Low', 112]].map(([c, l, n]) => (
                        <div key={String(l)} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: String(c) }} />
                                <span className="text-[10px] text-slate-500">{l}</span>
                            </div>
                            <span className="text-[11px] font-black text-slate-800">{n}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <GaugeChart value={63} size={80} strokeWidth={8} color="#ea580c" />
                        <span className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-orange-600">63</span>
                            <span className="text-[8px] text-slate-500">/100</span>
                        </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">Exposure Score</p>
                    <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 mt-1">Elevated Risk</span>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Remediation</p>
                    {[['Patched this week', 7, '#16a34a'], ['In Progress', 4, '#ca8a04'], ['Overdue', 2, '#dc2626']].map(([l, n, c]) => (
                        <div key={String(l)} className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">{l}</span>
                            <span className="text-[11px] font-black" style={{ color: String(c) }}>{n}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </Card>
);

/* ── 1E: MSSP Client Portfolio ── */
const clientStatusLabel = (c: { riskScore: number; activeIncidents: number }) =>
    c.riskScore >= 80 ? { label: '🔴 Critical', cls: 'text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold' } :
    c.activeIncidents >= 5 ? { label: '🟡 Attention', cls: 'text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold' } :
    { label: '🟢 Healthy', cls: 'text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold' };

const MSSPPanel = ({ role }: { role: string }) => {
    if (role !== 'SOC Manager') return null;
    return (
        <Card>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <SectionHeader title="MSSP Client Portfolio" badge="42 Active Clients" />
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
                            {CLIENTS.slice(0, 5).map(c => {
                                const st = clientStatusLabel(c);
                                return (
                                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-2 px-3 font-semibold text-slate-800">{c.icon} {c.name}</td>
                                        <td className="py-2 px-3 text-slate-500">{c.industry}</td>
                                        <td className="py-2 px-3">
                                            <span className={`font-black ${c.riskScore >= 80 ? 'text-red-600' : c.riskScore >= 70 ? 'text-amber-600' : 'text-emerald-600'}`}>{c.riskScore}</span>
                                        </td>
                                        <td className="py-2 px-3 font-bold text-slate-700">{c.activeIncidents}</td>
                                        <td className="py-2 px-3 text-slate-500">{c.agentsOnline.toLocaleString()}</td>
                                        <td className="py-2 px-3"><span className={st.cls}>{st.label}</span></td>
                                        <td className="py-2 px-3">
                                            <Link href="/customers" className="text-[10px] font-bold text-blue-700 hover:underline">View →</Link>
                                        </td>
                                    </tr>
                                );
                            })}
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

    useEffect(() => {
        fetch('/api/wazuh/alerts', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const items = data?.data?.affected_items;
                if (Array.isArray(items) && items.length > 0) {
                    setWazuhAlerts(items.map((a: { timestamp?: string; rule?: { description?: string; level?: number }; full_log?: string; agent?: { name?: string } }) => {
                        const level = a.rule?.level ?? 0;
                        return {
                            time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : '—',
                            event: a.rule?.description ?? a.full_log ?? 'Wazuh alert',
                            severity: level >= 12 ? 'Critical' : level >= 7 ? 'High' : level >= 4 ? 'Medium' : 'Low',
                            source: a.agent?.name ?? 'Wazuh-Agent',
                            status: 'New',
                        };
                    }));
                }
            })
            .catch(() => {});
    }, []);

    const liveSystemMetrics = [
        {
            label: 'Threats Blocked',
            value: ctipStats ? ctipStats.total_iocs.toLocaleString() : '...',
            trend: ctipStats ? '+live' : '',
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

    const data = globalMetrics.general;
    const generalCards = Object.entries(data).map(([key, val]) =>
        key === 'totalAssets' && wazuhAgents ? { ...val, value: wazuhAgents.total.toLocaleString() } : val
    );
    const allCards = [...generalCards, ...liveSystemMetrics];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {allCards.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>

            <GlobalThreatMap ctipStats={ctipStats} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <NigeriaThreatMap />
                <ComplianceSnapshot />
            </div>

            <SecuBreachSnapshot ctipStats={ctipStats} />

            <MSSPPanel role={role} />

            <ChartWrapper title="Security Posture & Incident Activity Trends (Last 30 Days)">
                <div className="w-full h-full flex items-end gap-2 pt-4">
                    {[40, 55, 30, 85, 42, 60, 70, 95, 45, 60, 80, 100].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div style={{ height: `${val}%`, backgroundColor: '#1d4ed8' }} className="w-full rounded-t opacity-70 group-hover:opacity-100 transition-all duration-200" />
                            <span className="text-[9px] text-slate-500 mt-1.5 font-medium">W{i + 1}</span>
                        </div>
                    ))}
                </div>
            </ChartWrapper>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                    <h4 className="font-bold text-[11px] text-slate-900 uppercase tracking-widest mb-5 border-l-2 border-[#1d4ed8] pl-2">Threat Vectors Distribution</h4>
                    <div className="space-y-4">
                        {[['Malware Activity', '42%', '#dc2626'], ['Phishing Infrastructure', '28%', '#7c3aed'], ['Ransomware Probing', '18%', '#ea580c']].map(([n, p, c]) => (
                            <div key={n}>
                                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5"><span>{n}</span><span>{p}</span></div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: p, backgroundColor: c }} />
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
