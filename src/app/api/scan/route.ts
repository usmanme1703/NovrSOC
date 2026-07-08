export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

const CTIP_URL = process.env.CTIP_API_URL || 'http://138.197.188.132:8001';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';
const ABUSEIPDB_KEY = process.env.ABUSEIPDB_API_KEY;

interface SourceResult {
    name: string;
    result: string;
    detail: string;
    verdict: string;
}

interface CtipMatch {
    confidence?: number;
    source?: string;
    threat_type?: string | null;
    malware_family?: string | null;
    country?: string | null;
    first_seen?: string | null;
    tags?: string[];
}

async function checkCtip(value: string): Promise<{ source: SourceResult; match: CtipMatch | null }> {
    try {
        const res = await fetch(`${CTIP_URL}/api/ctip/iocs/${encodeURIComponent(value)}`, { cache: 'no-store' });
        const data = await res.json();
        const match: CtipMatch | null = data?.found && Array.isArray(data.matches) && data.matches.length > 0 ? data.matches[0] : null;
        return {
            source: {
                name: 'CTIP Database',
                result: match ? 'Found' : 'Not Found',
                detail: match ? `Confidence ${match.confidence ?? 0}% · source: ${match.source ?? 'unknown'}` : 'No match in CTIP database',
                verdict: match && (match.confidence ?? 0) >= 80 ? 'Malicious' : match && (match.confidence ?? 0) >= 50 ? 'Suspicious' : match ? 'Clean' : 'Unknown',
            },
            match,
        };
    } catch {
        return { source: { name: 'CTIP Database', result: 'Error', detail: 'Failed to reach CTIP database', verdict: 'Unknown' }, match: null };
    }
}

async function checkUrlhaus(value: string, type: string): Promise<{ source: SourceResult; threat: string | null; tags: string[] }> {
    try {
        const endpoint = type === 'url' ? 'url' : 'host';
        const param = type === 'url' ? 'url' : 'host';
        const res = await fetch(`https://urlhaus-api.abuse.ch/v1/${endpoint}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `${param}=${encodeURIComponent(value)}`,
        });
        const data = await res.json();
        if (data?.query_status !== 'ok') {
            return { source: { name: 'URLHaus', result: 'Not Found', detail: data?.query_status ?? 'No match', verdict: 'Unknown' }, threat: null, tags: [] };
        }
        const threat = data?.threat ?? null;
        const tags: string[] = Array.isArray(data?.tags) ? data.tags : [];
        return {
            source: {
                name: 'URLHaus',
                result: 'Found',
                detail: `Threat: ${threat ?? 'unknown'}${data?.urlhaus_reference ? ` · ${data.urlhaus_reference}` : ''}`,
                verdict: threat === 'malware_download' || threat === 'phishing' ? 'Malicious' : 'Suspicious',
            },
            threat,
            tags,
        };
    } catch {
        return { source: { name: 'URLHaus', result: 'Error', detail: 'URLHaus API unavailable or requires an Auth-Key', verdict: 'Unknown' }, threat: null, tags: [] };
    }
}

async function checkAbuseIpdb(value: string): Promise<{ source: SourceResult; score: number | null; country: string | null }> {
    if (!ABUSEIPDB_KEY) {
        return { source: { name: 'AbuseIPDB', result: 'Error', detail: 'ABUSEIPDB_API_KEY not configured', verdict: 'Unknown' }, score: null, country: null };
    }
    try {
        const res = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(value)}&maxAgeInDays=90`, {
            headers: { Key: ABUSEIPDB_KEY, Accept: 'application/json' },
        });
        const data = await res.json();
        if (data?.errors) {
            return { source: { name: 'AbuseIPDB', result: 'Error', detail: data.errors[0]?.detail ?? 'AbuseIPDB request failed', verdict: 'Unknown' }, score: null, country: null };
        }
        const score = data?.data?.abuseConfidenceScore ?? 0;
        return {
            source: {
                name: 'AbuseIPDB',
                result: `${data?.data?.totalReports ?? 0} reports`,
                detail: `Confidence score ${score}% · last reported ${data?.data?.lastReportedAt ?? 'never'}`,
                verdict: score >= 75 ? 'Malicious' : score >= 25 ? 'Suspicious' : 'Clean',
            },
            score,
            country: data?.data?.countryCode ?? null,
        };
    } catch {
        return { source: { name: 'AbuseIPDB', result: 'Error', detail: 'AbuseIPDB API unavailable', verdict: 'Unknown' }, score: null, country: null };
    }
}

function detectType(value: string): 'url' | 'ip' | 'domain' | 'hash' {
    if (/^https?:\/\//i.test(value)) return 'url';
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return 'ip';
    if (/^[a-fA-F0-9]{32}$/.test(value) || /^[a-fA-F0-9]{64}$/.test(value)) return 'hash';
    return 'domain';
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const value: string = body?.value ?? '';
        const type: string = body?.type && body.type !== 'auto' ? body.type : detectType(value);

        if (!value.trim()) {
            return NextResponse.json({ error: 'Value is required' }, { status: 400 });
        }

        const ctip = await checkCtip(value);
        const sources: SourceResult[] = [ctip.source];

        let urlhausThreat: string | null = null;
        let tags: string[] = [];
        let abuseScore: number | null = null;
        let country: string | null = ctip.match?.country ?? null;

        if (type === 'url' || type === 'domain') {
            const uh = await checkUrlhaus(value, type);
            sources.push(uh.source);
            urlhausThreat = uh.threat;
            tags = uh.tags;
        }
        if (type === 'ip') {
            const ab = await checkAbuseIpdb(value);
            sources.push(ab.source);
            abuseScore = ab.score;
            country = country ?? ab.country;
        }

        const ctipConfidence = ctip.match?.confidence ?? 0;
        const anySucceeded = sources.some(s => s.result !== 'Error');

        let verdict: 'Malicious' | 'Suspicious' | 'Clean' | 'Unknown';
        let confidence: number;

        if (!anySucceeded) {
            verdict = 'Unknown';
            confidence = 0;
        } else if (ctipConfidence >= 80 || (abuseScore ?? 0) >= 75 || urlhausThreat === 'malware_download' || urlhausThreat === 'phishing') {
            verdict = 'Malicious';
            confidence = Math.max(ctipConfidence, abuseScore ?? 0, urlhausThreat ? 90 : 0);
        } else if (ctipConfidence >= 50 || (abuseScore ?? 0) >= 25) {
            verdict = 'Suspicious';
            confidence = Math.max(ctipConfidence, abuseScore ?? 0);
        } else {
            verdict = 'Clean';
            confidence = Math.max(ctipConfidence, abuseScore ?? 0);
        }

        const result = {
            value,
            type,
            verdict,
            confidence,
            sources,
            country,
            malware_family: ctip.match?.malware_family ?? null,
            threat_type: ctip.match?.threat_type ?? urlhausThreat,
            first_seen: ctip.match?.first_seen ?? null,
            tags: [...(ctip.match?.tags ?? []), ...tags],
        };

        // Best-effort persistence — never block the scan result on this.
        fetch(`${BACKEND_URL}/api/scan-history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value, type, verdict, confidence, scanned_by: 'Admin User', result_json: result }),
        }).catch(() => {});

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
    }
}
