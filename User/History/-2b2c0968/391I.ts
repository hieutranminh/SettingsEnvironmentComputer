import { ref, computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type { ServiceSalesByMonthFilterInterface } from '@/types/sales-report/ServiceSalesByMonth'
import type { ServiceSalesByMonthReportItem } from '@/types/sales-report/ServiceSalesByMonth'

/**
 * Composable for managing service sales by month report data and operations
 * Provides reactive state management and API integration for service sales by month reports
 * 
 * @returns Object containing reactive state and methods for service sales by month reports
 * 
 * @example
 * ```typescript
 * const { filterData, items, isLoading, error, fetchReport } = useServiceSalesByMonthReport()
 * 
 * // Fetch report with filters
 * await fetchReport({
 *   shopId: 1,
 *   headquarterShopId: 1,
 *   fromDateTs: 1640995200,
 *   toDateTs: 1672531200,
 *   isHeadquarterView: true,
 *   categoryId: 0,
 *   serviceId: 0,
 *   staffId: 0
 * })
 * ```
 */
export const useServiceSalesByMonthReport = () => {
  const { t } = useI18n()

  // Reactive state
  const filterData: Ref<ServiceSalesByMonthFilterInterface | null> = ref(null)
  const items: Ref<ServiceSalesByMonthReportItem[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Fetches service sales by month report data from API
   * Handles loading states and error management
   * 
   * @param filters - Filter parameters for the report request
   * @returns Promise that resolves when the report data is fetched
   * 
   * @example
   * ```typescript
   * await fetchReport({
   *   shopId: 1,
   *   headquarterShopId: 1,
   *   fromDateTs: 1640995200,
   *   toDateTs: 1672531200,
   *   isHeadquarterView: true,
   *   categoryId: 0,
   *   serviceId: 0,
   *   staffId: 0
   * })
   * ```
   */
  const fetchReport = async (filters: ServiceSalesByMonthFilterInterface): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      filterData.value = filters

      const response = await salesReportsReadService.getServiceSalesByMonthReport(filters)
      
      if (response.success && response.data) {
        items.value = response.data.serviceSalesByMonths || []
      } else {
        error.value = response.message || t('general.error-fetch-data')
        items.value = []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : t('general.error-unknown')
      items.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clears all report data and resets state
   * Useful for cleanup when component unmounts or filters change
   */
  const clearReport = (): void => {
    items.value = []
    filterData.value = null
    error.value = null
    isLoading.value = false
  }

  /**
   * Computed property indicating if there are any items in the report
   * @returns boolean indicating if items array has data
   */
  const hasItems = computed(() => items.value.length > 0)

  /**
   * Computed property for total amount across all months
   * Calculates sum of amount property from all report items
   * @returns number representing total amount
   */
  const totalAmount = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.amount || 0), 0)
  })

  /**
   * Computed property for total quantity across all months
   * Calculates sum of quantity property from all report items
   * @returns number representing total quantity
   */
  const totalQuantity = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.quantity || 0), 0)
  })

  return {
    // State
    filterData: readonly(filterData),
    items: readonly(items),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    hasItems,
    totalAmount,
    totalQuantity,

    // Actions
    fetchReport,
    clearReport,
  }
}
