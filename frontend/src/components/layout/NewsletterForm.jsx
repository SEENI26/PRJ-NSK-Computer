'use client';

import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';


export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    if (state === 'loading') return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState('error');
      setMessage('Enter a valid email address.');
      return;
    }

    setState('loading');
    try {
      await api.post('/newsletter/subscribe', { email });
      setState('done');
      setMessage('You are on the list. Check your inbox to confirm.');
      setEmail('');
    } catch {
      setState('error');
      setMessage('Could not subscribe right now. Please try again.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6" noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== 'idle') setState('idle');
          }}
          aria-invalid={state === 'error'}
          className={cn(
            'h-12 flex-1 rounded-xl border bg-base-700/60 px-4 text-sm text-ink placeholder:text-ink-faint',
            'transition-all duration-300 focus:border-primary/70 focus:outline-none focus:ring-4 focus:ring-primary/15',
            state === 'error' ? 'border-danger/60' : 'border-line-strong'
          )}
        />
        <button
          type="submit"
          disabled={state === 'loading' || state === 'done'}
          aria-label="Subscribe"
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-on-accent transition-all duration-300 hover:bg-primary-500 disabled:opacity-60"
        >
          {state === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : state === 'done' ? (
            <Check className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {message && (
        <p
          role="status"
          className={cn('mt-3 text-[12.5px]', state === 'error' ? 'text-tone-danger' : 'text-green-400')}
        >
          {message}
        </p>
      )}
    </form>
  );
}
