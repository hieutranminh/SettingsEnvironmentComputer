import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Constants
import { STANDARD_DATE_FORMAT } from '@/constants'
// Services
import {
  getSalesByDateReport,
  type SalesByDateReportRequest,
  type SalesByDateReportResponse,
} from '@/services/sales/sales-reports/sales-by-date-report.read'
// Types
import type { SalesByDateFilterInterface } from '@/types/sales-report/SalesByDateFilter'
// Utils
import { extraErrorMessages } from '@/utils/common'
import { fromUnixTimestamp } from '@/utils/dateUtils'

export const useSalesByDateReport = () => {
  // State
  const filterData = ref<SalesByDateFilterInterface | null>(null)
  const reportData = ref<SalesByDateReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.reportItems?.length))
  const items = computed(() => {
    const startDate = fromUnixTimestamp(filterData.value?.fromDateTs ?? 0)

    if (!reportData.value?.result?.reportItems?.length) return []

    return (reportData.value?.result?.reportItems ?? []).map((item, index) => {
      const total = item.serviceAmount + item.productAmount + item.prepaidCardAmount + item.prepaidServiceAmount
      const date = startDate.add(index, 'day').format(STANDARD_DATE_FORMAT.YMD)

      return {
        ...item,
        total,
        date,
      }
    })
  })

  /**
   * Convert SalesByDateFilterInterface to SalesByDateReportRequest
   * @param filters - The filters from SalesByDateView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: SalesByDateFilterInterface): SalesByDateReportRequest => {
    filterData.value = filters

    return {
      isHeadquarterView: filters.isHeadquarterView,
      headquarterShopId: filters.headquarterShopId,
      shopId: filters.shopId,
      toDateTs: filters.toDateTs,
      fromDateTs: filters.fromDateTs,
      prepaidSalesCountingType: filters.prepaidSalesCountingType,
    }
  }

  /**
   * Fetch sales by date report data
   * @param filters - The filters from SalesByDateView
   * @returns Promise containing the report data
   */
  const fetchReport = async (filters: SalesByDateFilterInterface): Promise<SalesByDateReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await getSalesByDateReport(requestPayload)
      if (!response || !response.isOK) {
        showError(response.errorMessages)
      }

      reportData.value = response
      return response
    } catch (err: unknown) {
      const errorMessage = extraErrorMessages(err)
      showError(errorMessage)
      return null
    } finally {
      startLoading(false)
    }
  }

  /**
   * Clear the current report data and error state
   */
  const clearReport = (): void => {
    reportData.value = null
    error.value = null
  }

  /**
   * Refresh the report with current filters
   * @param filters - The current filters
   */
  const refreshReport = async (filters: SalesByDateFilterInterface): Promise<void> => {
    await fetchReport(filters)
  }

  return {
    // State
    filterData,
    reportData,
    error,
    isLoading,

    // Computed
    hasData,
    items,

    // Methods
    fetchReport,
    clearReport,
    refreshReport,
    buildRequestPayload,
  }
}
