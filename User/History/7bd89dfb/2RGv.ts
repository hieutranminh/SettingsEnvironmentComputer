import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { computed } from 'vue'

// Stores
import { LANGUAGE_TYPE, STANDARD_DATE_FORMAT, TIMEZONE_TYPE } from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'

// Constants

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

export interface IDateFormatOptions {
  format?: string
  timezone?: string
  locale?: string
  keepLocalTime?: boolean
  parseAsLocal?: boolean
}

export interface IUseDateFormatReturn {
  formatDate: (date: string | Date | dayjs.Dayjs, options: IDateFormatOptions) => string
  convertTimezone: (
    date: string | Date | dayjs.Dayjs,
    fromTz: string,
    toTz: string,
    keepLocalTime?: boolean,
  ) => dayjs.Dayjs
  parseWithTimezone: (dateString: string, timezone: string, format?: string) => dayjs.Dayjs
  getCurrentDate: (timezone?: string, keepLocalTime?: boolean) => dayjs.Dayjs
  defaultTimezone: string
  defaultLocale: string
  toUTC: (date: string | Date | dayjs.Dayjs, keepLocalTime?: boolean) => dayjs.Dayjs
  fromUTC: (date: string | Date | dayjs.Dayjs, keepLocalTime?: boolean) => dayjs.Dayjs
  formatUTC: (date: string | Date | dayjs.Dayjs, format?: string, keepLocalTime?: boolean) => string
}

export const useDateFormat = (): IUseDateFormatReturn => {
  const authStore = useAuthStore()

  const defaultTimezone = computed(() => {
    // Map country to timezone
    const timezoneMap: Record<string, string> = {
      VN: 'Asia/Ho_Chi_Minh',
      KR: 'Asia/Seoul',
      // Add more mappings
    }
    return timezoneMap[authStore.shop?.country] ?? TIMEZONE_TYPE.UTC
  })

  const defaultLocale = computed(() => {
    return authStore.user?.language ?? LANGUAGE_TYPE.ENGLISH.LANGUAGE.toLowerCase()
  })

  const formatDate = (
    date: string | Date | dayjs.Dayjs,
    options: IDateFormatOptions = {},
  ): string => {
    const {
      format = STANDARD_DATE_FORMAT.YMD,
      timezone = defaultTimezone.value,
      locale = defaultLocale.value,
      keepLocalTime = false,
      parseAsLocal = false,
    } = options

    let dayjsInstance = parseAsLocal ? dayjs.tz(date, timezone) : dayjs(date)

    // Convert timezone
    if (timezone === TIMEZONE_TYPE.UTC) {
      dayjsInstance = dayjsInstance.utc(keepLocalTime)
    } else {
      dayjsInstance = dayjsInstance.tz(timezone)
    }

    return dayjsInstance.locale(locale).format(format)
  }

  const convertTimezone = (
    date: string | Date | dayjs.Dayjs,
    fromTz: string,
    toTz: string,
    keepLocalTime = false,
  ): dayjs.Dayjs => {
    const instance = dayjs.tz(date, fromTz)

    if (toTz === TIMEZONE_TYPE.UTC) {
      return instance.utc(keepLocalTime)
    }
    return instance.tz(toTz)
  }

  const parseWithTimezone = (
    dateString: string,
    timezone: string,
    format?: string,
  ): dayjs.Dayjs => {
    if (format) {
      return dayjs.tz(dateString, format, timezone)
    }
    return dayjs.tz(dateString, timezone)
  }

  /**
   * Get current date in specified timezone
   * @param timezone - Target timezone (optional, defaults to defaultTimezone)
   * @param keepLocalTime - When converting to UTC, whether to keep local time (optional, defaults to false)
   * @returns dayjs instance with current date in specified timezone
   * @example
   * Input: getCurrentDate()
   * Output: dayjs instance with current date in default timezone (e.g., Asia/Ho_Chi_Minh)
   *
   * Input: getCurrentDate('UTC')
   * Output: dayjs instance with current date in UTC timezone
   *
   * Input: getCurrentDate('UTC', true)
   * Output: dayjs instance with current date in UTC timezone keeping local time
   */
  const getCurrentDate = (timezone?: string, keepLocalTime = false): dayjs.Dayjs => {
    const targetTimezone = timezone ?? defaultTimezone.value

    if (targetTimezone === TIMEZONE_TYPE.UTC) {
      return dayjs().utc(keepLocalTime)
    }

    return dayjs().tz(targetTimezone)
  }

  return {
    formatDate,
    convertTimezone,
    parseWithTimezone,
    getCurrentDate,
    defaultTimezone: defaultTimezone.value,
    defaultLocale: defaultLocale.value,

    // Convenience methods
    toUTC: (date: string | Date | dayjs.Dayjs, keepLocalTime = false) =>
      convertTimezone(date, defaultTimezone.value, 'UTC', keepLocalTime),

    fromUTC: (date: string | Date | dayjs.Dayjs, keepLocalTime = false) =>
      convertTimezone(date, 'UTC', defaultTimezone.value, keepLocalTime),

    formatUTC: (date: string | Date | dayjs.Dayjs, format?: string, keepLocalTime = false) =>
      formatDate(date, { format, timezone: 'UTC', keepLocalTime }),
  }
}
