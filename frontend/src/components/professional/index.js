export { ProductCard, FilterPill } from './ProductCard';
/* DeviceRender and BrandMark moved to components/common when the gaming page
   started drawing its own devices. Re-exported so professional call sites and
   any future page can keep importing from wherever reads best. */
export { DeviceRender, BrandMark, hasBrandMark } from '@/components/common';
