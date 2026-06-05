/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand green — PMS 368 C
        brand: {
          50:  '#F5FAE8',
          100: '#EAF5CE',
          200: '#D3EB9D',
          300: '#BBDF6C',
          400: '#A6D64F',
          DEFAULT: '#8FC640',
          600: '#72A430',
          700: '#568022',
          800: '#3C5C17',
          900: '#25380E',
          950: '#141F07',
        },
        // Brand gray — Cool Gray 11 C
        gray: {
          DEFAULT: '#54585B',
          50:  '#F4F5F5',
          100: '#E8E9EA',
          200: '#D1D4D5',
          300: '#B3B7BA',
          400: '#8A8E92',
          500: '#6B6F72',
          600: '#54585B',
          700: '#44474A',
          800: '#35383A',
          900: '#26292B',
          950: '#0F1012',
        },
      },
      fontFamily: {
        sans:    ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
        'display-sm': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-md': ['clamp(2.75rem, 7vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['clamp(3.5rem, 9vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '800' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        128: '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        'fade-up':    'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right': 'slideRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in':   'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'line-grow':  'lineGrow 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(32px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideRight:{ from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        lineGrow:  { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'brand-sm': '0 2px 12px -2px rgba(143, 198, 64, 0.25)',
        'brand':    '0 4px 24px -4px rgba(143, 198, 64, 0.35)',
        'brand-lg': '0 8px 40px -8px rgba(143, 198, 64, 0.45)',
        'card':     '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px -4px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.06), 0 12px 32px -8px rgba(0,0,0,0.10)',
        'header':   '0 1px 0 rgba(0,0,0,0.06), 0 2px 16px -4px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
