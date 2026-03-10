import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import App from './App.vue'
import router from './router'
import { useConfig } from '@/composables/useConfig'

// Import global styles
import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
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
  const { initializeConfig, error } = useConfig()

  const success = await initializeConfig()
  console.log('success', success)

  if (!success) {
    console.error('Failed to initialize configuration:', error.value)
    // You might want to show a user-friendly error message here
  }

  app.mount('#app')
}

initializeApp()
