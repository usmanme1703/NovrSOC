'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setPortalSession } from '@/lib/portal-auth';

export default function PortalLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch('/api/portal/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok || !data.token) {
                setError('Invalid credentials. Contact your security team.');
                return;
            }
            setPortalSession(data.token, data.user);
            router.push('/');
        } catch {
            setError('Invalid credentials. Contact your security team.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/novrsoc.jpg"
                        alt="NovrSOC"
                        style={{
                            height: '40px',
                            width: 'auto',
                            maxWidth: '160px',
                            objectFit: 'contain',
                            display: 'block',
                            margin: '0 auto 16px',
                        }}
                    />
                    <h1 className="text-xl font-black text-gray-900">NovrSOC Security Portal</h1>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700" />
                    </div>
                    {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                    <button type="submit" disabled={submitting}
                        className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors">
                        {submitting ? 'Signing In…' : 'Sign In to Portal'}
                    </button>
                </form>

                <p className="text-center text-[10px] text-gray-400 mt-10">
                    Cybernovr team? Sign in at{' '}
                    <Link href="/login" className="text-blue-700 font-semibold hover:underline">/login</Link>
                </p>
                <p className="text-center text-[10px] text-gray-400 mt-4">Powered by Cybernovr</p>
            </div>
        </div>
    );
}
