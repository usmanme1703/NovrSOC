export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'Open' | 'Investigating' | 'Escalated' | 'Contained' | 'Resolved';

export interface Incident {
    id: string;
    severity: Severity;
    name: string;
    source: string;
    asset: string;
    status: IncidentStatus;
    analyst: string;
    sla: string;
    slaMinutes: number;
    mitre: string;
    description: string;
    affectedAssets: string[];
    timeline: { time: string; event: string; source: string }[];
    suggestedActions: string[];
    created: string;
}

export const INCIDENTS: Incident[] = [
    {
        id: 'INC-2026-0041', severity: 'Critical', name: 'Ransomware Execution Detected',
        source: 'EDR-Agent-04', asset: 'WORKSTATION-042', status: 'Investigating',
        analyst: 'Amaka Obi', sla: '00:18:42', slaMinutes: 18, mitre: 'T1486 — Data Encrypted for Impact',
        description: 'EDR-Agent-04 detected ransomware binary execution. 847 files encrypted before isolation.',
        affectedAssets: ['WORKSTATION-042', 'SHARED-DRIVE-01'],
        timeline: [
            { time: '14:10:22', event: 'Suspicious process spawned: cmd.exe → powershell.exe', source: 'WORKSTATION-042' },
            { time: '14:10:45', event: 'Encoded PowerShell command executed', source: 'WORKSTATION-042' },
            { time: '14:11:03', event: 'Credential dump attempt (LSASS)', source: 'WORKSTATION-042' },
            { time: '14:11:18', event: 'Lateral movement attempt to DOMAIN-CTRL-01', source: 'Network' },
            { time: '14:11:35', event: 'Ransomware binary dropped — invoice_Q2.exe', source: 'WORKSTATION-042' },
            { time: '14:11:41', event: 'File encryption started — 847 files affected', source: 'WORKSTATION-042' },
            { time: '14:11:49', event: 'EDR isolation triggered', source: 'WORKSTATION-042' },
            { time: '14:12:02', event: 'Alert fired → Case created', source: 'NovrSOC Platform' },
        ],
        suggestedActions: ['Isolate endpoint immediately', 'Capture memory dump', 'Check for lateral movement', 'Notify CISO', 'Initiate ransomware playbook'],
        created: '2026-06-28 14:12',
    },
    {
        id: 'INC-2026-0040', severity: 'Critical', name: 'BEC Attack on Finance Team',
        source: 'Email-Gateway', asset: 'MAIL-SERVER-01', status: 'Escalated',
        analyst: 'Chidi Nwosu', sla: '00:05:10', slaMinutes: 5, mitre: 'T1566.002 — Spearphishing Link',
        description: 'Business Email Compromise detected targeting finance team. Wire transfer request identified.',
        affectedAssets: ['MAIL-SERVER-01', 'FINANCE-PC-07'],
        timeline: [{ time: '13:45:00', event: 'Phishing email received', source: 'Email-Gateway' }],
        suggestedActions: ['Block sender domain', 'Alert finance team', 'Freeze pending transfers', 'Notify CBN-CSIRT'],
        created: '2026-06-28 13:45',
    },
    {
        id: 'INC-2026-0039', severity: 'High', name: 'Brute Force on SSH',
        source: 'Wazuh-Agent', asset: 'PROD-SERVER-03', status: 'Open',
        analyst: 'Unassigned', sla: '01:42:00', slaMinutes: 102, mitre: 'T1110 — Brute Force',
        description: '1,240 failed SSH login attempts from IP 185.220.101.47 in 60 seconds.',
        affectedAssets: ['PROD-SERVER-03'],
        timeline: [{ time: '12:30:00', event: 'Brute force threshold exceeded', source: 'Wazuh' }],
        suggestedActions: ['Block source IP', 'Enable account lockout', 'Review SSH access logs'],
        created: '2026-06-28 12:30',
    },
    {
        id: 'INC-2026-0038', severity: 'High', name: 'Lateral Movement Detected',
        source: 'SIEM-Correlation', asset: 'WORKSTATION-017', status: 'Investigating',
        analyst: 'Tunde Adeyemi', sla: '00:55:30', slaMinutes: 55, mitre: 'T1021 — Remote Services',
        description: 'SIEM correlation detected pass-the-hash lateral movement across workstations.',
        affectedAssets: ['WORKSTATION-017', 'WORKSTATION-023', 'DOMAIN-CTRL-01'],
        timeline: [{ time: '13:10:00', event: 'Pass-the-hash detected', source: 'SIEM' }],
        suggestedActions: ['Reset affected credentials', 'Enable Windows Defender Credential Guard', 'Review RDP logs'],
        created: '2026-06-28 13:10',
    },
    {
        id: 'INC-2026-0037', severity: 'Medium', name: 'Unusual Outbound Transfer',
        source: 'Network-Gateway', asset: 'FIREWALL-01', status: 'Open',
        analyst: 'Unassigned', sla: '03:10:00', slaMinutes: 190, mitre: 'T1041 — Exfiltration Over C2',
        description: 'High-volume outbound data transfer detected (4.2GB to external IP).',
        affectedAssets: ['FIREWALL-01', 'DB-SERVER-01'],
        timeline: [{ time: '11:00:00', event: 'Outbound transfer threshold exceeded', source: 'Network-Gateway' }],
        suggestedActions: ['Block destination IP', 'Review DLP policies', 'Capture packet trace'],
        created: '2026-06-28 11:00',
    },
    {
        id: 'INC-2026-0036', severity: 'Critical', name: 'Domain Controller Compromise Attempt',
        source: 'Wazuh-Agent', asset: 'DOMAIN-CTRL-01', status: 'Contained',
        analyst: 'Ngozi Eze', sla: '02:20:00', slaMinutes: 140, mitre: 'T1078 — Valid Accounts',
        description: 'Abnormal admin account activity on domain controller detected after hours.',
        affectedAssets: ['DOMAIN-CTRL-01'],
        timeline: [{ time: '02:14:00', event: 'Off-hours admin login detected', source: 'Wazuh' }],
        suggestedActions: ['Reset admin credentials', 'Enable MFA on domain admin', 'Review AD audit logs'],
        created: '2026-06-28 02:14',
    },
    {
        id: 'INC-2026-0035', severity: 'High', name: 'PowerShell Empire Detected',
        source: 'EDR-Agent-07', asset: 'WORKSTATION-031', status: 'Resolved',
        analyst: 'Emeka Okonkwo', sla: 'SLA Met', slaMinutes: 0, mitre: 'T1059.001 — PowerShell',
        description: 'PowerShell Empire C2 framework detected and blocked.',
        affectedAssets: ['WORKSTATION-031'],
        timeline: [{ time: '09:30:00', event: 'Empire beacon detected', source: 'EDR' }],
        suggestedActions: ['Block C2 domain', 'Scan for persistence', 'Review execution policy'],
        created: '2026-06-28 09:30',
    },
    {
        id: 'INC-2026-0034', severity: 'Medium', name: 'Malware Dropper via Email',
        source: 'Email-Gateway', asset: 'MAIL-SERVER-01', status: 'Investigating',
        analyst: 'Fatima Hassan', sla: '04:05:00', slaMinutes: 245, mitre: 'T1566.001 — Spearphishing Attachment',
        description: 'Malicious macro-enabled document attached to targeted email.',
        affectedAssets: ['MAIL-SERVER-01'],
        timeline: [{ time: '10:15:00', event: 'Malicious attachment detected', source: 'Email-Gateway' }],
        suggestedActions: ['Quarantine email', 'Block sender', 'Notify recipients'],
        created: '2026-06-28 10:15',
    },
    {
        id: 'INC-2026-0033', severity: 'Low', name: 'Port Scan from Internal Host',
        source: 'Wazuh-Agent', asset: 'WORKSTATION-008', status: 'Open',
        analyst: 'Unassigned', sla: '08:00:00', slaMinutes: 480, mitre: 'T1046 — Network Service Discovery',
        description: 'Internal host performing TCP port scan across subnet.',
        affectedAssets: ['WORKSTATION-008'],
        timeline: [{ time: '08:45:00', event: 'Port scan threshold exceeded', source: 'Wazuh' }],
        suggestedActions: ['Investigate host', 'Check for rogue security tools', 'Review network policy'],
        created: '2026-06-28 08:45',
    },
    {
        id: 'INC-2026-0032', severity: 'High', name: 'Credential Stuffing on VPN',
        source: 'VPN-Gateway', asset: 'VPN-GATEWAY', status: 'Open',
        analyst: 'Unassigned', sla: '02:30:00', slaMinutes: 150, mitre: 'T1078 — Valid Accounts',
        description: '3,200 failed VPN authentication attempts using credential lists.',
        affectedAssets: ['VPN-GATEWAY'],
        timeline: [{ time: '07:20:00', event: 'Credential stuffing detected', source: 'VPN-Gateway' }],
        suggestedActions: ['Enable CAPTCHA', 'Rate limit VPN auth', 'Notify NCC-CSIRT'],
        created: '2026-06-28 07:20',
    },
    {
        id: 'INC-2026-0031', severity: 'Medium', name: 'Suspicious DNS Queries',
        source: 'DNS-Monitor', asset: 'DNS-SERVER-01', status: 'Investigating',
        analyst: 'Chidi Nwosu', sla: '05:15:00', slaMinutes: 315, mitre: 'T1568 — Dynamic Resolution',
        description: 'Host performing DNS queries to algorithmically generated domains (DGA).',
        affectedAssets: ['DNS-SERVER-01', 'WORKSTATION-019'],
        timeline: [{ time: '06:50:00', event: 'DGA domain queries detected', source: 'DNS-Monitor' }],
        suggestedActions: ['Block DGA domains', 'Investigate source host', 'Check for C2 beaconing'],
        created: '2026-06-28 06:50',
    },
    {
        id: 'INC-2026-0030', severity: 'Low', name: 'Failed Backup Job',
        source: 'Backup-Agent', asset: 'BACKUP-SERVER-01', status: 'Resolved',
        analyst: 'IT-Admin', sla: 'SLA Met', slaMinutes: 0, mitre: 'N/A',
        description: 'Scheduled backup failed due to storage capacity issue.',
        affectedAssets: ['BACKUP-SERVER-01'],
        timeline: [{ time: '03:00:00', event: 'Backup job failed — disk full', source: 'Backup-Agent' }],
        suggestedActions: ['Clear storage space', 'Review backup retention policy'],
        created: '2026-06-28 03:00',
    },
];

export const INCIDENT_KPIS = {
    totalOpen: 8, investigating: 3, escalated: 2, contained: 1, avgSLA: 47,
};
