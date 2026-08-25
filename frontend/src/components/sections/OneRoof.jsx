import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Container, SectionTitle } from '@/components/common';
import { ROUTES } from '@/utils/constants';
import { COMPANY } from '@/data/company';
import { stagger, staggerItem, revealViewport } from '@/animations';

/**
 * Everything on one counter.
 *
 * The site's actual pitch — gaming, professional, parts, peripherals and
 * repair all from the same shop — was only ever stated in prose. This shows
 * the relationship instead: six columns standing on a single base, which is
 * literally the claim.
 *
 * Built as linked HTML on a drawn rail rather than one big SVG. The labels
 * stay real text, so they reflow, get read by a screen reader and can be
 * tabbed through — and every column is a route, which is what stops this
 * being decoration on the busiest page of the site.
 */

const DEPARTMENTS = [
  { to: ROUTES.gaming,       label: 'Gaming',       note: 'Rigs, laptops, cabinets' },
  { to: ROUTES.professional, label: 'Professional', note: 'Workstations, fleets' },
  { to: ROUTES.hardware,     label: 'Hardware',     note: 'Parts and components' },
  { to: ROUTES.accessories,  label: 'Accessories',  note: 'The rest of the desk' },
  { to: ROUTES.services,     label: 'Service',      note: 'Repair, recovery, AMC' },
  { to: ROUTES.about,        label: 'The counter',  note: 'Advice, fitting, trade' },
];

export function OneRoof() {
  return (
    <section className="py-24 lg:py-28" aria-labelledby="one-roof-heading">
      <Container>
        <SectionTitle
          titleId="one-roof-heading"
          eyebrow="All under one roof"
          title="Six departments, one counter"
          lead="The same people specify the build, sell you the part, fit it and repair it later. That is the whole advantage of buying from a shop rather than a marketplace — and it is why nothing here is quoted without someone looking at it first."
        />

        <motion.ul
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-6"
        >
          {DEPARTMENTS.map((d) => (
            <motion.li key={d.label} variants={staggerItem}>
              <Link
                to={d.to}
                className="group flex h-full flex-col items-center rounded-xl px-2 pb-6 text-center
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {/* The column. Its height is the only thing carrying the
                    "standing on one base" idea, so it is not decoration. */}
                <span
                  aria-hidden="true"
                  className="h-16 w-px bg-gradient-to-b from-transparent to-accent/45
                             transition-all duration-500 group-hover:to-accent"
                />
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rotate-45 border border-accent/50 bg-base-900
                             transition-all duration-500 group-hover:bg-accent
                             group-hover:shadow-[0_0_16px_rgb(var(--accent)/0.9)]"
                />
                <span className="mt-5 text-[15px] font-semibold tracking-[-0.01em] text-ink">
                  {d.label}
                </span>
                <span className="mt-1.5 text-[12px] leading-snug text-ink-faint">{d.note}</span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* The base every column stands on. */}
        <div className="relative -mt-1">
          <div className="rule-fade h-px w-full" />
          <p className="mt-6 text-center text-[12px] uppercase tracking-[0.18em] text-ink-faint">
            One counter · {COMPANY.address.street.split(',')[1]?.trim() ?? COMPANY.address.city} ·
            Since {COMPANY.foundingYear}
          </p>
        </div>
      </Container>
    </section>
  );
}
