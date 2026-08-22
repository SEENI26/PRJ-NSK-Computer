/**
 * NSK — Tailwind theme.
 *
 * Colours resolve through the CSS variables in src/styles/globals.css, so the
 * token file stays the single source of truth and `bg-base-700/60` style
 * modifiers keep working.
 */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', lg: '2.5rem' } },
    extend: {
      colors: {
        base: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          900:     'rgb(var(--bg) / <alpha-value>)',
          800:     'rgb(var(--bg-800) / <alpha-value>)',
          700:     'rgb(var(--bg-700) / <alpha-value>)',
          600:     'rgb(var(--bg-600) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted:   'rgb(var(--ink-muted) / <alpha-value>)',
          subtle:  'rgb(var(--ink-subtle) / <alpha-value>)',
          faint:   'rgb(var(--ink-faint) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dim:     'rgb(var(--accent-dim) / <alpha-value>)',
          blue:    'rgb(var(--accent-blue) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: { page: '1400px' },
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      boxShadow: {
        lift:  '0 18px 46px -18px rgb(0 0 0 / 0.9)',
        glow:  '0 0 42px -14px rgb(var(--accent) / 0.55)',
        inset: 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
      },
      backgroundImage: {
        'accent-sweep': 'linear-gradient(120deg, rgb(var(--accent)) 0%, rgb(var(--accent-blue)) 100%)',
      },
      screens: {
        // Named for the viewports in §21 rather than generic sizes, so a
        // breakpoint's purpose is legible at the call site.
        'laptop-sm': '1366px',
        'laptop':    '1440px',
        'desktop':   '1920px',
      },
    },
  },
  plugins: [],
};
