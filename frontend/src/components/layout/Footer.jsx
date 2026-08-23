import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Container, Divider } from '@/components/common';
import { LogoLockup } from './Logo';
import { COMPANY } from '@/data/company';
import { NAV_LINKS, ROUTES } from '@/utils/constants';
import { hardwareCategories } from '@/data/hardwareCategories';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-white/[0.07] bg-base-900">
      <Container className="py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <LogoLockup />
            <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-ink-muted">
              Hardware, systems and custom builds since {COMPANY.foundingYear}. Tell us what the
              machine is for and we will specify it properly.
            </p>
            <address className="mt-7 space-y-3 not-italic">
              <ContactRow icon={MapPin} label={COMPANY.address.full} />
              <ContactRow icon={Phone} label={COMPANY.phone} href={COMPANY.phoneHref} />
              <ContactRow icon={Mail} label={COMPANY.email} href={COMPANY.emailHref} />
              <ContactRow icon={Clock} label={`${COMPANY.hours.display} · ${COMPANY.hours.days}`} />
            </address>
          </div>

          <FooterColumn title="Explore" links={NAV_LINKS} />

          <FooterColumn
            title="Hardware"
            links={hardwareCategories.slice(0, 6).map((c) => ({
              label: c.name,
              to: `${ROUTES.hardware}#${c.id}`,
            }))}
          />

          <div>
            <h2 className="t-eyebrow text-ink-faint">Visit the showroom</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted">
              Bring the machine in — upgrades are fitted and verified at the counter while you wait,
              at no extra charge.
            </p>
            <Link
              to={ROUTES.about}
              className="mt-5 inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-white"
            >
              Directions and hours →
            </Link>
          </div>
        </div>

        <Divider className="my-12" />

        <div className="flex flex-col gap-4 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {COMPANY.legalName}</p>
          <p>Showcase site — prices confirmed on enquiry, not published online.</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <nav aria-label={title}>
      <h2 className="t-eyebrow text-ink-faint">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.to + link.label}>
            <Link to={link.to} className="text-sm text-ink-muted transition-colors hover:text-accent">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ContactRow({ icon: Icon, label, href }) {
  const content = (
    <span className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
  return href ? (
    <a href={href} className="block transition-colors hover:text-ink">{content}</a>
  ) : (
    <div>{content}</div>
  );
}
