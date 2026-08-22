import { Link } from 'react-router-dom';
import { cn } from '@/utils/helpers';

/**
 * The only button in the system. Renders as <button>, <a> or <Link> depending
 * on what it is given, so a call site never has to restyle a link to match.
 */
const VARIANTS = {
  primary:
    'bg-accent text-black font-medium hover:bg-white ' +
    'shadow-[0_0_28px_-8px_rgb(var(--accent)/0.65)] hover:shadow-[0_0_36px_-6px_rgb(var(--accent)/0.8)]',
  secondary:
    'border border-white/15 bg-white/[0.04] text-ink hover:bg-white/[0.09] hover:border-white/30',
  ghost:
    'text-ink-muted hover:text-accent',
  outline:
    'border border-accent/45 text-accent hover:bg-accent/10 hover:border-accent',
};

const SIZES = {
  sm: 'h-9  px-4  text-[13px] gap-1.5 rounded-lg',
  md: 'h-11 px-5  text-sm    gap-2   rounded-xl',
  lg: 'h-[52px] px-7 text-[15px] gap-2.5 rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  className,
  children,
  ...rest
}) {
  const classes = cn(
    'inline-flex items-center justify-center whitespace-nowrap font-body',
    'transition-all duration-300 ease-out',
    // Disabled state has to be visible, not just non-interactive.
    'disabled:pointer-events-none disabled:opacity-45',
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (to) return <Link to={to} className={classes} {...rest}>{children}</Link>;
  if (href) {
    const external = /^https?:|^mailto:|^tel:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return <button type="button" className={classes} {...rest}>{children}</button>;
}
