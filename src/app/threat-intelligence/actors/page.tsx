'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

const SEV: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High:     'bg-orange-50 text-orange-600 border-orange-200',
    Medium:   'bg-amber-50 text-amber-600 border-amber-200',
};

const ACTORS = [
    {
        name: 'Lazarus Group', level: 'Critical', flag: '🇰🇵', country: 'North Korea',
        sectors: ['Banking', 'Cryptocurrency', 'Defence'],
        ttps: ['T1566', 'T1055', 'T1003', 'T1078'],
        lastActive: 'Today',
        desc: 'Nation-state APT linked to DPRK. Known for SWIFT banking attacks and large-scale cryptocurrency theft.',
    },
    {
        name: 'APT41', level: 'Critical', flag: '🇨🇳', country: 'China',
        sectors: ['Telecom', 'Government', 'Healthcare'],
        ttps: ['T1190', 'T1133', 'T1071', 'T1486'],
        lastActive: '3 days ago',
        desc: 'Dual espionage and financially motivated group. Known for supply chain attacks and ransomware deployment.',
    },
    {
        name: 'BlackCat (ALPHV)', level: 'Critical', flag: '🇷🇺', country: 'Russia',
        sectors: ['Oil & Gas', 'Government', 'Healthcare'],
        ttps: ['T1486', 'T1490', 'T1489', 'T1078'],
        lastActive: 'Yesterday',
        desc: 'Ransomware-as-a-Service group. Uses Rust-based malware. Known for double extortion tactics and large ransom demands.',
    },
    {
        name: 'APT28 (Fancy Bear)', level: 'High', flag: '🇷🇺', country: 'Russia',
        sectors: ['Government', 'Defence', 'Energy'],
        ttps: ['T1059', 'T1190', 'T1566', 'T1003'],
        lastActive: '1 week ago',
        desc: 'Russian GRU-linked espionage group. Targets government and military organisations globally.',
    },
    {
        name: 'SilverTerrier', level: 'High', flag: '🇳🇬', country: 'Nigeria',
        sectors: ['Financial', 'Legal', 'Manufacturing'],
        ttps: ['T1566', 'T1204', 'T1078', 'T1041'],
        lastActive: '2 days ago',
        desc: 'Nigeria-based BEC and fraud group. Operates large-scale phishing campaigns targeting organisations globally.',
    },
    {
        name: 'TA-NG01', level: 'Medium', flag: '🇳🇬', country: 'Nigeria',
        sectors: ['Banking', 'Fintech', 'Telecom'],
        ttps: ['T1566', 'T1078', 'T1110'],
        lastActive: 'Today',
        desc: 'Unattributed Nigerian threat actor specialising in credential theft and account takeover attacks.',
    },
];

const KPIS = [
    { label: 'Tracked Actors', value: '23', color: 'text-blue-700' },
    { label: 'Nation-State',   value: '6',  color: 'text-red-600' },
    { label: 'Cybercriminal',  value: '14', color: 'text-orange-600' },
    { label: 'Active This Week', value: '8', color: 'text-violet-600' },
];

export default function ThreatActorsPage() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <PageLayout title="Threat Actors">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Threat Actors</h1>
                    <p className="text-xs text-gray-400">Threat Intelligence · Known and tracked threat actor profiles</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-4 gap-3">
                    {KPIS.map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                        </div>
                    ))}
                </div>

                {/* Actor cards */}
                <div className="grid grid-cols-3 gap-4">
                    {ACTORS.map(actor => (
                        <div key={actor.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4 flex flex-col flex-1 gap-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-black text-gray-900">{actor.name}</p>
                                        <p className="text-[11px] text-gray-500">{actor.flag} {actor.country}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${SEV[actor.level]}`}>{actor.level}</span>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {actor.sectors.map(s => (
                                        <span key={s} className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{s}</span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {actor.ttps.map(t => (
                                        <span key={t} className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded border border-orange-200">{t}</span>
                                    ))}
                                </div>

                                <p className="text-[11px] text-gray-600 leading-relaxed flex-1">{actor.desc}</p>

                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Last Active</p>
                                        <p className="text-[11px] font-bold text-gray-700">{actor.lastActive}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelected(selected === actor.name ? null : actor.name)}
                                        className="text-[10px] font-bold px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                                    >
                                        {selected === actor.name ? 'Close' : 'View Profile'}
                                    </button>
                                </div>

                                {selected === actor.name && (
                                    <div className="mt-2 pt-3 border-t border-gray-100 space-y-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Known TTPs</p>
                                        <div className="space-y-1">
                                            {actor.ttps.map(t => (
                                                <div key={t} className="flex items-center gap-2">
                                                    <span className="text-[9px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{t}</span>
                                                    <span className="text-[10px] text-gray-500">MITRE ATT&CK Technique</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Target Sectors</p>
                                        <p className="text-[11px] text-gray-700">{actor.sectors.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
