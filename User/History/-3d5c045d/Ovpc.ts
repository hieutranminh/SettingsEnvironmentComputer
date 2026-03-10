import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import { createApp } from 'vue'

import App from './App.vue'
import i18n from './plugins/i18n'
import { globalPassThrough } from './plugins/primevue/primeComponentTheme'
import router from './router'
import { customPreset } from './themes/custom'

// Import global styles
import 'primeicons/primeicons.css'
import '@/assets/styles/main.scss'
import '@/assets/styles/_primevue-theme.scss'
import '@/assets/styles/common.scss'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: customPreset,
    options: {
      darkModeSelector: '.app-dark',
      cssLayer: false,
    },
  },
  pt: {
    ...globalPassThrough,
  },
  ripple: true,
})
app.use(ConfirmationService)
app.use(DialogService)
app.use(router)
app.use(i18n)

app.mount('#app')
