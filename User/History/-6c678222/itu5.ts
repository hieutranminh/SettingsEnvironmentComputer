import { formatDate } from '@/utils/dateUtils'

export function useDateFormatter() {
  const { shop, user } = useAuthStore()
  const formatDate = (date: string, format: string) => {
    return formatDate(date, {
      locale: user.language,
      timezone: shop.timezone,
      format,
    })
  }

  return {
    formatDate,
  }
}
