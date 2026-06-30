'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KpiCard } from '../shared/KpiCard';
import { ChartWrapper } from '../shared/ChartWrapper';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { GaugeChart } from '../shared/GaugeChart';
import { globalMetrics, generalActivityLog, systemPerformanceMetrics } from '@/data/mockData';
import { FRAMEWORKS } from '@/lib/mock/compliance';
import { CLIENTS } from '@/lib/mock/clients';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden ${className}`}>
        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
        {children}
    </div>
);

const SectionHeader = ({ title, badge }: { title: string; badge?: string }) => (
    <div className="flex items-center gap-2 mb-1">
        <h3 className="text-xs font-black text-gray-800 dark:text-slate-100 uppercase tracking-widest">{title}</h3>
        {badge && <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700/40 rounded-full uppercase tracking-wide">{badge}</span>}
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

const GlobalThreatMap = () => {
    const [timeRange, setTimeRange] = useState('Last 24hr');
    return (
        <Card>
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <SectionHeader title="Global Threat Map — Live Attack Activity" />
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">Inbound attacks targeting NovrSOC-protected clients</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right mr-2">
                            <p className="text-[10px] text-gray-400 dark:text-slate-500">Attacks blocked today</p>
                            <p className="text-sm font-black text-red-600">3,451</p>
                        </div>
                        {['Last 1hr', 'Last 24hr', 'Last 7 days'].map(r => (
                            <button key={r} onClick={() => setTimeRange(r)}
                                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${timeRange === r ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'}`}>
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative bg-gray-100 dark:bg-slate-800/60 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                    <svg viewBox="0 0 900 380" className="w-full h-[220px]">
                        <ellipse cx="140" cy="170" rx="110" ry="90" fill="#1e3a5f" opacity="0.7" />
                        <ellipse cx="220" cy="310" rx="60" ry="80" fill="#1e3a5f" opacity="0.7" />
                        <ellipse cx="490" cy="120" rx="70" ry="55" fill="#1e3a5f" opacity="0.7" />
                        <ellipse cx="490" cy="255" rx="75" ry="100" fill="#1e3a5f" opacity="0.8" />
                        <ellipse cx="700" cy="155" rx="140" ry="90" fill="#1e3a5f" opacity="0.7" />
                        <ellipse cx="770" cy="300" rx="60" ry="40" fill="#1e3a5f" opacity="0.6" />
                        {[100, 200, 300].map(y => <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4 8" />)}
                        {[150, 300, 450, 600, 750].map(x => <line key={x} x1={x} y1="0" x2={x} y2="380" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4 8" />)}
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
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">{l}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-3 grid grid-cols-5 gap-2">
                    {ATTACK_ORIGINS.map(o => (
                        <div key={o.country} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-2 border border-gray-200 dark:border-slate-700 text-center">
                            <p className="text-[11px] font-bold text-gray-700 dark:text-slate-200">{o.country}</p>
                            <p className="text-[10px] font-black mt-0.5" style={{ color: o.color }}>{o.count}</p>
                            <p className="text-[9px] text-gray-400 dark:text-slate-500">{o.label}</p>
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
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">State-level threat activity across Nigeria</p>
                    </div>
                    <div className="flex gap-1">
                        {[['attacks', 'Attacks on Nigeria'], ['outbound', 'Outbound Threats']].map(([v, l]) => (
                            <button key={v} onClick={() => setView(v as 'attacks' | 'outbound')}
                                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${view === v ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-slate-600 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'}`}>
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-slate-800/60 rounded-lg p-3 border border-gray-200 dark:border-slate-700 relative">
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
                                    <span className="text-[9px] text-gray-500 dark:text-slate-400">{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Top Targeted Industries</p>
                            <div className="space-y-1.5">
                                {INDUSTRIES.map(ind => (
                                    <div key={ind.label}>
                                        <div className="flex justify-between text-[10px] text-gray-500 dark:text-slate-400 mb-0.5">
                                            <span>{ind.label}</span>
                                            <span className="font-bold" style={{ color: ind.color }}>{ind.pct}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-slate-700 h-1 rounded-full">
                                            <div className="h-full rounded-full" style={{ width: `${ind.pct}%`, backgroundColor: ind.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nigerian Threat Feed</p>
                            <div className="space-y-1">
                                {NIGERIA_FEED.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-100 dark:border-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sevColor(f.severity) }} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] text-gray-700 dark:text-slate-200 font-semibold truncate">{f.source} — {f.type}</p>
                                            <p className="text-[8px] text-gray-400 dark:text-slate-500">{f.sector} · {f.time}</p>
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
                <Link href="/compliance" className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
                {FRAMEWORKS.map(f => (
                    <div key={f.name} className="bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center text-center hover:border-blue-200 dark:hover:border-blue-700/40 transition-colors group">
                        <div className="relative mb-1">
                            <GaugeChart value={f.score} size={56} strokeWidth={6} />
                            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-gray-800 dark:text-slate-100">{f.score}%</span>
                        </div>
                        <p className="text-[9px] font-bold text-gray-700 dark:text-slate-200 mt-1 leading-tight">{f.name}</p>
                        <span className={`mt-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${f.status === 'Compliant' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-200 dark:border-emerald-700/40' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 border border-amber-200 dark:border-amber-700/40'}`}>
                            {f.status}
                        </span>
                        <Link href="/compliance" className="mt-1.5 text-[8px] text-blue-700 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Details →</Link>
                    </div>
                ))}
            </div>
        </div>
    </Card>
);

/* ── 1D: SecuBreach Snapshot ── */
const SecuBreachSnapshot = () => (
    <Card>
        <div className="p-4">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <SectionHeader title="SecuBreach — Exposure Summary" />
                        <span className="text-[8px] font-bold px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 border border-orange-200 dark:border-orange-700/40 rounded-full">Powered by SecuBreach</span>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Vulnerability & exposure risk snapshot</p>
                </div>
                <Link href="/exposure/secubreach" className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 hover:underline">Full Report →</Link>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/40 rounded-xl px-5 py-3 mb-4 flex items-center gap-4">
                <div className="text-3xl font-black text-red-600">12</div>
                <div>
                    <p className="text-sm font-bold text-red-700 dark:text-red-400">vulnerabilities likely to be exploited this week</p>
                    <p className="text-[10px] text-red-500 dark:text-red-500">Prioritized for immediate action — do not delay patching</p>
                </div>
                <Link href="/exposure/secubreach" className="ml-auto text-[10px] font-bold text-red-600 border border-red-300 dark:border-red-700/40 px-2.5 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors whitespace-nowrap">
                    View Priority List →
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Severity Breakdown</p>
                    {[['#dc2626', 'Critical', 3], ['#ea580c', 'High', 9], ['#ca8a04', 'Medium', 34], ['#2563eb', 'Low', 112]].map(([c, l, n]) => (
                        <div key={String(l)} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: String(c) }} />
                                <span className="text-[10px] text-gray-500 dark:text-slate-400">{l}</span>
                            </div>
                            <span className="text-[11px] font-black text-gray-800 dark:text-slate-100">{n}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <GaugeChart value={63} size={80} strokeWidth={8} color="#ea580c" />
                        <span className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-black text-orange-600">63</span>
                            <span className="text-[8px] text-gray-400 dark:text-slate-500">/100</span>
                        </span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 mt-1">Exposure Score</p>
                    <span className="text-[9px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-700/40 mt-1">Elevated Risk</span>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Remediation</p>
                    {[['Patched this week', 7, '#16a34a'], ['In Progress', 4, '#ca8a04'], ['Overdue', 2, '#dc2626']].map(([l, n, c]) => (
                        <div key={String(l)} className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-500 dark:text-slate-400">{l}</span>
                            <span className="text-[11px] font-black" style={{ color: String(c) }}>{n}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </Card>
);

/* ── 1E: MSSP Client Portfolio (SOC Manager only) ── */
const clientStatusLabel = (c: { riskScore: number; activeIncidents: number }) =>
    c.riskScore >= 80 ? { label: '🔴 Critical', cls: 'text-red-600' } :
    c.activeIncidents >= 5 ? { label: '🟡 Attention', cls: 'text-amber-600' } :
    { label: '🟢 Healthy', cls: 'text-emerald-600' };

const MSSPPanel = ({ role }: { role: string }) => {
    if (role !== 'SOC Manager') return null;
    return (
        <Card>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <SectionHeader title="MSSP Client Portfolio" badge="42 Active Clients" />
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">Cross-tenant security posture overview</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-[10px] font-bold px-2 py-1 border border-dashed border-blue-200 dark:border-blue-700/40 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">+ Add Client</button>
                        <Link href="/customers" className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 hover:underline">View All →</Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-slate-700">
                                {['Client', 'Industry', 'Risk Score', 'Active Incidents', 'Agents', 'Status'].map(h => (
                                    <th key={h} className="text-left py-2 px-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                                ))}
                                <th className="py-2 px-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {CLIENTS.slice(0, 5).map(c => {
                                const st = clientStatusLabel(c);
                                return (
                                    <tr key={c.id} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
                                        <td className="py-2 px-3 font-semibold text-gray-800 dark:text-slate-100">{c.icon} {c.name}</td>
                                        <td className="py-2 px-3 text-gray-500 dark:text-slate-400">{c.industry}</td>
                                        <td className="py-2 px-3">
                                            <span className={`font-black ${c.riskScore >= 80 ? 'text-red-600' : c.riskScore >= 70 ? 'text-amber-600' : 'text-gray-700 dark:text-slate-200'}`}>{c.riskScore}</span>
                                        </td>
                                        <td className="py-2 px-3 font-bold text-gray-700 dark:text-slate-200">{c.activeIncidents}</td>
                                        <td className="py-2 px-3 text-gray-500 dark:text-slate-400">{c.agentsOnline.toLocaleString()}</td>
                                        <td className={`py-2 px-3 font-bold text-xs ${st.cls}`}>{st.label}</td>
                                        <td className="py-2 px-3">
                                            <Link href="/customers" className="text-[10px] font-bold text-blue-700 dark:text-blue-400 hover:underline">View →</Link>
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
    const data = globalMetrics.general;
    const allCards = [...Object.values(data), ...systemPerformanceMetrics];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {allCards.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>

            <GlobalThreatMap />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <NigeriaThreatMap />
                <ComplianceSnapshot />
            </div>

            <SecuBreachSnapshot />

            <MSSPPanel role={role} />

            <ChartWrapper title="Security Posture & Incident Activity Trends (Last 30 Days)">
                <div className="w-full h-full flex items-end gap-2 pt-4">
                    {[40, 55, 30, 85, 42, 60, 70, 95, 45, 60, 80, 100].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div style={{ height: `${val}%` }} className="w-full bg-gradient-to-t from-blue-700 to-violet-600 rounded-t opacity-70 group-hover:opacity-100 transition-all duration-200" />
                            <span className="text-[9px] text-gray-400 dark:text-slate-500 mt-1.5 font-medium">W{i + 1}</span>
                        </div>
                    ))}
                </div>
            </ChartWrapper>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1e293b] p-6 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <h4 className="font-bold text-[11px] text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-5">Threat Vectors Distribution</h4>
                    <div className="space-y-4">
                        {[['Malware Activity', '42%', 'bg-blue-700'], ['Phishing Infrastructure', '28%', 'bg-violet-600'], ['Ransomware Probing', '18%', 'bg-amber-500']].map(([n, p, c]) => (
                            <div key={n}>
                                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5"><span>{n}</span><span>{p}</span></div>
                                <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className={`${c} h-full rounded-full`} style={{ width: p }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-6 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <h4 className="font-bold text-[11px] text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-5">Monitored Assets Proportions</h4>
                    <div className="space-y-4">
                        {[['Cloud Production Assets', '50%', 'bg-violet-600'], ['Enterprise Workstations', '25%', 'bg-blue-700'], ['On-Prem Infrastructure', '15%', 'bg-amber-500']].map(([n, p, c]) => (
                            <div key={n}>
                                <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1.5"><span>{n}</span><span>{p}</span></div>
                                <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div className={`${c} h-full rounded-full`} style={{ width: p }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DataTable
                title="Real-Time Global Activity Feed"
                columns={['Time', 'Telemetry Event Details', 'Severity', 'Ingestion Source', 'Status']}
                data={generalActivityLog}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-400 dark:text-slate-500">{row.time}</td>
                        <td className="px-6 py-4 font-semibold text-xs text-gray-800 dark:text-slate-100">{row.event}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.severity} /></td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-500 dark:text-slate-400">{row.source}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.status} /></td>
                    </tr>
                )}
            />
        </div>
    );
};
