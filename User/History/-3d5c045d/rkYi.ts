import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import { createApp } from 'vue'
import VueTippy from 'vue-tippy'

import App from './App.vue'
import { dialogPTConfigs } from './config/dialog-themes'
import i18n from './plugins/i18n'
import router from './router'
import { CustomPreset } from './themes/custom'

// Import global styles
import 'primeicons/primeicons.css'
import 'tippy.js/dist/tippy.css'

import '@/assets/styles/main.scss'
import '@/assets/styles/_primevue-theme.scss'
import '@/assets/styles/common.scss'

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
  pt: {
    dialog: dialogPTConfigs.default, // Default dialog theme
  },
  ripple: true,
})
app.use(ConfirmationService)
app.use(DialogService)
app.use(VueTippy, {
  directive: 'tippy', // => v-tippy
  component: 'tippy', // => <tippy/>
})
app.use(router)
app.use(i18n)

app.mount('#app')
