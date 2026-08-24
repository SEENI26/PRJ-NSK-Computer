import { BrandMark, hasBrandMark } from '@/components/common';
import { cn } from '@/utils/helpers';

/**
 * Maker on the left, silicon on the right — the two badges a buyer actually
 * scans for before reading a spec.
 *
 * Both are the real marks: the system brand from the inline Simple Icons set,
 * the GPU vendor from its own vector file. Both are then flattened to white
 * and given the same glow, so the pair reads as one row of partner logos
 * rather than a tinted glyph sitting next to NVIDIA green.
 *
 * Colour is what is given up for that consistency, and it is a real loss —
 * NVIDIA green is a shelf cue people recognise. The letterforms are untouched,
 * which is what carries the recognition here.
 *
 * Both are third-party trademarks shown to identify hardware we supply.
 */

const GPU_VENDORS = {
  nvidia: { src: '/brands/nvidia.svg', label: 'NVIDIA GeForce', height: 'h-3' },
  intel:  { src: '/brands/intel.svg',  label: 'Intel',          height: 'h-4' },
};

export function BrandBar({ brand, gpuVendor, className }) {
  const gpu = GPU_VENDORS[gpuVendor];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {brand && hasBrandMark(brand.id) ? (
        <span className="logo-glow h-3.5 shrink-0 text-white">
          <BrandMark slug={brand.id} title={brand.name} />
        </span>
      ) : (
        brand && (
          <span className="logo-glow text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {brand.name}
          </span>
        )
      )}

      {/* The brand mark is the logo alone, so the line still needs the name. */}
      {brand && (
        <span className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">
          {brand.name}
        </span>
      )}

      {gpu && (
        <>
          <span aria-hidden="true" className="ml-auto h-3 w-px bg-white/15" />
          <img
            src={gpu.src}
            alt={gpu.label}
            className={cn('logo-glow-img w-auto shrink-0', gpu.height)}
            loading="lazy"
            decoding="async"
          />
        </>
      )}
    </div>
  );
}
