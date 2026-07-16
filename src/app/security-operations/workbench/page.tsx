'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

const ALERTS = [
    { id: 'ALT-001', sev: 'Critical', name: 'Mimikatz execution detected', source: 'EDR-Agent', asset: 'WORKSTATION-042', mitre: 'T1003', time: '14:22:01', status: 'New' },
    { id: 'ALT-002', sev: 'Critical', name: 'Ransomware file encryption started', source: 'EDR-Agent', asset: 'WORKSTATION-017', mitre: 'T1486', time: '14:18:44', status: 'New' },
    { id: 'ALT-003', sev: 'High', name: 'PowerShell encoded command', source: 'Wazuh', asset: 'PROD-SERVER-03', mitre: 'T1059.001', time: '14:15:22', status: 'Assigned' },
    { id: 'ALT-004', sev: 'High', name: 'Abnormal admin login — off-hours', source: 'SIEM', asset: 'DOMAIN-CTRL-01', mitre: 'T1078', time: '13:50:10', status: 'Investigating' },
    { id: 'ALT-005', sev: 'High', name: 'Credential dump via LSASS', source: 'EDR-Agent', asset: 'WORKSTATION-042', mitre: 'T1003.001', time: '14:11:03', status: 'Investigating' },
    { id: 'ALT-006', sev: 'Medium', name: 'DNS DGA query detected', source: 'DNS-Monitor', asset: 'WORKSTATION-019', mitre: 'T1568', time: '06:50:22', status: 'New' },
    { id: 'ALT-007', sev: 'Medium', name: 'Suspicious outbound connection', source: 'Network-Monitor', asset: 'PROD-SERVER-03', mitre: 'T1041', time: '11:02:44', status: 'New' },
    { id: 'ALT-008', sev: 'High', name: 'Pass-the-hash lateral movement', source: 'SIEM', asset: 'WORKSTATION-023', mitre: 'T1550.002', time: '13:10:15', status: 'Investigating' },
    { id: 'ALT-009', sev: 'Critical', name: 'BEC email — suspicious wire request', source: 'Email-Gateway', asset: 'MAIL-SERVER-01', mitre: 'T1566.002', time: '13:45:00', status: 'Escalated' },
    { id: 'ALT-010', sev: 'Medium', name: 'Internal port scan detected', source: 'Wazuh', asset: 'WORKSTATION-008', mitre: 'T1046', time: '08:45:11', status: 'New' },
    { id: 'ALT-011', sev: 'High', name: 'Brute force on VPN', source: 'VPN-Gateway', asset: 'VPN-GATEWAY', mitre: 'T1078', time: '07:21:00', status: 'Open' },
    { id: 'ALT-012', sev: 'Low', name: 'Backup job failure', source: 'Backup-Agent', asset: 'BACKUP-SERVER-01', mitre: 'N/A', time: '03:00:00', status: 'Resolved' },
];

const CASES = [
    { id: 'CAS-2026-0041', title: 'Ransomware Investigation — WS042', priority: 'P1', analyst: 'Amaka Obi', alerts: 3, status: 'Investigating', created: 'Today 14:12' },
    { id: 'CAS-2026-0040', title: 'BEC Attack — Finance', priority: 'P1', analyst: 'Chidi Nwosu', alerts: 5, status: 'Escalated', created: 'Today 13:47' },
    { id: 'CAS-2026-0039', title: 'Brute Force Campaign', priority: 'P2', analyst: 'Tunde Adeyemi', alerts: 8, status: 'Investigating', created: 'Today 07:22' },
];

const TIMELINE = [
    { time: '14:10:22', type: '⚡', event: 'Suspicious process spawned', detail: 'cmd.exe → powershell.exe', asset: 'WORKSTATION-042' },
    { time: '14:10:45', type: '💻', event: 'Encoded PowerShell command executed', detail: 'Base64 encoded payload detected', asset: 'WORKSTATION-042' },
    { time: '14:11:03', type: '🔑', event: 'Credential dump attempt (LSASS)', detail: 'Mimikatz tool signature detected', asset: 'WORKSTATION-042' },
    { time: '14:11:18', type: '🔀', event: 'Lateral movement attempt', detail: 'SMB connection to DOMAIN-CTRL-01', asset: 'Network' },
    { time: '14:11:35', type: '☣️', event: 'Ransomware binary dropped', detail: 'invoice_Q2.exe created in %TEMP%', asset: 'WORKSTATION-042' },
    { time: '14:11:41', type: '🔒', event: 'File encryption started', detail: '847 files affected in C:\\Users\\', asset: 'WORKSTATION-042' },
    { time: '14:11:49', type: '🛡️', event: 'EDR isolation triggered', detail: 'Endpoint isolated from network', asset: 'WORKSTATION-042' },
    { time: '14:12:02', type: '📋', event: 'Alert fired → Case created', detail: 'CAS-2026-0041 opened', asset: 'NovrSOC Platform' },
];

