import { useI18n } from 'vue-i18n'

/**
 * Common formatting utilities
 */
import { COUNTRY_CODES, SLICE_INDEX } from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'
import { formatMobileAndPhoneNumber } from '@/utils/common'

export const useFormat = (): {
  formatCurrency: (value: number) => string
  formatPhoneNumber: (phoneNumber?: string | number | null) => string
  formatMobileAndPhoneNumbers: (phoneNumber?: string | number | null) => string
  formatNameWithNoInput: (name: string) => string
  formatYearMonthDisplay: (yearMonth: string) => string
  formatMonthRepeatDisplay: (month: string) => string
} => {
  const { t } = useI18n()

  // Helper function to get locale from user language
  const getUserLocale = (): string => {
    try {
      const currentUserStr = sessionStorage.getItem('currentUser')
      if (!currentUserStr) return 'en-US'

      const currentUser = JSON.parse(currentUserStr)
      const { language } = currentUser

      if (language === 'EN') return 'en-US'
      if (language === 'KR') return 'ko-KR'
      return 'en-US'
    } catch {
      return 'en-US'
    }
  }

  // Format currency based on user language
  const formatCurrency = (value: number): string => {
    const locale = getUserLocale()
    return new Intl.NumberFormat(locale).format(value)
  }

  // New, typed phone formatter using country from auth store
  const authStore = useAuthStore()

  const normalizeToDigits = (input: string | number): string => String(input).replace(/\D+/g, '')

  const formatPhoneNumber = (phoneNumber?: string | number | null): string => {
    if (phoneNumber === null || phoneNumber === undefined) return ''

    const digits = normalizeToDigits(phoneNumber)
    if (digits.length === 0) return ''

    const country = authStore.shop?.country ?? COUNTRY_CODES.KR
    return formatMobileAndPhoneNumber(digits, country)
  }

  // Backward-compatible alias (legacy name kept for existing usages)
  const formatMobileAndPhoneNumbers = (phoneNumber?: string | number | null): string => {
    return formatPhoneNumber(phoneNumber)
  }

  const formatNameWithNoInput = (name: string): string => {
    return name.toLowerCase() === 'none' ? t('general.label-no-input') : name
  }

  const convertHourToRange(hour: number, stepMinutes: number): string => {
    if (!Number.isFinite(hour)) throw new Error('hour must be a finite number')
      const h = Math.floor(hour) % 24
      const startH = h
      const startM = 0

      const total = startH * 60 + startM + stepMinutes
      const endH = Math.floor(total / 60) % 24
      const endM = total % 60

      return `${pad2(startH)}:${pad2(startM)} ~ ${pad2(endH)}:${pad2(endM)}`
  }

  /**
   * Format year month display
   * @param yearMonth yearMonth
   * @returns formatted year month
   * @example
   * Input: formatYearMonthDisplay('202501')
   * Output: '2025-01'
   */
  const formatYearMonthDisplay = (yearMonth: string): string => {
    return `${yearMonth.slice(SLICE_INDEX.YEAR_START, SLICE_INDEX.YEAR_END)}-${yearMonth.slice(SLICE_INDEX.MONTH_START, SLICE_INDEX.MONTH_END)}`
  }

  /**
   * Format month repeat display
   * @param month month
   * @returns formatted month repeat
   * @example
   * Input: formatMonthRepeatDisplay('202501')
   * Output: '01 Repeat'
   */
  const formatMonthRepeatDisplay = (month: string): string => {
    return `${month.slice(SLICE_INDEX.MONTH_START, SLICE_INDEX.MONTH_END)} ${t('new-clients-repeat.label-repeat')}`
  }

  return {
    formatCurrency,
    formatPhoneNumber,
    formatMobileAndPhoneNumbers,
    formatNameWithNoInput,
    formatYearMonthDisplay,
    formatMonthRepeatDisplay,
  }
}
