'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPortalContext } from '@/lib/portal-context';

interface IncidentKpis {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    avgSla: string;
}

interface RealIncident {
    id: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    name: string;
    asset: string;
    status: string;
    timestamp: string | null;
}

interface Advisory {
    id: number;
    title: string;
    severity: string;
    published_at: string;
}

interface ExternalEntry {
    ip: string;
    count: number;
    verdict: 'Malicious' | 'Suspicious' | 'Unknown';
    country: string;
    port: string;
}

interface InternalEntry {
    ip: string;
    count: number;
    verdict: 'Malicious' | 'Suspicious' | 'Internal';
    network: string;
    port: string;
}

interface NetworkData {
    external: { inbound: ExternalEntry[]; outbound: ExternalEntry[] };
    internal: { inbound: InternalEntry[]; outbound: InternalEntry[] };
    summary: { total_external_inbound: number; total_external_outbound: number; total_internal: number; malicious_detected: number };
}

const sevBadge: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High: 'bg-orange-50 text-orange-600 border-orange-200',
    Medium: 'bg-amber-50 text-amber-600 border-amber-200',
    Low: 'bg-blue-50 text-blue-600 border-blue-200',
};

const verdictEmoji: Record<string, string> = { Malicious: '🔴', Suspicious: '🟡', Unknown: '⚪', Internal: '⚪' };
const verdictColor: Record<string, string> = { Malicious: 'text-red-600', Suspicious: 'text-amber-600', Unknown: 'text-gray-400', Internal: 'text-gray-400' };

