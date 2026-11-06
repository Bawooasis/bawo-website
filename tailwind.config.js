/** @type {import('tailwindcss').Config} */
const outfit = ['"Outfit"', 'system-ui', 'sans-serif'];

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: outfit,
        display: outfit,
        // Legacy museo-* aliases all resolve to Outfit
        museo: outfit,
        'museo-thin': outfit,
        'museo-light': outfit,
        'museo-regular': outfit,
        'museo-medium': outfit,
        'museo-semibold': outfit,
        'museo-bold': outfit,
        'museo-extrabold': outfit,
        'museo-black': outfit,
        wordmark: outfit,
      },
      fontSize: {
        // Floor visible text at 14px; body stays 16px
        xs: ['0.875rem', { lineHeight: '1.45' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.55' }],
        xl: ['1.25rem', { lineHeight: '1.45' }],
      },
      spacing: {
        'bawo-xs': 'var(--bawo-space-xs)',
        'bawo-sm': 'var(--bawo-space-sm)',
        'bawo-md': 'var(--bawo-space-md)',
        'bawo-lg': 'var(--bawo-space-lg)',
        'bawo-xl': 'var(--bawo-space-xl)',
        'bawo-xxl': 'var(--bawo-space-xxl)',
      },
      colors: {
        bawo: {
          pumpkin: "var(--bawo-pumpkin, #D6B26A)",
          peach: "var(--bawo-peach, #F7E7C4)",
          gold: "var(--bawo-gold, #D6B26A)",
          copper: "var(--bawo-copper, #A07636)",
          "gold-glow": "var(--bawo-gold-glow, #E9CF94)",
          "gold-deep": "var(--bawo-gold-deep, #A07636)",
          ink: "var(--bawo-ink, #07050B)",
          card: "var(--bawo-card, #1C132B)",
          navy: "var(--bawo-navy, #0E0A14)",
          eggplant: "var(--bawo-eggplant, #160F24)",
          "eggplant-light": "var(--bawo-eggplant-light, #2A193D)",
        },
      },
      borderRadius: {
        'bawo-sm': 'var(--bawo-radius-sm)',
        'bawo-md': 'var(--bawo-radius-md)',
        'bawo-lg': 'var(--bawo-radius-lg)',
        'bawo-xl': 'var(--bawo-radius-xl)',
        'bawo-pill': 'var(--bawo-radius-pill)',
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'subtle-float': 'subtleFloat 7s ease-in-out infinite',
      },
      keyframes: {
        subtleFloat: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -6px, 0)' },
        },
      },
    },
  },
  plugins: [],
};
