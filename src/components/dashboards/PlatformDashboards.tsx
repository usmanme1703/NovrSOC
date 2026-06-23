import React from 'react';
import { KpiCard } from '../shared/KpiCard';
import { ChartWrapper } from '../shared/ChartWrapper';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { extendedPlatformMetrics, complianceFrameworkData, msspTenantData } from '@/data/mockData';

// 1. Compliance Dashboard
export const ComplianceDashboard = () => {
    const data = extendedPlatformMetrics.compliance;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>
            <DataTable
                title="Regulatory Compliance Standards Tracking Matrix"
                columns={["Standard / Framework", "Calculated Coverage Score", "Operational Audit Status", "Last Assessed Execution Date"]}
                data={complianceFrameworkData}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{row.standard}</td>
                        <td className="px-6 py-4 font-mono font-bold text-[#2563EB]">{row.score}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.status} /></td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{row.auditDate}</td>
                    </tr>
                )}
            />
        </div>
    );
};

// 2. SOAR Dashboard
export const SoarDashboard = () => {
    const data = extendedPlatformMetrics.soar;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper title="Automated Playbook Playback Volumes & Performance Mitigation Trends">
                    <div className="w-full h-full flex items-end justify-between pt-6 font-mono text-[10px]">
                        {["Brute Force Isolate", "Phishing Cred Revoke", "Malware Contain", "API Token Cycle"].map((name, idx) => (
                            <div key={idx} className="flex flex-col items-center w-1/5">
                                <div className="w-full bg-[#7C3AED] opacity-85 rounded-t" style={{ height: `${85 - (idx * 15)}%` }}></div>
                                <span className="text-gray-500 mt-2 truncate text-center w-full">{name}</span>
                            </div>
                        ))}
                    </div>
                </ChartWrapper>
                <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-bold text-sm text-gray-900 uppercase mb-4">SOAR Orchestration Connectors Status</h3>
                    <div className="space-y-3 text-xs">
                        {["Wazuh EDR Engine API Proxy", "Office 365 Cloud Directory Service", "Palo Alto NGFW Router Layer"].map((conn, i) => (
                            <div key={i} className="flex justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <span className="font-medium text-gray-900">{conn}</span>
                                <span className="text-emerald-600 font-bold">● Connected Operational</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. Reporting Dashboard
export const ReportingDashboard = () => {
    const data = extendedPlatformMetrics.reporting;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase mb-4">Configured Automated Export Engine</h3>
                <div className="divide-y divide-gray-100">
                    {[
                        { target: "CISO Executive Overview Report", interval: "Every Monday 06:00 WAT", format: "PDF Architecture Data" },
                        { target: "CBN Regulatory Cybersecurity Compliance Export", interval: "1st of Every Calendar Month", format: "Signed XLSX Data Matrix" },
                        { target: "Internal Technical SOC Incident Analysis", interval: "Every 24 Hours Automated", format: "JSON Data Payload Blob" }
                    ].map((report, i) => (
                        <div key={i} className="py-3 flex flex-col md:flex-row justify-between items-start md:items-center text-xs">
                            <div>
                                <p className="font-bold text-gray-900">{report.target}</p>
                                <p className="text-gray-500 mt-0.5">Recurrence Timeline: {report.interval}</p>
                            </div>
                            <span className="mt-2 md:mt-0 px-2 py-1 bg-gray-100 text-gray-700 font-mono rounded border border-gray-200">{report.format}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 4. Customer Dashboard
export const CustomerDashboard = () => {
    const data = extendedPlatformMetrics.customer;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>
            <DataTable
                title="MSSP Tenant Operational Health Matrices"
                columns={["Corporate Customer Organization", "Monitored Telemetry Surface", "Active Critical Incidents", "Calculated Risk Score Index", "Service Lifecycle Node"]}
                data={msspTenantData}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{row.company}</td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.infrastructure}</td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-red-600">{row.criticals}</td>
                        <td className="px-6 py-4 font-mono font-bold">{row.health}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.status} /></td>
                    </tr>
                )}
            />
        </div>
    );
};

// 5. NovrAI Command Center (Flagship AI Capability Layout)
export const NovrAiCommandCenter = () => {
    const data = extendedPlatformMetrics.novrai;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>

            {/* Flagship Interface Feature: Natural Language Security Prompt Parsing Engine */}
            <div className="bg-gradient-to-br from-white to-blue-50/20 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-2 text-[#7C3AED] font-bold text-xs uppercase tracking-widest mb-3">
                    <span>⚡ NovrAI Cognitive Translation Engine</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Natural Language Tactical Security Query</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">Interrogate your cross-platform Wazuh, cloud infrastructure, and network data metrics cleanly without coding complex SQL or Lucene schema strings.</p>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-inner">
                    <p className="text-xs font-mono font-medium text-gray-400 mb-1">// Active Operational Core Request Example Input</p>
                    <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2.5 rounded border border-gray-100">
                        "Show me all critical phishing incidents affecting financial-sector customers during the last 30 days."
                    </p>

                    <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded w-max">
                            <span>✔ NovrAI System Synthesis Generation Completed</span>
                        </div>

                        <div className="text-xs space-y-2.5 mt-2">
                            <p className="text-gray-700"><strong>Summary:</strong> Threat matching maps 3 inbound high-impact campaigns originating from systemic spear phishing deployments targeting infrastructure components.</p>
                            <p className="text-gray-700"><strong>Risk Evaluation & Business Impact Analysis:</strong> Assessed at Medium-Critical. Threat surface points to local workstation vectors, isolated by automated tenant policy overrides before credential theft completion.</p>
                            <p className="text-gray-700"><strong>System Recommended Actions:</strong> Push DMARC enforcing profiles across monitored tenant scopes, run targeted email header trace arrays via NovrSOC core automation pipelines immediately.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};