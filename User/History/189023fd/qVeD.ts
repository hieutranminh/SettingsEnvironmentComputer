import './assets/css/global.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import { setupPlugins } from './plugins'
import { appConfig } from './config/app'
import { setI18nLanguage } from './plugins/i18n'
import { useAuthStore } from './stores/auth'
import type { Locale } from './locales'

async function bootstrap(): Promise<void> {
  const app = createApp(App)

  // Setup all plugins
  setupPlugins(app)

  // Initialize locale from authStore after plugins are set up
  const authStore = useAuthStore()
  const initialLocale: Locale = authStore.locale ?? 'en'
  setI18nLanguage(initialLocale)

  // Development enhancements
  if (appConfig.enableDevTools) {
    // Enable Vue devtools in development
    app.config.performance = true
  }

  // Mount the app
  app.mount('#app')

  // Log app info in development
  if (appConfig.isDevelopment) {
    console.warn(`🚀 ${appConfig.name} v${appConfig.version} is running in development mode`)
  }
}

// Start the application
bootstrap().catch((error) => {
  console.error('Failed to start application:', error)
})
