'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseReady } from '@/lib/supabase/client';
import SetupNotice from '@/components/admin/SetupNotice';

/**
 * Сюда ведёт ссылка из письма. Supabase к этому моменту уже создал сессию,
 * остаётся задать новый пароль.
 */
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseReady()) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('Пароль должен быть не короче 6 знаков.');
      return;
    }
    if (password !== repeat) {
      setError('Пароли не совпадают.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сменить пароль');
    } finally {
      setSaving(false);
    }
  }

  if (!isSupabaseReady()) return <SetupNotice />;

  return (
    <div className="mx-auto max-w-sm pt-24">
      <h1 className="font-display text-3xl">Новый пароль</h1>

      {!ready && (
        <p className="mt-3 text-sm text-clay-dark">
          Ссылка не опознана или устарела. Запросите новую на странице восстановления пароля.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label className="field-label" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="repeat">
            Ещё раз
          </label>
          <input
            id="repeat"
            type="password"
            className="field"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {error && <p className="text-sm text-clay-dark">{error}</p>}

        <button type="submit" className="btn btn-solid w-full" disabled={saving || !ready}>
          {saving ? 'Сохраняю...' : 'Сохранить пароль'}
        </button>
      </form>
    </div>
  );
}
