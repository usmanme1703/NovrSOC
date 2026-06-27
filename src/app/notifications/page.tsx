'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NOTIFICATIONS, TYPE_CONFIG, NotifType } from '@/data/notifications';

const FILTERS: Array<'all' | NotifType> = ['all', 'critical', 'warning', 'info'];

export default function NotificationsPage() {
    const [allRead, setAllRead] = useState(false);
    const [filter, setFilter]   = useState<'all' | NotifType>('all');

    const displayed = NOTIFICATIONS.filter(n => filter === 'all' || n.type === filter);
    const totalUnread = allRead ? 0 : NOTIFICATIONS.filter(n => !n.read).length;
    const criticalCount = NOTIFICATIONS.filter(n => n.type === 'critical').length;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">

            {/* Page header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 h-[64px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15,18 9,12 15,6" />
                            </svg>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
                                <span className="text-[9px] font-black text-white">NVR</span>
                            </div>
                            <span className="font-black text-gray-900 text-sm tracking-tight">NovrSOC</span>
                            <span className="text-gray-300 select-none">/</span>
                            <span className="text-xs font-semibold text-gray-500">Notifications</span>
                        </div>
                    </div>
                    {!allRead && totalUnread > 0 && (
                        <button
                            onClick={() => setAllRead(true)}
                            className="text-xs font-semibold text-[#2563EB] hover:underline transition-colors"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Total',    value: NOTIFICATIONS.length, color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'Unread',   value: totalUnread,          color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-100' },
                        { label: 'Critical', value: criticalCount,        color: 'text-red-700',   bg: 'bg-red-50 border-red-100' },
                    ].map(stat => (
                        <div key={stat.label} className={`${stat.bg} rounded-xl border border-gray-200 p-4 shadow-sm`}>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-2">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                                filter === f
                                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                    <span className="ml-auto text-[11px] text-gray-400 font-medium">{displayed.length} notification{displayed.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Notification list */}
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white">
                    {/* Accent bar */}
                    <div className="h-[3px] bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" />

                    {displayed.length === 0 ? (
                        <div className="py-16 text-center text-gray-400 text-sm">No notifications match this filter.</div>
                    ) : (
                        displayed.map((notif, idx) => {
                            const cfg    = TYPE_CONFIG[notif.type];
                            const isRead = notif.read || allRead;
                            return (
                                <div
                                    key={notif.id}
                                    className={`border-l-[4px] ${cfg.border} ${isRead ? 'bg-white' : cfg.unreadBg} px-6 py-5 ${idx < displayed.length - 1 ? 'border-b border-gray-100' : ''} hover:brightness-[0.97] transition-all`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                                                    {cfg.label}
                                                </span>
                                                {!isRead && (
                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                                )}
                                            </div>
                                            <p className={`text-sm font-bold mb-1 ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-500 leading-relaxed">{notif.description}</p>
                                        </div>
                                        <span className="text-[11px] text-gray-400 flex-shrink-0 mt-1">{notif.time}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer link back */}
                <div className="flex items-center justify-center pt-2">
                    <Link
                        href="/"
                        className="text-xs font-semibold text-gray-400 hover:text-[#2563EB] transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
