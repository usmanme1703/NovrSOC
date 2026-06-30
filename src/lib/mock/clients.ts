export interface Client {
    id: string; name: string; industry: string; plan: string;
    riskScore: number; activeIncidents: number; endpoints: number;
    complianceScore: number; agentsOnline: number; lastActivity: string;
    icon: string;
}

export const CLIENTS: Client[] = [
    { id: 'c1', name: 'Zenith Bank', industry: 'Banking', plan: 'Enterprise', riskScore: 72, activeIncidents: 2, endpoints: 1240, complianceScore: 91, agentsOnline: 1238, lastActivity: '2 mins ago', icon: '🏦' },
    { id: 'c2', name: 'MTN Nigeria', industry: 'Telecom', plan: 'Enterprise', riskScore: 68, activeIncidents: 5, endpoints: 3400, complianceScore: 85, agentsOnline: 3391, lastActivity: '5 mins ago', icon: '📱' },
    { id: 'c3', name: 'NNPC Limited', industry: 'Oil & Gas', plan: 'Professional', riskScore: 81, activeIncidents: 1, endpoints: 890, complianceScore: 78, agentsOnline: 884, lastActivity: '8 mins ago', icon: '⛽' },
    { id: 'c4', name: 'Flutterwave', industry: 'Fintech', plan: 'Professional', riskScore: 55, activeIncidents: 8, endpoints: 420, complianceScore: 72, agentsOnline: 417, lastActivity: '1 min ago', icon: '💳' },
    { id: 'c5', name: 'FIRS', industry: 'Government', plan: 'Enterprise', riskScore: 74, activeIncidents: 3, endpoints: 610, complianceScore: 88, agentsOnline: 608, lastActivity: '12 mins ago', icon: '🏛️' },
    { id: 'c6', name: 'Access Bank', industry: 'Banking', plan: 'Enterprise', riskScore: 79, activeIncidents: 1, endpoints: 980, complianceScore: 90, agentsOnline: 979, lastActivity: '3 mins ago', icon: '🏦' },
    { id: 'c7', name: 'Airtel Nigeria', industry: 'Telecom', plan: 'Professional', riskScore: 66, activeIncidents: 4, endpoints: 2100, complianceScore: 82, agentsOnline: 2094, lastActivity: '7 mins ago', icon: '📡' },
    { id: 'c8', name: 'NLNG', industry: 'Oil & Gas', plan: 'Essential', riskScore: 70, activeIncidents: 2, endpoints: 340, complianceScore: 75, agentsOnline: 338, lastActivity: '20 mins ago', icon: '⛽' },
    { id: 'c9', name: 'Kuda Bank', industry: 'Fintech', plan: 'Professional', riskScore: 61, activeIncidents: 6, endpoints: 210, complianceScore: 69, agentsOnline: 210, lastActivity: '4 mins ago', icon: '💸' },
    { id: 'c10', name: 'NIMC', industry: 'Government', plan: 'Essential', riskScore: 77, activeIncidents: 2, endpoints: 480, complianceScore: 84, agentsOnline: 478, lastActivity: '15 mins ago', icon: '🆔' },
];

export const MSSP_KPIS = {
    totalClients: 42, totalEndpoints: '42,000', crossClientIncidents: 28,
    clientsWithCritical: 3, avgRiskScore: 71, slaBreachRisk: 2,
};

export const ONBOARDING_STEPS = ['Organization Details', 'Plan Selection', 'Agent Deployment', 'Integration Config', 'Confirmation'];

export const PLANS = [
    { name: 'Essential', price: '₦150,000/mo', endpoints: 'Up to 200 endpoints', features: ['Wazuh SIEM', 'Basic Alerting', 'Email Notifications', '8×5 Support', 'Monthly Report'] },
    { name: 'Professional', price: '₦450,000/mo', endpoints: 'Up to 1,000 endpoints', features: ['Everything in Essential', 'SOAR Automation', 'Threat Intelligence', 'Compliance Monitoring', 'NovrAI Assistant', '24×7 Support', 'Weekly Report'] },
    { name: 'Enterprise', price: 'Custom', endpoints: 'Unlimited endpoints', features: ['Everything in Professional', 'Dedicated SOC Analyst', 'Executive Dashboard', 'SecuBreach Integration', 'Custom Integrations', 'SLA Guarantee', 'Daily Report'] },
];
