'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

type CtipStats = {
    total_iocs: number;
    iocs_last_24h: number;
    active_campaigns: number;
    exploitable_cves_this_week: number;
    sources_active: number;
    last_collector_run: string | null;
};

const ADVISORIES = [
    {
        id: 'CBN-CSIRT-2026-041', sev: 'Critical', title: 'BEC Campaign Targeting Nigerian Banks',
        summary: 'Active Business Email Compromise campaign specifically targeting CFOs and finance teams at Nigerian banks and fintechs. Attackers are spoofing executive email addresses to initiate fraudulent wire transfers. Immediate awareness training and email authentication review required.',
        sectors: ['Banking', 'Fintech'], published: 'Today', source: 'CBN-CSIRT', action: 'Immediate action required',
    },
    {
        id: 'NGCERT-2026-089', sev: 'High', title: 'Ransomware Targeting Government Infrastructure',
        summary: 'NGCERT has issued an advisory for active ransomware campaigns targeting Nigerian government ministries and agencies. Patch CVE-2024-3400 (PAN-OS) immediately. Attackers have been observed leveraging this vulnerability for initial access.',
        sectors: ['Government'], published: 'Yesterday', source: 'NGCERT', action: 'Patch CVE-2024-3400 immediately',
    },
    {
        id: 'NCC-CSIRT-2026-112', sev: 'High', title: 'Phishing Infrastructure Targeting Telecom Users',
        summary: 'NCC-CSIRT has identified an active phishing campaign targeting customers of major Nigerian telecom operators. Fake "account suspension" emails are being sent en masse. User awareness recommended and domain monitoring should be enabled.',
        sectors: ['Telecom'], published: '2 days ago', source: 'NCC-CSIRT', action: 'User awareness + domain monitoring',
    },
    {
        id: 'CISA-2026-447', sev: 'Medium', title: 'Ivanti VPN Vulnerabilities — Multiple CVEs',
        summary: 'CISA has added multiple Ivanti VPN vulnerabilities to the Known Exploited Vulnerabilities catalog. Affected products: Ivanti Connect Secure, Policy Secure. Apply available patches as soon as possible.',
        sectors: ['All Sectors'], published: '3 days ago', source: 'CISA', action: 'Apply Ivanti patches',
    },
    {
        id: 'NGCERT-2026-088', sev: 'High', title: 'Credential Stuffing Attacks on Nigerian Fintechs',
        summary: 'Sustained credential stuffing attacks observed against Nigerian fintech platforms. Threat actors are using leaked credential databases. Enable MFA enforcement and anomalous login detection immediately.',
        sectors: ['Fintech', 'Banking'], published: '4 days ago', source: 'NGCERT', action: 'Enforce MFA immediately',
    },
    {
        id: 'CBN-CSIRT-2026-039', sev: 'Medium', title: 'ATM Skimming Devices Reported in Lagos',
        summary: 'Physical ATM skimming devices reported at multiple ATM locations in Lagos. While primarily a physical threat, associated card data may be used for online fraud. Review fraud detection parameters.',
        sectors: ['Banking'], published: '5 days ago', source: 'CBN-CSIRT', action: 'Review fraud detection systems',
    },
    {
        id: 'NCC-CSIRT-2026-108', sev: 'Low', title: 'DNS Resolver Misconfiguration Advisory',
        summary: 'Advisory for DNS resolver misconfigurations that could enable DNS amplification attacks. Ensure recursive DNS is not open to the internet. Review firewall rules.',
        sectors: ['All Sectors'], published: '1 week ago', source: 'NCC-CSIRT', action: 'Review DNS configuration',
    },
    {
        id: 'NGCERT-2026-081', sev: 'Medium', title: 'Mobile Banking App Security Notice',
        summary: 'Multiple Nigerian banking app clones identified on third-party app stores. Customer education required. Enable certificate pinning in mobile apps and monitor for app store takedown opportunities.',
        sectors: ['Banking', 'Fintech'], published: '1 week ago', source: 'NGCERT', action: 'Mobile app security review',
    },
];

const SEV_STYLE: Record<string, string> = {
    Critical: 'border-l-red-600 bg-red-50',
    High: 'border-l-orange-500 bg-orange-50',
    Medium: 'border-l-amber-500 bg-amber-50',
    Low: 'border-l-blue-500 bg-blue-50',
};
const SEV_BADGE: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High: 'bg-orange-50 text-orange-600 border-orange-200',
    Medium: 'bg-amber-50 text-amber-600 border-amber-200',
    Low: 'bg-blue-50 text-blue-600 border-blue-200',
};

export default function AdvisoryPage() {
    const [ctipStats, setCtipStats] = useState<CtipStats | null>(null);

    useEffect(() => {
        fetch('/api/threat-intel/stats')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then((data: CtipStats) => setCtipStats(data))
            .catch(() => setCtipStats(null));
    }, []);

    return (
        <PageLayout title="Threat Advisory">
            <div className="space-y-4">
                {/* Live Intel Banner — only rendered when CTIP responds with data */}
                {ctipStats && ctipStats.total_iocs > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                            <span className="text-xs text-green-600 font-medium">CTIP Live</span>
                        </div>
                        <p className="text-xs text-slate-600">
                            Live Intel:{' '}
                            <span className="font-bold text-blue-700">{ctipStats.iocs_last_24h.toLocaleString()}</span>
                            {' '}new IOCs tracked in the last 24 hours across{' '}
                            <span className="font-bold text-blue-700">{ctipStats.sources_active}</span>
                            {' '}active sources —{' '}
                            <span className="font-bold text-blue-700">{ctipStats.total_iocs.toLocaleString()}</span>
                            {' '}total indicators in database
                        </p>
                    </div>
                )}

                <div>
                    <h1 className="text-lg font-black text-gray-900">Threat Advisory</h1>
                    <p className="text-xs text-gray-500">Threat Intelligence · Active advisories from Nigerian and global threat intelligence sources</p>
                </div>

                <div className="flex items-center gap-3">
                    {[['Critical', 1], ['High', 3], ['Medium', 3], ['Low', 1]].map(([s, n]) => (
                        <div key={s} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold ${SEV_BADGE[String(s)]}`}>
                            <span>{String(s)}</span><span className="font-black">{n}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    {ADVISORIES.map(a => (
                        <div key={a.id} className={`border-l-4 ${SEV_STYLE[a.sev]} rounded-r-xl p-4 border border-gray-200 border-l-4`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEV_BADGE[a.sev]}`}>{a.sev}</span>
                                        <span className="text-[10px] font-mono text-gray-400">{a.id}</span>
                                        <span className="text-[10px] text-gray-400">· {a.source}</span>
                                        <span className="text-[10px] text-gray-400">· {a.published}</span>
                                    </div>
                                    <h3 className="text-sm font-black text-gray-900 mb-1">{a.title}</h3>
                                    <p className="text-[11px] text-gray-600 leading-relaxed mb-2">{a.summary}</p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">Sectors:</span>
                                            {a.sectors.map(s => <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{s}</span>)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[9px] font-bold text-blue-700">→ {a.action}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex-shrink-0 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white text-[10px] font-bold rounded-lg transition-colors whitespace-nowrap">Read Full Advisory</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
