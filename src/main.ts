import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify'
import awsConfig from './aws-exports.js'

import App from './App.vue'
import router from './router'

Amplify.configure(awsConfig)

export const app = createApp(App)
export const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
