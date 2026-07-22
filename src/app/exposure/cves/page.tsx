'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { getPortalContext } from '@/lib/portal-context';

type CVE = {
    id: string; cvss: number; severity: string; description: string;
    isKev: boolean; ransomware: boolean; published: string; score: number;
};

const CVES: CVE[] = [
    { id: 'CVE-2024-3400',  cvss: 10.0, severity: 'Critical', description: 'PAN-OS Command Injection (GlobalProtect)',        isKev: true,  ransomware: true,  published: 'Mar 2024', score: 100 },
    { id: 'CVE-2024-1709',  cvss: 10.0, severity: 'Critical', description: 'ConnectWise ScreenConnect Authentication Bypass', isKev: true,  ransomware: true,  published: 'Feb 2024', score: 97  },
    { id: 'CVE-2021-44228', cvss: 10.0, severity: 'Critical', description: 'Log4Shell — Apache Log4j RCE',                   isKev: true,  ransomware: true,  published: 'Dec 2021', score: 95  },
    { id: 'CVE-2023-34362', cvss: 9.8,  severity: 'Critical', description: 'MOVEit Transfer SQL Injection',                  isKev: true,  ransomware: true,  published: 'Jun 2023', score: 95  },
    { id: 'CVE-2023-20198', cvss: 10.0, severity: 'Critical', description: 'Cisco IOS XE Web UI Privilege Escalation',       isKev: true,  ransomware: false, published: 'Oct 2023', score: 95  },
    { id: 'CVE-2024-21887', cvss: 9.8,  severity: 'Critical', description: 'Ivanti Connect Secure Command Injection',        isKev: true,  ransomware: false, published: 'Jan 2024', score: 94  },
    { id: 'CVE-2024-21762', cvss: 9.8,  severity: 'Critical', description: 'FortiOS SSL VPN Out-of-Bounds Write',            isKev: true,  ransomware: false, published: 'Feb 2024', score: 94  },
    { id: 'CVE-2022-22965', cvss: 9.8,  severity: 'Critical', description: 'Spring4Shell — Spring Framework RCE',            isKev: true,  ransomware: true,  published: 'Mar 2022', score: 91  },
    { id: 'CVE-2024-4577',  cvss: 9.8,  severity: 'Critical', description: 'PHP CGI Argument Injection RCE',                 isKev: true,  ransomware: false, published: 'Jun 2024', score: 91  },
    { id: 'CVE-2019-3396',  cvss: 9.8,  severity: 'Critical', description: 'Atlassian Confluence Server SSTI',               isKev: true,  ransomware: true,  published: 'Mar 2019', score: 89  },
    { id: 'CVE-2023-46805', cvss: 8.2,  severity: 'High',     description: 'Ivanti ICS/IPS Authentication Bypass',           isKev: true,  ransomware: false, published: 'Oct 2023', score: 88  },
    { id: 'CVE-2024-27198', cvss: 9.8,  severity: 'Critical', description: 'JetBrains TeamCity Auth Bypass & RCE',           isKev: false, ransomware: false, published: 'Mar 2024', score: 76  },
    { id: 'CVE-2023-44487', cvss: 7.5,  severity: 'High',     description: 'HTTP/2 Rapid Reset DDoS Attack',                 isKev: true,  ransomware: false, published: 'Oct 2023', score: 72  },
    { id: 'CVE-2024-6387',  cvss: 8.1,  severity: 'High',     description: 'OpenSSH regreSSHion Race Condition RCE',         isKev: false, ransomware: false, published: 'Jul 2024', score: 69  },
    { id: 'CVE-2024-30051', cvss: 7.8,  severity: 'High',     description: 'Windows DWM Core Library Privilege Escalation',  isKev: true,  ransomware: false, published: 'May 2024', score: 63  },
];

const SEV_COLOR: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High:     'bg-orange-50 text-orange-600 border-orange-200',
    Medium:   'bg-amber-50 text-amber-600 border-amber-200',
};

type WazuhVuln = {
    cve: string; title: string; severity: string; cvss_score: number | null;
    package: string; version: string; agent: string; status: string;
};

type WazuhVulnSummary = { critical: number; high: number; medium: number; low: number; total: number };

const WAZUH_SEV_COLOR: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High:     'bg-orange-50 text-orange-600 border-orange-200',
    Medium:   'bg-amber-50 text-amber-600 border-amber-200',
    Low:      'bg-gray-100 text-gray-500 border-gray-200',
};

function scoreColor(s: number) {
    if (s >= 80) return 'text-red-600 font-black';
    if (s >= 60) return 'text-orange-600 font-bold';
    return 'text-slate-600 font-bold';
}

