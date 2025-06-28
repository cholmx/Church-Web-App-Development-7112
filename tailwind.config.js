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
        secondary: '#484846',
        accent: '#F3F1E6',
        white: '#FFFFFF',
        // Additional shades for better design flexibility
        'primary-light': '#E8C461',
        'primary-dark': '#D4A632',
        'secondary-light': '#5A5A57',
        'secondary-dark': '#363635',
        'accent-light': '#F7F5F0',
        'accent-dark': '#EFECD5',
      },
      fontFamily: {
        'sans': ['Inter Tight', 'sans-serif'],
        'serif': ['Inter Tight', 'sans-serif'],
      },
    },
  },
  plugins: [],
}