export type NotifType = 'critical' | 'warning' | 'info';

export interface Notification {
    id: number | string;
    type: NotifType;
    title: string;
    description: string;
    time: string;
    read: boolean;
}

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
