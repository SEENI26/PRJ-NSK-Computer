import { cn } from '@/utils/helpers';

/** Hairline that fades at both ends, so it never boxes a section in. */
export function Divider({ className }) {
  return <div aria-hidden="true" className={cn('h-px w-full rule-fade', className)} />;
}
