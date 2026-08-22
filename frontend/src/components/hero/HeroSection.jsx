import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu } from 'lucide-react';
import { Button, Container } from '@/components/common';
import { HeroBackground } from './HeroBackground';
import { Cabinet3D } from './Cabinet3D';
import { useMousePosition } from '@/hooks/useMousePosition';
import { COMPANY } from '@/data/company';
import { ROUTES } from '@/utils/constants';
import { stagger, staggerItem, maskUp, EASE } from '@/animations';

/**
 * Home hero — §6.
 *
 * The headline wipes up from behind a mask, the supporting copy and buttons
 * stagger in behind it, and the whole frame tilts a few degrees with the
 * pointer. The stat band anchors the bottom so the fold has a floor.
 */
export function HeroSection() {
  const frameRef = useRef(null);
  const tilt = useMousePosition(frameRef);

  return (
    <section
      ref={frameRef}
      className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden pb-24 pt-32 lg:min-h-[720px] lg:pb-28 lg:pt-36"
    >
      <HeroBackground tilt={tilt} />

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
          <motion.div variants={stagger(0.09, 0.1)} initial="hidden" animate="visible">
            <motion.div variants={staggerItem} className="flex items-center gap-2.5">
              <Cpu className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="t-eyebrow text-accent">Hardware · Systems · Builds</span>
            </motion.div>

            {/* Two masked lines — the wipe is what makes it feel authored */}
            <h1 className="mt-7">
              {['Build better.', 'Perform faster.'].map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    variants={maskUp}
                    transition={{ delay: 0.16 + i * 0.11, duration: 0.85, ease: EASE }}
                    className="t-hero block whitespace-nowrap"
                  >
                    {i === 1 ? <span className="text-gradient">{line}</span> : line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p variants={staggerItem} className="t-sub mt-7 max-w-[54ch] text-ink-muted">
              Premium computer hardware, gaming PCs, professional workstations and accessories —
              all under one roof.
            </motion.p>

            <motion.div variants={staggerItem} className="mt-10 flex flex-wrap gap-3">
              <Button to={ROUTES.gaming} size="lg" className="group">
                Explore Gaming PCs
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <Button to={ROUTES.professional} variant="secondary" size="lg">
                Explore Professional PCs
              </Button>
            </motion.div>

            {/* Stat band */}
            <motion.dl
              variants={staggerItem}
              className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-white/[0.08] pt-8 sm:grid-cols-4"
            >
              {COMPANY.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="t-mono block text-2xl font-semibold tracking-tight">{stat.value}</span>
                    <span className="mt-2 block text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* The machine — the real three.js model, with the CSS cabinet
              standing in until it paints. */}
          <div className="relative flex justify-center lg:justify-end">
            <Cabinet3D model="workstation" background="080808" fallbackMode="gaming" />
          </div>
        </div>
      </Container>
    </section>
  );
}
