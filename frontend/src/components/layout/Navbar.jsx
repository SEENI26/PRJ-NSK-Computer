import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button, Container } from '@/components/common';
import { MobileMenu } from './MobileMenu';
import { Logo } from './Logo';
import { cn } from '@/utils/helpers';
import { NAV_LINKS, ROUTES } from '@/utils/constants';

/**
 * Sticky navbar — §17. Transparent over the hero, blurred once scrolled.
 * The scroll flag is driven by a motion value rather than a scroll listener,
 * so it does not re-render on every frame.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { pathname } = useLocation();

  /*
   * The bar is white type on nothing until you scroll, which works over a dark
   * hero and disappears over a light one. The professional page is light from
   * its first pixel, so there the bar keeps its solid treatment from the top.
   */
  const overLightPage = pathname === ROUTES.professional;
  const solid = scrolled || overLightPage;

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled((was) => (was === y > 24 ? was : y > 24));
  });

  // A route change while the sheet is open would otherwise leave it hanging.
  useEffect(() => {
    if (!menuOpen) return undefined;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* Skip link — first tab stop on every page (§22) */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
                   focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>

      <motion.header
        initial={{ y: -70 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          // Over paper the bar is fully opaque: a translucent black on white
          // washes out to grey and the whole header reads as disabled.
          overLightPage && 'border-b border-black/10 bg-[#0B0B0C]',
          !overLightPage && scrolled &&
            'border-b border-white/[0.07] bg-base-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-base-900/65',
          !solid && 'bg-transparent',
        )}
      >
        <Container className="flex h-[72px] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === ROUTES.home}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-lg px-3.5 py-2 text-[13.5px] transition-colors duration-200',
                    isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-px h-px bg-accent"
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button to={`${ROUTES.about}#enquiry`} size="sm" className="hidden sm:inline-flex">
              Get a PC Recommendation
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/10
                         text-ink-muted transition-colors hover:text-ink lg:hidden"
            >
              <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
