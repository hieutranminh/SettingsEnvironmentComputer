import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth/auth'
import { convertToShopTimezone, convertOffsetToIANA } from '@/utils/dateUtils'
import type { dayjs } from '@/utils/dateUtils'

/**
 * Composable for working with shop timezone from auth store
 */
export const useShopTimezone = () => {
  const authStore = useAuthStore()

  /**
   * Get shop timezone from auth store
   */
  const shopTimezone = computed(() => authStore.shop.timezone)

  /**
   * Get IANA timezone format from shop timezone
   */
  const shopIANATimezone = computed(() => {
    if (shopTimezone.value) {
      return convertOffsetToIANA(shopTimezone.value)
    }
    return 'local'
  })

  /**
   * Convert date to shop timezone
   */
  const convertDateToShopTimezone = (date: dayjs.Dayjs | Date | string) => {
    if (shopTimezone.value) {
      return convertToShopTimezone(date, shopTimezone.value)
    }
    return null
  }

  /**
   * Check if shop timezone is available
   */
  const hasShopTimezone = computed(() => !!shopTimezone.value)

  return {
    shopTimezone,
    shopIANATimezone,
    convertDateToShopTimezone,
    hasShopTimezone,
  }
}
