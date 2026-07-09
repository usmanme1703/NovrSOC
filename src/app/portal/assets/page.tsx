'use client';

import { useEffect, useState } from 'react';
import { getPortalToken, getPortalUser } from '@/lib/portal-auth';

interface Asset {
    id: string;
    name: string;
    status: string;
    os: string | null;
    ip: string | null;
    lastKeepAlive: string | null;
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
            className="text-[10px] font-bold px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
        >
            {copied ? 'Copied ✓' : 'Copy Install Command'}
        </button>
    );
}

export default function PortalAssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const user = getPortalUser();
    const group = user?.orgId === 1 ? 'default' : (user?.orgName ?? 'client').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    useEffect(() => {
        const token = getPortalToken();
        fetch('/api/portal/assets', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
            .then((r) => r.json())
            .then((d) => setAssets(Array.isArray(d?.assets) ? d.assets : []))
            .catch(() => setAssets([]))
            .finally(() => setLoading(false));
    }, []);

    const winCmd = `msiexec /i wazuh-agent.msi WAZUH_MANAGER="164.92.203.205" WAZUH_AGENT_GROUP="${group}"`;
    const linuxCmd = `curl -so wazuh-agent.deb https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.12.0-1_amd64.deb && WAZUH_MANAGER='164.92.203.205' WAZUH_AGENT_GROUP='${group}' dpkg -i ./wazuh-agent.deb`;

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-black text-gray-900">Assets</h1>
                <p className="text-xs text-gray-500">Endpoints connected to your Cybernovr monitoring group</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-6 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}</div>
                ) : assets.length === 0 ? (
                    <div className="p-8 space-y-4">
                        <p className="text-sm text-gray-600 text-center">No endpoints connected. Install the Cybernovr agent to begin monitoring.</p>
                        <div className="space-y-3 max-w-xl mx-auto">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Windows</p>
                                    <CopyButton text={winCmd} />
                                </div>
                                <code className="text-[10px] text-gray-700 break-all">{winCmd}</code>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Linux</p>
                                    <CopyButton text={linuxCmd} />
                                </div>
                                <code className="text-[10px] text-gray-700 break-all">{linuxCmd}</code>
                            </div>
                        </div>
                    </div>
                ) : (
                    <table className="w-full text-xs">
                        <thead><tr className="border-b border-gray-100">
                            {['Asset Name', 'OS', 'Status', 'Last Seen', 'Risk'].map((h) => (
                                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {assets.map((a) => (
                                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-gray-800">{a.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{a.os ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {a.status === 'active' ? '🟢 Active' : '🔴 Offline'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{a.lastKeepAlive ? new Date(a.lastKeepAlive).toLocaleString() : '—'}</td>
                                    <td className="px-4 py-3"><span className="text-[10px] font-bold text-emerald-600">Low</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
