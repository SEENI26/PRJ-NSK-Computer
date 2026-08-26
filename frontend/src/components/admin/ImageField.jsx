import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { uploadImage } from '@/services/api';
import { cn } from '@/utils/helpers';

/**
 * Pick an image, upload it, keep the returned path.
 *
 * The server is the only thing that decides whether a file is acceptable: it
 * sniffs the real MIME type with finfo and derives the extension from that, so
 * a PHP file renamed .webp cannot land in a served directory. The checks here
 * are courtesy — they save a round trip on an obvious mistake and give a
 * faster message — and are deliberately not relied on.
 */

const CLIENT_MAX_BYTES = 5 * 1024 * 1024;
const CLIENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ImageField({ value, onChange, label = 'Image' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    if (!file) return;
    setError('');

    if (!CLIENT_TYPES.includes(file.type)) {
      setError('Choose a JPEG, PNG, WebP or GIF.');
      return;
    }
    if (file.size > CLIENT_MAX_BYTES) {
      setError('That image is over 5 MB.');
      return;
    }

    setBusy(true);
    try {
      const result = await uploadImage(file);
      onChange(result.url);
    } catch (err) {
      setError(err.message || 'The upload failed.');
    } finally {
      setBusy(false);
      // Clearing lets the same file be chosen again after an error.
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <span className="block text-[11px] uppercase tracking-[0.14em] text-ink-faint">{label}</span>

      <div className="mt-2 flex items-start gap-4">
        <div
          className={cn(
            'grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-lg',
            'border border-white/10 bg-black/40',
          )}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-5 w-5 text-ink-faint" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2
                         text-[13px] text-ink transition-colors hover:border-white/30
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Uploading…</>
              ) : (
                <><ImagePlus className="h-3.5 w-3.5" aria-hidden="true" /> {value ? 'Replace' : 'Upload'}</>
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2
                           text-[13px] text-ink-muted transition-colors hover:border-white/25 hover:text-ink"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Remove
              </button>
            )}
          </div>

          {value && (
            <p className="mt-2 truncate font-mono text-[11px] text-ink-faint" title={value}>
              {value}
            </p>
          )}
          {error && <p className="mt-2 text-[12px] text-red-300">{error}</p>}
          <p className="mt-2 text-[11.5px] text-ink-faint">
            JPEG, PNG, WebP or GIF · up to 5 MB. Removing an image falls the
            section back to the picture built into the site.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={CLIENT_TYPES.join(',')}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
