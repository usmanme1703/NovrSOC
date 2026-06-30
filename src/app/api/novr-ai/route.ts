import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] });

const SYSTEM_PROMPT = `You are NovrAI, a senior SOC analyst assistant embedded in the NovrSOC platform — an AI-Powered MSSP and SOC-as-a-Service platform for Africa. You specialize in:
- Nigerian cybersecurity threats (NCC-CSIRT advisories, NGCERT alerts, CBN-regulated institution threats)
- African regulatory compliance (NDPA, CBN Cybersecurity Framework, NCC Framework)
- MITRE ATT&CK analysis and threat hunting
- Incident investigation and triage
- Vulnerability prioritization using SecuBreach exposure scoring
- SOAR playbook recommendations

When responding:
1. Start with a brief summary
2. List key findings as bullet points
3. Map to MITRE ATT&CK techniques where relevant (use technique IDs like T1566)
4. Provide suggested next actions
5. Include a severity assessment
6. Reference Nigerian/African context where relevant

Keep responses concise, actionable, and professional. You are talking to SOC analysts and security managers.`;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json() as { messages: Anthropic.MessageParam[] };

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid request: messages array required' }, { status: 400 });
        }

        const response = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages,
        });

        const content = response.content[0];
        if (content.type !== 'text') {
            return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 });
        }

        return NextResponse.json({ reply: content.text });
    } catch (err) {
        console.error('NovrAI API error:', err);
        return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
    }
}
