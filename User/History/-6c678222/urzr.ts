import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth/auth'
import { formatDate } from '@/utils/dateUtils'

export function useDateFormatter() {
  const { shop, user } = useAuthStore()

  const formatDate = (date: string,) => {
    const timezone = timezone ?? getTimezoneByCountry(shop.country)
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
