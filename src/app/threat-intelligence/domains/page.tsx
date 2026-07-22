'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/layout/PageLayout';
import { getPortalContext } from '@/lib/portal-context';

interface WhoisInfo {
    registrar: string | null;
    registered: string | null;
    expires: string | null;
    days_until_expiry: number | null;
}

interface ThreatIntel {
    domain_in_ctip: boolean;
    verdict: string;
    malicious_ips: string[];
}

interface DomainAnalysisResult {
    domain: string;
    whois: WhoisInfo;
    subdomains: string[];
    ip_addresses: string[];
    threat_intel: ThreatIntel;
    risk_score: number;
    risk_factors: string[];
}

function formatDate(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function riskBadge(score: number): { label: string; style: string } {
    if (score >= 60) return { label: 'High Risk', style: 'bg-red-50 text-red-600 border-red-200' };
    if (score >= 25) return { label: 'Moderate Risk', style: 'bg-amber-50 text-amber-600 border-amber-200' };
    return { label: 'Low Risk', style: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
}

const SUSPICIOUS_KEYWORDS = ['login', 'secure', 'verify', 'account', 'update', 'confirm', 'signin', 'billing', 'reset'];

export default function DomainsPage() {
    const router = useRouter();
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DomainAnalysisResult | null>(null);

    const analyse = async () => {
        const target = domain.trim();
        if (!target) return;
        setLoading(true);
        setError(null);
        try {
            const orgId = getPortalContext().orgId;
            const res = await fetch('/api/domains/analyse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: target, ...(orgId ? { orgId } : {}) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? 'Domain analysis failed');
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Domain analysis failed');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const badge = result ? riskBadge(result.risk_score) : null;
    const recentlyRegistered = result?.whois.registered
        ? (Date.now() - new Date(result.whois.registered).getTime()) < 30 * 24 * 60 * 60 * 1000
        : false;
    const hasValidCert = result ? !result.risk_factors.includes('No valid SSL certificate found') : false;
    const suspiciousSubdomains = result ? result.subdomains.filter((s) => SUSPICIOUS_KEYWORDS.some((kw) => s.includes(kw))) : [];

    return (
        <PageLayout title="Domain Intelligence Suite">
            <div className="space-y-4">
                <div>
                    <h1 className="text-lg font-black text-gray-900">Domain Intelligence Suite</h1>
                    <p className="text-xs text-gray-500">Subdomain discovery, WHOIS lookup, and threat analysis</p>
                </div>

                {/* Search bar */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                    <div className="p-5">
                        <div className="flex gap-3">
                            <input
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && analyse()}
                                placeholder="Enter domain to analyse (e.g. cybernovr.com)"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700"
                            />
                            <button
                                onClick={analyse}
                                disabled={loading || !domain.trim()}
                                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-xs font-black rounded-lg transition-colors whitespace-nowrap"
                            >
                                {loading ? '⏳ Analysing…' : 'Analyse'}
                            </button>
                        </div>
                        {error && <p className="text-[11px] text-red-600 mt-3">{error}</p>}
                    </div>
                </div>

                {result && badge && (
                    <>
                        {/* Overview */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <p className="text-sm font-black text-gray-900 font-mono">{result.domain}</p>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${badge.style}`}>{badge.label} ({result.risk_score}/100)</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-1">Registrar</p>
                                        <p className="text-gray-700 font-bold">{result.whois.registrar ?? 'Unknown'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-1">Registered</p>
                                        <p className="text-gray-700 font-bold">{formatDate(result.whois.registered)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-1">Expires</p>
                                        <p className="text-gray-700 font-bold">{formatDate(result.whois.expires)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px] mb-1">Days Until Expiry</p>
                                        <p className={`font-bold ${result.whois.days_until_expiry !== null && result.whois.days_until_expiry < 30 ? 'text-amber-600' : 'text-gray-700'}`}>
                                            {result.whois.days_until_expiry ?? '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subdomains */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4 border-b border-gray-100">
                                <p className="text-xs font-black text-gray-800">Discovered Subdomains ({result.subdomains.length})</p>
                            </div>
                            {result.subdomains.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-8">No subdomains discovered via Certificate Transparency logs</p>
                            ) : (
                                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                {['Subdomain', 'Flag', 'Action'].map((h) => (
                                                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.subdomains.map((sub) => {
                                                const suspicious = SUSPICIOUS_KEYWORDS.some((kw) => sub.includes(kw));
                                                return (
                                                    <tr key={sub} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className="px-4 py-2 font-mono text-gray-700">{sub}</td>
                                                        <td className="px-4 py-2">
                                                            {suspicious && <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded">⚠ Suspicious</span>}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <button
                                                                onClick={() => router.push(`/threat-intelligence/dns?domain=${encodeURIComponent(sub)}`)}
                                                                className="text-[10px] font-bold text-blue-700 hover:underline"
                                                            >
                                                                Run DNS Lookup
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* IP Addresses */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="h-[3px] bg-gradient-to-r from-blue-700 via-violet-600 to-red-600" />
                            <div className="p-4 border-b border-gray-100">
                                <p className="text-xs font-black text-gray-800">Resolving IP Addresses ({result.ip_addresses.length})</p>
                            </div>
                            {result.ip_addresses.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-8">No IP addresses resolved</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                {['IP Address', 'Verdict'].map((h) => (
                                                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.ip_addresses.map((ip) => {
                                                const malicious = result.threat_intel.malicious_ips.includes(ip);
                                                return (
                                                    <tr key={ip} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className={`px-4 py-2 font-mono ${malicious ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{ip}</td>
                                                        <td className="px-4 py-2">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${malicious ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                                                {malicious ? '🔴 Malicious' : '🟢 Clean'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Threat Intelligence */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className={`h-[3px] ${result.threat_intel.domain_in_ctip ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-blue-700 via-violet-600 to-red-600'}`} />
                            <div className="p-5">
                                <p className="text-xs font-black text-gray-800 mb-3">Threat Intelligence</p>
                                {result.threat_intel.domain_in_ctip ? (
                                    <div className="space-y-1.5 text-[11px]">
                                        <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                            <span className="text-gray-400">Verdict</span>
                                            <span className="font-bold text-red-600">{result.threat_intel.verdict}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                            <span className="text-gray-400">Source</span>
                                            <span className="font-bold text-gray-700">CTIP Database</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400">Domain not found in threat intelligence database</p>
                                )}
                            </div>
                        </div>

                        {/* Risk Assessment */}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className={`h-[3px] ${badge.style.includes('red') ? 'bg-gradient-to-r from-red-600 to-red-700' : badge.style.includes('amber') ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'}`} />
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-black text-gray-800">Risk Assessment</p>
                                    <span className="text-lg font-black text-gray-900">{result.risk_score}/100</span>
                                </div>
                                <div className="space-y-1.5">
                                    {[
                                        { label: 'Domain registered recently (< 30 days)', bad: recentlyRegistered },
                                        { label: 'Domain in CTIP blocklist', bad: result.threat_intel.domain_in_ctip },
                                        { label: 'Valid SSL certificate', bad: !hasValidCert },
                                        { label: 'Resolving IPs clean', bad: result.threat_intel.malicious_ips.length > 0 },
                                        { label: 'No suspicious subdomains', bad: suspiciousSubdomains.length > 0 },
                                    ].map((c) => (
                                        <div key={c.label} className="flex items-center gap-2 text-[11px] border-b border-gray-50 pb-1.5">
                                            <span>{c.bad ? '❌' : '✅'}</span>
                                            <span className="text-gray-600">{c.label}</span>
                                        </div>
                                    ))}
                                </div>
                                {result.risk_factors.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Risk Factors</p>
                                        <ul className="space-y-1">
                                            {result.risk_factors.map((f) => (
                                                <li key={f} className="text-[11px] text-red-600">• {f}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </PageLayout>
    );
}
