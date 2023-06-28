/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        'app-blue': '#0f172a',
        'app-blue-soft': '#1e293b',
        'app-light-blue': '#E6EFFF',
        'app-text-color': '#91a3b1',
        'app-orange': '#F97316',
        'app-orange-soft': '#fb8333',
        'app-orange-muted': '#a94e12'
      }
    }
  },
  plugins: [require('flowbite/plugin'), require('tailwind-scrollbar')]
}
