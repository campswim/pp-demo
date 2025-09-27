/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],      // body/UI
        heading: ['var(--font-playfair)', 'serif'],    // headings
        mono: ['var(--font-geist-mono)', 'monospace'], // monospace
      },
    },
  },
  plugins: [],
}

export default config