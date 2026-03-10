import { useAuthStore } from '@/stores/auth/auth'
import { getTimezoneByCountry } from '@/utils/common'
import { formatDate, type TimezoneType } from '@/utils/dateUtils'

export function useDateFormatter() {
  const { shop, user } = useAuthStore()

  const formatDate = (date: string, format: string) => {
    const timezone = shop.timezone ?? getTimezoneByCountry(shop.country) as TimezoneType
    return formatDate(date, {
      locale: user.language,
      timezone: shop.timezone,
      format,
    })
  }

  return {
    formatDate,
  }
},
