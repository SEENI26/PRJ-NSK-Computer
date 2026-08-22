import { cn } from '@/utils/helpers';

/** Page gutter. One place decides how wide the site is. */
export function Container({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cn('container-page', className)} {...rest}>
      {children}
    </Tag>
  );
}
