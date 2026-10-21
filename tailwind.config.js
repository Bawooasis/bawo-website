/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        /* Build 165: Montserrat everywhere (legacy museo-* class names map here). */
        sans: [
          'Montserrat',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        museo: ['Montserrat', 'sans-serif'],
        'museo-thin': ['Montserrat', 'sans-serif'],
        'museo-light': ['Montserrat', 'sans-serif'],
        'museo-regular': ['Montserrat', 'sans-serif'],
        'museo-medium': ['Montserrat', 'sans-serif'],
        'museo-semibold': ['Montserrat', 'sans-serif'],
        'museo-bold': ['Montserrat', 'sans-serif'],
        'museo-extrabold': ['Montserrat', 'sans-serif'],
        'museo-black': ['Montserrat', 'sans-serif'],
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
          pumpkin: "var(--bawo-pumpkin, #FF6B00)",
          peach: "var(--bawo-peach, #FF8C42)",
          gold: "var(--bawo-gold, #FFBC42)",
          copper: "var(--bawo-copper, #B87333)",
          ink: "var(--bawo-ink, #0E0A14)",
          card: "var(--bawo-card, #221525)",
          navy: "var(--bawo-navy, #1a0a28)",
          eggplant: "var(--bawo-eggplant, #2a1438)",
          "eggplant-light": "var(--bawo-eggplant-light, #3a1d48)",
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
