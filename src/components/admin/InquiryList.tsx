'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient, isSupabaseReady } from '@/lib/supabase/client';
import SetupNotice from './SetupNotice';
import type { Inquiry } from '@/lib/supabase/types';

/** Контакт приходит одной строкой: телефон, email или ник в Telegram. */
function contactLink(value: string) {
  const raw = value.trim();
  if (raw.includes('@') && raw.includes('.')) return { href: `mailto:${raw}`, kind: 'email' };
  if (raw.startsWith('@')) return { href: `https://t.me/${raw.slice(1)}`, kind: 'telegram' };
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.length >= 8) return { href: `tel:${digits}`, kind: 'phone', digits };
  return { href: null, kind: 'text' };
}

const STATUS_LABEL: Record<Inquiry['status'], string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Закрыта',
};

const TYPE_LABEL: Record<Inquiry['type'], string> = {
  product: 'Товар',
  custom: 'Индивидуальный',
  contact: 'Контакт',
};

export default function InquiryList() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | Inquiry['status']>('all');

  const ready = isSupabaseReady();

  const load = useCallback(async () => {
    if (!ready) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (dbError) throw dbError;
      setItems((data as Inquiry[]) ?? []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }, [ready]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(item: Inquiry, status: Inquiry['status']) {
    const supabase = createClient();
    await supabase.from('inquiries').update({ status }).eq('id', item.id);
    setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, status } : row)));
  }

  const visible = filter === 'all' ? items : items.filter((item) => item.status === filter);
  const fresh = items.filter((item) => item.status === 'new').length;

  if (!ready) return <SetupNotice />;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Заявки</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? '...' : `всего ${items.length}${fresh ? ` · новых ${fresh}` : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'in_progress', 'done'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full border px-4 py-1.5 text-xs ${
                filter === key ? 'border-ink bg-ink text-bone' : 'border-ink/20 text-muted'
              }`}
            >
              {key === 'all' ? 'Все' : STATUS_LABEL[key]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-6 border hairline bg-bone-dark p-4 text-sm text-clay-dark">{error}</p>
      )}

      {!loading && visible.length === 0 && !error && (
        <p className="mt-10 text-muted">Заявок нет.</p>
      )}

      <div className="mt-8 space-y-4">
        {visible.map((item) => (
          <article key={item.id} className="border hairline bg-bone-dark p-5">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="rounded-full bg-ink/10 px-2.5 py-1">{TYPE_LABEL[item.type]}</span>
              <span>{new Date(item.created_at).toLocaleString()}</span>
              {item.locale && <span className="uppercase">{item.locale}</span>}
            </div>

            <p className="mt-3 font-display text-2xl">{item.name}</p>
            {(() => {
              const link = contactLink(item.contact);
              return (
                <p className="flex flex-wrap items-center gap-4 text-sm">
                  {link.href ? (
                    <a
                      href={link.href}
                      target={link.kind === 'telegram' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {item.contact}
                    </a>
                  ) : (
                    <span>{item.contact}</span>
                  )}
                  {link.kind === 'phone' && (
                    <a
                      href={`https://wa.me/${link.digits?.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted underline hover:text-ink"
                    >
                      WhatsApp ↗
                    </a>
                  )}
                </p>
              );
            })()}

            {item.product_title && (
              <p className="mt-2 text-sm text-muted">Товар: {item.product_title}</p>
            )}

            {(item.custom_stone || item.custom_size || item.custom_finish || item.custom_budget) && (
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
                {item.custom_stone && <li>Камень: {item.custom_stone}</li>}
                {item.custom_size && <li>Размер: {item.custom_size}</li>}
                {item.custom_finish && <li>Финиш: {item.custom_finish}</li>}
                {item.custom_budget && <li>Бюджет: {item.custom_budget}</li>}
              </ul>
            )}

            {item.message && <p className="mt-3 whitespace-pre-wrap text-sm">{item.message}</p>}

            <div className="mt-4 flex gap-2 border-t hairline pt-4">
              {(['new', 'in_progress', 'done'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatus(item, status)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    item.status === status
                      ? 'border-ink bg-ink text-bone'
                      : 'border-ink/20 text-muted hover:border-ink'
                  }`}
                >
                  {STATUS_LABEL[status]}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
