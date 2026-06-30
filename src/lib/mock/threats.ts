export const CTI_KPIS = {
    iocCount: '14,382', activeCampaigns: 7, emergingThreats: 3, topActor: 'Lazarus Group',
};

export const THREAT_FEEDS = [
    { name: 'VirusTotal', lastSync: '2 mins ago', newItems: '342 new IOCs', color: 'text-blue-400', dot: 'bg-blue-500' },
    { name: 'AbuseIPDB', lastSync: '5 mins ago', newItems: '128 reported IPs', color: 'text-purple-400', dot: 'bg-purple-500' },
    { name: 'AlienVault OTX', lastSync: '8 mins ago', newItems: '5 new pulses', color: 'text-orange-400', dot: 'bg-orange-500' },
    { name: 'MISP', lastSync: '15 mins ago', newItems: '2 new events', color: 'text-green-400', dot: 'bg-green-500' },
];

export const CAMPAIGNS = [
    { name: 'Operation SilverFox', actor: 'Lazarus Group', sector: 'Banking/Fintech', ttps: 'T1566, T1078', firstSeen: '12 Jun 2026', lastSeen: 'Today', severity: 'Critical', iocCount: 847 },
    { name: 'NigerPhish-2026', actor: 'Unknown TA', sector: 'Government', ttps: 'T1566.001', firstSeen: '01 May 2026', lastSeen: 'Today', severity: 'High', iocCount: 312 },
    { name: 'TelecomSweep', actor: 'APT41', sector: 'Telecom', ttps: 'T1190, T1133', firstSeen: '20 Jun 2026', lastSeen: 'Today', severity: 'High', iocCount: 203 },
    { name: 'RansomNG', actor: 'BlackCat Affiliate', sector: 'Oil & Gas', ttps: 'T1486, T1490', firstSeen: '15 Jun 2026', lastSeen: 'Today', severity: 'Critical', iocCount: 156 },
    { name: 'FinServSpy', actor: 'Scattered Spider', sector: 'Insurance/Finance', ttps: 'T1213, T1074', firstSeen: '22 Jun 2026', lastSeen: 'Today', severity: 'High', iocCount: 89 },
];

export const THREAT_ACTORS = [
    { name: 'Lazarus Group', origin: '🇰🇵 North Korea', sectors: 'Banking, Crypto, Fintech', ttps: 'T1566, T1078, T1486', lastActive: 'Today', level: 'Critical' },
    { name: 'APT41', origin: '🇨🇳 China', sectors: 'Telecom, Healthcare, Gov', ttps: 'T1190, T1133, T1059', lastActive: '2 days ago', level: 'Critical' },
    { name: 'BlackCat (ALPHV)', origin: '🇷🇺 Russia', sectors: 'Energy, Oil & Gas, Finance', ttps: 'T1486, T1490, T1041', lastActive: 'Today', level: 'Critical' },
    { name: 'Scattered Spider', origin: '🇺🇸 USA/UK', sectors: 'Insurance, Finance, Telecom', ttps: 'T1213, T1074, T1078', lastActive: '1 day ago', level: 'High' },
    { name: 'Unknown TA (NigerPhish)', origin: '🌍 Unknown', sectors: 'Government, Banking', ttps: 'T1566.001, T1204', lastActive: 'Today', level: 'High' },
];

export const IOC_FEED = [
    { type: 'IP', value: '185.220.101.47', source: 'AbuseIPDB', seen: 'Today 14:22', verdict: 'Malicious' },
    { type: 'Domain', value: 'secure-ng-login.com', source: 'VirusTotal', seen: 'Today 13:55', verdict: 'Malicious' },
    { type: 'Hash', value: 'a3f2c1b4d5e6f7a8b9c0d1e2f3a4b5c6', source: 'MISP', seen: 'Today 12:40', verdict: 'Malicious' },
    { type: 'IP', value: '91.108.4.179', source: 'OTX', seen: 'Today 11:30', verdict: 'Suspicious' },
    { type: 'Domain', value: 'zenith-bank-alert.xyz', source: 'VirusTotal', seen: 'Today 11:15', verdict: 'Malicious' },
    { type: 'URL', value: 'http://goo.su/invoice-update', source: 'AbuseIPDB', seen: 'Today 10:50', verdict: 'Malicious' },
    { type: 'Hash', value: 'f1e2d3c4b5a6978869504132ba987654', source: 'MISP', seen: 'Today 10:20', verdict: 'Malicious' },
    { type: 'IP', value: '45.142.212.100', source: 'OTX', seen: 'Today 09:45', verdict: 'Suspicious' },
    { type: 'Domain', value: 'cbn-alert-portal.net', source: 'VirusTotal', seen: 'Today 09:10', verdict: 'Malicious' },
    { type: 'Email', value: 'transfers@mtn-nigeria-secure.com', source: 'AbuseIPDB', seen: 'Today 08:30', verdict: 'Malicious' },
    { type: 'IP', value: '203.0.113.42', source: 'OTX', seen: 'Today 08:00', verdict: 'Suspicious' },
    { type: 'Hash', value: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d', source: 'MISP', seen: 'Yesterday', verdict: 'Malicious' },
    { type: 'Domain', value: 'ngcert-advisory.click', source: 'VirusTotal', seen: 'Yesterday', verdict: 'Malicious' },
    { type: 'IP', value: '185.125.190.17', source: 'AbuseIPDB', seen: 'Yesterday', verdict: 'Suspicious' },
];
