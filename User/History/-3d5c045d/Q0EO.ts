import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'

import App from './App.vue'
import i18n, { getLocaleFromStore } from './plugins/i18n'
import { globalPassThrough } from './plugins/primevue/primeComponentTheme'
import router from './router'
import { customPreset } from './themes/custom'
import { signalRPlugins } from './plugins/signalR'

// Import global styles
import 'primeicons/primeicons.css'
import '@/assets/styles/main.scss'
import '@/assets/styles/_primevue-theme.scss'
import '@/assets/styles/common.scss'
import { PRIME_VUE_LOCALE_MAP } from './constants'
import { initPrimeVueLocaleSync } from '@/plugins/primevue/localeSync'

const app = createApp(App)

// Initialize Pinia first (required for SignalR plugin)
app.use(createPinia())

// Get locale with fallback to prevent crashes
const currentLocale = getLocaleFromStore()
const primeVueLocale = PRIME_VUE_LOCALE_MAP[currentLocale] ?? PRIME_VUE_LOCALE_MAP['en']

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
  locale: primeVueLocale,
})
app.use(ConfirmationService)
app.use(DialogService)
app.use(router)
app.use(i18n)
app.use(VueDOMPurifyHTML)

// Initialize SignalR after Pinia and before mounting
app.use(signalRPlugins)

initPrimeVueLocaleSync(app)
app.mount('#app')
