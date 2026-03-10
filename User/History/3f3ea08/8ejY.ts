import en from './en'
import vi from './vi'
import ko from './ko'

export const messages = {
  en,
  vi,
  ko,
}

export const availableLocales = ['en', 'vi', 'ko'] as const

export type Locale = (typeof availableLocales)[number]

export const defaultLocale: Locale = 'en'
