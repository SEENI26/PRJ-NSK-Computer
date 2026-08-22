import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/common';
import { COMPANY } from '@/data/company';

const ROWS = [
  { icon: MapPin, label: 'Showroom',  value: COMPANY.address.full },
  { icon: Phone,  label: 'Phone',     value: COMPANY.phone, href: COMPANY.phoneHref },
  { icon: Mail,   label: 'Email',     value: COMPANY.email, href: COMPANY.emailHref },
  {
    icon: Clock,
    label: 'Hours',
    value: `${COMPANY.hours.display} · ${COMPANY.hours.days}`,
    note: COMPANY.hours.note,
  },
];

export function ContactInfo() {
  return (
    <div className="surface-card p-8 lg:p-10">
      <h2 className="t-title">Visit our store</h2>
      <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
        Bring the machine in and we will look at it on the bench. Upgrades are fitted and verified
        at the counter, at no extra charge.
      </p>

      <dl className="mt-9 space-y-6">
        {ROWS.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex gap-4">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <Icon className="h-4 w-4 text-accent" />
              </span>
              <div className="min-w-0">
                <dt className="t-eyebrow text-ink-faint">{row.label}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink">
                  {row.href ? (
                    <a href={row.href} className="transition-colors hover:text-accent">{row.value}</a>
                  ) : (
                    row.value
                  )}
                  {row.note && <span className="mt-1 block text-xs text-ink-subtle">{row.note}</span>}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>

      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        <Button href={COMPANY.whatsappHref} size="lg">
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
        </Button>
        <Button href={COMPANY.phoneHref} variant="secondary" size="lg">
          <Phone className="h-4 w-4" aria-hidden="true" /> Call the store
        </Button>
      </div>
    </div>
  );
}
