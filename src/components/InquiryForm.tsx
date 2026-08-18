'use client';

import { useState, type FormEvent } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

export default function InquiryForm({
  dict,
  locale,
  type = 'contact',
  productId,
  productTitle,
  defaultMessage = '',
  compact = false,
}: {
  dict: Dictionary;
  locale: Locale;
  type?: 'product' | 'contact';
  productId?: string;
  productTitle?: string;
  defaultMessage?: string;
  compact?: boolean;
}) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState(defaultMessage);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [website, setWebsite] = useState('');
  const [errorText, setErrorText] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
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
          website,
          type,
          name,
          contact,
          message,
          locale,
          product_id: productId && !productId.startsWith('demo-') ? productId : null,
          product_title: productTitle ?? null,
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
      <div className="border hairline bg-bone-dark px-6 py-10 text-center">
        <p className="font-display text-2xl">{dict.form.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-5' : 'space-y-7'}>
      {/* приманка для ботов: людям не видна, боты её заполняют */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className={compact ? 'space-y-5' : 'grid gap-5 sm:grid-cols-2'}>
        <div>
          <label className="field-label" htmlFor="if-name">
            {dict.form.name}
          </label>
          <input
            id="if-name"
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="if-contact">
            {dict.form.contact}
          </label>
          <input
            id="if-contact"
            className="field"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="if-message">
          {dict.form.message}
        </label>
        <textarea
          id="if-message"
          className="field"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {errorText && <p className="text-sm text-clay-dark">{errorText}</p>}

      <button type="submit" className="btn btn-solid" disabled={state === 'sending'}>
        {state === 'sending' ? dict.form.sending : dict.form.submit}
      </button>
    </form>
  );
}
