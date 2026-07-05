import { NextRequest, NextResponse } from 'next/server';

const CTIP_URL = process.env.CTIP_API_URL || 'http://98.89.196.60:8001';

async function proxy(req: NextRequest, path: string[]) {
    const search = req.nextUrl.search;
    const target = `${CTIP_URL}/api/ctip/${path.join('/')}${search}`;

    const res = await fetch(target, {
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text(),
    });

    const data = await res.json().catch(() => null);
    return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
    const { path } = await ctx.params;
    return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
    const { path } = await ctx.params;
    return proxy(req, path);
}
