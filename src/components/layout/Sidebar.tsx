'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SidebarGroup {
    group: string;
    items: string[];
}

export const Sidebar = () => {
    const [openGroup, setOpenGroup] = useState<string | null>("Threat Intelligence");

    const featureNavigation: SidebarGroup[] = [
        { group: "Threat Intelligence", items: ["CTI", "Threat Advisory", "URL Scan", "DNS", "Domain Monitoring"] },
        { group: "Security Operations", items: ["Threat Management", "Incident Response", "Alert Communication", "Executive Monitoring"] },
        { group: "Assets & Risk", items: ["Asset Management", "Vendor Assessment"] },
        { group: "Exposure Monitoring", items: ["Social Monitoring", "Website Scanning", "Brand Monitoring"] },
        { group: "Protection & Automation", items: ["Messaging", "Mobile App", "Data Recovery", "DMARC", "copyiD", "phishiD", "WebLogic"] }
    ];

    return (
        <aside className="w-[260px] bg-white dark:bg-[#0B0F19] border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 flex flex-col z-30 select-none transition-colors duration-200">
            {/* Brand Header */}
            <div className="h-[72px] border-b border-gray-200 dark:border-gray-800 px-5 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#0B0F19]">
                <div className="flex items-center space-x-2">
                    <div className="relative h-7 w-28 dark:invert">
                        <Image src="/novrsoc.png" alt="NOVRSOC" fill priority className="object-contain object-left" />
                    </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded-md shadow-sm border border-blue-700">
                    MSSP
                </span>
            </div>

            {/* 5 Distinct Rectangle Dropdowns Navigation Container */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-150px)] scrollbar-thin">
                {featureNavigation.map((navGroup, idx) => {
                    const isOpen = openGroup === navGroup.group;
                    return (
                        <div
                            key={idx}
                            className="bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-800/80 rounded-xl overflow-hidden transition-all duration-200"
                        >
                            {/* Dropdown Card Trigger */}
                            <button
                                onClick={() => setOpenGroup(isOpen ? null : navGroup.group)}
                                className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
                            >
                                <span className="text-[11px] font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                    {navGroup.group}
                                </span>
                                <span className={`text-xs text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {/* Nested Links */}
                            <div className={`transition-all duration-200 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 border-t border-gray-100 dark:border-gray-800 p-2' : 'max-h-0'}`}>
                                <div className="space-y-0.5">
                                    {navGroup.items.map((item, itemIdx) => (
                                        <div
                                            key={itemIdx}
                                            className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer transition-all truncate"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Footer Status */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111827]/40 flex-shrink-0">
                <div className="flex items-center space-x-3 p-2 bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 tracking-wide">
                        Telemetry Feed Online
                    </p>
                </div>
            </div>
        </aside>
    );
};