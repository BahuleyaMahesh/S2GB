/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        critical: '#EF4444',
        high: '#F97316',
        medium: '#EAB308',
        low: '#22C55E'
      }
    }
  },
  plugins: []
}
