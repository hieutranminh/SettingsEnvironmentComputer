import type { App } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import { setupPrimeVue } from './primevue'
import { setupGlobalComponents } from './global-components'
import { setupGlobalErrorHandler } from './error-handler'
import { i18n } from './i18n'

export function setupPlugins(app: App): void {
  // State management
  app.use(createPinia())

  // Router
  app.use(router)

  // I18n
  app.use(i18n)

  // UI Library
  setupPrimeVue(app)

  // Global components
  setupGlobalComponents(app)

  // Error handling
  setupGlobalErrorHandler(app)
}
