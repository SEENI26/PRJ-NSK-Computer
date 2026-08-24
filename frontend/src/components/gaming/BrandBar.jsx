import { BrandMark, hasBrandMark } from '@/components/common';
import { cn } from '@/utils/helpers';

/**
 * Maker on the left, silicon on the right — the two badges a buyer actually
 * scans for before reading a spec.
 *
 * The system brand comes from the generated Simple Icons set and inherits
 * `currentColor`. The GPU vendor does not: NVIDIA green is load-bearing
 * information, the thing people recognise from a shelf, so it ships as its own
 * file at full colour rather than being flattened to the tier tint.
 *
 * Both are third-party trademarks shown to identify hardware we supply.
 */

const GPU_VENDORS = {
  nvidia: { src: '/brands/nvidia.svg', label: 'NVIDIA GeForce', height: 'h-3' },
  intel:  { src: '/brands/intel.svg',  label: 'Intel',          height: 'h-4' },
};

export function BrandBar({ brand, gpuVendor, tint, className }) {
  const gpu = GPU_VENDORS[gpuVendor];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {brand && hasBrandMark(brand.id) ? (
        <span className="h-3.5 shrink-0" style={{ color: tint }}>
          <BrandMark slug={brand.id} title={brand.name} />
        </span>
      ) : (
        brand && (
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: tint }}
          >
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
            className={cn('w-auto shrink-0', gpu.height)}
            loading="lazy"
            decoding="async"
          />
        </>
      )}
    </div>
  );
}
