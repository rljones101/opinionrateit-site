import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      find: './runtimeConfig',
      replacement: './runtimeConfig.browser'
    }
  },
  server: {
    headers: {
      // Content Security Policy for Stripe integration
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.youtube.com https://s.ytimg.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.stripe.com https://www.googleapis.com https://www.youtube.com http://localhost:3000",
        "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.youtube.com",
        "frame-ancestors 'none'"
      ].join('; ')
    }
  }
})
