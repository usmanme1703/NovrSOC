'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

const SEV: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High:     'bg-orange-50 text-orange-600 border-orange-200',
    Medium:   'bg-amber-50 text-amber-600 border-amber-200',
};
const STATUS: Record<string, string> = {
    Active:     'bg-red-50 text-red-600',
    Monitoring: 'bg-amber-50 text-amber-600',
    Contained:  'bg-emerald-50 text-emerald-600',
};

const CAMPAIGNS = [
    {
        name: 'Operation SilverFox', actor: 'Lazarus Group',
        sectors: 'Banking, Fintech', ttps: 'T1566, T1078, T1055',
        firstSeen: '12 Jun 2026', lastSeen: 'Today', severity: 'Critical',
        iocCount: 847, status: 'Active',
        description: 'Sophisticated SWIFT-targeting campaign attributed to Lazarus Group. Attackers use spearphishing to gain initial access then move laterally to treasury systems.',
        fullTtps: ['T1566 — Phishing', 'T1078 — Valid Accounts', 'T1055 — Process Injection', 'T1021 — Remote Services', 'T1041 — Exfiltration Over C2'],
        sampleIocs: ['185.220.101.42', 'secure-transfer-ng.com', 'c2-lazarus-2026.net'],
        actions: ['Block all IPs associated with the campaign', 'Enforce MFA on all SWIFT terminal accounts', 'Monitor for lateral movement from finance workstations'],
    },
    {
        name: 'NigerPhish-2026', actor: 'Unknown TA',
        sectors: 'Government', ttps: 'T1566.001, T1204',
        firstSeen: '01 May 2026', lastSeen: 'Today', severity: 'High',
        iocCount: 312, status: 'Active',
        description: 'Mass phishing campaign targeting Nigerian government ministries. Uses look-alike domains of official government portals to harvest credentials.',
        fullTtps: ['T1566.001 — Spearphishing Attachment', 'T1204 — User Execution', 'T1078 — Valid Accounts'],
        sampleIocs: ['gov-ng-portal.com', 'nigeria-mda.net', '91.108.4.179'],
        actions: ['Report domains to NiRA/NGCERT for takedown', 'Block phishing domains at perimeter', 'Issue staff awareness notice'],
    },
    {
        name: 'TelecomSweep', actor: 'APT41',
        sectors: 'Telecom', ttps: 'T1190, T1133, T1071',
        firstSeen: '20 Jun 2026', lastSeen: 'Today', severity: 'High',
        iocCount: 203, status: 'Active',
        description: 'APT41 campaign targeting Nigerian and West African telecom operators for intelligence collection and pre-positioning.',
        fullTtps: ['T1190 — Exploit Public-Facing Application', 'T1133 — External Remote Services', 'T1071 — Application Layer Protocol'],
        sampleIocs: ['203.0.113.55', 'telecom-update-ng.com', '45.142.212.100'],
        actions: ['Patch all internet-facing applications immediately', 'Review VPN access logs for anomalies', 'Enable network segmentation between IT and OT'],
    },
    {
        name: 'RansomNG', actor: 'BlackCat',
        sectors: 'Oil & Gas, Gov', ttps: 'T1486, T1490, T1489',
        firstSeen: '15 Jun 2026', lastSeen: 'Yesterday', severity: 'Critical',
        iocCount: 156, status: 'Active',
        description: 'BlackCat ALPHV ransomware campaign targeting Nigerian oil sector and government agencies. Double extortion with data exfiltration prior to encryption.',
        fullTtps: ['T1486 — Data Encrypted for Impact', 'T1490 — Inhibit System Recovery', 'T1489 — Service Stop'],
        sampleIocs: ['ransom-alphv-ng.onion', '194.165.16.11', 'nnpc-decrypt.com'],
        actions: ['Ensure offline backups are tested and current', 'Disable unnecessary RDP and remote services', 'Deploy EDR with ransomware behavioural detection'],
    },
    {
        name: 'SIMSwapNG', actor: 'Local TA',
        sectors: 'Banking, Telecom', ttps: 'T1078, T1110',
        firstSeen: '01 Jun 2026', lastSeen: '25 Jun', severity: 'Medium',
        iocCount: 45, status: 'Monitoring',
        description: 'Local threat actor group conducting SIM swap attacks against banking customers in collaboration with telecom insiders.',
        fullTtps: ['T1078 — Valid Accounts', 'T1110 — Brute Force'],
        sampleIocs: ['192.168.99.10', 'sim-swap-panel.com'],
        actions: ['Work with telecom partners to strengthen SIM swap controls', 'Implement step-up authentication for high-value transactions', 'Monitor for unusual port-in requests'],
    },
    {
        name: 'CredStuff-NG', actor: 'Unknown',
        sectors: 'Fintech', ttps: 'T1110.004',
        firstSeen: '10 May 2026', lastSeen: '20 Jun', severity: 'Medium',
        iocCount: 203, status: 'Monitoring',
        description: 'Credential stuffing campaign using leaked databases against Nigerian fintech platforms.',
        fullTtps: ['T1110.004 — Credential Stuffing'],
        sampleIocs: ['credential-check-ng.ru', '185.56.83.14'],
        actions: ['Enforce MFA on all customer accounts', 'Deploy rate limiting on authentication endpoints', 'Subscribe to HaveIBeenPwned enterprise feed'],
    },
    {
        name: 'OilSector-APT', actor: 'APT28',
        sectors: 'Oil & Gas', ttps: 'T1190, T1059',
        firstSeen: '01 Mar 2026', lastSeen: '01 Jun', severity: 'High',
        iocCount: 89, status: 'Contained',
        description: 'APT28 espionage campaign targeting Nigerian oil sector for energy intelligence collection. Activity appears to have stopped.',
        fullTtps: ['T1190 — Exploit Public-Facing Application', 'T1059 — Command & Scripting Interpreter'],
        sampleIocs: ['oil-sector-survey.com', '62.182.82.100'],
        actions: ['Conduct full forensic review of affected systems', 'Rotate all credentials on affected infrastructure', 'File incident report with NGCERT'],
    },
];

