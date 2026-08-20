'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient, isSupabaseReady } from '@/lib/supabase/client';
import SetupNotice from '@/components/admin/SetupNotice';

/**
 * Забыли пароль: письмо со ссылкой, по которой можно задать новый.
 * Ссылка ведёт на /admin/update-password.
 */
export default function AdminResetPage() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/update-password`,
      });
      if (authError) throw authError;
      setState('done');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Не удалось отправить письмо');
    }
  }

  if (!isSupabaseReady()) return <SetupNotice />;

  return (
    <div className="mx-auto max-w-sm pt-24">
      <h1 className="font-display text-3xl">Восстановление пароля</h1>
      <p className="mt-2 text-sm text-muted">
        Впишите почту, которой вы входите в админку. Пришлём ссылку для смены пароля.
      </p>

      {state === 'done' ? (
        <div className="mt-8 border hairline bg-bone-dark p-5 text-sm">
          <p>Письмо отправлено на {email}.</p>
          <p className="mt-2 text-muted">
            Если его нет во «Входящих» — посмотрите в «Спаме». Ссылка живёт один час.
          </p>
          <Link href="/admin/login" className="mt-4 inline-block underline">
            Вернуться ко входу
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {error && <p className="text-sm text-clay-dark">{error}</p>}

          <button type="submit" className="btn btn-solid w-full" disabled={state === 'sending'}>
            {state === 'sending' ? 'Отправляю...' : 'Прислать ссылку'}
          </button>

          <Link href="/admin/login" className="block text-center text-xs text-muted underline">
            Вспомнил пароль
          </Link>
        </form>
      )}
    </div>
  );
}
