export interface Vendor {
    id: string;
    name: string;
    category: string;
    riskScore: number;
    lastAssessed: string;
    issuesFound: number;
    status: 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical';
    contact: string;
    criticality: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const VENDORS: Vendor[] = [
    { id: 'VND-001', name: 'Microsoft', category: 'Software', riskScore: 32, lastAssessed: '15 Jun 2026', issuesFound: 0, status: 'Low Risk', contact: 'enterprise@microsoft.com', criticality: 'Critical' },
    { id: 'VND-002', name: 'Amazon Web Services', category: 'Cloud', riskScore: 28, lastAssessed: '01 Jun 2026', issuesFound: 1, status: 'Low Risk', contact: 'aws-support@amazon.com', criticality: 'Critical' },
    { id: 'VND-003', name: 'Fortinet', category: 'Network Security', riskScore: 45, lastAssessed: '20 May 2026', issuesFound: 2, status: 'Medium Risk', contact: 'partners@fortinet.com', criticality: 'High' },
    { id: 'VND-004', name: 'Oracle', category: 'Database', riskScore: 61, lastAssessed: '10 Apr 2026', issuesFound: 4, status: 'High Risk', contact: 'oracle-support@oracle.com', criticality: 'High' },
    { id: 'VND-005', name: 'SAP Nigeria', category: 'ERP', riskScore: 55, lastAssessed: '15 Mar 2026', issuesFound: 3, status: 'Medium Risk', contact: 'sap.ng@sap.com', criticality: 'Medium' },
    { id: 'VND-006', name: 'Spectranet ISP', category: 'Network / ISP', riskScore: 78, lastAssessed: '01 Feb 2026', issuesFound: 6, status: 'Critical', contact: 'enterprise@spectranet.com', criticality: 'High' },
    { id: 'VND-007', name: 'Paystack', category: 'Payment Gateway', riskScore: 41, lastAssessed: '10 Jun 2026', issuesFound: 1, status: 'Medium Risk', contact: 'enterprise@paystack.com', criticality: 'Critical' },
    { id: 'VND-008', name: 'Interswitch', category: 'Fintech / Payment', riskScore: 49, lastAssessed: '01 May 2026', issuesFound: 2, status: 'Medium Risk', contact: 'corporate@interswitch.com', criticality: 'High' },
];

export const VENDOR_KPIS = {
    total: 8, criticalVendors: 4, avgRisk: 49, overdueAssessments: 3,
    highRisk: 2, criticalRisk: 1,
};
