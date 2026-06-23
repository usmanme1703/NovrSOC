import React from 'react';

interface SidebarGroup {
    group: string;
    items: string[];
}

export const Sidebar = () => {
    // Configured exactly to spec to keep navigation scalable as CyberNovr grows
    const featureNavigation: SidebarGroup[] = [
        {
            group: "Threat Intelligence",
            items: ["CTI", "Threat Advisory", "URL Scan", "DNS", "Domain Monitoring"]
        },
        {
            group: "Security Operations",
            items: ["Threat Management", "Incident Response", "Alert Communication", "Executive Monitoring"]
        },
        {
            group: "Assets & Risk",
            items: ["Asset Management", "Vendor Assessment"]
        },
        {
            group: "Exposure Monitoring",
            items: ["Social Monitoring", "Website Scanning", "Brand Monitoring"]
        },
        {
            group: "Protection & Automation",
            items: ["Messaging", "Mobile App", "Data Recovery", "DMARC", "copyiD", "phishiD", "WebLogic"]
        }
    ];

    return (
        <aside className="w-[260px] bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col z-30 select-none">
            {/* Brand Header */}
            <div className="h-[72px] border-b border-gray-200 px-6 flex items-center space-x-3 flex-shrink-0">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-black text-sm tracking-wider">
                    Ω
                </div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    NovrSOC
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">
                    MSSP
                </span>
            </div>

            {/* Navigation Streams */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                {featureNavigation.map((navGroup, idx) => (
                    <div key={idx} className="space-y-1">
                        <h5 className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                            {navGroup.group}
                        </h5>
                        {navGroup.items.map((item, itemIdx) => (
                            <div
                                key={itemIdx}
                                className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-[#2563EB] hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-150 truncate"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                ))}
            </nav>

            {/* System Status Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
                <div className="flex items-center space-x-3 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-600 tracking-wide">
                        Telemetry Feed Online
                    </p>
                </div>
            </div>
        </aside>
    );
};