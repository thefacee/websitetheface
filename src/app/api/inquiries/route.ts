import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Payload = {
  type?: 'product' | 'custom' | 'contact';
  name?: string;
  contact?: string;
  message?: string;
  locale?: string;
  product_id?: string | null;
  product_title?: string | null;
  custom_stone?: string;
  custom_size?: string;
  custom_finish?: string;
  custom_budget?: string;
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = (body.name || '').trim().slice(0, 200);
  const contact = (body.contact || '').trim().slice(0, 200);

  if (!name || !contact) {
    return NextResponse.json({ error: 'name and contact are required' }, { status: 400 });
  }

  const row = {
    type: body.type || 'contact',
    name,
    contact,
    message: (body.message || '').trim().slice(0, 4000) || null,
    locale: body.locale || null,
    product_id: body.product_id || null,
    product_title: body.product_title || null,
    custom_stone: body.custom_stone || null,
    custom_size: body.custom_size || null,
    custom_finish: body.custom_finish || null,
    custom_budget: body.custom_budget || null,
  };

  if (!isSupabaseConfigured()) {
    // No database yet — do not lose the lead, log it to the server output.
    console.log('[inquiry received — Supabase not configured]', row);
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('inquiries').insert(row);
    if (error) throw error;
    return NextResponse.json({ ok: true, stored: true });
  } catch (error) {
    console.error('[inquiry insert failed]', error);
    return NextResponse.json({ error: 'Could not store inquiry' }, { status: 500 });
  }
}
