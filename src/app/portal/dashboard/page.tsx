'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPortalToken, getPortalUser } from '@/lib/portal-auth';

interface DashboardData {
    org: { name: string; industry: string | null; plan: string | null };
    endpoints: number;
    incidents: number;
    vulnerabilities: number;
    riskScore: number;
    recentIncidents: { severity: string; description: string; asset: string; time: string | null }[];
    advisories: { id: number; title: string; severity: string; published_at: string }[];
}

const SEV_BADGE: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High: 'bg-orange-50 text-orange-600 border-orange-200',
    Medium: 'bg-amber-50 text-amber-600 border-amber-200',
    Low: 'bg-blue-50 text-blue-600 border-blue-200',
};

function greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

function formatTime(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString();
}

export default function PortalDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const user = getPortalUser();

    useEffect(() => {
        const token = getPortalToken();
        fetch('/api/portal/dashboard', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
            .then((r) => r.json())
            .then((d) => {
                if (d?.org) setData(d);
                setLastUpdated(new Date().toLocaleTimeString());
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse" />)}</div>;
    }

    if (!data) {
        return <p className="text-sm text-gray-400">Unable to load your dashboard right now. Please try again shortly.</p>;
    }

    const endpointStatus = data.endpoints > 0;
    const threatLevel = data.incidents === 0 ? 'Low' : data.incidents <= 5 ? 'Elevated' : 'High';
    const threatColor = threatLevel === 'Low' ? '🟢' : threatLevel === 'Elevated' ? '🟡' : '🔴';

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-black text-gray-900">{greeting()}, {user?.name ?? 'there'}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500">{data.org.name}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full uppercase">{data.org.plan ?? 'Essential'}</span>
                    </div>
                </div>
                <p className="text-[10px] text-gray-400">Last updated {lastUpdated}</p>
            </div>

            {/* Traffic light row */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Endpoint Protection</p>
                    <p className="text-sm font-black text-gray-800">{endpointStatus ? '🟢 Active' : '🔴 Issues'}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Threat Level</p>
                    <p className="text-sm font-black text-gray-800">{threatColor} {threatLevel}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Compliance</p>
                    <p className="text-sm font-black text-gray-800">🟢 Good</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: 'Protected Endpoints', value: data.endpoints, color: 'text-blue-700' },
                    { label: 'Active Incidents', value: data.incidents, color: 'text-red-600' },
                    { label: 'Vulnerabilities', value: data.vulnerabilities, color: 'text-orange-600' },
                    { label: 'Risk Score', value: `${data.riskScore}/100`, color: 'text-amber-600' },
                ].map((k) => (
                    <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="h-[3px] bg-blue-700 -mt-4 -mx-4 mb-3 rounded-t-xl" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                        <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Incidents */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <p className="text-xs font-black text-gray-800">Recent Incidents</p>
                    <Link href="/portal/incidents" className="text-[11px] font-bold text-blue-700 hover:underline">View All Incidents →</Link>
                </div>
                {data.recentIncidents.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-10">No security incidents detected. Your environment is being monitored.</p>
                ) : (
                    <table className="w-full text-xs">
                        <thead><tr className="border-b border-gray-100">
                            {['Severity', 'Description', 'Asset', 'Time'].map((h) => (
                                <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {data.recentIncidents.map((inc, i) => (
                                <tr key={i} className="border-b border-gray-50">
                                    <td className="px-4 py-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEV_BADGE[inc.severity] ?? SEV_BADGE.Low}`}>{inc.severity}</span></td>
                                    <td className="px-4 py-2 text-gray-700">{inc.description}</td>
                                    <td className="px-4 py-2 font-mono text-gray-500">{inc.asset}</td>
                                    <td className="px-4 py-2 text-gray-400">{formatTime(inc.time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Active Advisories */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <p className="text-xs font-black text-gray-800">Active Advisories</p>
                    <Link href="/portal/advisories" className="text-[11px] font-bold text-blue-700 hover:underline">View All Advisories →</Link>
                </div>
                {data.advisories.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-10">No advisories for your sector currently.</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {data.advisories.map((a) => (
                            <div key={a.id} className="flex items-center justify-between px-4 py-3">
                                <p className="text-xs font-semibold text-gray-800">{a.title}</p>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEV_BADGE[a.severity] ?? SEV_BADGE.Low}`}>{a.severity}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(a.published_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
