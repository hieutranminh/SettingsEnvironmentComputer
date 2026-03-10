import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import App from './App.vue'
import router from './router'

// Import global styles
import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue,  {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none',
      cssLayer: {
        name: 'app-styles',
        order: 'primevue, app-styles'
      }
    }
  },
})
app.use(router)

app.mount('#app')
