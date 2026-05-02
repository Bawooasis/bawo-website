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
      borderRadius: {
        'bawo-sm': 'var(--bawo-radius-sm)',
        'bawo-md': 'var(--bawo-radius-md)',
        'bawo-lg': 'var(--bawo-radius-lg)',
        'bawo-xl': 'var(--bawo-radius-xl)',
        'bawo-pill': 'var(--bawo-radius-pill)',
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
      },
    },
  },
  plugins: [],
};
