import { NextRequest, NextResponse } from 'next/server';
import { postToMake } from '@/lib/make-webhook';
import { FormData, SubmitPayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  let body: FormData;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const { name, email, company, answers } = body;

  if (!name?.trim() || !email?.trim() || !company?.trim()) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 });
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: 'Keine Antworten übermittelt' }, { status: 400 });
  }

  const payload: SubmitPayload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: body.phone?.trim() || '',
    company: company.trim(),
    answers,
    submittedAt: new Date().toISOString(),
  };

  try {
    await postToMake(payload);
  } catch (err) {
    // fire-and-forget: log but don't fail the user
    console.error('Make webhook error:', err);
  }

  return NextResponse.json({ success: true });
}
