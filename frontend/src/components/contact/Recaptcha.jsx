import { useEffect, useRef, useState } from 'react';

/**
 * Google reCAPTCHA v2 — the "I'm not a robot" checkbox.
 *
 * Renders nothing at all when no site key is configured, and tells the parent
 * so via `onReady(false)`. That is deliberate: the form must never be blocked
 * by an unset config value. This site already shipped a contact form that
 * refused every enquiry because one env var was empty, and it went unnoticed
 * for months because the failure looked like a polite message.
 *
 * The script is injected on mount rather than sitting in index.html, so a
 * visitor who never reaches the contact page never loads Google's bundle.
 */

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
const SCRIPT_ID = 'recaptcha-v2';
const SRC = 'https://www.google.com/recaptcha/api.js?render=explicit';

/** Resolves once grecaptcha is on the page and ready to render. */
function loadRecaptcha() {
  if (window.grecaptcha?.render) return Promise.resolve(window.grecaptcha);

  return new Promise((resolve, reject) => {
    let script = document.getElementById(SCRIPT_ID);

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // The API object appears slightly after the script's load event, so poll
    // briefly rather than trusting onload alone.
    const started = Date.now();
    const tick = () => {
      if (window.grecaptcha?.render) return resolve(window.grecaptcha);
      if (Date.now() - started > 10000) return reject(new Error('reCAPTCHA did not load'));
      return setTimeout(tick, 100);
    };

    script.addEventListener('error', () => reject(new Error('reCAPTCHA failed to load')));
    tick();
  });
}

export const recaptchaConfigured = Boolean(SITE_KEY);

export function Recaptcha({ onChange, onReady }) {
  const holder = useRef(null);
  const widgetId = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) {
      onReady?.(false);
      return undefined;
    }

    let live = true;

    loadRecaptcha()
      .then((grecaptcha) => {
        if (!live || !holder.current || widgetId.current !== null) return;
        widgetId.current = grecaptcha.render(holder.current, {
          sitekey: SITE_KEY,
          theme: 'dark',
          callback: (token) => onChange?.(token),
          'expired-callback': () => onChange?.(''),
          'error-callback': () => onChange?.(''),
        });
        onReady?.(true);
      })
      .catch(() => {
        if (!live) return;
        setFailed(true);
        // Let the form submit anyway. The server still has the honeypot, the
        // timing check and the rate limit, and it treats an unreachable
        // verifier as a pass rather than losing a real enquiry.
        onReady?.(false);
      });

    return () => { live = false; };
    // Mount-only: re-rendering the widget on every parent render would reset
    // a checkbox the visitor has already ticked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!SITE_KEY) return null;

  if (failed) {
    return (
      <p className="text-[12.5px] text-ink-faint">
        The robot check could not load. You can still send this — we screen
        enquiries at our end.
      </p>
    );
  }

  return <div ref={holder} className="min-h-[78px]" />;
}

/** Reset the checkbox after a send, so a second enquiry gets a fresh token. */
export function resetRecaptcha() {
  try {
    window.grecaptcha?.reset?.();
  } catch {
    /* Nothing to reset — the widget never rendered. */
  }
}
