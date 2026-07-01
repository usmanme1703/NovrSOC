'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { GaugeChart } from '@/components/shared/GaugeChart';
import { CLIENTS, MSSP_KPIS, ONBOARDING_STEPS, PLANS } from '@/lib/mock/clients';

const riskBg = (r: number) => r >= 80 ? 'bg-red-50' : '';
const riskColor = (r: number) => r >= 80 ? 'text-red-600' : r >= 70 ? 'text-amber-600' : 'text-emerald-600';
const clientStatus = (c: { riskScore: number; activeIncidents: number }) =>
    c.riskScore >= 80 ? { label: '🔴 Critical', cls: 'text-red-600' } :
    c.activeIncidents >= 5 ? { label: '🟡 Attention', cls: 'text-amber-600' } :
    { label: '🟢 Healthy', cls: 'text-emerald-600' };

export default function CustomersPage() {
    const [view, setView] = useState<'table' | 'cards'>('table');
    const [wizard, setWizard] = useState(false);
    const [step, setStep] = useState(0);
    const [activeTenant, setActiveTenant] = useState<string | null>(null);

    return (
        <PageLayout title="MSSP Customers">
            {activeTenant && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 px-6 py-2 flex items-center justify-between text-xs font-bold">
                    <span>👁 Viewing: {activeTenant} — All data scoped to this client</span>
                    <button onClick={() => setActiveTenant(null)} className="border border-amber-700 px-3 py-1 rounded hover:bg-amber-600 transition-colors">Exit to MSSP View</button>
                </div>
            )}
            <div className={`space-y-5 ${activeTenant ? 'pt-8' : ''}`}>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-black text-gray-900">MSSP Client Portfolio</h1>
                        <p className="text-xs text-gray-400">Customers · Multi-tenant security management across all clients</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                            {(['table', 'cards'] as const).map(v => (
                                <button key={v} onClick={() => setView(v)}
                                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${view === v ? 'bg-blue-700 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                                    {v === 'table' ? '☰ Table' : '⊞ Cards'}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setWizard(true)} className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">+ Add Client</button>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-6 gap-3">
                    {[
                        { label: 'Total Clients', value: MSSP_KPIS.totalClients, color: 'text-blue-700' },
                        { label: 'Endpoints Monitored', value: MSSP_KPIS.totalEndpoints, color: 'text-blue-600' },
                        { label: 'Active Incidents', value: MSSP_KPIS.crossClientIncidents, color: 'text-orange-600' },
                        { label: 'Critical Alert Clients', value: MSSP_KPIS.clientsWithCritical, color: 'text-red-600' },
                        { label: 'Avg Risk Score', value: MSSP_KPIS.avgRiskScore, color: 'text-amber-600' },
                        { label: 'SLA Breach Risk', value: MSSP_KPIS.slaBreachRisk, color: 'text-red-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-3">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-3 -mx-3 mb-3 rounded-t-xl" />
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{k.label}</p>
                            <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
                        </div>
                    ))}
                </div>

                {/* Table view */}
                {view === 'table' && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead><tr className="border-b border-gray-200">
                                    {['Client', 'Industry', 'Plan', 'Risk Score', 'Incidents', 'Endpoints', 'Compliance', 'Agents Online', 'Last Activity', 'Actions'].map(h =>
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    )}
                                </tr></thead>
                                <tbody>
                                    {CLIENTS.map(c => {
                                        return (
                                            <tr key={c.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${riskBg(c.riskScore)}`}>
                                                <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">{c.icon} {c.name}</td>
                                                <td className="px-4 py-3 text-gray-500">{c.industry}</td>
                                                <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">{c.plan}</span></td>
                                                <td className={`px-4 py-3 font-black ${riskColor(c.riskScore)}`}>{c.riskScore}</td>
                                                <td className={`px-4 py-3 font-bold ${c.activeIncidents >= 5 ? 'text-red-600' : 'text-gray-700'}`}>{c.activeIncidents}</td>
                                                <td className="px-4 py-3 text-gray-500">{c.endpoints.toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-12 bg-gray-200 h-1 rounded-full"><div className="h-full rounded-full bg-blue-700" style={{ width: `${c.complianceScore}%` }} /></div>
                                                        <span className="text-[10px] text-gray-500">{c.complianceScore}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{c.agentsOnline.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-gray-400">{c.lastActivity}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setActiveTenant(c.name)} className="text-[10px] font-bold text-blue-700 hover:underline">View</button>
                                                        <button className="text-[10px] font-bold text-gray-400 hover:text-gray-700">Manage</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Cards view */}
                {view === 'cards' && (
                    <div className="grid grid-cols-3 gap-4">
                        {CLIENTS.map(c => {
                            const st = clientStatus(c);
                            return (
                                <div key={c.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors">
                                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-sm font-black text-gray-800">{c.icon} {c.name}</p>
                                                <p className="text-[10px] text-gray-400">{c.industry} · {c.plan}</p>
                                            </div>
                                            <div className="relative">
                                                <GaugeChart value={c.riskScore} size={48} strokeWidth={5} color={c.riskScore >= 80 ? '#ef4444' : c.riskScore >= 70 ? '#eab308' : '#22c55e'} />
                                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-800">{c.riskScore}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                                            <div className="bg-gray-50 rounded-lg p-1.5"><p className="text-gray-400">Incidents</p><p className="font-black text-orange-600">{c.activeIncidents}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-1.5"><p className="text-gray-400">Agents</p><p className="font-black text-blue-700">{c.agentsOnline.toLocaleString()}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-1.5"><p className="text-gray-400">Compliance</p><p className="font-black text-emerald-600">{c.complianceScore}%</p></div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className={`text-[10px] font-bold ${st.cls}`}>{st.label}</span>
                                            <button onClick={() => setActiveTenant(c.name)} className="text-[10px] font-bold text-blue-700 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">View →</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Onboarding Wizard */}
            {wizard && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-black text-gray-800">Client Onboarding — Step {step + 1} of {ONBOARDING_STEPS.length}</h2>
                                <button onClick={() => { setWizard(false); setStep(0); }} className="text-gray-400 hover:text-gray-700 text-lg">✕</button>
                            </div>
                            {/* Step pills */}
                            <div className="flex items-center gap-1 mb-6">
                                {ONBOARDING_STEPS.map((s, i) => (
                                    <div key={s} className={`flex items-center gap-1 ${i < ONBOARDING_STEPS.length - 1 ? 'flex-1' : ''}`}>
                                        <div className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0 ${i < step ? 'bg-emerald-600 text-white' : i === step ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-400'}`}>{i < step ? '✓' : i + 1}</div>
                                        <span className={`text-[9px] font-bold ${i === step ? 'text-gray-800' : 'text-gray-400'} whitespace-nowrap`}>{s}</span>
                                        {i < ONBOARDING_STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
                                    </div>
                                ))}
                            </div>

                            <div className="min-h-[200px]">
                                {step === 0 && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Organization Name', 'Industry', 'Country', 'Company Size', 'Primary Contact', 'Contact Email'].map(f => (
                                            <div key={f}><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{f}</label>
                                                <input className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700/20" /></div>
                                        ))}
                                    </div>
                                )}
                                {step === 1 && (
                                    <div className="grid grid-cols-3 gap-3">
                                        {PLANS.map(p => (
                                            <div key={p.name} className={`border rounded-xl p-3 cursor-pointer hover:border-blue-200 transition-colors ${p.name === 'Professional' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                                                <p className="font-black text-gray-800 text-sm">{p.name}</p>
                                                <p className="text-blue-700 font-bold text-xs mt-0.5">{p.price}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{p.endpoints}</p>
                                                <ul className="mt-2 space-y-1">{p.features.map(f => <li key={f} className="text-[9px] text-gray-500">✓ {f}</li>)}</ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-500">Auto-generated Wazuh installation commands:</p>
                                        {['Windows', 'Linux', 'macOS'].map(os => (
                                            <div key={os} className="bg-gray-900 rounded-lg p-3 font-mono text-[10px] text-emerald-400">
                                                <p className="text-gray-500 mb-1"># {os}</p>
                                                {os === 'Windows' && `Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.7.0.msi -OutFile wazuh-agent.msi; Start-Process msiexec.exe -Wait -ArgumentList '/i wazuh-agent.msi /quiet WAZUH_MANAGER="wazuh.cybernovr.com"'`}
                                                {os === 'Linux' && `curl -so wazuh-agent.deb https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.7.0-1_amd64.deb && WAZUH_MANAGER="wazuh.cybernovr.com" dpkg -i ./wazuh-agent.deb && systemctl enable --now wazuh-agent`}
                                                {os === 'macOS' && `curl -so wazuh-agent.pkg https://packages.wazuh.com/4.x/macos/wazuh-agent-4.7.0.pkg && WAZUH_MANAGER="wazuh.cybernovr.com" installer -pkg ./wazuh-agent.pkg -target /`}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {step === 3 && (
                                    <div className="space-y-3">
                                        {['SIEM Endpoint URL', 'Ticketing System (Jira/ServiceNow)', 'Alert Email Address', 'Webhook URL (optional)'].map(f => (
                                            <div key={f}><label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{f}</label>
                                                <input className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700/20" /></div>
                                        ))}
                                    </div>
                                )}
                                {step === 4 && (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
                                        <p className="text-sm font-black text-emerald-600">Ready to Activate!</p>
                                        <p className="text-xs text-gray-500 mt-2">Review your configuration and click Activate to onboard this client.</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                {step > 0 && <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 border border-gray-200 text-gray-500 text-xs font-bold rounded-lg hover:text-gray-800 transition-colors">← Back</button>}
                                <button onClick={() => step === ONBOARDING_STEPS.length - 1 ? setWizard(false) : setStep(s => s + 1)}
                                    className="ml-auto px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">
                                    {step === ONBOARDING_STEPS.length - 1 ? '🚀 Activate Client' : 'Next →'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}
