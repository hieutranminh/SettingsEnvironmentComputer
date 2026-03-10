import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { computed } from 'vue'

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
      US: 'America/New_York',
      JP: 'Asia/Tokyo',
      GB: 'Europe/London',
      // Add more mappings
    }
    return timezoneMap[shop?.country] || 'UTC'
  })
}
