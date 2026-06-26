import { KpiCard } from '../shared/KpiCard';
import { ChartWrapper } from '../shared/ChartWrapper';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { extendedPlatformMetrics, complianceFrameworkData, msspTenantData } from '@/data/mockData';

export const ComplianceDashboard = () => {
    const data = extendedPlatformMetrics.compliance;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>
            <DataTable
                title="Regulatory Compliance Standards Tracking Matrix"
                columns={['Standard / Framework', 'Coverage Score', 'Audit Status', 'Last Assessed']}
                data={complianceFrameworkData}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{row.standard}</td>
                        <td className="px-6 py-4 font-mono font-bold text-[#2563EB]">{row.score}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.status} /></td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">{row.auditDate}</td>
                    </tr>
                )}
            />
        </div>
    );
};

export const SoarDashboard = () => {
    const data = extendedPlatformMetrics.soar;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper title="Automated Playbook Playback Volumes & Mitigation Trends">
                    <div className="w-full h-full flex items-end justify-between gap-4 pt-4">
                        {['Brute Force Isolate', 'Phishing Cred Revoke', 'Malware Contain', 'API Token Cycle'].map((name, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1 h-full group">
                                <div
                                    className="w-full bg-gradient-to-t from-[#7C3AED] to-[#A78BFA] rounded-t opacity-70 group-hover:opacity-100 transition-all duration-200"
                                    style={{ height: `${85 - idx * 15}%` }}
                                />
                                <span className="text-[9px] text-gray-400 mt-2 text-center leading-tight font-medium">{name}</span>
                            </div>
                        ))}
                    </div>
                </ChartWrapper>

                <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-700 text-[11px] tracking-widest uppercase mb-5">SOAR Orchestration Connectors</h3>
                    <div className="space-y-3">
                        {['Wazuh EDR Engine API Proxy', 'Office 365 Cloud Directory Service', 'Palo Alto NGFW Router Layer'].map((conn, i) => (
                            <div key={i} className="flex justify-between items-center p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                                <span className="font-semibold text-xs text-gray-800">{conn}</span>
                                <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Connected
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ReportingDashboard = () => {
    const data = extendedPlatformMetrics.reporting;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm">Configured Automated Export Engine</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {[
                        { target: 'CISO Executive Overview Report',          interval: 'Every Monday 06:00 WAT',       format: 'PDF Architecture Data' },
                        { target: 'CBN Regulatory Cybersecurity Compliance', interval: '1st of Every Calendar Month', format: 'Signed XLSX Matrix' },
                        { target: 'Internal Technical SOC Incident Analysis',interval: 'Every 24 Hours Automated',     format: 'JSON Payload Blob' },
                    ].map((report, i) => (
                        <div key={i} className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="font-bold text-xs text-gray-900">{report.target}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{report.interval}</p>
                            </div>
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 font-mono text-[10px] rounded-lg border border-gray-200 flex-shrink-0">
                                {report.format}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CustomerDashboard = () => {
    const data = extendedPlatformMetrics.customer;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>
            <DataTable
                title="MSSP Tenant Operational Health Matrices"
                columns={['Customer Organization', 'Telemetry Surface', 'Critical Incidents', 'Risk Score', 'Service Node']}
                data={msspTenantData}
                renderRow={(row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 text-sm">{row.company}</td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-600">{row.infrastructure}</td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-red-600">{row.criticals}</td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-900">{row.health}</td>
                        <td className="px-6 py-4"><StatusBadge value={row.status} /></td>
                    </tr>
                )}
            />
        </div>
    );
};

export const NovrAiCommandCenter = () => {
    const data = extendedPlatformMetrics.novrai;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(data).map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#7C3AED] text-xs font-black uppercase tracking-widest">⚡ NovrAI Cognitive Translation Engine</span>
                </div>
                <h3 className="text-base font-black text-gray-900 tracking-tight">Natural Language Tactical Security Query</h3>
                <p className="text-xs text-gray-500 mt-1 mb-5">
                    Interrogate your cross-platform Wazuh, cloud infrastructure, and network data without writing SQL or Lucene queries.
                </p>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-inner">
                    <p className="text-[10px] font-mono font-bold text-gray-400 mb-2 uppercase tracking-wider">// Active Request Input</p>
                    <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                        "Show me all critical phishing incidents affecting financial-sector customers during the last 30 days."
                    </p>

                    <div className="mt-5 border-t border-gray-100 pt-5 space-y-3">
                        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            NovrAI Synthesis Completed
                        </div>
                        <div className="text-xs space-y-2.5 text-gray-700">
                            <p><strong className="text-gray-900">Summary:</strong> 3 inbound high-impact campaigns from spear phishing deployments targeting infrastructure components.</p>
                            <p><strong className="text-gray-900">Risk Evaluation:</strong> Medium-Critical. Threat surface isolated by automated tenant policy overrides before credential theft.</p>
                            <p><strong className="text-gray-900">Recommended Actions:</strong> Push DMARC enforcing profiles across monitored tenant scopes, run email header trace via NovrSOC pipelines.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
