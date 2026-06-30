export interface Asset {
    id: string;
    name: string;
    type: 'Workstation' | 'Server' | 'Firewall' | 'Router' | 'Cloud Instance' | 'Mobile' | 'Network';
    ip: string;
    os: string;
    department: string;
    riskScore: number;
    agentStatus: 'Active' | 'Inactive' | 'Warning';
    lastSeen: string;
    openCves: number;
    internetFacing: boolean;
}

export const ASSETS: Asset[] = [
    { id: 'AST-001', name: 'WORKSTATION-042', type: 'Workstation', ip: '192.168.1.42', os: 'Windows 11', department: 'Finance', riskScore: 82, agentStatus: 'Active', lastSeen: '2 mins ago', openCves: 18, internetFacing: false },
    { id: 'AST-002', name: 'PROD-SERVER-03', type: 'Server', ip: '10.0.0.3', os: 'Ubuntu 22.04', department: 'IT', riskScore: 74, agentStatus: 'Active', lastSeen: '1 min ago', openCves: 24, internetFacing: false },
    { id: 'AST-003', name: 'MAIL-SERVER-01', type: 'Server', ip: '10.0.0.10', os: 'Windows Server 2022', department: 'IT', riskScore: 71, agentStatus: 'Active', lastSeen: '3 mins ago', openCves: 15, internetFacing: true },
    { id: 'AST-004', name: 'FIREWALL-01', type: 'Firewall', ip: '196.1.1.1', os: 'FortiOS 7.4', department: 'Network', riskScore: 82, agentStatus: 'Active', lastSeen: '1 min ago', openCves: 12, internetFacing: true },
    { id: 'AST-005', name: 'DOMAIN-CTRL-01', type: 'Server', ip: '10.0.0.2', os: 'Windows Server 2022', department: 'IT', riskScore: 71, agentStatus: 'Active', lastSeen: '2 mins ago', openCves: 9, internetFacing: false },
    { id: 'AST-006', name: 'VPN-GATEWAY', type: 'Network', ip: '196.2.1.5', os: 'Palo Alto PAN-OS', department: 'Network', riskScore: 79, agentStatus: 'Active', lastSeen: '2 mins ago', openCves: 8, internetFacing: true },
    { id: 'AST-007', name: 'BACKUP-SERVER-01', type: 'Server', ip: '10.0.0.50', os: 'Ubuntu 20.04', department: 'IT', riskScore: 45, agentStatus: 'Active', lastSeen: '10 mins ago', openCves: 3, internetFacing: false },
    { id: 'AST-008', name: 'WORKSTATION-017', type: 'Workstation', ip: '192.168.1.17', os: 'Windows 10', department: 'Operations', riskScore: 68, agentStatus: 'Active', lastSeen: '5 mins ago', openCves: 11, internetFacing: false },
    { id: 'AST-009', name: 'APP-SERVER-01', type: 'Server', ip: '10.0.1.10', os: 'CentOS 8', department: 'Engineering', riskScore: 61, agentStatus: 'Active', lastSeen: '4 mins ago', openCves: 7, internetFacing: true },
    { id: 'AST-010', name: 'USER-PC-018', type: 'Workstation', ip: '192.168.1.18', os: 'Windows 11', department: 'HR', riskScore: 55, agentStatus: 'Active', lastSeen: '8 mins ago', openCves: 5, internetFacing: false },
    { id: 'AST-011', name: 'FILE-SERVER-01', type: 'Server', ip: '10.0.0.20', os: 'Windows Server 2019', department: 'IT', riskScore: 66, agentStatus: 'Active', lastSeen: '3 mins ago', openCves: 14, internetFacing: false },
    { id: 'AST-012', name: 'DB-SERVER-01', type: 'Server', ip: '10.0.0.30', os: 'Oracle Linux 8', department: 'IT', riskScore: 72, agentStatus: 'Active', lastSeen: '2 mins ago', openCves: 16, internetFacing: false },
    { id: 'AST-013', name: 'CLOUD-PROD-01', type: 'Cloud Instance', ip: '10.128.0.5', os: 'Ubuntu 22.04 (AWS)', department: 'Engineering', riskScore: 58, agentStatus: 'Active', lastSeen: '1 min ago', openCves: 6, internetFacing: true },
    { id: 'AST-014', name: 'MGMT-WORKSTATION', type: 'Workstation', ip: '192.168.1.100', os: 'macOS 14', department: 'IT', riskScore: 44, agentStatus: 'Active', lastSeen: '7 mins ago', openCves: 2, internetFacing: false },
    { id: 'AST-015', name: 'MOBILE-EXEC-01', type: 'Mobile', ip: 'N/A', os: 'iOS 17', department: 'Executive', riskScore: 38, agentStatus: 'Warning', lastSeen: '22 mins ago', openCves: 0, internetFacing: false },
];

export const ASSET_KPIS = {
    total: 1420, online: 1418, critical: 24, unmanaged: 12,
    internetFacing: 6, avgRisk: 66,
};
