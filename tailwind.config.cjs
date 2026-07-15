/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './board_localhub/**/*.html',
    './home_localhub/**/*.html',
    './map_localhub/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00478d',
        'secondary-container': '#a5d8ff'
      }
    }
  },
  plugins: []
}
