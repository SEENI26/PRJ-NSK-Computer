import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, Loader2, LogOut, RotateCcw } from 'lucide-react';
import { Container } from '@/components/common';
import { Logo } from '@/components/layout';
import { ImageField } from '@/components/admin/ImageField';
import { useAdminAuth } from '@/components/admin/AdminAuth';
import { sections as sectionsApi } from '@/services/api';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/utils/helpers';

/**
 * The section editor.
 *
 * The form is built from the registry the server sends, not from a list kept
 * here — so the fields offered and the fields the server will accept cannot
 * drift apart. Adding a section is a one-line change in api/lib/sections.php
 * and it appears here on the next load.
 *
 * Every field is optional. A blank one is not "empty content": it means *use
 * what is built into the site*, and clearing a whole section deletes its row
 * so the page returns to its compiled copy. That is what keeps the panel from
 * being able to blank the live site by accident.
 */

const PAGE_LINKS = {
  home: ROUTES.home,
  gaming: ROUTES.gaming,
  professional: ROUTES.professional,
  hardware: ROUTES.hardware,
  accessories: ROUTES.accessories,
  services: ROUTES.services,
  about: ROUTES.about,
};

export default function AdminSections() {
  const { user, signOut } = useAdminAuth();
  const [state, setState] = useState({ loading: true, error: '', fields: {}, registry: {} });
  const [values, setValues] = useState({});
  const [saved, setSaved] = useState({});
  const [activePage, setActivePage] = useState('home');
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    let live = true;
    sectionsApi
      .editable()
      .then((data) => {
        if (!live) return;
        setState({ loading: false, error: '', fields: data.fields, registry: data.registry });
        setValues(data.values ?? {});
        setSaved(JSON.parse(JSON.stringify(data.values ?? {})));
      })
      .catch((err) => {
        if (live) setState({ loading: false, error: err.message, fields: {}, registry: {} });
      });
    return () => { live = false; };
  }, []);

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(saved),
    [values, saved],
  );

  // Warn before losing edits — this form has no autosave.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function setField(key, field, value) {
    setValues((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), [field]: value } }));
  }

  function revertSection(key) {
    setValues((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setFlash('');
    try {
      // Send every registry key, including cleared ones, so a removal is
      // actually applied rather than silently kept from the previous save.
      const payload = {};
      for (const [page, meta] of Object.entries(state.registry)) {
        for (const id of Object.keys(meta.sections)) {
          const key = `${page}.${id}`;
          payload[key] = values[key] ?? {};
        }
      }
      await sectionsApi.save(payload);
      setSaved(JSON.parse(JSON.stringify(values)));
      setFlash('Saved. The public site picks this up on its next load.');
    } catch (err) {
      setFlash(err.message || 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  if (state.loading) {
    return (
      <main className="grid min-h-[100dvh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden="true" />
      </main>
    );
  }

  if (state.error) {
    return (
      <main className="grid min-h-[100dvh] place-items-center px-5">
        <p className="max-w-[46ch] text-center text-[14px] text-ink-muted">
          Could not load the editor: {state.error}
        </p>
      </main>
    );
  }

  const page = state.registry[activePage];

  return (
    <main className="min-h-[100dvh] pb-24">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-base-900/90 backdrop-blur-xl">
        <Container className="flex h-[72px] items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Logo />
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-ink-faint sm:inline">
              Content editor
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user && <span className="hidden text-[13px] text-ink-muted md:inline">{user.name}</span>}
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-3 py-2
                         text-[13px] text-ink-muted transition-colors hover:border-white/30 hover:text-ink"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
            </button>
          </div>
        </Container>
      </header>

      <Container className="pt-10">
        <h1 className="t-display">Page content</h1>
        <p className="mt-4 max-w-[64ch] text-[14px] leading-relaxed text-ink-muted">
          Change the wording or the image for any section. Leave a field blank to
          keep what is already built into the site — blank means “use the
          original”, not “show nothing”.
        </p>

        {/* Page picker */}
        <div className="mt-9 flex flex-wrap gap-2">
          {Object.entries(state.registry).map(([id, meta]) => {
            const edited = Object.keys(meta.sections)
              .filter((s) => values[`${id}.${s}`] && Object.keys(values[`${id}.${s}`]).length).length;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActivePage(id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-[13px] transition-colors',
                  activePage === id
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-white/10 text-ink-muted hover:border-white/25 hover:text-ink',
                )}
              >
                {meta.label}
                {edited > 0 && <span className="ml-2 opacity-60">{edited} edited</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <Link
            to={PAGE_LINKS[activePage] ?? '/'}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-faint hover:text-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            View {page.label} on the site
          </Link>
        </div>

        {/* Sections for the chosen page */}
        <div className="mt-8 space-y-5">
          {Object.entries(page.sections).map(([id, section]) => {
            const key = `${activePage}.${id}`;
            const current = values[key] ?? {};
            const isEdited = Object.keys(current).length > 0;

            return (
              <section key={key} className="surface-card rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-[16px] font-semibold">
                    {section.label}
                    {isEdited && (
                      <span className="ml-3 rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5
                                       text-[10px] uppercase tracking-[0.12em] text-accent">
                        edited
                      </span>
                    )}
                  </h2>
                  {isEdited && (
                    <button
                      type="button"
                      onClick={() => revertSection(key)}
                      className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-faint hover:text-ink"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Use the original
                    </button>
                  )}
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  {section.fields.filter((f) => f !== 'image').map((field) => {
                    const meta = state.fields[field];
                    const isBlob = meta.type === 'blob';
                    return (
                      <label key={field} className={cn('block', isBlob && 'lg:col-span-2')}>
                        <span className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                          {meta.label}
                          <span className="normal-case tracking-normal">
                            {(current[field] ?? '').length}/{meta.max}
                          </span>
                        </span>
                        {isBlob ? (
                          <textarea
                            rows={3}
                            maxLength={meta.max}
                            value={current[field] ?? ''}
                            placeholder="Using the built-in text"
                            onChange={(e) => setField(key, field, e.target.value)}
                            className="mt-2 w-full resize-y rounded-lg border border-white/12 bg-black/40 px-4 py-3
                                       text-[14px] leading-relaxed text-ink outline-none transition-colors
                                       placeholder:text-ink-faint focus:border-accent/60"
                          />
                        ) : (
                          <input
                            maxLength={meta.max}
                            value={current[field] ?? ''}
                            placeholder="Using the built-in text"
                            onChange={(e) => setField(key, field, e.target.value)}
                            className="mt-2 w-full rounded-lg border border-white/12 bg-black/40 px-4 py-3
                                       text-[14px] text-ink outline-none transition-colors
                                       placeholder:text-ink-faint focus:border-accent/60"
                          />
                        )}
                      </label>
                    );
                  })}

                  {section.fields.includes('image') && (
                    <div className="lg:col-span-2">
                      <ImageField
                        value={current.image ?? ''}
                        onChange={(url) => setField(key, 'image', url)}
                      />
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </Container>

      {/* Save bar — pinned, because the form is long. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-base-900/95 backdrop-blur-xl">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <p aria-live="polite" className="text-[13px] text-ink-muted">
            {flash || (dirty ? 'Unsaved changes' : 'Everything saved')}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-6 text-[14px]
                       font-medium text-black transition-colors hover:bg-white
                       disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving
              ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Saving…</>
              : <><Check className="h-4 w-4" aria-hidden="true" /> Save changes</>}
          </button>
        </Container>
      </div>
    </main>
  );
}
