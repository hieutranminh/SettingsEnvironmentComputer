import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { computed } from 'vue'

// Stores
import { STANDARD_DATE_FORMAT } from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'

// Constants

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

export interface DateFormatOptions {
  format?: string
  timezone?: string
  locale?: string
  keepLocalTime?: boolean
  parseAsLocal?: boolean
}

export const useDateFormat = () => {
  const { shop, user } = useAuthStore()

  const defaultTimezone = computed(() => {
    // Map country to timezone
    const timezoneMap: Record<string, string> = {
      VN: 'Asia/Ho_Chi_Minh',
      KR: 'Asia/Seoul',
      // Add more mappings
    }
    console.log('1', timezoneMap)
    console.log('2', timezoneMap[shop?.country])
    return timezoneMap[shop?.country] || 'UTC'
  })

  const defaultLocale = computed(() => {
    return user?.language || 'en'
  })

  console.log('shop?.country', shop?.country)
  console.log('defaultTimezone', defaultTimezone.value)
  const formatDate = (date: string | Date | dayjs.Dayjs, options: DateFormatOptions = {}): string => {
    console.log('3', defaultTimezone.value)
    const {
      format = STANDARD_DATE_FORMAT.YMD,
      timezone = defaultTimezone.value,
      locale = defaultLocale.value,
      keepLocalTime = false,
      parseAsLocal = false,
    } = options

    let dayjsInstance = parseAsLocal ? dayjs.tz(date, timezone) : dayjs(date)

    // Convert timezone
    if (timezone === 'UTC') {
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

    if (toTz === 'UTC') {
      return instance.utc(keepLocalTime)
    }
    return instance.tz(toTz)
  }

  const parseWithTimezone = (dateString: string, timezone: string, format?: string): dayjs.Dayjs => {
    if (format) {
      return dayjs.tz(dateString, format, timezone)
    }
    return dayjs.tz(dateString, timezone)
  }

  return {
    formatDate,
    convertTimezone,
    parseWithTimezone,
    defaultTimezone,
    defaultLocale,

    // Convenience methods
    toUTC: (date: string | Date | dayjs.Dayjs, keepLocalTime = false) =>
      convertTimezone(date, defaultTimezone.value, 'UTC', keepLocalTime),

    fromUTC: (date: string | Date | dayjs.Dayjs, keepLocalTime = false) =>
      convertTimezone(date, 'UTC', defaultTimezone.value, keepLocalTime),

    formatUTC: (date: string | Date | dayjs.Dayjs, format?: string, keepLocalTime = false) =>
      formatDate(date, { format, timezone: 'UTC', keepLocalTime }),
  }
}
