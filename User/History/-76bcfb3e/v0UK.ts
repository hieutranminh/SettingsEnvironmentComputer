import { ref, computed } from 'vue'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, STORAGE_KEYS } from '@/constants/APP_CONSTANTS'
import ko from '@/locales/ko.json'
import en from '@/locales/en.json'

type SupportedLanguage = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES]

interface I18nState {
  currentLanguage: SupportedLanguage
  messages: Record<string, any>
}

const locales = {
  [SUPPORTED_LANGUAGES.KO]: ko,
  [SUPPORTED_LANGUAGES.EN]: en
}

const state = ref<I18nState>({
  currentLanguage: getStoredLanguage(),
  messages: locales[getStoredLanguage()]
})

function getStoredLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE)
  return (stored && Object.values(SUPPORTED_LANGUAGES).includes(stored as SupportedLanguage))
    ? (stored as SupportedLanguage)
    : DEFAULT_LANGUAGE
}

export const useI18n = () => {
  const currentLanguage = computed(() => state.value.currentLanguage)
  const messages = computed(() => state.value.messages)

  const setLanguage = (language: SupportedLanguage): void => {
    if (!Object.values(SUPPORTED_LANGUAGES).includes(language)) {
      throw new Error(`Unsupported language: ${language}`)
    }

    state.value.currentLanguage = language
    state.value.messages = locales[language]
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
  }

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.')
    let value: any = state.value.messages

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`)
      return key
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match
      })
    }

    return value
  }

  const getSupportedLanguages = (): Array<{ code: SupportedLanguage; name: string }> => {
    return [
      { code: SUPPORTED_LANGUAGES.KO, name: '한국어' },
      { code: SUPPORTED_LANGUAGES.EN, name: 'English' }
    ]
  }

  const isCurrentLanguage = (language: SupportedLanguage): boolean => {
    return state.value.currentLanguage === language
  }

  return {
    // State
    currentLanguage,
    messages,

    // Actions
    setLanguage,
    t,
    getSupportedLanguages,
    isCurrentLanguage
  }
}
