/** @type {import('tailwindcss').Config} */
import flowBitePlugin from 'flowbite/plugin'
import tailwindScrollbar from 'tailwind-scrollbar'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        'app-blue': '#ebebeb',
        'app-blue-soft': '#d7d7d7',
        'app-light-blue': '#b0b0b0',
        'app-text-color': '#393939',
        'app-orange': '#f97415',
        'app-orange-soft': '#fa9044',
        'app-orange-muted': '#c75d11',

        brand: {
          50: '#fdefeb',
          100: '#fadfd7',
          200: '#f5bfaf',
          300: '#f09f87',
          400: '#eb7f5f',
          500: '#e65f37',
          600: '#b84c2c',
          700: '#8a3921',
          800: '#5c2616',
          900: '#2e130b'
        },
        default: {
          50: '#ebebeb',
          100: '#d7d7d7',
          200: '#b0b0b0',
          300: '#888888',
          400: '#616161',
          500: '#393939',
          600: '#2e2e2e',
          700: '#222222',
          800: '#171717',
          900: '#0b0b0b'
        },
        secondary: {
          50: '#fbfbfb',
          100: '#f8f8f8',
          200: '#f1f1f1',
          300: '#e9e9e9',
          400: '#e2e2e2',
          500: '#dbdbdb',
          600: '#afafaf',
          700: '#838383',
          800: '#585858',
          900: '#2c2c2c'
        }
      }
    }
  },
  plugins: [flowBitePlugin, tailwindScrollbar],
  darkMode: 'class'
}
