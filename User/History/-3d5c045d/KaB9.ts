import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import DialogService from 'primevue/dialogservice'
import { createApp } from 'vue'

import App from './App.vue'
import i18n from './plugins/i18n'
import router from './router'
import { CustomPreset } from './themes/custom'

// Import global styles
import '@/assets/styles/main-clean.scss'
import 'primeicons/primeicons.css'

import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: CustomPreset,
    options: {
      darkModeSelector: '.app-dark',
      cssLayer: false,
    },
  },
  ripple: true,
})
app.use(DialogService)
app.use(router)
app.use(i18n)

app.mount('#app')
