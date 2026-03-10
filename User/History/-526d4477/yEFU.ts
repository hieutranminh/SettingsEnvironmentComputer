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
    return name.toLowerCase() === 'none' ? t('general.label-no-input') : name
  }

  const formatYearMonthDisplay = (yearMonth: string): string => {
    return `${yearMonth.slice(0, 4)}-${yearMonth.slice(4, 6)}`
  }

  const formatMonthRepeatDisplay = (month: string): string => {
    return `${month.slice(4, 6)} ${t('new-clients-repeat.label-repeat')}`
  }

  return {
    formatCurrency,
    formatNameWithNoInput,
    formatYearMonthDisplay,
    formatMonthRepeatDisplay,
  }
}
