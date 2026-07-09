'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPortalUser, type PortalUser } from '@/lib/portal-auth';

export default function PortalTeamPage() {
    const router = useRouter();
    const [user, setUser] = useState<PortalUser | null>(null);
    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [invited, setInvited] = useState(false);

    useEffect(() => {
        const u = getPortalUser();
        if (!u || u.portalRole !== 'org_admin') {
            router.replace('/portal/dashboard');
            return;
        }
        setUser(u);
    }, [router]);

    if (!user) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Team</h1>
                    <p className="text-xs text-gray-500">Manage who has access to your security portal</p>
                </div>
                <button onClick={() => setShowInvite(true)}
                    className="text-xs font-bold px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors">
                    + Invite Member
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                    <thead><tr className="border-b border-gray-100">
                        {['Name', 'Email', 'Role', 'Status', 'Last Login'].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        <tr className="border-b border-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-800">{user.name}</td>
                            <td className="px-4 py-3 text-gray-500">{user.email}</td>
                            <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full uppercase">{user.portalRole.replace('_', ' ')}</span></td>
                            <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded">Active</span></td>
                            <td className="px-4 py-3 text-gray-400">Now</td>
                        </tr>
                    </tbody>
                </table>
                <p className="text-[10px] text-gray-400 px-4 py-3 border-t border-gray-100">Additional team members you invite will appear here.</p>
            </div>

            {showInvite && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
                    <div className="bg-white rounded-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
                        {invited ? (
                            <div className="text-center py-4">
                                <p className="text-sm font-bold text-gray-800">Invite sent to {inviteEmail}</p>
                                <button onClick={() => { setShowInvite(false); setInvited(false); setInviteEmail(''); }}
                                    className="mt-4 text-xs font-bold text-blue-700 hover:underline">Close</button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-sm font-black text-gray-900 mb-4">Invite Team Member</h3>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
                                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-700/20" />
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => setShowInvite(false)} className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg">Cancel</button>
                                    <button onClick={() => setInvited(true)} disabled={!inviteEmail.trim()}
                                        className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors">
                                        Send Invite
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
