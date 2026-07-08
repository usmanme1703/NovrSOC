'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

interface ThreatActor {
    name: string;
    level?: string;
    country?: string;
    flag?: string;
    sectors?: string[];
    ttps?: string[];
    last_active?: string;
    description?: string;
}

const SEV: Record<string, string> = {
    Critical: 'bg-red-50 text-red-600 border-red-200',
    High:     'bg-orange-50 text-orange-600 border-orange-200',
    Medium:   'bg-amber-50 text-amber-600 border-amber-200',
};

export default function ThreatActorsPage() {
    const [actors, setActors] = useState<ThreatActor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/ctip/actors', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => setActors(Array.isArray(data) ? data : []))
            .catch(() => setActors([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <PageLayout title="Threat Actors">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Threat Actors</h1>
                    <p className="text-xs text-gray-400">Threat Intelligence · Known and tracked threat actor profiles from CTIP</p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: 'Tracked Actors', value: actors.length, color: 'text-blue-700' },
                        { label: 'Critical', value: actors.filter(a => a.level === 'Critical').length, color: 'text-red-600' },
                        { label: 'High', value: actors.filter(a => a.level === 'High').length, color: 'text-orange-600' },
                        { label: 'Active This Week', value: actors.filter(a => a.last_active).length, color: 'text-violet-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-4 rounded-t-xl" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-2xl font-black ${k.color}`}>{loading ? '...' : k.value}</p>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 h-40 animate-pulse" />
                        ))}
                    </div>
                ) : actors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white border border-gray-200 rounded-xl">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 mb-4">
                            <circle cx="12" cy="8" r="4" strokeLinecap="round" />
                            <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">No Threat Actors Tracked Yet</h3>
                        <p className="text-xs text-gray-400 max-w-sm">
                            Threat actor attribution builds over time as intelligence feeds accumulate data.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {actors.map(actor => (
                            <div key={actor.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                                <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                                <div className="p-4 flex flex-col flex-1 gap-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-black text-gray-900">{actor.name}</p>
                                            {actor.country && <p className="text-[11px] text-gray-500">{actor.flag} {actor.country}</p>}
                                        </div>
                                        {actor.level && (
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${SEV[actor.level] ?? ''}`}>{actor.level}</span>
                                        )}
                                    </div>

                                    {actor.sectors && actor.sectors.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {actor.sectors.map(s => (
                                                <span key={s} className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{s}</span>
                                            ))}
                                        </div>
                                    )}

                                    {actor.ttps && actor.ttps.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {actor.ttps.map(t => (
                                                <span key={t} className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded border border-orange-200">{t}</span>
                                            ))}
                                        </div>
                                    )}

                                    {actor.description && <p className="text-[11px] text-gray-600 leading-relaxed flex-1">{actor.description}</p>}

                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">Last Active</p>
                                            <p className="text-[11px] font-bold text-gray-700">{actor.last_active ?? 'Unknown'}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelected(selected === actor.name ? null : actor.name)}
                                            className="text-[10px] font-bold px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                                        >
                                            {selected === actor.name ? 'Close' : 'View Profile'}
                                        </button>
                                    </div>

                                    {selected === actor.name && actor.ttps && actor.ttps.length > 0 && (
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
