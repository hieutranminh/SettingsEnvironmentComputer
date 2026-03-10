import { useI18n } from 'vue-i18n'

/**
 * Common formatting utilities
 */
export function useFormat() {
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

  const formatNameWithNoInput = (name: string): string => {
    const NONE_NAME = 'none'
    return name.toLowerCase() === NONE_NAME ? t('general.label-no-input') : name
  }

  const formatYearMonthDisplay = (yearMonth: string): string => {
    const YEAR_START_INDEX = 0
    const YEAR_END_INDEX = 4
    const MONTH_START_INDEX = 4
    const MONTH_END_INDEX = 6
    return `${yearMonth.slice(YEAR_START_INDEX, YEAR_END_INDEX)}-${yearMonth.slice(MONTH_START_INDEX, MONTH_END_INDEX)}`
  }

  return {
    formatCurrency,
    formatNameWithNoInput,
  }
}
