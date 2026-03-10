import type { App } from 'vue'
import { useI18n } from '@/composables/useI18n'

export const i18nPlugin = {
  install: (app: App) => {
    const { t, setLanguage, currentLanguage, getSupportedLanguages } = useI18n()

    // Provide i18n functions globally
    app.provide('i18n', {
      t,
      setLanguage,
      currentLanguage,
      getSupportedLanguages
    })

    // Add global properties
    app.config.globalProperties.$t = t
    app.config.globalProperties.$i18n = {
      setLanguage,
      currentLanguage,
      getSupportedLanguages
    }
  }
}

export default i18nPlugin
