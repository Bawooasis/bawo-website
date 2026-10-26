/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        museo: ['"Plus Jakarta Sans"', 'sans-serif'],
        'museo-thin': ['"Plus Jakarta Sans"', 'sans-serif'],
        'museo-light': ['"Plus Jakarta Sans"', 'sans-serif'],
        'museo-regular': ['"Plus Jakarta Sans"', 'sans-serif'],
        'museo-medium': ['"Plus Jakarta Sans"', 'sans-serif'],
        'museo-semibold': ['"Plus Jakarta Sans"', 'sans-serif'],
        'museo-bold': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'museo-extrabold': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'museo-black': ['"Cormorant Garamond"', 'Georgia', 'serif'],
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
          pumpkin: "var(--bawo-pumpkin, #E8B959)",
          peach: "var(--bawo-peach, #FFCF6B)",
          gold: "var(--bawo-gold, #E8B959)",
          copper: "var(--bawo-copper, #C9922C)",
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
