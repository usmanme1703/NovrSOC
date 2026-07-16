'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Monitor, AlertTriangle, AlertOctagon, Clock, Activity, Building2, Users, Server } from 'lucide-react';
import { KpiCard, type KpiCardProps } from '../shared/KpiCard';
import { ChartWrapper } from '../shared/ChartWrapper';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { GaugeChart } from '../shared/GaugeChart';
import { generalActivityLog } from '@/data/mockData';
import { FRAMEWORKS } from '@/lib/mock/compliance';
import { getPortalContext } from '@/lib/portal-context';

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
interface CtipCountry { country: string; name: string; count: number; flag: string }
const NIGERIA_X = 500, NIGERIA_Y = 240;

const THREAT_VECTORS_FALLBACK: { label: string; pct: number; color: string }[] = [
    { label: 'Malware Activity', pct: 42, color: '#dc2626' },
    { label: 'Phishing Infrastructure', pct: 28, color: '#7c3aed' },
    { label: 'Ransomware Probing', pct: 18, color: '#ea580c' },
];

// Approximate positions on the 900x380 viewBox, matched to the continent silhouettes below.
const COUNTRY_COORDS: Record<string, { x: number; y: number }> = {
    CN: { x: 740, y: 140 }, RU: { x: 660, y: 75 }, US: { x: 140, y: 140 },
    BR: { x: 220, y: 300 }, IN: { x: 660, y: 190 }, DE: { x: 480, y: 95 },
    NL: { x: 465, y: 90 }, FR: { x: 465, y: 115 }, GB: { x: 455, y: 85 }, UA: { x: 525, y: 100 },
};
const ARC_COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#7c3aed', '#2563eb'];
const ARC_DASHES = ['6 4', '4 3', '8 3', '5 5', '3 6'];

