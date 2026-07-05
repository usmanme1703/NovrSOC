'use client';

import { PageLayout } from '@/components/layout/PageLayout';

type ReqStatus = 'Compliant' | 'Partial';

const REQUIREMENTS: { num: number; name: string; status: ReqStatus; score: number }[] = [
    { num: 1,  name: 'Install and Maintain Network Security',    status: 'Compliant', score: 95 },
    { num: 2,  name: 'Apply Secure Configurations',             status: 'Compliant', score: 91 },
    { num: 3,  name: 'Protect Stored Account Data',             status: 'Compliant', score: 96 },
    { num: 4,  name: 'Protect Cardholder Data in Transit',      status: 'Compliant', score: 98 },
    { num: 5,  name: 'Protect Against Malicious Software',      status: 'Compliant', score: 94 },
    { num: 6,  name: 'Develop Secure Systems',                  status: 'Partial',   score: 82 },
    { num: 7,  name: 'Restrict Access by Business Need',        status: 'Compliant', score: 90 },
    { num: 8,  name: 'Identify Users and Authenticate',         status: 'Compliant', score: 93 },
    { num: 9,  name: 'Restrict Physical Access',                status: 'Compliant', score: 89 },
    { num: 10, name: 'Log and Monitor All Access',              status: 'Compliant', score: 88 },
    { num: 11, name: 'Test Security Regularly',                 status: 'Partial',   score: 79 },
    { num: 12, name: 'Support Information Security Policy',     status: 'Compliant', score: 95 },
];

const BADGE: Record<ReqStatus, string> = {
    Compliant: 'bg-emerald-50 text-emerald-700',
    Partial:   'bg-amber-50 text-amber-700',
};

function scoreColor(s: number) { return s >= 85 ? 'text-emerald-600' : s >= 70 ? 'text-amber-600' : 'text-red-600'; }
function barColor(s: number)   { return s >= 85 ? 'bg-emerald-500'   : s >= 70 ? 'bg-amber-500'   : 'bg-red-500'; }

export default function PCIDSSPage() {
    const overall = Math.round(REQUIREMENTS.reduce((sum, r) => sum + r.score, 0) / REQUIREMENTS.length);

    return (
        <PageLayout title="PCI-DSS">
            <div className="space-y-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-black text-gray-900">PCI-DSS v4.0</h1>
                        <p className="text-xs text-gray-400">Compliance · Payment Card Industry Data Security Standard</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center min-w-[100px]">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-4 -mx-4 mb-3 rounded-t-xl" />
                        <p className={`text-3xl font-black ${scoreColor(overall)}`}>{overall}%</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Overall Score</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {REQUIREMENTS.map(req => (
                        <div key={req.num} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-start gap-2">
                                        <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 flex-shrink-0">
                                            Req {req.num}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${BADGE[req.status]}`}>
                                        {req.status === 'Compliant' ? '✅' : '🟡'} {req.status}
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-800 mb-2 leading-tight">{req.name}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                                        <div className={`h-1.5 rounded-full ${barColor(req.score)}`} style={{ width: `${req.score}%` }} />
                                    </div>
                                    <span className={`text-xs font-black flex-shrink-0 ${scoreColor(req.score)}`}>{req.score}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">QSA Details</p>
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: 'Qualified Security Assessor', value: 'SecureAudit Nigeria Ltd' },
                                { label: 'Last Assessment',             value: '01 Jun 2026' },
                                { label: 'Next Assessment',             value: '01 Jun 2027' },
                                { label: 'Report on Compliance (ROC)',  value: 'Filed ✅' },
                            ].map(r => (
                                <div key={r.label}>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">{r.label}</p>
                                    <p className="text-xs font-bold text-gray-800">{r.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
