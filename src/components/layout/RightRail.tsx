import React, { useState } from 'react';

export const RightRail = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <aside
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            className={`bg-white border-l border-gray-200 h-screen sticky top-0 flex flex-col items-center py-6 shadow-sm transition-all duration-300 z-30 ${expanded ? 'w-[220px]' : 'w-[60px]'}`}
        >
            <div className="space-y-6 w-full px-3">
                {[
                    { icon: "🛡️", label: "Security Profile", desc: "Access settings" },
                    { icon: "🔔", label: "Notifications", desc: "System alerts queue" },
                    { icon: "🏢", label: "Organization", desc: "Multi-tenant routing" },
                    { icon: "💳", label: "Billing Ledger", desc: "License & metrics" },
                    { icon: "⚙️", label: "Engine Control", desc: "Global sync config" }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors w-full group">
                        <div className="text-lg text-center w-7 flex-shrink-0 group-hover:scale-110 transition-transform">{item.icon}</div>
                        {expanded && (
                            <div className="truncate">
                                <p className="text-xs font-bold text-gray-900 tracking-wide">{item.label}</p>
                                <p className="text-[10px] text-gray-400 truncate">{item.desc}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};