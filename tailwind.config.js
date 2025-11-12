/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#83A682', // A softer, modern green
        secondary: '#5F5F5A', // A warm gray for text and secondary elements
        accent: '#FCFAF2', // A warm, off-white background
        'accent-light': '#FFFFFF',
        'accent-dark': '#F3F1E6',
        
        'text-primary': '#333333',
        'text-secondary': '#5F5F5A',
        'text-light': '#888888',

        'brand-yellow': '#E2BA49',
        'brand-blue': '#2c4747',
        'brand-blue-dark': '#1a2a2a',

        'white': '#FFFFFF',
        'social-green': '#83A682',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'heading': ['Inter Tight', 'sans-serif'],
        'display': ['Fraunces', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
      },
      boxShadow: {
        'soft': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'soft-inset': 'inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff',
        'modern': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'modern-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}