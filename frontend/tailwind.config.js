/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ==== Palet resmi Koran Gala 5.0 (dari System Design Visual brief) ====
        obsidian: '#0B0F17',      // Background Main (Dark Mode)
        charcoal: '#111827',      // Background Card
        paper: '#F8F9FA',         // Background Light Mode
        cyan: {
          DEFAULT: '#00E5FF',     // Primary Accent / Brand — Neon Cyan
          dim: '#00B8CC',
        },
        emerald: {
          DEFAULT: '#00E676',     // Secondary Accent / B2B — Royal Emerald
          dim: '#00B85E',
        },
        hoax: '#FF1744',          // Hoax / Alert Red
        ink: {
          DEFAULT: '#F3F4F6',     // Text Primary (Dark Mode)
          muted: '#9CA3AF',       // Text Muted / Subtitle
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        cyan: '0 0 24px -4px rgba(0, 229, 255, 0.35)',
        emerald: '0 0 24px -4px rgba(0, 230, 118, 0.30)',
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
