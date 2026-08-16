'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export default function CustomForm({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    stone: '',
    size: '',
    finish: '',
    budget: '',
    message: '',
  });
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const set = (key: keyof typeof form) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value } as typeof prev));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setState('error');
      setErrorText(dict.form.required);
      return;
    }
    setState('sending');
    setErrorText('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'custom',
          name: form.name,
          contact: form.contact,
          message: form.message,
          locale,
          custom_stone: form.stone,
          custom_size: form.size,
          custom_finish: form.finish,
          custom_budget: form.budget,
        }),
      });
      if (!res.ok) throw new Error('failed');
      setState('done');
    } catch {
      setState('error');
      setErrorText(dict.form.error);
    }
  }

  if (state === 'done') {
    return (
      <div className="border hairline bg-bone px-6 py-14 text-center">
        <p className="font-display text-3xl">{dict.form.success}</p>
      </div>
    );
  }

  const selects: Array<{ key: keyof typeof form; label: string; options: string[] }> = [
    { key: 'stone', label: dict.custom.stone, options: dict.custom.stoneOptions },
    { key: 'size', label: dict.custom.size, options: dict.custom.sizeOptions },
    { key: 'finish', label: dict.custom.finish, options: dict.custom.finishOptions },
    { key: 'budget', label: dict.custom.budget, options: dict.custom.budgetOptions },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="cf-name">
            {dict.form.name}
          </label>
          <input id="cf-name" className="field" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="field-label" htmlFor="cf-contact">
            {dict.form.contact}
          </label>
          <input
            id="cf-contact"
            className="field"
            value={form.contact}
            onChange={set('contact')}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {selects.map((item) => (
          <div key={item.key}>
            <label className="field-label" htmlFor={`cf-${item.key}`}>
              {item.label}
            </label>
            <div className="relative">
              <select
                id={`cf-${item.key}`}
                className="field pr-6"
                value={form[item.key]}
                onChange={set(item.key)}
              >
                <option value="">—</option>
                {item.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted">
                ↓
              </span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="field-label" htmlFor="cf-message">
          {dict.custom.idea}
        </label>
        <textarea
          id="cf-message"
          className="field"
          placeholder={dict.custom.ideaPlaceholder}
          value={form.message}
          onChange={set('message')}
        />
      </div>

      {errorText && <p className="text-sm text-clay-dark">{errorText}</p>}

      <button type="submit" className="btn btn-solid" disabled={state === 'sending'}>
        {state === 'sending' ? dict.form.sending : dict.form.submit}
      </button>
    </form>
  );
}
