export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://138.197.188.132:4000';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    try {
        const res = await fetch(`${BACKEND_URL}/api/vendor-assessments/${id}`, { cache: 'no-store' });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
    }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    try {
        const body = await req.text();
        const res = await fetch(`${BACKEND_URL}/api/vendor-assessments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body,
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
    }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    try {
        const res = await fetch(`${BACKEND_URL}/api/vendor-assessments/${id}`, { method: 'DELETE' });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: 'Failed to reach backend' }, { status: 502 });
    }
}
