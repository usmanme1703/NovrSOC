'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SidebarGroup {
    group: string;
    icon: string;
    items: string[];
}

const featureNavigation: SidebarGroup[] = [
    {
        group: "Threat Intelligence",
        icon: "🛰️",
        items: ["CTI", "Threat Advisory", "URL Scan", "DNS Tracker", "Domain Monitoring"],
    },
    {
        group: "Security Operations",
        icon: "⚔️",
        items: ["Threat Management", "Incident Response", "Alert Communication", "Executive Monitoring"],
    },
    {
        group: "Assets & Risk",
        icon: "🗂️",
        items: ["Asset Management", "Vendor Assessment"],
    },
    {
        group: "Exposure Monitoring",
        icon: "🔭",
        items: ["Social Monitoring", "Website Scanning", "Brand Monitoring"],
    },
    {
        group: "Protection & Automation",
        icon: "⚡",
        items: ["Messaging Security", "Mobile App Protection", "Data Recovery", "DMARC Enforcer", "copyiD", "phishiD", "WebLogic"],
    },
];

export const Sidebar = () => {
    const [openGroup, setOpenGroup] = useState<string | null>("Threat Intelligence");

    return (
        <aside className="w-[260px] bg-white dark:bg-[#0B0F19] border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 flex flex-col z-30 select-none transition-colors duration-200">
            {/* Brand */}
            <div className="h-[72px] border-b border-gray-200 dark:border-gray-800 px-5 flex items-center justify-between flex-shrink-0">
                <div className="relative h-7 w-28 dark:invert">
                    <Image src="/novrsoc.png" alt="NOVRSOC" fill priority className="object-contain object-left" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded-md border border-blue-700">
                    MSSP
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
                {featureNavigation.map((navGroup) => {
                    const isOpen = openGroup === navGroup.group;
                    return (
                        <div key={navGroup.group} className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => setOpenGroup(isOpen ? null : navGroup.group)}
                                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors duration-150 ${isOpen
                                        ? 'bg-gray-50 dark:bg-[#111827]'
                                        : 'bg-white dark:bg-[#0B0F19] hover:bg-gray-50 dark:hover:bg-[#111827]'
                                    }`}
                            >
                                <div className="flex items-center space-x-2.5">
                                    <span className="text-sm leading-none">{navGroup.icon}</span>
                                    <span className="text-[11px] font-bold tracking-wide text-gray-700 dark:text-gray-300">
                                        {navGroup.group}
                                    </span>
                                </div>
                                <span className={`text-[9px] text-gray-400 dark:text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {isOpen && (
                                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-[#111827]/60 px-2 py-1.5 space-y-0.5">
                                    {navGroup.items.map((item) => (
                                        <div
                                            key={item}
                                            className="group px-3 py-2 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-[#0B0F19] hover:shadow-sm transition-all duration-150 border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                        >
                                            <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
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
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                <div className="flex items-center space-x-2.5 px-3 py-2 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg">
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wide">Telemetry Feed Online</p>
                </div>
            </div>
        </aside>
    );
};
