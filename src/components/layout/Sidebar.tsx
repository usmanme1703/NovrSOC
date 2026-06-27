'use client';

import { useState } from 'react';

const featureNavigation = [
    {
        group: 'Threat Intelligence',
        icon: '🛰️',
        items: ['CTI', 'Threat Advisory', 'URL Scan', 'DNS Tracker', 'Domain Monitoring'],
    },
    {
        group: 'Security Operations',
        icon: '⚔️',
        items: ['Threat Management', 'Incident Response', 'Alert Communication', 'Executive Monitoring'],
    },
    {
        group: 'Assets & Risk',
        icon: '🗂️',
        items: ['Asset Management', 'Vendor Assessment'],
    },
    {
        group: 'Exposure Monitoring',
        icon: '🔭',
        items: ['Social Monitoring', 'Website Scanning', 'Brand Monitoring'],
    },
    {
        group: 'Protection & Automation',
        icon: '⚡',
        items: ['Messaging Security', 'Mobile App Protection', 'Data Recovery', 'DMARC Enforcer', 'copyiD', 'phishiD', 'WebLogic'],
    },
];

export const Sidebar = () => {
    const [openGroup, setOpenGroup] = useState<string | null>('Threat Intelligence');

    return (
        <aside className="w-[280px] bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col z-30 select-none flex-shrink-0">

            {/* Brand */}
            <div className="h-[64px] border-b border-gray-200 px-4 flex items-center gap-3 flex-shrink-0">
                {/* Logo mark */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-[10px] font-black text-white tracking-tight">NVR</span>
                </div>
                {/* Text */}
                <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                        <p className="text-sm font-black text-gray-900 leading-none tracking-tight">NovrSOC</p>
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-600 text-white rounded border border-blue-700 leading-none flex-shrink-0">
                            MSSP
                        </span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5 leading-none">by CyberNovr</p>
                </div>
            </div>

            {/* Scrollable nav */}
            <nav className="flex-1 overflow-y-auto p-2.5 scrollbar-thin space-y-1">
                {featureNavigation.map((navGroup) => {
                    const isOpen = openGroup === navGroup.group;
                    return (
                        <div key={navGroup.group} className="rounded-xl overflow-hidden border border-gray-100">
                            <button
                                onClick={() => setOpenGroup(isOpen ? null : navGroup.group)}
                                className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors duration-150 ${
                                    isOpen ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm leading-none">{navGroup.icon}</span>
                                    <span className="text-[10px] font-bold tracking-wide text-gray-700">{navGroup.group}</span>
                                </div>
                                <span className={`text-[9px] text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            {isOpen && (
                                <div className="border-t border-gray-100 bg-gray-50/60 px-2 py-1.5 space-y-0.5">
                                    {navGroup.items.map((item) => (
                                        <div
                                            key={item}
                                            className="group px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white hover:shadow-sm transition-all duration-150 border border-transparent hover:border-gray-100"
                                        >
                                            <p className="text-[10px] font-semibold text-gray-600 group-hover:text-[#2563EB] transition-colors">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-2.5 border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <p className="text-[10px] font-bold text-gray-500 tracking-wide">Telemetry Online</p>
                </div>
            </div>
        </aside>
    );
};
