/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'museo': ['MuseoModerno', 'sans-serif'],
        'museo-thin': ['MuseoModerno', 'sans-serif'],
        'museo-light': ['MuseoModerno', 'sans-serif'],
        'museo-regular': ['MuseoModerno', 'sans-serif'],
        'museo-medium': ['MuseoModerno', 'sans-serif'],
        'museo-semibold': ['MuseoModerno', 'sans-serif'],
        'museo-bold': ['MuseoModerno', 'sans-serif'],
        'museo-extrabold': ['MuseoModerno', 'sans-serif'],
        'museo-black': ['MuseoModerno', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite reverse',
      },
    },
  },
  plugins: [],
};
