/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel:    ['Cinzel', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        russo:     ['Russo One', 'sans-serif'],
        chakra:    ['Chakra Petch', 'sans-serif'],
        baloo:     ['Baloo 2', 'cursive'],
        comic:     ['Comic Neue', 'cursive'],
      },
      colors: {
        gold: '#D4AF37',
        home:   { bg: '#0f0520', primary: '#7C3AED', accent: '#D4AF37' },
        pastor: { bg: '#0D0D0D', accent: '#D4AF37' },
        youth:  { bg: '#0a0a0f', primary: '#7C3AED', neon: '#00FF88' },
        sunday: { bg: '#FFF8F0', primary: '#F97316' },
      },
      animation: {
        'blob-drift': 'blob-drift 8s ease-in-out infinite',
        'page-in': 'page-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
