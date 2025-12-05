/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0A2E5B', // Primary Blue
          light: '#1A4580',
        },
        accent: {
          DEFAULT: '#40E8A0', // Accent Green
          hover: '#32D68F',
        },
        background: '#F5F5F7',
        surface: '#FFFFFF',
      }
    },
  },
  plugins: [],
}
