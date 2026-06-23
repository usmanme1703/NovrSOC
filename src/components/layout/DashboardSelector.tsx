import React from 'react';

interface SelectorProps {
    value: string;
    onChange: (val: string) => void;
}

export const DashboardSelector = ({ value, onChange }: SelectorProps) => {
    return (
        <div className="px-8 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Workspace Context:</label>
                <div className="relative">
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 px-4 py-2 pr-10 rounded-lg text-xs font-bold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] cursor-pointer shadow-sm"
                    >
                        <optgroup label="ROLE DASHBOARDS">
                            <option value="General">General Dashboard</option>
                            <option value="Executive">Executive Dashboard</option>
                            <option value="SOC Manager">SOC Manager Dashboard</option>
                            <option value="SOC Analyst">SOC Analyst Dashboard</option>
                        </optgroup>

                        <optgroup label="SERVICE DASHBOARDS">
                            <option value="Threat Intelligence">Threat Intelligence Dashboard</option>
                            <option value="Security Operations">Security Operations Dashboard</option>
                            <option value="Assets & Risk">Assets & Risk Dashboard</option>
                            <option value="Exposure Monitoring">Exposure Monitoring Dashboard</option>
                            <option value="Protection & Automation">Protection & Automation Dashboard</option>
                        </optgroup>

                        <optgroup label="PLATFORM DASHBOARDS">
                            <option value="Compliance">Compliance Dashboard</option>
                            <option value="SOAR Platform">SOAR Dashboard</option>
                            <option value="Reporting Center">Reporting Dashboard</option>
                            <option value="Customer Multi-Tenant">Customer Dashboard</option>
                            <option value="NovrAI Command Center">NovrAI Command Center</option>
                        </optgroup>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 text-xs font-bold">▼</div>
                </div>
            </div>
            <div className="text-xs text-gray-400 font-medium hidden md:block">Cross-Platform Unified Perspectives Switcher</div>
        </div>
    );
};