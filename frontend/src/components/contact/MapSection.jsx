import { MapPin, ExternalLink } from 'lucide-react';
import { COMPANY } from '@/data/company';

/**
 * Store location.
 *
 * The embed only renders when a Maps key is configured; without one it falls
 * back to a styled panel and a directions link rather than an iframe that
 * would render Google's "for development purposes only" watermark.
 */
export function MapSection() {
  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const query = encodeURIComponent(`${COMPANY.legalName}, ${COMPANY.address.full}`);
  /*
   * Prefer the shop's own listing link. Searching by name and address is a
   * guess that can resolve to a different business with a similar name; the
   * share link resolves to exactly one place.
   */
  const directions = COMPANY.mapsUrl
    ?? `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="surface-card overflow-hidden">
      {key ? (
        <iframe
          title={`Map showing ${COMPANY.name}`}
          className="h-[380px] w-full border-0 grayscale-[0.35] contrast-[1.05]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}`}
        />
      ) : (
        <div className="relative grid h-[380px] place-items-center bg-base-800">
          <div aria-hidden="true" className="absolute inset-0 grid-backdrop opacity-60" />
          <div className="relative px-8 text-center">
            <MapPin className="mx-auto h-7 w-7 text-accent" aria-hidden="true" />
            <p className="mt-5 font-display text-lg font-semibold">{COMPANY.legalName}</p>
            <p className="mx-auto mt-3 max-w-[38ch] text-sm leading-relaxed text-ink-muted">
              {COMPANY.address.full}
            </p>
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-white"
            >
              Open in Google Maps <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
