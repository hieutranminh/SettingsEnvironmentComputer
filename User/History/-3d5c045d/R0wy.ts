import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'

// Import PrimeVue styles
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'

// Import global styles
// import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    name: 'aura-light-green'
  }
})

app.mount('#app')
