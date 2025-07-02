/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E2BA49',
        secondary: '#304E4E',
        accent: '#F3F1E6',
        white: '#FFFFFF',
        // Additional shades for better design flexibility
        'primary-light': '#E8C461',
        'primary-dark': '#D4A632',
        'secondary-light': '#4A6B6B',
        'secondary-dark': '#1F3333',
        'accent-light': '#F7F5F0',
        'accent-dark': '#EFECD5',
        // Custom text color
        'text-custom': '#5f5f5a',
        // Discussion questions background
        'discussion-bg': '#f9f9f4',
        // Additional secondary color variations
        'secondary-50': '#F0F4F4',
        'secondary-100': '#DBE4E4',
        'secondary-200': '#B8CACA',
        'secondary-300': '#8FA9A9',
        'secondary-400': '#6B8A8A',
        'secondary-500': '#304E4E',
        'secondary-600': '#2A4444',
        'secondary-700': '#243B3B',
        'secondary-800': '#1F3333',
        'secondary-900': '#1A2C2C',
      },
      fontFamily: {
        'sans': ['Inter Tight', 'sans-serif'],
        'inter': ['Inter Tight', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
