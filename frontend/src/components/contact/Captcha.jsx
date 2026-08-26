import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from '@/services/api';
import { COMPANY } from '@/data/company';
import { cn } from '@/utils/helpers';

/**
 * Image verification code.
 *
 * The server draws a short code and returns it with a signed token; the token
 * is an HMAC of the code, so nothing has to be stored between the two requests
 * and no session cookie is set. This component only carries the token and
 * whatever the visitor types back to the form.
 *
 * Accessibility, stated plainly because it is a real cost: a picture of text
 * cannot be read by a screen reader, and no amount of alt text can fix that
 * without giving the answer away. Anyone who cannot read it is told, in the
 * markup and not just visually, to phone or WhatsApp instead — which is how
 * most of this shop's enquiries arrive anyway.
 */
export function Captcha({ value, onChange, onToken, error, id = 'captcha-answer' }) {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  /*
   * The callbacks live in refs rather than in `load`'s dependency array.
   *
   * The parent passes inline arrow functions, so their identity changes on
   * every render. With them as dependencies, `load` was rebuilt each render,
   * the mount effect re-ran, and the component fetched a new code in a loop
   * until the rate limiter cut it off — which surfaced as "could not load the
   * image" rather than as the runaway request it actually was.
   */
  const onTokenRef = useRef(onToken);
  const onChangeRef = useRef(onChange);
  onTokenRef.current = onToken;
  onChangeRef.current = onChange;

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const data = await api.get('/captcha');
      setImage(data.image);
      onTokenRef.current(data.token);
      /*
       * Deliberately does not clear the parent's answer field. It used to, and
       * because a failed submit remounts this component to issue a fresh code,
       * that cleared the "code did not match" message in the same tick — the
       * visitor saw the form reset with no explanation. Clearing the answer is
       * the parent's call, and it makes it before showing the error.
       */
    } catch {
      setFailed(true);
      onTokenRef.current('');
    } finally {
      setLoading(false);
    }
  }, []);

  // Once per mount. The parent remounts this (via `key`) after a send, which
  // is what issues a fresh code for the next enquiry.
  useEffect(() => { load(); }, [load]);

  if (failed) {
    return (
      <p className="text-[12.5px] leading-relaxed text-ink-faint">
        The verification image could not be loaded.{' '}
        <button type="button" onClick={load} className="text-accent underline underline-offset-2">
          Try again
        </button>
        , or call us on{' '}
        <a href={COMPANY.phoneHref} className="text-accent underline underline-offset-2">
          {COMPANY.phone}
        </a>.
      </p>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-ink">
        Type the code shown
        <span className="ml-1 text-accent" aria-hidden="true">*</span>
        <span className="sr-only"> (required)</span>
      </label>

      <div className="mt-2.5 flex flex-wrap items-center gap-3">
        <div className="relative h-[64px] w-[192px] shrink-0 overflow-hidden rounded-lg border border-white/12 bg-black/50">
          {image && (
            <img
              src={image}
              /* Describes the control, never its contents — the code has to
                 stay unreadable to anything that is not a pair of eyes. */
              alt="Verification code image"
              className="h-full w-full object-cover"
            />
          )}
          {loading && (
            <span className="absolute inset-0 grid place-items-center text-[11px] text-ink-faint">
              Loading…
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={load}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/12
                     text-ink-muted transition-colors hover:border-white/30 hover:text-ink"
          aria-label="Show a different verification code"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
        </button>

        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={8}
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck="false"
          placeholder="5 characters"
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-help`}
          className={cn(
            'h-12 w-[168px] rounded-lg border bg-black/40 px-4 text-[15px] uppercase tracking-[0.22em]',
            'text-ink outline-none transition-colors placeholder:normal-case placeholder:tracking-normal',
            'placeholder:text-ink-faint',
            error ? 'border-red-400/60' : 'border-white/12 focus:border-accent/60',
          )}
        />
      </div>

      {error && <p className="mt-2 text-[12.5px] text-red-300">{error}</p>}

      <p id={`${id}-help`} className="mt-2 text-[12px] leading-relaxed text-ink-faint">
        Letters and numbers only, not case sensitive. Cannot read it? Use the
        refresh button, or call{' '}
        <a href={COMPANY.phoneHref} className="underline underline-offset-2 hover:text-accent">
          {COMPANY.phone}
        </a>{' '}
        and we will take the details over the phone.
      </p>
    </div>
  );
}
