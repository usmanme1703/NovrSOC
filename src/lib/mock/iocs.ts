export interface IOC {
    id: string;
    type: 'IP' | 'Domain' | 'Hash' | 'URL' | 'Email';
    value: string;
    source: string;
    seen: string;
    verdict: 'Malicious' | 'Suspicious' | 'Clean';
    campaign?: string;
    tags: string[];
}

export const IOC_FEED: IOC[] = [
    { id: 'IOC-001', type: 'IP', value: '185.220.101.47', source: 'Feed Source B', seen: 'Today 14:22', verdict: 'Malicious', campaign: 'Operation SilverFox', tags: ['tor-exit', 'c2', 'lazarus'] },
    { id: 'IOC-002', type: 'Domain', value: 'secure-ng-login.com', source: 'VirusTotal', seen: 'Today 13:55', verdict: 'Malicious', campaign: 'NigerPhish-2026', tags: ['phishing', 'banking', 'credential-harvest'] },
    { id: 'IOC-003', type: 'Hash', value: 'a3f2c1d4e5b6...sha256', source: 'MISP', seen: 'Today 12:40', verdict: 'Malicious', campaign: 'RansomNG', tags: ['ransomware', 'blackcat', 'wiper'] },
    { id: 'IOC-004', type: 'IP', value: '91.108.4.179', source: 'Feed Source A', seen: 'Today 11:30', verdict: 'Suspicious', tags: ['russia', 'apt', 'scanning'] },
    { id: 'IOC-005', type: 'URL', value: 'http://update-ng.net/pay', source: 'URL Intelligence', seen: 'Today 10:15', verdict: 'Malicious', campaign: 'NigerPhish-2026', tags: ['phishing', 'payment', 'fintech'] },
    { id: 'IOC-006', type: 'IP', value: '45.142.212.100', source: 'Threat Feed', seen: 'Today 09:00', verdict: 'Malicious', tags: ['c2', 'emotet', 'botnet'] },
    { id: 'IOC-007', type: 'Domain', value: 'updates-chrome-ng.com', source: 'VirusTotal', seen: 'Today 08:30', verdict: 'Malicious', tags: ['phishing', 'fake-update', 'malware-delivery'] },
    { id: 'IOC-008', type: 'Hash', value: 'b9e7f2a1c4d5...sha256', source: 'MISP', seen: 'Yesterday 23:10', verdict: 'Malicious', campaign: 'TelecomSweep', tags: ['apt41', 'backdoor', 'telecom'] },
    { id: 'IOC-009', type: 'Email', value: 'no-reply@zenith-bank.com.ru', source: 'Email-Gateway', seen: 'Yesterday 20:45', verdict: 'Malicious', campaign: 'Operation SilverFox', tags: ['bec', 'spoofed', 'banking'] },
    { id: 'IOC-010', type: 'IP', value: '194.165.16.88', source: 'Feed Source B', seen: 'Yesterday 18:00', verdict: 'Suspicious', tags: ['scanning', 'vpn-probe'] },
    { id: 'IOC-011', type: 'Domain', value: 'mtn-ng-account.net', source: 'URL Intelligence', seen: 'Yesterday 15:30', verdict: 'Malicious', campaign: 'TelecomSweep', tags: ['phishing', 'telecom', 'credential-harvest'] },
    { id: 'IOC-012', type: 'URL', value: 'https://paysta-ck.com/invoice', source: 'Threat Feed', seen: 'Yesterday 12:00', verdict: 'Malicious', tags: ['phishing', 'payment', 'fintech'] },
    { id: 'IOC-013', type: 'Hash', value: 'c8a1b3e2d4f5...sha256', source: 'VirusTotal', seen: 'Yesterday 08:15', verdict: 'Malicious', tags: ['ransomware', 'blackcat'] },
    { id: 'IOC-014', type: 'IP', value: '103.102.166.224', source: 'Feed Source A', seen: '2 days ago', verdict: 'Suspicious', tags: ['china', 'apt', 'scanning'] },
    { id: 'IOC-015', type: 'Domain', value: 'nnpc-login-portal.tk', source: 'MISP', seen: '2 days ago', verdict: 'Malicious', campaign: 'NigerPhish-2026', tags: ['phishing', 'oil-gas', 'government'] },
];

export const IOC_KPIS = {
    total: 14382, newToday: 342, activeCampaigns: 7, emergingThreats: 3,
    topActor: 'Lazarus Group', blockedToday: 128,
};

export const CAMPAIGNS = [
    { name: 'Operation SilverFox', actor: 'Lazarus Group', sector: 'Banking/Fintech', ttps: ['T1566', 'T1078', 'T1055'], firstSeen: '12 Jun 2026', lastSeen: 'Today', severity: 'Critical', iocs: 847 },
    { name: 'NigerPhish-2026', actor: 'Unknown TA', sector: 'Government', ttps: ['T1566.001', 'T1056'], firstSeen: '01 May 2026', lastSeen: 'Today', severity: 'High', iocs: 312 },
    { name: 'TelecomSweep', actor: 'APT41', sector: 'Telecom', ttps: ['T1190', 'T1133', 'T1021'], firstSeen: '20 Jun 2026', lastSeen: 'Today', severity: 'High', iocs: 203 },
    { name: 'RansomNG', actor: 'BlackCat/ALPHV', sector: 'Oil & Gas', ttps: ['T1486', 'T1490', 'T1489'], firstSeen: '15 Jun 2026', lastSeen: 'Today', severity: 'Critical', iocs: 156 },
    { name: 'GovSpear-NG', actor: 'Unknown TA', sector: 'Government/FIRS', ttps: ['T1566.002', 'T1078'], firstSeen: '10 Jun 2026', lastSeen: '25 Jun 2026', severity: 'High', iocs: 89 },
    { name: 'FinCred-2026', actor: 'FIN7', sector: 'Banking', ttps: ['T1110.004', 'T1059'], firstSeen: '05 Jun 2026', lastSeen: '20 Jun 2026', severity: 'High', iocs: 412 },
    { name: 'DDoS-Telecom', actor: 'Unknown Hacktivist', sector: 'Telecom', ttps: ['T1498', 'T1499'], firstSeen: '01 Jun 2026', lastSeen: '28 Jun 2026', severity: 'Medium', iocs: 22 },
];
