/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Store ──
        primary: '#C9A96E',
        'primary-dark': '#A8834A',
        'primary-light': '#E8D5A8',
        dark: '#1A1A1A',
        'dark-secondary': '#2C2C2C',
        light: '#F8F5F0',
        'light-secondary': '#EDE8DF',
        muted: '#8A8178',
        // ── Admin sidebar ──
        sidebar: '#1C1C1E',
        'sidebar-hover': 'rgba(255,255,255,0.07)',
        'sidebar-active': 'rgba(201,169,110,0.15)',
      },
      fontFamily: {
        serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"Jost"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        admin:   ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        wider:  '0.2em',
      },
    },
  },
  plugins: [],
}
