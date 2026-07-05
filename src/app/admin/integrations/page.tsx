'use client';

import { PageLayout } from '@/components/layout/PageLayout';

const INTEGRATIONS = [
    {
        name: 'Wazuh SIEM', icon: '🛡',
        desc: 'Endpoint monitoring and alert collection from deployed Wazuh agents.',
        status: 'Not Connected', connected: false,
    },
    {
        name: 'MISP', icon: '🔗',
        desc: 'Threat intelligence sharing platform for IOC collaboration.',
        status: 'Not Connected', connected: false,
    },
    {
        name: 'Anthropic API', icon: '🤖',
        desc: 'NovrAI SOC analyst powered by Claude — natural language threat analysis.',
        status: 'Connected', connected: true,
    },
    {
        name: 'AlienVault OTX', icon: '🛰️',
        desc: 'Open Threat Exchange — live IOC feed and threat intelligence.',
        status: 'Connected', connected: true,
    },
    {
        name: 'Slack', icon: '💬',
        desc: 'Alert notifications and team collaboration channel integration.',
        status: 'Not Connected', connected: false,
    },
    {
        name: 'PagerDuty', icon: '📟',
        desc: 'Incident escalation, on-call management, and automated runbooks.',
        status: 'Not Connected', connected: false,
    },
];

export default function IntegrationsPage() {
    return (
        <PageLayout title="Integrations">
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Integrations</h1>
                    <p className="text-xs text-gray-400">Administration · Connect external services and data sources to NovrSOC</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {INTEGRATIONS.map(intg => (
                        <div key={intg.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                                            {intg.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">{intg.name}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                intg.connected
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-red-50 text-red-500'
                                            }`}>
                                                {intg.connected ? '● Connected' : '○ Not Connected'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed flex-1 mb-4">{intg.desc}</p>
                                <button className={`w-full py-2 text-xs font-bold rounded-lg transition-colors ${
                                    intg.connected
                                        ? 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                                        : 'bg-blue-700 hover:bg-blue-800 text-white'
                                }`}>
                                    {intg.connected ? 'Configure' : 'Connect'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}
