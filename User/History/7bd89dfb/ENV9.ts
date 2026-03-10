import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

// Vue
import { computed } from 'vue'

// Stores
import { useAuthStore } from '@/stores/auth/auth'

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
    return timezoneMap[shop?.country] || 'UTC'
  })

  const defaultLocale = computed(() => {
    return user?.language || 'en'
  })

  const formatDate = (date: string | Date | dayjs.Dayjs, options: DateFormatOptions = {}): string => {
    const {
      format = 'YYYY-MM-DD HH:mm:ss',
      timezone = defaultTimezone.value,
      locale = defaultLocale.value,
      keepLocalTime = false,
      parseAsLocal = false,
    } = options

    let dayjsInstance = parseAsLocal ? dayjs.tz(date, timezone) : dayjs(date)

    // Xử lý timezone conversion
    if (timezone === 'UTC') {
      dayjsInstance = dayjsInstance.utc(keepLocalTime)
    } else {
      dayjsInstance = dayjsInstance.tz(timezone)
    }

    return dayjsInstance.locale(locale).format(format)
  }
}