export default function CVETrackerPage() {
    const [sevFilter, setSevFilter] = useState('All');
    const [kevFilter, setKevFilter] = useState('All');
    const [search, setSearch] = useState('');

    const [wazuhVulns, setWazuhVulns] = useState<WazuhVuln[] | null>(null);
    const [wazuhSummary, setWazuhSummary] = useState<WazuhVulnSummary | null>(null);

    useEffect(() => {
        const group = getPortalContext().wazuhGroup;
        fetch(`/api/wazuh/vulnerabilities${group ? `?group=${encodeURIComponent(group)}` : ''}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                setWazuhVulns(Array.isArray(data?.vulnerabilities) ? data.vulnerabilities : []);
                setWazuhSummary(data?.summary ?? null);
            })
            .catch(() => {
                setWazuhVulns([]);
                setWazuhSummary(null);
            });
    }, []);

    const filtered = CVES.filter(c => {
        const q = search.toLowerCase();
        const matchQ = !q || c.id.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
        const matchSev = sevFilter === 'All' || c.severity === sevFilter;
        const matchKev = kevFilter === 'All' || (kevFilter === 'KEV Only' && c.isKev);
        return matchQ && matchSev && matchKev;
    });

    return (
        <PageLayout title="CVE Tracker">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Vulnerabilities Detected on Your Endpoints</h1>
                    <p className="text-xs text-gray-400">Live vulnerability scan results from Wazuh agents on monitored machines</p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: 'Critical',        value: wazuhSummary ? wazuhSummary.critical.toLocaleString() : '...', color: 'text-red-600' },
                        { label: 'High',             value: wazuhSummary ? wazuhSummary.high.toLocaleString() : '...',     color: 'text-orange-600' },
                        { label: 'Medium',           value: wazuhSummary ? wazuhSummary.medium.toLocaleString() : '...',   color: 'text-amber-600' },
                        { label: 'Total Detected',   value: wazuhSummary ? wazuhSummary.total.toLocaleString() : '...',    color: 'text-blue-700' },
                    ].map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    {wazuhVulns !== null && wazuhVulns.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-xs font-semibold text-gray-500">No vulnerabilities detected on monitored endpoints.</p>
                            <p className="text-[11px] text-gray-400 mt-1">Vulnerability scanning runs automatically on all connected agents.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        {['CVE ID', 'Title', 'Severity', 'CVSS Score', 'Affected Package', 'Agent', 'Status'].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(wazuhVulns ?? []).map((v, i) => (
                                        <tr key={`${v.cve}-${i}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">{v.cve || '—'}</td>
                                            <td className="px-4 py-3 text-gray-700 max-w-[320px] truncate" title={v.title}>{v.title || '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${WAZUH_SEV_COLOR[v.severity] ?? WAZUH_SEV_COLOR.Low}`}>{v.severity || 'Unknown'}</span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-gray-800">{v.cvss_score != null ? v.cvss_score.toFixed(1) : '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{v.package ? `${v.package} ${v.version}` : '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{v.agent || '—'}</td>
                                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{v.status || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <h2 className="text-lg font-black text-gray-900">CVE Tracker</h2>
                    <p className="text-xs text-gray-400">Exposure Monitoring · Global CTIP CVE database with Cybernovr Risk Scoring</p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: 'Total CVEs Tracked',    value: '1,631', color: 'text-blue-700' },
                        { label: 'KEV Listed',            value: '287',   color: 'text-red-600' },
                        { label: 'Critical',              value: '156',   color: 'text-red-600' },
                        { label: 'Exploitable This Week', value: '12',    color: 'text-orange-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by CVE ID or description…"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 w-64" />
                    <select value={sevFilter} onChange={e => setSevFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none">
                        {['All', 'Critical', 'High', 'Medium'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <select value={kevFilter} onChange={e => setKevFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none">
                        {['All', 'KEV Only'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <span className="ml-auto text-[10px] text-gray-400">{filtered.length} CVEs</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['CVE ID', 'CVSS', 'Severity', 'Description', 'KEV', 'Ransomware', 'Published', 'Cybernovr Score', 'Action'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(cve => (
                                    <tr key={cve.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">{cve.id}</td>
                                        <td className="px-4 py-3 font-bold text-gray-800">{cve.cvss.toFixed(1)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEV_COLOR[cve.severity] ?? ''}`}>{cve.severity}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 max-w-[280px]">{cve.description}</td>
                                        <td className="px-4 py-3">
                                            {cve.isKev && <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">KEV</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            {cve.ransomware && <span className="text-[9px] font-bold px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded">Ransomware</span>}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{cve.published}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-sm ${scoreColor(cve.score)}`}>{cve.score}</span>
                                            <span className="text-[9px] text-gray-400">/100</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-[10px] font-bold text-blue-700 hover:underline whitespace-nowrap">View Details</button>
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
