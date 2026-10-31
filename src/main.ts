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

app.mount('#app')
