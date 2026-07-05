'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

const KEYS = [
    { name: 'CTIP Integration', service: 'Internal',       created: '01 Jul 2026', lastUsed: 'Today',  status: 'Active'   },
    { name: 'Anthropic API',    service: 'NovrAI',         created: '28 Jun 2026', lastUsed: 'Today',  status: 'Active'   },
    { name: 'Feed Source A',    service: 'Feed Collector', created: '01 Jul 2026', lastUsed: 'Today',  status: 'Active'   },
    { name: 'Feed Source B',    service: 'Feed Collector', created: '01 Jul 2026', lastUsed: 'Today',  status: 'Active'   },
    { name: 'Wazuh API',        service: 'SIEM',           created: 'Not configured', lastUsed: 'Never', status: 'Inactive' },
];

export default function APIKeysPage() {
    const [showNew, setShowNew] = useState(false);
    const [newName, setNewName] = useState('');
    const [newService, setNewService] = useState('');
    const [generated, setGenerated] = useState<string | null>(null);

    function handleGenerate(e: React.FormEvent) {
        e.preventDefault();
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const key = 'nsk_' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        setGenerated(key);
    }

    return (
        <PageLayout title="API Keys">
            <div className="space-y-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-black text-gray-900">API Keys</h1>
                        <p className="text-xs text-gray-400">Administration · Manage service integrations and API credentials</p>
                    </div>
                    <button onClick={() => { setShowNew(true); setGenerated(null); }}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">
                        + Generate New Key
                    </button>
                </div>

                {showNew && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                        <div className="p-5">
                            <p className="text-xs font-bold text-gray-800 mb-4">Generate New API Key</p>
                            {generated ? (
                                <div className="space-y-3">
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <p className="text-[10px] font-bold text-amber-700 mb-1">Copy this key now — it will not be shown again.</p>
                                        <p className="font-mono text-xs text-gray-800 break-all">{generated}</p>
                                    </div>
                                    <button onClick={() => { setShowNew(false); setGenerated(null); setNewName(''); setNewService(''); }}
                                        className="px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-lg">Done</button>
                                </div>
                            ) : (
                                <form onSubmit={handleGenerate} className="flex gap-3 items-end flex-wrap">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Key Name</label>
                                        <input value={newName} onChange={e => setNewName(e.target.value)} required
                                            placeholder="e.g. Production API Key"
                                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Service</label>
                                        <input value={newService} onChange={e => setNewService(e.target.value)} required
                                            placeholder="e.g. SIEM"
                                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs w-36 focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                                    </div>
                                    <button type="submit" className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors">Generate</button>
                                    <button type="button" onClick={() => setShowNew(false)} className="px-4 py-2 border border-gray-200 text-xs font-bold text-gray-500 rounded-lg">Cancel</button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['Key Name', 'Service', 'Created', 'Last Used', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {KEYS.map(k => (
                                    <tr key={k.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-800">{k.name}</td>
                                        <td className="px-4 py-3 text-gray-500">{k.service}</td>
                                        <td className="px-4 py-3 text-gray-500">{k.created}</td>
                                        <td className="px-4 py-3 text-gray-500">{k.lastUsed}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${k.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {k.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-[10px] font-bold text-red-500 hover:underline">Revoke</button>
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
