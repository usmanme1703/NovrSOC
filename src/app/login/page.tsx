'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok || !data.token) {
                setError('Invalid credentials');
                return;
            }
            localStorage.setItem('admin_token', data.token);
            router.push('/');
        } catch {
            setError('Invalid credentials');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-50 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                            <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-black text-gray-900">NovrSOC</h1>
                    <p className="text-xs text-gray-400 mt-1">MSSP Command Center</p>
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
                        {submitting ? 'Signing In…' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-[10px] text-gray-400 mt-6">
                    Client? Access your portal at{' '}
                    <Link href="/portal/login" className="text-blue-700 font-semibold hover:underline">/portal/login</Link>
                </p>
                <p className="text-center text-[10px] text-gray-400 mt-4">Powered by Cybernovr</p>
            </div>
        </div>
    );
}
