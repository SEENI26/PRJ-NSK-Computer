import { useNow } from '@/hooks/useNow';
import { COMPANY } from '@/data/company';
import { cn } from '@/utils/helpers';

/**
 * Whether the counter is open right now.
 *
 * Two things make this less trivial than it looks.
 *
 * The clock has to be the *shop's*. Someone checking from Dubai or London has
 * a browser clock hours away from Trichy, and telling them the shop is shut
 * when it is mid-morning in Tamil Nadu is worse than showing no badge at all —
 * so the day and hour are read through `Intl.DateTimeFormat` in
 * `COMPANY.hours.timeZone`, never from the raw local Date.
 *
 * And it renders nothing until `useNow` reports a timestamp. That hook starts
 * at null on purpose: a component that branches on the current time would
 * otherwise paint one answer and immediately correct itself.
 */

const DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Day-of-week and hour as they are at the shop, not on this device. */
function shopClock(timestamp) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: COMPANY.hours.timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date(timestamp));

  const get = (type) => parts.find((p) => p.type === type)?.value;
  // hour12:false still yields "24" at midnight in some engines.
  const hour = Number(get('hour')) % 24;

  return { day: DAY_INDEX[get('weekday')], hour, minute: Number(get('minute')) };
}

export function isOpenAt(timestamp) {
  const { day, hour } = shopClock(timestamp);
  const { openDays, opensAt, closesAt } = COMPANY.hours;
  return openDays.includes(day) && hour >= opensAt && hour < closesAt;
}

export function OpenStatus({ className }) {
  // One minute is plenty — this flips twice a day.
  const now = useNow(60_000);

  // Nothing to say until the client clock is known. The hours themselves are
  // always rendered next to this, so no information is lost while it is blank.
  if (now === null) return null;

  const open = isOpenAt(now);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1',
        'text-[11.5px] font-medium uppercase tracking-[0.12em]',
        open
          ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300'
          : 'border-white/12 bg-white/[0.04] text-ink-subtle',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          open ? 'bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153/0.9)]' : 'bg-ink-faint',
        )}
      />
      {open ? 'Open now' : 'Closed now'}
    </span>
  );
}
