/** Route table — imported by the router, the navbar and the sitemap so the
 *  three can never drift apart. */
export const ROUTES = {
  home:         '/',
  gaming:       '/gaming-pcs',
  professional: '/professional-pcs',
  hardware:     '/hardware',
  accessories:  '/accessories',
  services:     '/services',
  about:        '/about',
};

export const NAV_LINKS = [
  { label: 'Home',              to: ROUTES.home },
  { label: 'Gaming PCs',        to: ROUTES.gaming },
  { label: 'Professional PCs',  to: ROUTES.professional },
  { label: 'Hardware',          to: ROUTES.hardware },
  { label: 'Accessories',       to: ROUTES.accessories },
  { label: 'Services',          to: ROUTES.services },
  { label: 'About',             to: ROUTES.about },
];

/** Viewport widths the layout is designed against — §21. */
export const BREAKPOINTS = {
  mobile:   390,
  mobileLg: 430,
  tablet:   768,
  laptopSm: 1366,
  laptop:   1440,
  desktop:  1920,
};
