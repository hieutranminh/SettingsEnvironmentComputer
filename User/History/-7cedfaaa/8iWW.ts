import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ko from '@/locales/ko.json'

// Get language from localStorage or browser settings
const getDefaultLocale = (): string => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && ['en', 'ko'].includes(savedLocale)) {
    return savedLocale
  }
  
  // Fallback to browser language
  const browserLang = navigator.language.split('-')[0]
  return ['en', 'ko'].includes(browserLang) ? browserLang : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    ko
  }
})

export default i18n 