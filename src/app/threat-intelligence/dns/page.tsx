'use client';

import { PageLayout } from '@/components/layout/PageLayout';

const DNS_QUERIES = [
    { domain: 'secure-ng-login.com', type: 'A', asset: 'WS-042', response: '185.220.101.42', category: 'Malicious C2', time: '14:22:01', status: 'Blocked' },
    { domain: 'update-windows-ng.net', type: 'A', asset: 'WS-017', response: '91.108.4.179', category: 'Phishing', time: '14:18:00', status: 'Blocked' },
    { domain: 'api.paystack.com', type: 'A', asset: 'APP-SERVER-01', response: '52.31.0.0', category: 'Legitimate', time: '14:15:00', status: 'Allowed' },
    { domain: 'xn--ng-login-secure-j8b.com', type: 'A', asset: 'WS-031', response: '185.100.87.33', category: 'DGA', time: '14:10:22', status: 'Blocked' },
    { domain: 'google.com', type: 'A', asset: 'WORKSTATION-042', response: '142.250.200.46', category: 'Legitimate', time: '14:05:10', status: 'Allowed' },
    { domain: 'mtn-ng-account.net', type: 'A', asset: 'USER-PC-018', response: '194.165.16.88', category: 'Phishing', time: '13:55:00', status: 'Blocked' },
    { domain: 'api.flutterwave.com', type: 'A', asset: 'APP-SERVER-01', response: '104.19.205.155', category: 'Legitimate', time: '13:50:00', status: 'Allowed' },
    { domain: 'c2-lazarus.tk', type: 'TXT', asset: 'WS-009', response: 'NXDOMAIN', category: 'C2 Infrastructure', time: '13:40:00', status: 'Blocked' },
    { domain: 'github.com', type: 'A', asset: 'PROD-SERVER-03', response: '140.82.112.4', category: 'Legitimate', time: '13:35:00', status: 'Allowed' },
    { domain: 'zenith-secure-login.xyz', type: 'A', asset: 'USER-PC-022', response: '45.142.212.100', category: 'Phishing', time: '13:20:00', status: 'Blocked' },
    { domain: 'windowsupdate.microsoft.com', type: 'A', asset: 'WORKSTATION-017', response: '20.188.72.9', category: 'Legitimate', time: '13:00:00', status: 'Allowed' },
    { domain: 'invoice-ng.ru', type: 'A', asset: 'WS-042', response: '91.108.56.203', category: 'Malware Distribution', time: '12:55:00', status: 'Blocked' },
    { domain: 'slack.com', type: 'A', asset: 'MGMT-WS', response: '54.192.130.83', category: 'Legitimate', time: '12:40:00', status: 'Allowed' },
    { domain: 'dga-c2-r7k9q.net', type: 'A', asset: 'WS-019', response: '185.56.83.21', category: 'DGA', time: '12:25:00', status: 'Blocked' },
    { domain: 'aws.amazon.com', type: 'A', asset: 'PROD-SERVER-03', response: '52.0.0.1', category: 'Legitimate', time: '12:00:00', status: 'Allowed' },
];

const STATUS_STYLE: Record<string, string> = {
    Blocked: 'bg-red-50 text-red-600 border-red-200',
    Allowed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};
const CAT_STYLE = (c: string) =>
    c === 'Legitimate' ? 'text-emerald-600' :
    c.includes('Phish') || c.includes('C2') || c.includes('DGA') || c.includes('Malware') ? 'text-red-600' : 'text-amber-600';

export default function DNSPage() {
    const blocked = DNS_QUERIES.filter(q => q.status === 'Blocked').length;
    const malicious = DNS_QUERIES.filter(q => q.category !== 'Legitimate').length;

    return (
        <PageLayout title="DNS Tracker">
            <div className="space-y-4">
                <div>
                    <h1 className="text-lg font-black text-gray-900">DNS Tracker</h1>
                    <p className="text-xs text-gray-500">Threat Intelligence · DNS query monitoring and threat detection</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'DNS Queries Today', v: '48,291', color: 'text-gray-900' },
                        { label: 'Blocked', v: String(blocked + 124), color: 'text-red-600' },
                        { label: 'Malicious Domains', v: String(malicious + 15), color: 'text-orange-600' },
                        { label: 'Top Queried', v: 'api.paystack.com', color: 'text-blue-700' },
                    ].map(k => (
                        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-3">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600 -mt-3 -mx-3 mb-2 rounded-t-xl" />
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{k.label}</p>
                            <p className={`text-base font-black ${k.color} truncate`}>{k.v}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    {['Domain', 'Type', 'Source Asset', 'Response', 'Category', 'Time', 'Status'].map(h => (
                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {DNS_QUERIES.map((q, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-2.5 font-mono text-gray-700 text-[10px] max-w-[200px] truncate">{q.domain}</td>
                                        <td className="px-4 py-2.5 font-mono text-gray-400 text-[10px]">{q.type}</td>
                                        <td className="px-4 py-2.5 font-mono text-gray-600 text-[10px]">{q.asset}</td>
                                        <td className="px-4 py-2.5 font-mono text-gray-500 text-[10px]">{q.response}</td>
                                        <td className={`px-4 py-2.5 font-bold text-[10px] ${CAT_STYLE(q.category)}`}>{q.category}</td>
                                        <td className="px-4 py-2.5 font-mono text-gray-400 text-[10px]">{q.time}</td>
                                        <td className="px-4 py-2.5">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_STYLE[q.status]}`}>{q.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400">Showing last 15 DNS events · Real-time updates every 30 seconds</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
