import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gamepad2, Briefcase } from 'lucide-react';
import { Container, Button } from '@/components/common';
import { AnimatedCabinet } from '@/components/hero/AnimatedCabinet';
import { cn } from '@/utils/helpers';
import { ROUTES } from '@/utils/constants';
import { EASE, revealViewport } from '@/animations';

/**
 * The fork — §7.
 *
 * Two halves that respond to hover: the side you point at grows and lights up,
 * the other recedes. This is the site's central decision, so it is given a
 * full section and made physically interactive rather than being two cards.
 *
 * On touch and narrow screens the split stacks and both halves render at full
 * presence — there is no hover to reward, and a "dimmed" panel would just look
 * broken.
 */
const SIDES = [
  {
    id: 'gaming',
    icon: Gamepad2,
    eyebrow: 'Gaming',
    title: 'Performance built for gaming.',
    body: 'High-refresh play, ray tracing and streaming. Cooling and power specified so the machine holds its clocks in hour three, not just in a benchmark.',
    includes: ['Gaming PC', 'High-refresh monitor', 'Mechanical keyboard', 'Gaming mouse', 'Headset'],
    cta: 'Explore Gaming Builds',
    to: ROUTES.gaming,
    mode: 'gaming',
  },
  {
    id: 'professional',
    icon: Briefcase,
    eyebrow: 'Professional',
    title: 'Power built for productivity.',
    body: 'Workstations for offices, developers, creators and engineers. Chosen on sustained throughput, expandability and quiet operation.',
    includes: ['Workstation', 'Colour-accurate monitor', 'Silent keyboard', 'Ergonomic mouse', 'Docking station'],
    cta: 'Explore Professional Builds',
    to: ROUTES.professional,
    mode: 'professional',
  },
];

export function GamingVsProfessional() {
  const [active, setActive] = useState(null);

  return (
    <section className="relative overflow-hidden py-24 lg:py-32" aria-labelledby="fork-heading">
      <Container>
        <h2 id="fork-heading" className="sr-only">Choose gaming or professional</h2>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-5">
          {SIDES.map((side) => {
            const Icon = side.icon;
            const isActive = active === side.id;
            const isDimmed = active !== null && !isActive;

            return (
              <motion.div
                key={side.id}
                onHoverStart={() => setActive(side.id)}
                onHoverEnd={() => setActive(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={{ duration: 0.7, ease: EASE }}
                animate={{
                  // Only applied where a pointer exists; see the lg: guards below.
                  scale: isActive ? 1.012 : 1,
                  opacity: isDimmed ? 0.62 : 1,
                }}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-3xl border p-8 lg:p-10',
                  'transition-colors duration-500',
                  isActive ? 'border-accent/35' : 'border-white/[0.08]',
                  side.id === 'gaming'
                    ? 'bg-gradient-to-br from-[#0d1418] via-base-800 to-base-900'
                    : 'bg-gradient-to-br from-[#121214] via-base-800 to-base-900',
                )}
              >
                {/* Wash that only appears for the active half */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background:
                      side.id === 'gaming'
                        ? 'radial-gradient(70% 50% at 80% 0%, rgb(var(--accent) / 0.16), transparent 70%)'
                        : 'radial-gradient(70% 50% at 80% 0%, rgb(255 255 255 / 0.06), transparent 70%)',
                  }}
                />

                <div className="relative flex flex-1 flex-col">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid h-11 w-11 place-items-center rounded-xl border transition-colors duration-500',
                      isActive ? 'border-accent/40 bg-accent/10' : 'border-white/10 bg-white/[0.03]',
                    )}
                  >
                    <Icon className={cn('h-5 w-5', side.id === 'gaming' ? 'text-accent' : 'text-ink-muted')} />
                  </span>

                  <p className={cn('t-eyebrow mt-6', side.id === 'gaming' ? 'text-accent' : 'text-ink-subtle')}>
                    {side.eyebrow}
                  </p>
                  <h3 className="t-title mt-3 max-w-[16ch]">{side.title}</h3>
                  <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-ink-muted">{side.body}</p>

                  {/* The complete-setup promise, in miniature */}
                  <ul className="mt-8 flex flex-wrap gap-2">
                    {side.includes.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5
                                   text-[11.5px] text-ink-subtle"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex-1" />

                  {/* The machine, in this side's lighting */}
                  <div className="pointer-events-none relative mx-auto my-10 w-[58%] max-w-[220px]">
                    <AnimatedCabinet mode={side.mode} scrollParallax={false} />
                  </div>

                  <Button
                    to={side.to}
                    variant={side.id === 'gaming' ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {side.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
