import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { fadeUp, stagger, staggerItem, revealViewport } from '@/animations';

/**
 * Section header: eyebrow, heading, optional lead and a right-hand slot for a
 * link or control. Used by every section so vertical rhythm stays consistent.
 */
export function SectionTitle({
  eyebrow,
  title,
  lead,
  align = 'left',
  action,
  className,
}) {
  return (
    <motion.header
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      className={cn(
        'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <motion.p variants={staggerItem} className="t-eyebrow text-accent">
            {eyebrow}
          </motion.p>
        )}
        <motion.h2 variants={staggerItem} className={cn('t-display', eyebrow && 'mt-4')}>
          {title}
        </motion.h2>
        {lead && (
          <motion.p variants={fadeUp} className="t-sub mt-5 text-ink-muted">
            {lead}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div variants={staggerItem} className="shrink-0">
          {action}
        </motion.div>
      )}
    </motion.header>
  );
}
