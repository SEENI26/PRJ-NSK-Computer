'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

import { whatsappGeneral } from '@/lib/enquiry';
import { EASE } from '@/lib/motion';
import { site } from '@/lib/site';

/**
 * Persistent WhatsApp / call cluster.
 *
 * WhatsApp enquiries are the site's primary conversion goal, so the route to one
 * is never more than a thumb away.
 *
 * Positioned bottom-LEFT: the AI assistant already owns bottom-right, and two
 * floating clusters on the same corner would overlap on a phone. Appears after
 * the first scroll so it does not compete with the hero's own CTAs, which say
 * the same thing more fully.
 */
export function QuickContact() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed bottom-5 left-5 z-[84] flex flex-col gap-3 sm:bottom-7 sm:left-7"
        >
          {/*
            Both targets are 48px — above the 44px minimum for a touch target —
            and carry visible labels on wider screens rather than relying on the
            icon alone to say what they do.
          */}
          <a
            href={whatsappGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-[#25D366] px-4 text-[14px] font-semibold text-[#05310f] shadow-lift transition-transform duration-300 ease-premium hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sr-only sm:hidden">Message us on WhatsApp</span>
          </a>

          <a
            href={site.contact.phoneHref}
            className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-line-strong bg-base/90 px-4 text-[14px] font-semibold text-ink shadow-lift backdrop-blur-xl transition-transform duration-300 ease-premium hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            <Phone className="h-5 w-5 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Call</span>
            <span className="sr-only sm:hidden">Call {site.contact.phone}</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