const GlobalThreatMap = ({ ctipStats, countries }: {
    ctipStats: { total_iocs: number } | null;
    countries: CtipCountry[] | null;
}) => {
    const [timeRange, setTimeRange] = useState('Last 24hr');
    const attackOrigins: AttackOrigin[] = (countries ?? []).map((c, i) => {
        const coord = COUNTRY_COORDS[c.country] ?? { x: 500, y: 60 };
        return {
            country: `${c.flag} ${c.name}`,
            x: coord.x,
            y: coord.y,
            count: c.count.toLocaleString(),
            label: 'IOC Source',
            color: ARC_COLORS[i % ARC_COLORS.length],
            dashed: ARC_DASHES[i % ARC_DASHES.length],
        };
    });
    return (
        <Card>
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <SectionHeader title="Global Threat Map: Live Attack Activity" />
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

/* ── 1B: Nigeria Threat Activity ── */
interface FeedAdvisory { id: number; title: string; severity: string; published_at: string }
const sevColor = (s: string) => s === 'Critical' ? '#dc2626' : s === 'High' ? '#ea580c' : s === 'Medium' ? '#ca8a04' : '#2563eb';

function feedTimeAgo(iso: string): string {
    const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 60) return mins <= 1 ? 'Just now' : `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
}

const NigeriaThreatMap = ({ advisories }: { advisories: FeedAdvisory[] | null }) => {
    const feed = (advisories ?? []).slice(0, 3);
    return (
        <Card>
            <div className="p-4">
                <div className="mb-3">
                    <SectionHeader title="Nigeria National Threat Activity" />
                    <p className="text-[10px] text-slate-500">Regional threat activity across Nigeria</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f8fafc] rounded-lg p-3 border border-slate-200 relative">
                        <svg viewBox="0 0 300 300" className="w-full h-[180px]">
                            <path d="M 60 60 L 240 60 L 250 80 L 240 180 L 220 240 L 180 280 L 150 290 L 120 280 L 80 240 L 50 180 L 40 100 Z"
                                fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1.5" />
                        </svg>
                        <p className="text-[9px] text-slate-400 text-center mt-1">Regional threat data populates as Nigerian clients are onboarded</p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nigerian Threat Feed</p>
                        {feed.length === 0 ? (
                            <div className="py-6 text-center">
                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                    No advisories published yet.<br />Use the Threat Advisory page to publish your first advisory.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {feed.map(f => (
                                    <div key={f.id} className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sevColor(f.severity) }} />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] text-slate-800 font-semibold truncate">{f.title}</p>
                                            <p className="text-[8px] text-slate-500">Cybernovr Intelligence · {feedTimeAgo(f.published_at)}</p>
                                        </div>
                                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ color: sevColor(f.severity), backgroundColor: `${sevColor(f.severity)}15` }}>{f.severity}</span>
                                    </div>
                                ))}
                            </div>
                        )}
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

/* ── 1E: Onboarded Clients ── */
interface OnboardedClient { id: number; name: string; industry: string | null; status: string; agentsTotal: number; activeIncidents: number; wazuhGroup: string | null }
interface ClientLiveData { endpoints: number; incidents: number }

function clientStatusBadge(orgStatus: string, endpoints: number): { label: string; classes: string } {
    if (orgStatus !== 'active') return { label: 'Inactive', classes: 'text-slate-500 bg-slate-100 border-slate-200' };
    if (endpoints > 0) return { label: 'Active', classes: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    return { label: 'Pending', classes: 'text-amber-600 bg-amber-50 border-amber-200' };
}

const OnboardedClientsWidget = ({ clients, loading }: { clients: OnboardedClient[] | null; loading: boolean }) => {
    const rows = (clients ?? []).slice(0, 5);
    const [liveData, setLiveData] = useState<Record<number, ClientLiveData>>({});

    useEffect(() => {
        if (!clients || clients.length === 0) return;
        const fetchGroup = async (group: string | null) => {
            const [agentsRes, incidentsRes] = await Promise.all([
                fetch(`/api/wazuh/agents${group ? `?group=${encodeURIComponent(group)}` : ''}`, { cache: 'no-store' }).then(r => r.json()).catch(() => null),
                fetch(`/api/wazuh/incidents${group ? `?group=${encodeURIComponent(group)}` : ''}`, { cache: 'no-store' }).then(r => r.json()).catch(() => null),
            ]);
            return {
                endpoints: typeof agentsRes?.total === 'number' ? agentsRes.total : 0,
                incidents: typeof incidentsRes?.kpis?.total === 'number' ? incidentsRes.kpis.total : 0,
            };
        };
        clients.forEach(async (c) => {
            let result = await fetchGroup(c.wazuhGroup);
            // A client's own wazuh_group may not have any registered agents yet
            // (e.g. mid-onboarding) — fall back to 'default' so real data still shows.
            if (result.endpoints === 0 && c.wazuhGroup && c.wazuhGroup !== 'default') {
                result = await fetchGroup('default');
            }
            setLiveData(prev => ({ ...prev, [c.id]: result }));
        });
    }, [clients]);

    return (
        <Card>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <SectionHeader title="Onboarded Clients" badge={clients ? `${clients.length} ${clients.length === 1 ? 'Client' : 'Clients'}` : undefined} />
                        <p className="text-[10px] text-slate-500">Client portfolio and monitoring status</p>
                    </div>
                    <Link href="/customers" className="text-[10px] font-semibold text-blue-700 hover:underline">View All →</Link>
                </div>
                {loading ? (
                    <div className="space-y-2 py-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-6 bg-slate-100 rounded animate-pulse" />)}</div>
                ) : rows.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-[11px] text-slate-400 mb-3">No clients onboarded yet. Go to Customers to add your first client.</p>
                        <Link href="/customers" className="inline-block text-[10px] font-bold px-3 py-1.5 bg-[#1d4ed8] text-white rounded-lg hover:bg-[#1e40af] transition-colors">Onboard First Client</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    {['Client Name', 'Industry', 'Endpoints', 'Incidents (24h)', 'Status'].map(h => (
                                        <th key={h} className="text-left py-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(c => {
                                    const live = liveData[c.id];
                                    const endpoints = live?.endpoints ?? c.agentsTotal;
                                    const incidents = live?.incidents ?? c.activeIncidents;
                                    const badge = clientStatusBadge(c.status, endpoints);
                                    return (
                                        <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-2 px-3 font-semibold text-slate-800">{c.name === 'Cybernovr' ? '🛡️' : '🏢'} {c.name}</td>
                                            <td className="py-2 px-3 text-slate-500">{c.industry ?? '—'}</td>
                                            <td className="py-2 px-3 text-slate-500">{endpoints.toLocaleString()}</td>
                                            <td className="py-2 px-3 font-bold text-slate-700">{incidents}</td>
                                            <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.classes}`}>{badge.label}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Card>
    );
};

