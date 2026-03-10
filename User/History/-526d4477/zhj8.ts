import { useI18n } from 'vue-i18n'

/**
 * Common formatting utilities
 */
import { COUNTRY_CODES, SLICE_INDEX } from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'
import { formatMobileAndPhoneNumber } from '@/utils/common'

export const useFormat = () => {
  const { t } = useI18n()

  // Format currency based on user language
  const formatCurrency = (value: number): string => {
    // Get user language from sessionStorage
    let locale = 'en-US' // Default

    try {
      const currentUserStr = sessionStorage.getItem('currentUser')
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr)
        const { language } = currentUser

        if (language === 'EN') {
          locale = 'en-US'
        } else if (language === 'KR') {
          locale = 'ko-KR'
        }
      }
    } catch {
      // Fallback to default values if parsing fails
    }

    return new Intl.NumberFormat(locale).format(value)
  }

  // New, typed phone formatter using country from auth store
  const authStore = useAuthStore()

  const normalizeToDigits = (input: string | number): string => String(input).replace(/\D+/g, '')

  const formatPhoneNumber = (phoneNumber?: string | number | null): string => {
    if (phoneNumber === null || phoneNumber === undefined) return ''

    const digits = normalizeToDigits(phoneNumber)
    if (digits.length === 0) return ''

    const country = authStore.shop?.country || COUNTRY_CODES.KR
    return formatMobileAndPhoneNumber(digits, country)
  }

  // Backward-compatible alias (legacy name kept for existing usages)
  const formatMobileAndPhoneNumbers = (phoneNumber?: string | number | null): string => {
    return formatPhoneNumber(phoneNumber)
  }
  const formatNameWithNoInput = (name: string): string => {
    return name.toLowerCase() === 'none' ? t('general.label-no-input') : name
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
    return `${month.slice(4, 6)} ${t('new-clients-repeat.label-repeat')}`
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
