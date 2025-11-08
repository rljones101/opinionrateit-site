import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//import { Amplify } from 'aws-amplify'
//import awsConfig from './aws-exports.js'

import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'

import App from './App.vue'
import router from './router'

//if (awsConfig) Amplify.configure(awsConfig)

// Add security headers to the document
const addSecurityHeaders = () => {
  // Add CSP meta tag if not already present
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspMeta = document.createElement('meta')
    cspMeta.httpEquiv = 'Content-Security-Policy'
    cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' " + import.meta.env.VITE_API_URL
    document.head.appendChild(cspMeta)
  }
  
  // Add X-Content-Type-Options
  const noSniffMeta = document.createElement('meta')
  noSniffMeta.httpEquiv = 'X-Content-Type-Options'
  noSniffMeta.content = 'nosniff'
  document.head.appendChild(noSniffMeta)
  
  // Add X-Frame-Options
  const frameOptionsMeta = document.createElement('meta')
  frameOptionsMeta.httpEquiv = 'X-Frame-Options'
  frameOptionsMeta.content = 'DENY'
  document.head.appendChild(frameOptionsMeta)
}

addSecurityHeaders()

export const app = createApp(App)
export const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Material
  }
})

app.mount('#app')
