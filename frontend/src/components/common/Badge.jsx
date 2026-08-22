import { cn } from '@/utils/helpers';

const TONES = {
  accent:  'border-accent/40 text-accent bg-accent/10',
  neutral: 'border-white/12 text-ink-muted bg-white/[0.04]',
  quiet:   'border-transparent text-ink-subtle bg-white/[0.03]',
};

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1',
        'text-[11px] font-medium leading-none tracking-wide',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
