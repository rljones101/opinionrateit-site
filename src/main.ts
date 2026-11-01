import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//import { Amplify } from 'aws-amplify'
//import awsConfig from './aws-exports.js'

import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import vue3GoogleLogin from 'vue3-google-login'

import App from './App.vue'
import router from './router'

//if (awsConfig) Amplify.configure(awsConfig)

export const app = createApp(App)
export const pinia = createPinia()

// Enable the dark theme globally (matches the dark slate token palette).
document.documentElement.classList.add('app-dark')

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      // App uses a dark theme. Scope PrimeVue dark mode to the .app-dark
      // class on <html>, which we set below, so it stays in sync with our tokens.
      darkModeSelector: '.app-dark'
    }
  }
})

// Sign in with Google (Google Identity Services). The client id comes from the
// Google Cloud Console OAuth 2.0 "Web application" credential; set it as
// VITE_GOOGLE_CLIENT_ID. The feature degrades gracefully (button hidden) when
// it's absent — see UserLogin.vue.
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
})

app.mount('#app')
