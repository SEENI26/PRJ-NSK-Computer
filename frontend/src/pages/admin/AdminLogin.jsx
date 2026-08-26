import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { useAdminAuth } from '@/components/admin/AdminAuth';
import { Logo } from '@/components/layout';

/**
 * Sign-in. Deliberately says nothing about *why* a login failed.
 *
 * The API already returns one generic message for a wrong username, a wrong
 * password and a deactivated account, so that an attacker cannot use the form
 * to discover which usernames exist. Echoing that message unchanged is the
 * whole job here — inventing a friendlier, more specific one would undo it.
 */
export default function AdminLogin() {
  const { signIn } = useAdminAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signIn(form.username, form.password);
    } catch (err) {
      setError(err.message || 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }

  const field =
    'mt-2 w-full rounded-lg border border-white/12 bg-black/40 px-4 py-3 text-[14px] ' +
    'text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent/60';

  return (
    <main className="grid min-h-[100dvh] place-items-center px-5 py-16">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="flex justify-center"><Logo /></div>

        <form onSubmit={submit} className="surface-card mt-10 rounded-2xl p-7">
          <h1 className="flex items-center gap-2.5 text-[18px] font-semibold">
            <Lock className="h-4 w-4 text-accent" aria-hidden="true" /> Admin sign-in
          </h1>
          <p className="mt-2 text-[13px] text-ink-muted">
            Manage the copy and images shown on the public site.
          </p>

          <label className="mt-7 block">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              Username or email
            </span>
            <input
              className={field}
              value={form.username}
              autoComplete="username"
              required
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </label>

          <label className="mt-5 block">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">Password</span>
            <input
              className={field}
              type="password"
              value={form.password}
              autoComplete="current-password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          {error && (
            <p role="alert" className="mt-5 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-[13px] text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-primary mt-7 inline-flex h-12 w-full items-center justify-center gap-2
                       rounded-xl bg-accent text-[15px] font-medium text-black transition-colors
                       hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Signing in…</> : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