/* ── Main ── */
export const GeneralDashboard = () => {
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
        const group = getPortalContext().wazuhGroup;
        fetch(`/api/wazuh/agents${group ? `?group=${encodeURIComponent(group)}` : ''}`, { cache: 'no-store' })
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
        const group = getPortalContext().wazuhGroup;
        fetch(`/api/wazuh/alerts-indexer${group ? `?group=${encodeURIComponent(group)}` : ''}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const hits = data?.hits;
                if (Array.isArray(hits)) {
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
                } else {
                    setWazuhAlerts([]);
                }
                if (typeof data?.criticalCount === 'number') setCriticalAlertsCount(data.criticalCount);
                if (typeof data?.openIncidentsCount === 'number') setOpenIncidentsCount(data.openIncidentsCount);
            })
            .catch(() => setWazuhAlerts([]));
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

    const [ctipCountries, setCtipCountries] = useState<CtipCountry[] | null>(null);

    useEffect(() => {
        fetch('/api/ctip/countries', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => setCtipCountries(Array.isArray(data) ? data : []))
            .catch(() => setCtipCountries([]));
    }, []);

    const [nigeriaAdvisories, setNigeriaAdvisories] = useState<FeedAdvisory[] | null>(null);

    useEffect(() => {
        fetch('/api/advisories', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => setNigeriaAdvisories(Array.isArray(data?.advisories) ? data.advisories : []))
            .catch(() => setNigeriaAdvisories([]));
    }, []);

    const [clients, setClients] = useState<OnboardedClient[] | null>(null);
    const [clientsLoading, setClientsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/customers', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => setClients(Array.isArray(data?.customers) ? data.customers : []))
            .catch(() => setClients([]))
            .finally(() => setClientsLoading(false));
    }, []);

    const [vendorRisk, setVendorRisk] = useState<{ label: string; avg: number } | null>(null);

    useEffect(() => {
        fetch('/api/vendor-assessments', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const assessments = Array.isArray(data?.assessments) ? data.assessments : [];
                const scored = assessments.filter((a: { risk_score: number | null }) => typeof a.risk_score === 'number');
                if (scored.length === 0) { setVendorRisk(null); return; }
                const avg = scored.reduce((s: number, a: { risk_score: number }) => s + a.risk_score, 0) / scored.length;
                const label = avg >= 75 ? 'High' : avg >= 50 ? 'Medium' : 'Low';
                setVendorRisk({ label, avg: Math.round(avg) });
            })
            .catch(() => setVendorRisk(null));
    }, []);

    const trendBars = trendData
        ? (() => {
            const maxAlerts = Math.max(...trendData.map(d => d.alerts), 1);
            return trendData.map(d => ({ heightPct: Math.max(4, Math.round((d.alerts / maxAlerts) * 100)), label: d.week }));
        })()
        : [40, 55, 30, 85, 42, 60, 70, 95, 45, 60, 80, 100].map((val, i) => ({ heightPct: val, label: `W${i + 1}` }));

    const hasClients = (clients?.length ?? 0) > 0;
    const critical = criticalAlertsCount ?? 0;
    const openTotal = openIncidentsCount ?? 0;
    const riskScoreValue = !hasClients ? 0 : Math.min(100, critical * 10 + openTotal * 2);
    const platformOperational = wazuhAgents !== null && ctipStats !== null;

    const kpiCards: KpiCardProps[] = [
        {
            label: 'Total Assets',
            value: wazuhAgents ? wazuhAgents.total.toLocaleString() : '...',
            trend: '',
            type: 'blue',
            icon: Monitor,
        },
        {
            label: 'Active Incidents',
            value: openIncidentsCount !== null ? String(openIncidentsCount) : '...',
            trend: '',
            type: 'orange',
            icon: AlertTriangle,
        },
        {
            label: 'Critical Alerts',
            value: criticalAlertsCount !== null ? String(criticalAlertsCount) : '...',
            trend: '',
            type: 'red',
            icon: AlertOctagon,
        },
        {
            label: 'Open Incidents',
            value: openIncidentsCount !== null ? String(openIncidentsCount) : '...',
            trend: '',
            type: 'orange',
            icon: Clock,
        },
        {
            label: 'Risk Score',
            value: `${riskScoreValue}/100`,
            trend: '',
            type: 'blue',
            icon: Activity,
        },
        {
            label: 'Vendor Risk',
            value: vendorRisk ? vendorRisk.label : 'No Data',
            trend: '',
            type: 'purple',
            icon: Building2,
        },
        {
            label: 'Clients Protected',
            value: clients ? String(clients.length) : '...',
            trend: '',
            type: 'blue',
            icon: Users,
        },
        {
            label: 'Platform Health',
            value: platformOperational ? 'Operational' : 'Degraded',
            trend: '',
            type: platformOperational ? 'blue' : 'red',
            icon: Server,
            subValue: ctipStats ? `${ctipStats.sources_active} sources active` : undefined,
        },
    ];

    return (
        <div className="space-y-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider -mb-2">Aggregated across all onboarded clients</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiCards.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>

            <GlobalThreatMap ctipStats={ctipStats} countries={ctipCountries} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <NigeriaThreatMap advisories={nigeriaAdvisories} />
                <ComplianceSnapshot />
            </div>

            <OnboardedClientsWidget clients={clients} loading={clientsLoading} />

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

            {wazuhAlerts !== null && wazuhAlerts.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 text-center">
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        No recent high-severity activity. Onboard clients to begin monitoring their environments.
                    </p>
                </div>
            ) : (
                <DataTable
                    title="Real-Time Global Activity Feed"
                    columns={['Time', 'Telemetry Event Details', 'Severity', 'Ingestion Source', 'Status']}
                    data={wazuhAlerts ?? []}
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
            )}
        </div>
    );
};
