import dayjs from 'dayjs'
import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth/auth'
import { formatDatePure, type DateFormatOptions, type TimezoneConvertOptions } from '@/utils/dateUtils'

export const useDateFormatter = () => {
  const { shop, user } = useAuthStore()

  const defaultOptions = computed(() => ({
    userLanguage: user.language,
    shopCountry: shop.country,
  }))

  // Main formatter function
  const formatDate = (
    date: dayjs.Dayjs | Date | string,
    options: DateFormatOptions & TimezoneConvertOptions = {},
  ): string => {
    return formatDatePure(date, {
      ...defaultOptions.value,
      ...options,
    })
  }

  // Convenient wrapper functions
  const formatDateTime = (
    date: dayjs.Dayjs | Date | string,
    options: Omit<DateFormatOptions & TimezoneConvertOptions, 'format'> = {},
  ) => {
    return formatDate(date, { ...options, format: 'datetime' })
  }

  const formatTime = (
    date: dayjs.Dayjs | Date | string,
    options: Omit<DateFormatOptions & TimezoneConvertOptions, 'format'> = {},
  ) => {
    return formatDate(date, { ...options, format: 'time' })
  }

  const formatRelative = (
    date: dayjs.Dayjs | Date | string,
    options: Omit<DateFormatOptions & TimezoneConvertOptions, 'format'> = {},
  ) => {
    return formatDate(date, { ...options, format: 'relative' })
  }

  const formatCustom = (
    date: dayjs.Dayjs | Date | string,
    customFormat: string,
    options: Omit<DateFormatOptions & TimezoneConvertOptions, 'customFormat'> = {},
  ) => {
    return formatDate(date, { ...options, customFormat })
  }

  return {
    formatDate,
    formatDateTime,
    formatTime,
    formatRelative,
    formatCustom,
  }
}
