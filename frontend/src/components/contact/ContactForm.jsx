import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common';
import { cn } from '@/utils/helpers';
import { submitEnquiry } from '@/services/enquiries';
import { Recaptcha, resetRecaptcha, recaptchaConfigured } from './Recaptcha';
import { Captcha } from './Captcha';

const REQUIREMENTS = [
  'Gaming PC build',
  'Professional workstation',
  'Component upgrade',
  'Repair or service',
  'Accessories',
  'Bulk / trade enquiry',
];

const EMPTY = { name: '', phone: '', email: '', requirement: REQUIREMENTS[0], message: '', website: '' };

/**
 * Enquiry form — §18.
 *
 * Validated client-side for fast feedback, then again by the API, which is the
 * authority. Field errors come back keyed by field so they render inline
 * rather than as one opaque banner.
 */
/**
 * @param {string} [defaultRequirement] preselects the dropdown when the visitor
 *   arrived from a page that already implies what they want — clicking through
 *   from Gaming should not make anyone re-pick "Gaming PC build".
 */
export function ContactForm({ defaultRequirement } = {}) {
  const [form, setForm] = useState(() =>
    defaultRequirement && REQUIREMENTS.includes(defaultRequirement)
      ? { ...EMPTY, requirement: defaultRequirement }
      : EMPTY,
  );
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [reference, setReference] = useState('');
  const [formError, setFormError] = useState('');
  const [token, setToken] = useState('');
  // The image code path — used unless a reCAPTCHA site key is configured.
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNonce, setCaptchaNonce] = useState(0);
  // Null until the widget reports in; false means it is not configured or
  // failed to load, and the form must not wait for a box that will never show.
  const [captchaLive, setCaptchaLive] = useState(null);
  const openedAt = useRef(Date.now());

  // Reset the clock when the form is reused for a second enquiry.
  useEffect(() => {
    if (status === 'sent') openedAt.current = Date.now();
  }, [status]);

  const set = (field) => (event) => {
    setForm((f) => ({ ...f, [field]: event.target.value }));
    setErrors((e) => ({ ...e, [field]: '' }));
    setFormError('');
  };

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Please tell us your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      next.email = 'Enter an email address we can reply to.';
    }
    // Phone is optional, but if given it should look like one.
    if (form.phone.trim() && form.phone.replace(/\D/g, '').length < 8) {
      next.phone = 'That phone number looks too short.';
    }
    if (!form.message.trim()) next.message = 'Tell us a little about what you need.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    if (recaptchaConfigured && captchaLive && !token) {
      setFormError('Please tick the "I am not a robot" box first.');
      return;
    }
    if (!recaptchaConfigured && !captchaAnswer.trim()) {
      setErrors((e) => ({ ...e, captcha_answer: 'Enter the code shown in the image.' }));
      return;
    }

    setStatus('sending');
    setFormError('');
    try {
      const result = await submitEnquiry(form, {
        token,
        captchaToken,
        captchaAnswer,
        elapsedMs: Date.now() - openedAt.current,
      });
      setReference(result.reference ?? '');
      setStatus('sent');
      setForm(EMPTY);
      setToken('');
      setCaptchaAnswer('');
      setCaptchaNonce((n) => n + 1);
      resetRecaptcha();
    } catch (error) {
      if (error.fieldErrors && Object.keys(error.fieldErrors).length) {
        setErrors(error.fieldErrors);
        setStatus('idle');
      } else {
        setFormError(error.message || 'Could not send that. Please call or WhatsApp us instead.');
        setStatus('error');
      }
      // Every code is single-use, so a retry needs a fresh one. The typed
      // answer goes, the error explaining why stays.
      setToken('');
      setCaptchaAnswer('');
      setCaptchaNonce((n) => n + 1);
      resetRecaptcha();
    }
  }

  return (
    <div className="surface-card relative p-8 lg:p-10">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-10 text-center"
          >
            <CheckCircle2 className="mx-auto h-10 w-10 text-accent" aria-hidden="true" />
            <h2 className="t-title mt-6">Enquiry sent</h2>
            <p className="mx-auto mt-4 max-w-[42ch] text-sm leading-relaxed text-ink-muted">
              {reference && (
                <>Reference <span className="t-mono text-ink">{reference}</span>. </>
              )}
              We reply within one working day — usually the same day during shop hours.
            </p>
            <Button variant="secondary" className="mt-8" onClick={() => setStatus('idle')}>
              Send another enquiry
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            noValidate
          >
            <h2 className="t-title">Send an enquiry</h2>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
              Tell us what the machine is for and roughly what you want to spend. We will come back
              with a specification and a price.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label="Name" required error={errors.name}>
                <input
                  className={inputClass(errors.name)}
                  value={form.name}
                  onChange={set('name')}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />
              </Field>

              <Field label="Phone" error={errors.phone}>
                <input
                  className={inputClass(errors.phone)}
                  value={form.phone}
                  onChange={set('phone')}
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                />
              </Field>

              <Field label="Email" required error={errors.email} className="sm:col-span-2">
                <input
                  className={inputClass(errors.email)}
                  value={form.email}
                  onChange={set('email')}
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                />
              </Field>

              <Field label="Requirement" className="sm:col-span-2">
                <select className={inputClass()} value={form.requirement} onChange={set('requirement')}>
                  {REQUIREMENTS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>

              <Field label="Message" required error={errors.message} className="sm:col-span-2">
                <textarea
                  className={cn(inputClass(errors.message), 'h-32 resize-y py-3')}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Budget, games or software you use, and anything you already own."
                  aria-invalid={Boolean(errors.message)}
                />
              </Field>
            </div>

            {/*
              Honeypot. The API has always looked for this field; the form
              never rendered it, so the check was doing nothing. Hidden from
              people three ways — off-screen, aria-hidden, and excluded from
              the tab order — while remaining a normal input a bot will fill.
            */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor="website">Do not fill this in</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={set('website')}
              />
            </div>

            <div className="mt-8">
              {recaptchaConfigured ? (
                <Recaptcha onChange={setToken} onReady={setCaptchaLive} />
              ) : (
                <Captcha
                  key={captchaNonce}
                  value={captchaAnswer}
                  onChange={(v) => {
                    setCaptchaAnswer(v);
                    setErrors((e) => ({ ...e, captcha_answer: '' }));
                  }}
                  onToken={setCaptchaToken}
                  error={errors.captcha_answer}
                />
              )}
            </div>

            {formError && (
              <p role="alert" className="mt-5 flex items-start gap-2 text-[13px] text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {formError}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : (<>Send Enquiry <Send className="h-4 w-4" aria-hidden="true" /></>)}
            </Button>

            <p className="mt-4 text-xs text-ink-faint">
              We use your details only to answer this enquiry.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputClass(error) {
  return cn(
    'h-11 w-full rounded-xl border bg-white/[0.03] px-4 text-sm text-ink',
    'placeholder:text-ink-faint transition-colors duration-200',
    'focus:border-accent/60 focus:bg-white/[0.05] focus:outline-none',
    error ? 'border-red-500/50' : 'border-white/[0.1] hover:border-white/20',
  );
}

function Field({ label, required, error, className, children }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-2 block text-[12.5px] text-ink-muted">
        {label}
        {required && <span className="ml-1 text-accent" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[11.5px] text-red-400">{error}</span>}
    </label>
  );
}
