/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontSize: {
        'xs': ['0.6375rem', { lineHeight: '0.85rem' }],
        'sm': ['0.74375rem', { lineHeight: '1.0625rem' }],
        'base': ['0.85rem', { lineHeight: '1.275rem' }],
        'lg': ['0.95625rem', { lineHeight: '1.4875rem' }],
        'xl': ['1.0625rem', { lineHeight: '1.4875rem' }],
        '2xl': ['1.275rem', { lineHeight: '1.7rem' }],
        '3xl': ['1.59375rem', { lineHeight: '1.9125rem' }],
        '4xl': ['1.9125rem', { lineHeight: '2.125rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}
