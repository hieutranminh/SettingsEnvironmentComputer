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

  return {
    formatCurrency,
    formatNameWithNoInput,
  }
}
