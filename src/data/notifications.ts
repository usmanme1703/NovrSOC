export type NotifType = 'critical' | 'warning' | 'info';

export interface Notification {
    id: number;
    type: NotifType;
    title: string;
    description: string;
    time: string;
    read: boolean;
}

export const NOTIFICATIONS: Notification[] = [
    { id: 1, type: 'critical', title: 'Malware Execution Blocked',  description: 'EDR-Agent-04 isolated endpoint after macro execution.',        time: '2 min ago',  read: false },
    { id: 2, type: 'warning',  title: 'Unusual Outbound Transfer',  description: 'Network gateway flagged high-volume data egress.',             time: '18 min ago', read: false },
    { id: 3, type: 'info',     title: 'New Asset Discovered',       description: 'Exposure monitor identified a new domain asset.',              time: '1 hr ago',   read: false },
    { id: 4, type: 'critical', title: 'Brute Force Attempt',        description: 'Auth0 mitigation triggered on production gateway.',            time: '2 hr ago',   read: true  },
    { id: 5, type: 'info',     title: 'Wazuh Sync Complete',        description: '1,418 of 1,420 agents successfully synchronized.',            time: '3 hr ago',   read: true  },
    { id: 6, type: 'warning',  title: 'API Latency Spike',          description: 'Gateway latency briefly exceeded threshold at 142ms.',         time: '5 hr ago',   read: true  },
];

export const TYPE_CONFIG: Record<NotifType, {
    border: string;
    unreadBg: string;
    badge: string;
    label: string;
    dot: string;
    ring: string;
}> = {
    critical: {
        border:   'border-l-red-500',
        unreadBg: 'bg-red-50/60',
        badge:    'bg-red-100 text-red-700',
        label:    'Critical',
        dot:      'bg-red-500',
        ring:     'border-red-200',
    },
    warning: {
        border:   'border-l-amber-500',
        unreadBg: 'bg-amber-50/50',
        badge:    'bg-amber-100 text-amber-700',
        label:    'Warning',
        dot:      'bg-amber-500',
        ring:     'border-amber-200',
    },
    info: {
        border:   'border-l-blue-500',
        unreadBg: 'bg-blue-50/40',
        badge:    'bg-blue-100 text-blue-700',
        label:    'Info',
        dot:      'bg-blue-500',
        ring:     'border-blue-200',
    },
};
