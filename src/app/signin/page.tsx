'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading,  setLoading]  = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">

            {/* Background grid texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="w-full max-w-md relative">

                {/* Logo + brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] shadow-lg mb-4">
                        <span className="text-sm font-black text-white tracking-tight">NVR</span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">NovrSOC</h1>
                    <p className="text-xs font-semibold text-gray-400 mt-1 tracking-wider uppercase">by CyberNovr · MSSP Platform</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" />
                    <div className="p-8">
                        <h2 className="text-base font-black text-gray-900 mb-1">Sign in to your account</h2>
                        <p className="text-xs text-gray-400 mb-6">Access your security operations dashboard.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Email */}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="analyst@cybernovr.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <a href="#" className="text-[11px] font-semibold text-[#2563EB] hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPass ? (
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="w-3.5 h-3.5 rounded border-gray-300 accent-[#2563EB] cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-xs font-medium text-gray-500 cursor-pointer select-none">
                                    Keep me signed in
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white text-sm font-bold tracking-wide shadow-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Signing in…
                                    </>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                            <Link
                                href="/"
                                className="text-xs font-semibold text-gray-400 hover:text-[#2563EB] transition-colors"
                            >
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-[11px] text-gray-400 mt-5">
                    Secured by CyberNovr · SOC Platform v1.0
                </p>
            </div>
        </div>
    );
}
