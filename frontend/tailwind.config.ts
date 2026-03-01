import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#1a1714',
          secondary: '#231f1b',
          tertiary: '#2c2620',
          elevated: '#342d26',
        },
        text: {
          primary: '#e8e0d4',
          secondary: '#a09888',
          muted: '#6a6058',
        },
        gold: {
          dark: '#785723',
          DEFAULT: '#bf913a',
          mid: '#c7ad67',
          light: '#dad395',
          accent: '#b28636',
        },
        border: {
          DEFAULT: '#3a3228',
          gold: 'rgba(199, 173, 103, 0.25)',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #785723 0%, #bf913a 30%, #dad395 60%, #b28636 100%)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
