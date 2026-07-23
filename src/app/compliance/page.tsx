'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { GaugeChart } from '@/components/shared/GaugeChart';
import { getPortalContext } from '@/lib/portal-context';

interface FrameworkScore {
    id: number;
    name: string;
    shortName: string;
    description: string;
    totalControls: number;
    assessed: number;
    compliant: number;
    score: number;
}

interface Control {
    id: number;
    controlId: string;
    title: string;
    category: string;
    weight: number;
    status: string;
    notes: string | null;
}

const STATUS_META: Record<string, { label: string; classes: string; icon: string }> = {
    not_assessed: { label: 'Not Assessed', classes: 'text-gray-500 bg-gray-100 border-gray-200', icon: '—' },
    compliant: { label: 'Compliant', classes: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: '✅' },
    partially_compliant: { label: 'Partially Compliant', classes: 'text-amber-600 bg-amber-50 border-amber-200', icon: '⚠️' },
    non_compliant: { label: 'Non-Compliant', classes: 'text-red-600 bg-red-50 border-red-200', icon: '❌' },
    not_applicable: { label: 'Not Applicable', classes: 'text-gray-500 bg-gray-100 border-gray-200', icon: 'N/A' },
};
const STATUS_OPTIONS = Object.keys(STATUS_META);

function FrameworkCard({ f, selected, onSelect }: { f: FrameworkScore; selected: boolean; onSelect: () => void }) {
    return (
        <button
            onClick={onSelect}
            className={`text-left bg-white border rounded-xl overflow-hidden transition-colors ${selected ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200 hover:border-blue-200'}`}
        >
            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
            <div className="p-4 flex flex-col items-center text-center">
                <div className="relative my-2">
                    <GaugeChart value={f.score} size={72} strokeWidth={7} />
                    <span className="absolute inset-0 flex items-center justify-center text-base font-black text-gray-800">{f.score}%</span>
                </div>
                <p className="text-xs font-black text-gray-800 mt-1">{f.name}</p>
                <span className="mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full border text-blue-700 bg-blue-50 border-blue-200">{f.shortName}</span>
                <div className="mt-2 w-full">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-700 rounded-full" style={{ width: `${f.score}%` }} />
                    </div>
                    <p className="mt-1.5 text-[10px] text-gray-400">{f.assessed}/{f.totalControls} controls assessed</p>
                </div>
                <span className="mt-2 text-[9px] font-bold text-blue-700">Edit →</span>
            </div>
        </button>
    );
}

export default function CompliancePage() {
    const portal = getPortalContext();
    const orgId = portal.isPortal ? portal.orgId : 1;

    const [frameworks, setFrameworks] = useState<FrameworkScore[] | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [controls, setControls] = useState<Control[] | null>(null);
    const [controlsLoading, setControlsLoading] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        if (!orgId) return;
        fetch(`/api/compliance?orgId=${orgId}`, { cache: 'no-store' })
            .then((r) => r.json())
            .then((data) => setFrameworks(Array.isArray(data) ? data : []))
            .catch(() => setFrameworks([]));
    }, [orgId]);

    useEffect(() => {
        if (!selectedId || !orgId) { setControls(null); return; }
        setControlsLoading(true);
        fetch(`/api/compliance/controls?frameworkId=${selectedId}&orgId=${orgId}`, { cache: 'no-store' })
            .then((r) => r.json())
            .then((data) => setControls(Array.isArray(data) ? data : []))
            .catch(() => setControls([]))
            .finally(() => setControlsLoading(false));
    }, [selectedId, orgId]);

    const selectedFramework = frameworks?.find((f) => f.id === selectedId) ?? null;

    const updateStatus = async (control: Control, status: string) => {
        if (!orgId) return;
        setNotice(null);
        setControls((prev) => (prev ? prev.map((c) => (c.id === control.id ? { ...c, status } : c)) : prev));
        try {
            const res = await fetch('/api/compliance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orgId,
                    controlId: control.id,
                    status,
                    notes: control.notes,
                    assessedBy: portal.isPortal ? (portal.portalRole ?? 'portal') : 'admin',
                }),
            });
            if (!res.ok) throw new Error('save failed');
            fetch(`/api/compliance?orgId=${orgId}`, { cache: 'no-store' })
                .then((r) => r.json())
                .then((data) => setFrameworks(Array.isArray(data) ? data : []))
                .catch(() => {});
        } catch {
            setNotice('Could not save — the compliance backend is not deployed yet, so this status change was not persisted.');
        }
    };

    const top4 = frameworks?.slice(0, 4) ?? [];
    const bottom3 = frameworks?.slice(4) ?? [];

    return (
        <PageLayout title="Compliance">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Compliance Checklist</h1>
                    <p className="text-xs text-gray-400">Regulatory framework scores and control-level assessments</p>
                </div>

                {notice && <p className="text-xs font-semibold text-amber-600">{notice}</p>}

                {frameworks === null ? (
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-44 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-4 gap-4">
                            {top4.map((f) => (
                                <FrameworkCard key={f.id} f={f} selected={f.id === selectedId} onSelect={() => setSelectedId(f.id)} />
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {bottom3.map((f) => (
                                <FrameworkCard key={f.id} f={f} selected={f.id === selectedId} onSelect={() => setSelectedId(f.id)} />
                            ))}
                        </div>
                    </>
                )}

                {selectedFramework && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-sm font-black text-gray-900">{selectedFramework.name} Compliance Checklist</p>
                                    <p className="text-[10px] text-gray-400">{selectedFramework.description}</p>
                                </div>
                                {!portal.isPortal && (
                                    <button
                                        onClick={() => setNotice('Adding custom controls requires the compliance backend, which is not deployed yet.')}
                                        className="text-[10px] font-bold text-blue-700 hover:underline flex-shrink-0"
                                    >
                                        + Add Controls
                                    </button>
                                )}
                            </div>

                            {controlsLoading ? (
                                <div className="space-y-2 py-4">
                                    {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
                                </div>
                            ) : !controls || controls.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                                        No controls loaded for {selectedFramework.shortName} yet. The compliance backend
                                        (control library + assessment storage) hasn&apos;t been deployed — once it is,
                                        controls will appear here automatically.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                {['Control ID', 'Title', 'Category', 'Status', 'Notes', 'Action'].map((h) => (
                                                    <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {controls.map((c) => {
                                                const meta = STATUS_META[c.status] ?? STATUS_META.not_assessed;
                                                return (
                                                    <tr key={c.id} className="border-b border-gray-100">
                                                        <td className="px-3 py-2 font-mono font-semibold text-gray-700">{c.controlId}</td>
                                                        <td className="px-3 py-2 text-gray-800">{c.title}</td>
                                                        <td className="px-3 py-2 text-gray-500">{c.category}</td>
                                                        <td className="px-3 py-2">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.classes}`}>{meta.icon} {meta.label}</span>
                                                        </td>
                                                        <td className="px-3 py-2 text-gray-500">{c.notes ?? '—'}</td>
                                                        <td className="px-3 py-2">
                                                            <select
                                                                value={c.status}
                                                                onChange={(e) => updateStatus(c, e.target.value)}
                                                                className="text-[10px] font-semibold border border-gray-200 rounded px-1.5 py-1 bg-white"
                                                            >
                                                                {STATUS_OPTIONS.map((s) => (
                                                                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