function NetworkTable<T extends { ip: string; count: number; verdict: string; port: string }>({
    rows, locationLabel, getLocation, getDirection, emptyText,
}: {
    rows: T[];
    locationLabel: string;
    getLocation: (r: T) => string;
    getDirection: (r: T) => string;
    emptyText: string;
}) {
    if (rows.length === 0) return <p className="text-[11px] text-gray-400 text-center py-6">{emptyText}</p>;
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
                <thead><tr className="border-b border-gray-100">
                    {['IP Address', 'Direction', 'Count', 'Verdict', locationLabel].map(h => (
                        <th key={h} className="text-left py-1.5 pr-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                </tr></thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={`${r.ip}-${i}`} className="border-b border-gray-50">
                            <td className="py-1.5 pr-2 font-mono text-gray-700">{r.ip}</td>
                            <td className="py-1.5 pr-2 text-gray-500 capitalize">{getDirection(r)}</td>
                            <td className="py-1.5 pr-2 text-gray-500">{r.count}</td>
                            <td className={`py-1.5 pr-2 font-bold ${verdictColor[r.verdict] ?? verdictColor.Unknown}`}>{verdictEmoji[r.verdict] ?? verdictEmoji.Unknown} {r.verdict}</td>
                            <td className="py-1.5 pr-2 text-gray-400">{getLocation(r)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function timeAgo(iso: string | null): string {
    if (!iso) return '—';
    const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 60) return mins <= 1 ? 'Just now' : `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
}

function CopyBlock({ label, command }: { label: string; command: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(command).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <button onClick={copy} className="text-[10px] font-bold text-blue-700 hover:underline">{copied ? 'Copied ✓' : 'Copy Command'}</button>
            </div>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-[10px] text-emerald-400 break-all">{command}</div>
        </div>
    );
}

export const PortalDashboard = () => {
    const portal = getPortalContext();
    const orgSlug = (portal.orgName ?? 'client').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const wazuhGroup = portal.wazuhGroup ?? 'default';

    const [agents, setAgents] = useState<{ active: number; total: number } | null>(null);
    const [kpis, setKpis] = useState<IncidentKpis | null>(null);
    const [incidents, setIncidents] = useState<RealIncident[]>([]);
    const [advisories, setAdvisories] = useState<Advisory[]>([]);
    const [threatsBlocked, setThreatsBlocked] = useState<number | null>(null);
    const [network, setNetwork] = useState<NetworkData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const group = portal.wazuhGroup;
        const groupParam = group ? `?group=${encodeURIComponent(group)}` : '';
        Promise.allSettled([
            fetch(`/api/wazuh/agents${groupParam}`, { cache: 'no-store' }).then(r => r.json()),
            fetch(`/api/wazuh/incidents${groupParam}`, { cache: 'no-store' }).then(r => r.json()),
            fetch(`/api/wazuh/threats-blocked${groupParam}`, { cache: 'no-store' }).then(r => r.json()),
            fetch(`/api/advisories${portal.orgIndustry ? `?industry=${encodeURIComponent(portal.orgIndustry)}` : ''}`, { cache: 'no-store' }).then(r => r.json()),
            fetch(`/api/wazuh/network-connections${groupParam}`, { cache: 'no-store' }).then(r => r.json()),
        ]).then(([agentsRes, incidentsRes, threatsRes, advisoriesRes, networkRes]) => {
            if (agentsRes.status === 'fulfilled') {
                const conn = agentsRes.value?.data?.connection;
                if (conn) setAgents({ active: conn.active, total: conn.total });
            }
            if (incidentsRes.status === 'fulfilled') {
                if (Array.isArray(incidentsRes.value?.incidents)) setIncidents(incidentsRes.value.incidents.slice(0, 5));
                if (incidentsRes.value?.kpis) setKpis(incidentsRes.value.kpis);
            }
            if (threatsRes.status === 'fulfilled' && typeof threatsRes.value?.threats_blocked === 'number') {
                setThreatsBlocked(threatsRes.value.threats_blocked);
            }
            if (advisoriesRes.status === 'fulfilled' && Array.isArray(advisoriesRes.value?.advisories)) {
                setAdvisories(advisoriesRes.value.advisories.slice(0, 3));
            }
            if (networkRes.status === 'fulfilled' && networkRes.value?.external) {
                setNetwork(networkRes.value);
            }
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasAgents = (agents?.total ?? 0) > 0;
    const threatLevel = kpis ? (kpis.total === 0 ? 'Low' : kpis.total <= 5 ? 'Elevated' : 'High') : null;

    const kpiCards = [
        { label: 'Protected Endpoints', value: loading ? '...' : String(agents?.total ?? 0), color: 'text-blue-700', sub: undefined as string | undefined },
        { label: 'Active Incidents (24h)', value: loading ? '...' : String(kpis?.total ?? 0), color: 'text-orange-600', sub: undefined as string | undefined },
        { label: 'High Severity', value: loading ? '...' : String(kpis?.high ?? 0), color: 'text-red-600', sub: undefined as string | undefined },
        {
            label: 'Threats Blocked',
            value: threatsBlocked !== null ? `${threatsBlocked.toLocaleString()} threats blocked` : '...',
            color: 'text-violet-600',
            sub: 'Last 30 days, your endpoints only',
        },
    ];

    const windowsCmd = `Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.12.0-1.msi -OutFile wazuh-agent.msi; msiexec /i wazuh-agent.msi /q WAZUH_MANAGER="164.92.203.205" WAZUH_AGENT_GROUP="${wazuhGroup}" WAZUH_AGENT_NAME="${orgSlug}-endpoint-01"`;
    const linuxCmd = `WAZUH_MANAGER="164.92.203.205" WAZUH_AGENT_GROUP="${wazuhGroup}" WAZUH_AGENT_NAME="${orgSlug}-endpoint-01" apt-get install wazuh-agent`;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-lg font-black text-gray-900">Welcome, {portal.orgName}</h1>
                <p className="text-xs text-gray-400">Your security overview, powered by Cybernovr NovrSOC</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiCards.map(k => (
                    <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                        <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                        {k.sub && <p className="text-[10px] text-gray-400 mt-1">{k.sub}</p>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-xl">{hasAgents ? '🟢' : '🔴'}</span>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Endpoint Protection</p>
                        <p className="text-xs font-black text-gray-800">{hasAgents ? 'Active' : 'Deploy Agent'}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-xl">{threatLevel === 'High' ? '🔴' : threatLevel === 'Elevated' ? '🟡' : '🟢'}</span>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Threat Level</p>
                        <p className="text-xs font-black text-gray-800">{threatLevel ?? '...'}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-xl">🟢</span>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Intelligence Feed</p>
                        <p className="text-xs font-black text-gray-800">Active</p>
                    </div>
                </div>
            </div>

            {!loading && !hasAgents && (
                <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-6">
                        <h3 className="text-sm font-black text-gray-900 mb-1">Start Monitoring Your Environment</h3>
                        <p className="text-xs text-gray-500 mb-4">Install the Cybernovr security agent on your endpoints to begin real-time monitoring.</p>
                        <div className="space-y-3">
                            <CopyBlock label="Windows" command={windowsCmd} />
                            <CopyBlock label="Linux" command={linuxCmd} />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                <div className="p-4">
                    <p className="text-xs font-black text-gray-800">Network Activity</p>
                    <p className="text-[10px] text-gray-400">Last 24 hours</p>
                </div>
                {loading ? (
                    <div className="p-6 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
                ) : !network ||
                  (network.external.inbound.length === 0 &&
                    network.external.outbound.length === 0 &&
                    network.internal.inbound.length === 0 &&
                    network.internal.outbound.length === 0) ? (
                    <div className="py-10 px-6 text-center">
                        <p className="text-xs text-gray-500 font-semibold mb-1">No network connection data yet.</p>
                        <p className="text-[11px] text-gray-400 max-w-md mx-auto">
                            Network monitoring activates once the Wazuh agent is configured with network audit rules.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-100">
                        <div className="p-4 md:border-r border-b border-gray-100">
                            <p className="text-xs font-black text-gray-800">⬇️ Inbound External</p>
                            <p className="text-[10px] text-gray-400 mb-3">Public IPs connecting to your endpoints</p>
                            <NetworkTable
                                rows={network.external.inbound}
                                locationLabel="Country"
                                getLocation={(r) => r.country}
                                getDirection={() => 'Inbound'}
                                emptyText="No external inbound connections detected in the last 24 hours."
                            />
                        </div>
                        <div className="p-4 border-b border-gray-100">
                            <p className="text-xs font-black text-gray-800">⬆️ Outbound External</p>
                            <p className="text-[10px] text-gray-400 mb-3">Your endpoints connecting to the internet</p>
                            <NetworkTable
                                rows={network.external.outbound}
                                locationLabel="Country"
                                getLocation={(r) => r.country}
                                getDirection={() => 'Outbound'}
                                emptyText="No external outbound connections detected in the last 24 hours."
                            />
                        </div>
                        <div className="p-4 md:border-r border-gray-100">
                            <p className="text-xs font-black text-gray-800">🔄 Internal Connections</p>
                            <p className="text-[10px] text-gray-400 mb-3">LAN traffic on your network</p>
                            <NetworkTable
                                rows={[
                                    ...network.internal.inbound.map(r => ({ ...r, direction: 'inbound' as const })),
                                    ...network.internal.outbound.map(r => ({ ...r, direction: 'outbound' as const })),
                                ]}
                                locationLabel="Network"
                                getLocation={(r) => r.network}
                                getDirection={(r) => r.direction}
                                emptyText="No internal connections detected in the last 24 hours."
                            />
                        </div>
                        <div className="p-4">
                            <p className="text-xs font-black text-gray-800">📊 Summary</p>
                            <p className="text-[10px] text-gray-400 mb-3">Last 24 hours</p>
                            <div className="space-y-2">
                                {[
                                    { label: 'External Inbound', value: network.summary.total_external_inbound },
                                    { label: 'External Outbound', value: network.summary.total_external_outbound },
                                    { label: 'Internal Connections', value: network.summary.total_internal },
                                ].map(s => (
                                    <div key={s.label} className="flex items-center justify-between text-[11px]">
                                        <span className="text-gray-500">{s.label}</span>
                                        <span className="font-bold text-gray-800">{s.value.toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-100">
                                    <span className="text-gray-500">Known Malicious IPs</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${network.summary.malicious_detected > 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}>
                                        {network.summary.malicious_detected}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                <div className="p-4 flex items-center justify-between">
                    <p className="text-xs font-black text-gray-800">Recent Incidents</p>
                    <Link href="/security-operations/incidents" className="text-[10px] font-bold text-blue-700 hover:underline">View All →</Link>
                </div>
                {loading ? (
                    <div className="p-6 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
                ) : incidents.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8">No incidents detected</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b border-gray-100">
                                {['Severity', 'Incident Name', 'Asset', 'Status', 'Detected'].map(h => (
                                    <th key={h} className="text-left px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr></thead>
                            <tbody>
                                {incidents.map(inc => (
                                    <tr key={inc.id} className="border-b border-gray-50">
                                        <td className="px-4 py-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sevBadge[inc.severity]}`}>{inc.severity}</span></td>
                                        <td className="px-4 py-2 font-semibold text-gray-800">{inc.name}</td>
                                        <td className="px-4 py-2 font-mono text-gray-600">{inc.asset}</td>
                                        <td className="px-4 py-2 text-gray-500">{inc.status}</td>
                                        <td className="px-4 py-2 text-gray-400">{timeAgo(inc.timestamp)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                <div className="p-4 flex items-center justify-between">
                    <p className="text-xs font-black text-gray-800">Recent Advisories</p>
                    <Link href="/threat-intelligence/advisory" className="text-[10px] font-bold text-blue-700 hover:underline">View All →</Link>
                </div>
                {loading ? (
                    <div className="p-6 space-y-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
                ) : advisories.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8">No advisories published yet.</p>
                ) : (
                    <div className="p-4 pt-0 space-y-2">
                        {advisories.map(a => (
                            <div key={a.id} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${sevBadge[a.severity] ?? sevBadge.Medium}`}>{a.severity}</span>
                                <p className="text-xs font-semibold text-gray-800 truncate flex-1">{a.title}</p>
                                <span className="text-[10px] text-gray-400 flex-shrink-0">{timeAgo(a.published_at)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
