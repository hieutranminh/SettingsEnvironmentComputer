import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import ko from '@/locales/ko.json'

const messages = { en, ko } as const
export type AppLocale = keyof typeof messages

const i18n = createI18n({
  locale: 'ko',
  fallbackLocale: 'ko',
  messages,
  legacy: false, // Use Composition API mode
  globalInjection: true,
})

// Export translation function for use in .js files
export const { t } = i18n.global
export const setLocale = (locale: AppLocale) => {
  i18n.global.locale.value = locale
}
export const getCurrentLocale = () => i18n.global.locale.value

export default i18n
