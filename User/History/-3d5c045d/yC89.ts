import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import App from './App.vue'
import router from './router'
import { useConfigStore } from '@/stores/config'

// Import global styles
import '@/assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue,  {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none',
    }
  },
})
app.use(router)

// Initialize configuration before mounting the app
const initializeApp = async (): Promise<void> => {
  const configStore = useConfigStore()

  const success = await configStore.initializeConfig()

  if (!success) {
    console.error('Failed to initialize configuration:', configStore.error)
    // You might want to show a user-friendly error message here
  }

  app.mount('#app')
}

initializeApp()
