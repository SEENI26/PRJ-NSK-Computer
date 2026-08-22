import { Container, AuroraOrbs } from '@/components/ui/primitives';
import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

/**
 * Shared inner-page hero. Keeps every non-home route on the same rhythm:
 * eyebrow → display title → lede → optional stat rail.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  image,
  stats,
  children,
  className,
}
) {
  return (
    <header className={cn('relative overflow-hidden pb-16 pt-40 lg:pb-24 lg:pt-48', className)}>
      <AuroraOrbs />

      {image && (
        <div aria-hidden className="absolute inset-0 -z-20">
          <SmartImage src={image} alt="" fill priority quality={68} sizes="100vw" className="bg-art object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-base via-base/88 to-base" />
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-fine bg-grid-fine opacity-50 [mask-image:radial-gradient(ellipse_65%_60%_at_50%_0%,#000_20%,transparent_75%)]"
      />

      <Container>
        <Reveal>
          <p className="eyebrow">
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
            {eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl text-display-xl">{title}</h1>
          {description && (
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-subtle sm:text-lg">{description}</p>
          )}
          {children && <div className="mt-10">{children}</div>}
        </Reveal>

        {stats && (
          <Reveal delay={0.15}>
            <dl className="mt-14 grid gap-8 border-t border-line-soft pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{stat.label}</dt>
                  <dd className="mt-2 text-2xl font-bold text-sheen">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </Container>
    </header>
  );
}
