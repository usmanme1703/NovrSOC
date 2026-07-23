export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

// Mirrors the compliance_frameworks seed rows from the STEP 1 migration. This is
// static reference metadata (names/descriptions/control counts), not fabricated
// scores — actual assessment data always comes from the backend when available.
export const COMPLIANCE_FRAMEWORKS = [
    { id: 1, name: 'Nigeria Data Protection Act', shortName: 'NDPA', description: 'Nigerian data protection regulation', totalControls: 20 },
    { id: 2, name: 'CBN Cybersecurity Framework', shortName: 'CBN', description: 'Central Bank of Nigeria cybersecurity requirements', totalControls: 25 },
    { id: 3, name: 'NCC Cybersecurity Regulations', shortName: 'NCC', description: 'Nigerian Communications Commission security rules', totalControls: 20 },
    { id: 4, name: 'ISO/IEC 27001:2022', shortName: 'ISO 27001', description: 'International information security management', totalControls: 30 },
    { id: 5, name: 'PCI DSS v4.0', shortName: 'PCI-DSS', description: 'Payment card industry data security standard', totalControls: 25 },
    { id: 6, name: 'NIST Cybersecurity Framework', shortName: 'NIST CSF', description: 'NIST cybersecurity framework', totalControls: 23 },
    { id: 7, name: 'SWIFT Customer Security Programme', shortName: 'SWIFT CSP', description: 'SWIFT financial messaging security', totalControls: 22 },
];

interface BackendFrameworkScore {
    framework_id: number;
    assessed: number;
    compliant: number;
}

export async function GET(req: NextRequest) {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId is required' }, { status: 400 });

    // The compliance backend isn't deployed yet (no report_history-style endpoint
    // exists for this either) — fall through to an honest zero-assessed state
    // rather than fabricating scores. This starts returning real numbers the
    // moment GET /api/compliance?orgId= exists on the backend.
    let liveScores: BackendFrameworkScore[] = [];
    try {
        const res = await fetch(`${BACKEND_URL}/api/compliance?orgId=${encodeURIComponent(orgId)}`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) liveScores = data;
        }
    } catch {
        // ignored — honest zero-state below
    }

    const scoreById = new Map(liveScores.map((s) => [s.framework_id, s]));

    const frameworks = COMPLIANCE_FRAMEWORKS.map((f) => {
        const live = scoreById.get(f.id);
        const assessed = live?.assessed ?? 0;
        const compliant = live?.compliant ?? 0;
        return {
            id: f.id,
            name: f.name,
            shortName: f.shortName,
            description: f.description,
            totalControls: f.totalControls,
            assessed,
            compliant,
            score: f.totalControls > 0 ? Math.round((compliant / f.totalControls) * 100) : 0,
        };
    });

    return NextResponse.json(frameworks);
}

interface AssessmentBody {
    orgId?: number;
    controlId?: number;
    status?: string;
    notes?: string;
    assessedBy?: string;
}

export async function POST(req: NextRequest) {
    let body: AssessmentBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (!body.orgId || !body.controlId || !body.status) {
        return NextResponse.json({ error: 'orgId, controlId, and status are required' }, { status: 400 });
    }

    try {
        const res = await fetch(`${BACKEND_URL}/api/compliance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('backend rejected assessment');
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: 'Compliance backend is not deployed yet — this assessment was not saved.' },
            { status: 502 }
        );
    }
}
