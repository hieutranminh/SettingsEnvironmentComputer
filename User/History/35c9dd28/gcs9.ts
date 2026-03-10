import { computed } from 'vue'
import { useI18n as vueUseI18n } from 'vue-i18n'
import { setI18nLanguage } from '@/plugins/i18n'
import { availableLocales, type Locale } from '@/locales'

const LOCALE_STORAGE_KEY = 'app_locale'

export function getStoredLocale(): Locale | null {
  const stored = sessionStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && (availableLocales as readonly string[]).includes(stored)) {
    return stored as Locale
  }
  return null
}

export function useI18n() {
  const i18n = vueUseI18n()

  const changeLocale = (newLocale: Locale): void => {
    setI18nLanguage(newLocale)
    sessionStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }

  return {
    ...i18n,
    changeLocale,
    currentLocale: computed(() => i18n.locale.value as Locale),
  }
}
