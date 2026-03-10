import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { computed } from 'vue'

// Stores
import {
  LANGUAGE_TYPE,
  STANDARD_DATE_FORMAT,
  TIMEZONE_TYPE,
  DATE_UNITS,
  DATE_RANGE_PRESETS,
  DATE_RANGE_OFFSETS,
  type DateRangePresetType,
} from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'
import { addTime, getEndOf, getStartOf, type TimezoneType } from '@/utils/dateUtils'
import { getTimezoneByCountryCode } from '@/utils/common'

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
  formatDateRange: (
    fromDate: string | Date | dayjs.Dayjs,
    toDate: string | Date | dayjs.Dayjs,
    options: IDateFormatOptions,
  ) => string
  convertTimezone: (
    date: string | Date | dayjs.Dayjs,
    fromTz: string,
    toTz: string,
    keepLocalTime?: boolean,
  ) => dayjs.Dayjs
  parseWithTimezone: (dateString: string, timezone: string, format?: string) => dayjs.Dayjs
  getCurrentDate: (timezone?: string, keepLocalTime?: boolean) => dayjs.Dayjs
  getDateRangePresetHandler: (dateRangePreset: DateRangePresetType) => [Date, Date]
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

  const formatDateRange = (
    fromDate: string | Date | dayjs.Dayjs,
    toDate: string | Date | dayjs.Dayjs,
    options: IDateFormatOptions = {},
  ): string => {
    return `(${formatDate(fromDate, options)} - ${formatDate(toDate, options)})`
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

  /**
   * Convert dayjs object to Date with local time matching dayjs time values
   * This ensures that when createDateRange uses keepLocalTime: true,
   * the timestamps will be correct regardless of local timezone
   * @param dayjsDate - dayjs instance (with any timezone)
   * @returns Date object with local time = dayjs time values
   */
  const toDateWithLocalTime = (dayjsDate: dayjs.Dayjs): Date => {
    return new Date(
      dayjsDate.year(),
      dayjsDate.month(),
      dayjsDate.date(),
      dayjsDate.hour(),
      dayjsDate.minute(),
      dayjsDate.second(),
      dayjsDate.millisecond(),
    )
  }

  const getDateRangePresetHandler = (dateRangePreset: DateRangePresetType): [Date, Date] => {
    const shopTimezone = getTimezoneByCountryCode(authStore.shop.country) as TimezoneType
    const currentDate = getCurrentDate()

    switch (dateRangePreset) {
      case DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_MONTH_TO_TODAY: {
        const startOfMonth = getStartOf(currentDate, DATE_UNITS.MONTH, shopTimezone)
        const endOfDay = getEndOf(currentDate, DATE_UNITS.DAY, shopTimezone)
        return [toDateWithLocalTime(startOfMonth), toDateWithLocalTime(endOfDay)]
      }
      case DATE_RANGE_PRESETS.FROM_TODAY_TO_NEXT_6_DAYS: {
        const startOfDay = getStartOf(currentDate, DATE_UNITS.DAY, shopTimezone)
        const endOf6DaysLater = getEndOf(
          addTime(currentDate, DATE_RANGE_OFFSETS.NEXT_6_DAYS, DATE_UNITS.DAY),
          DATE_UNITS.DAY,
          shopTimezone,
        )
        return [toDateWithLocalTime(startOfDay), toDateWithLocalTime(endOf6DaysLater)]
      }
      case DATE_RANGE_PRESETS.FROM_FIRST_DAY_OF_YEAR_TO_END_OF_CURRENT_MONTH: {
        const startOfYear = getStartOf(currentDate, DATE_UNITS.YEAR, shopTimezone)
        const endOfMonth = getEndOf(currentDate, DATE_UNITS.MONTH, shopTimezone)
        return [toDateWithLocalTime(startOfYear), toDateWithLocalTime(endOfMonth)]
      }
      default: {
        return [toDateWithLocalTime(currentDate), toDateWithLocalTime(currentDate)]
      }
    }
  }

  return {
    formatDate,
    formatDateRange,
    convertTimezone,
    parseWithTimezone,
    getCurrentDate,
    getDateRangePresetHandler,
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