export default function CampaignsPage() {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <PageLayout title="Campaigns">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Active Campaigns</h1>
                    <p className="text-xs text-gray-400">Threat Intelligence · Tracked threat campaigns and operations</p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: 'Active',    value: '7', color: 'text-red-600' },
                        { label: 'Critical',  value: '2', color: 'text-red-600' },
                        { label: 'Monitoring',value: '5', color: 'text-amber-600' },
                        { label: 'Contained', value: '3', color: 'text-emerald-600' },
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['Campaign Name', 'Threat Actor', 'Target Sectors', 'TTPs', 'First Seen', 'Last Seen', 'Severity', 'IOC Count', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {CAMPAIGNS.map(c => (
                                    <>
                                        <tr
                                            key={c.name}
                                            onClick={() => setExpanded(expanded === c.name ? null : c.name)}
                                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{c.name}</td>
                                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.actor}</td>
                                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.sectors}</td>
                                            <td className="px-4 py-3 font-mono text-orange-600 text-[10px] whitespace-nowrap">{c.ttps}</td>
                                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.firstSeen}</td>
                                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.lastSeen}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEV[c.severity] ?? ''}`}>{c.severity}</span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-gray-700">{c.iocCount.toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS[c.status] ?? ''}`}>{c.status}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button className="text-[10px] font-bold text-blue-700 hover:underline whitespace-nowrap">
                                                    {expanded === c.name ? 'Collapse ▲' : 'Details ▼'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expanded === c.name && (
                                            <tr key={`${c.name}-detail`} className="border-b border-gray-200 bg-slate-50">
                                                <td colSpan={10} className="px-6 py-5">
                                                    <div className="grid grid-cols-3 gap-6">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Description</p>
                                                            <p className="text-xs text-gray-700 leading-relaxed">{c.description}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">TTPs</p>
                                                            <div className="space-y-1">
                                                                {c.fullTtps.map(t => (
                                                                    <p key={t} className="text-[11px] font-mono text-orange-700">{t}</p>
                                                                ))}
                                                            </div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-3 mb-2">Sample IOCs</p>
                                                            {c.sampleIocs.map(i => (
                                                                <p key={i} className="text-[11px] font-mono text-gray-700">{i}</p>
                                                            ))}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Recommended Actions</p>
                                                            <ol className="space-y-1.5">
                                                                {c.actions.map((a, i) => (
                                                                    <li key={i} className="flex items-start gap-2 text-[11px] text-gray-700">
                                                                        <span className="text-blue-700 font-bold flex-shrink-0">{i + 1}.</span>{a}
                                                                    </li>
                                                                ))}
                                                            </ol>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
