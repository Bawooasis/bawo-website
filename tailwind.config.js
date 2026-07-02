/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Montserrat',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['MuseoModerno', 'Montserrat', 'system-ui', 'sans-serif'],
        museo: ['MuseoModerno', 'Montserrat', 'sans-serif'],
        'museo-thin': ['MuseoModerno', 'sans-serif'],
        'museo-light': ['MuseoModerno', 'sans-serif'],
        'museo-regular': ['MuseoModerno', 'sans-serif'],
        'museo-medium': ['MuseoModerno', 'sans-serif'],
        'museo-semibold': ['MuseoModerno', 'sans-serif'],
        'museo-bold': ['MuseoModerno', 'sans-serif'],
        'museo-extrabold': ['MuseoModerno', 'sans-serif'],
        'museo-black': ['MuseoModerno', 'sans-serif'],
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
          pumpkin: "var(--bawo-pumpkin, #ff6b00)",
          peach: "var(--bawo-peach, #ff8c42)",
          ink: "var(--bawo-ink, #0e0a14)",
          forest: "var(--bawo-forest, #1f493c)",
          "forest-bright": "var(--bawo-forest-bright, #6db896)",
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
