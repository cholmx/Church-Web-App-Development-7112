/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2c4747',
        secondary: '#304E4E',
        accent: '#fcfaf2',
        white: '#FFFFFF',
        // Additional shades for better design flexibility
        'primary-light': '#3e5d5d',
        'primary-dark': '#1a2a2a',
        'secondary-light': '#4A6B6B',
        'secondary-dark': '#1F3333',
        'accent-light': '#fefcf5',
        'accent-dark': '#f9f6ed',
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
        // Social media icon color
        'social-green': '#83A682',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'inter-tight': ['Inter Tight', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // Important: This ensures all Tailwind utilities get !important
  important: true,
}