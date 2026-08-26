import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/common';
import { Logo } from './Logo';
import { NAV_LINKS, ROUTES } from '@/utils/constants';
import { COMPANY } from '@/data/company';
import { EASE } from '@/animations';

/**
 * Mobile sheet — §17.
 *
 * Escape closes it, focus moves inside on open and returns to the trigger on
 * close, and a click on the scrim dismisses. Items stagger in behind the panel.
 */
export function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previouslyFocused.current = document.activeElement;
    panelRef.current?.focus();

    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.36, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[61] flex w-[min(360px,88vw)] flex-col
                       border-l border-white/[0.08] bg-base-800 outline-none lg:hidden"
          >
            <div className="flex h-[72px] items-center justify-between px-6">
              <Logo onClick={onClose} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-ink-muted"
              >
                <X className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 px-4 pt-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.36, ease: EASE }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === ROUTES.home}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3.5 font-display text-lg transition-colors ${
                        isActive ? 'bg-white/[0.06] text-accent' : 'text-ink-muted hover:bg-white/[0.04] hover:text-ink'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="space-y-3 border-t border-white/[0.07] p-6">
              <Button to={`${ROUTES.about}#enquiry`} onClick={onClose} className="w-full" size="lg">
                Get a PC Recommendation
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button href={COMPANY.phoneHref} variant="secondary" size="sm">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Call
                </Button>
                <Button href={COMPANY.whatsappHref} variant="secondary" size="sm">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
