/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        'app-blue': '#10192d'
      }
    }
  },
  plugins: [require('flowbite/plugin'), require('tailwind-scrollbar')]
}