const HUNTING_FIELDS = ['process.name', 'command_line', 'ip.src', 'ip.dst', 'file.name', 'user.name'];
const HUNTING_OPS = ['=', 'CONTAINS', '!=', 'STARTS WITH', 'ENDS WITH'];

const sevBadge: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High: 'bg-orange-50 text-orange-600 border-orange-200',
    Medium: 'bg-amber-50 text-amber-600 border-amber-200',
    Low: 'bg-blue-50 text-blue-600 border-blue-200',
};

export default function WorkbenchPage() {
    const [tab, setTab] = useState<'alerts' | 'cases' | 'timeline' | 'hunting' | 'ioc'>('alerts');
    const [iocQuery, setIocQuery] = useState('');
    const [iocResult, setIocResult] = useState(false);
    const [huntConditions, setHuntConditions] = useState([{ field: 'process.name', op: '=', value: 'powershell.exe' }]);

    return (
        <PageLayout title="Analyst Workbench">
            <div className="space-y-4">
                <div>
                    <h1 className="text-lg font-black text-gray-900">SOC Analyst Workbench</h1>
                    <p className="text-xs text-gray-400">Security Operations · Full analyst toolkit: alerts, cases, threat hunting, IOC lookup</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1 w-fit">
                    {([['alerts', '⚠️ Alert Queue'], ['cases', '📂 Cases'], ['timeline', '⏱️ Timeline'], ['hunting', '🔍 Threat Hunting'], ['ioc', '🔎 IOC Lookup']] as const).map(([k, l]) => (
                        <button key={k} onClick={() => setTab(k)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${tab === k ? 'bg-blue-700 text-white' : 'text-gray-500 hover:text-gray-800'}`}>{l}</button>
                    ))}
                </div>

                {/* Alert Queue */}
                {tab === 'alerts' && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead><tr className="border-b border-gray-200">
                                    {['Severity', 'Alert Name', 'Source', 'Asset', 'MITRE', 'Time', 'Status', 'Actions'].map(h =>
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    )}
                                </tr></thead>
                                <tbody>
                                    {ALERTS.map(a => (
                                        <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sevBadge[a.sev]}`}>{a.sev}</span></td>
                                            <td className="px-4 py-2 font-semibold text-gray-800 whitespace-nowrap">{a.name}</td>
                                            <td className="px-4 py-2 font-mono text-gray-500">{a.source}</td>
                                            <td className="px-4 py-2 font-mono text-gray-700">{a.asset}</td>
                                            <td className="px-4 py-2 font-mono text-orange-600 text-[10px]">{a.mitre}</td>
                                            <td className="px-4 py-2 font-mono text-gray-400">{a.time}</td>
                                            <td className="px-4 py-2"><span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{a.status}</span></td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <button className="text-[10px] font-bold text-blue-700 hover:underline mr-2">Investigate</button>
                                                <button className="text-[10px] font-bold text-gray-400 hover:text-gray-700">Assign</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Cases */}
                {tab === 'cases' && (
                    <div className="space-y-3">
                        <div className="flex justify-end">
                            <button className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">+ New Case</button>
                        </div>
                        {CASES.map(c => (
                            <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[10px] text-gray-400">{c.id}</span>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${c.priority === 'P1' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>{c.priority}</span>
                                        </div>
                                        <p className="font-bold text-gray-800 mt-1">{c.title}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Analyst: {c.analyst} · {c.alerts} linked alerts · Created: {c.created}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded">{c.status}</span>
                                        <button className="text-[10px] font-bold text-blue-700 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">View →</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Timeline */}
                {tab === 'timeline' && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                        <div className="p-4">
                            <p className="text-xs font-black text-gray-800 mb-1">Incident Timeline: CAS-2026-0041</p>
                            <p className="text-[10px] text-gray-400 mb-4">Ransomware Investigation · WORKSTATION-042</p>
                            <div className="space-y-1 border-l-2 border-blue-200 pl-4 ml-2">
                                {TIMELINE.map((t, i) => (
                                    <div key={i} className="relative pb-3">
                                        <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-[8px]">{t.type}</div>
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-[10px] text-blue-700">{t.time}</span>
                                                <span className="text-xs font-bold text-gray-800">{t.event}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500">{t.detail}</p>
                                            <p className="text-[9px] text-gray-500 mt-0.5 font-mono">{t.asset}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Threat Hunting */}
                {tab === 'hunting' && (
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4">
                                <p className="text-xs font-black text-gray-800 mb-3">Threat Hunting Query Builder</p>
                                <div className="space-y-2">
                                    {huntConditions.map((c, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            {i > 0 && <span className="text-[10px] font-bold text-blue-700 w-8">AND</span>}
                                            <select value={c.field} onChange={e => { const n = [...huntConditions]; n[i] = { ...n[i], field: e.target.value }; setHuntConditions(n); }}
                                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none">
                                                {HUNTING_FIELDS.map(f => <option key={f}>{f}</option>)}
                                            </select>
                                            <select value={c.op} onChange={e => { const n = [...huntConditions]; n[i] = { ...n[i], op: e.target.value }; setHuntConditions(n); }}
                                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none">
                                                {HUNTING_OPS.map(o => <option key={o}>{o}</option>)}
                                            </select>
                                            <input value={c.value} onChange={e => { const n = [...huntConditions]; n[i] = { ...n[i], value: e.target.value }; setHuntConditions(n); }}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                                            {huntConditions.length > 1 && (
                                                <button onClick={() => setHuntConditions(huntConditions.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-600 text-sm">✕</button>
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => setHuntConditions([...huntConditions, { field: 'process.name', op: '=', value: '' }])} className="text-[10px] font-bold text-blue-700 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">+ Add Condition</button>
                                        <button className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">▶ Run Query</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4">
                                <p className="text-xs font-bold text-gray-500 mb-2">Query Results — 3 matches</p>
                                <table className="w-full text-xs">
                                    <thead><tr className="border-b border-gray-200">
                                        {['Timestamp', 'Host', 'Process', 'Command Line', 'User'].map(h => <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {[['14:10:45', 'WORKSTATION-042', 'powershell.exe', 'powershell.exe -encodedCommand JAB...', 'CORP\\j.okafor'],
                                          ['13:55:12', 'WORKSTATION-017', 'powershell.exe', 'powershell.exe -NoProfile -NonInteractive -enc JAB...', 'CORP\\b.eze'],
                                          ['09:28:33', 'PROD-SERVER-03', 'powershell.exe', 'powershell.exe -WindowStyle Hidden -enc SUV...', 'NT AUTHORITY\\SYSTEM'],
                                        ].map(([ts, h, p, cmd, u]) => (
                                            <tr key={ts} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-3 py-2 font-mono text-gray-400">{ts}</td>
                                                <td className="px-3 py-2 font-mono text-gray-700">{h}</td>
                                                <td className="px-3 py-2 font-mono text-orange-600">{p}</td>
                                                <td className="px-3 py-2 font-mono text-gray-500 max-w-[200px] truncate">{cmd}</td>
                                                <td className="px-3 py-2 font-mono text-gray-500">{u}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* IOC Lookup */}
                {tab === 'ioc' && (
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4">
                                <p className="text-xs font-black text-gray-800 mb-3">IOC Enrichment Lookup</p>
                                <div className="flex gap-2">
                                    <input value={iocQuery} onChange={e => setIocQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && setIocResult(true)}
                                        placeholder="Enter IP, domain, hash, or email address…"
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                                    <button onClick={() => setIocResult(true)} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Search</button>
                                </div>
                                {iocResult && iocQuery && (
                                    <div className="mt-4 bg-red-50 border border-red-300 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="font-mono text-sm font-bold text-gray-800">{iocQuery}</p>
                                            <span className="text-xs font-black bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full">🔴 MALICIOUS</span>
                                        </div>
                                        {[['VirusTotal', '48/72 engines flagged', 'Malware distribution', 'text-blue-700'],
                                          ['Feed Source B', 'Confidence 94% malicious', '312 abuse reports', 'text-violet-600'],
                                          ['Feed Source A', '3 threat pulses', 'Linked to Lazarus Group', 'text-orange-600'],
                                        ].map(([src, det, ctx, cls]) => (
                                            <div key={src} className="flex items-start gap-3 border-b border-gray-200 pb-2">
                                                <span className={`text-xs font-black ${cls} w-32 flex-shrink-0`}>{src}</span>
                                                <span className="text-xs text-gray-700">{det}</span>
                                                <span className="text-xs text-gray-400 ml-auto">{ctx}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
