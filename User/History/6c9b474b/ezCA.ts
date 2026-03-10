import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Constants
import { STANDARD_DATE_FORMAT } from '@/constants'
// Services
import {
  getSalesByMonthReport,
  type SalesByMonthReportRequest,
  type SalesByMonthReportResponse,
} from '@/services/sales/sales-reports/sales-by-month-report.read'
// Types
import type { SalesByMonthFilterInterface } from '@/types/sales-report/SalesByMonthFilter'
// Utils
import { extraErrorMessages } from '@/utils/common'
import { fromUnixTimestamp } from '@/utils/dateUtils'

export const useSalesByMonthReport = () => {
  // State
  const filterData = ref<SalesByMonthFilterInterface | null>(null)
  const reportData = ref<SalesByMonthReportResponse | null>(null)
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
      const date = startDate.add(index, 'month').format(STANDARD_DATE_FORMAT.YM)

      return {
        ...item,
        total,
        date,
      }
    })
  })

  /**
   * Convert SalesByMonthFilterInterface to SalesByMonthReportRequest
   * @param filters - The filters from SalesByMonthView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: SalesByMonthFilterInterface): SalesByMonthReportRequest => {
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
   * Fetch sales by month report data
   * @param filters - The filters from SalesByMonthView
   * @returns Promise containing the report data
   */
  const fetchReport = async (filters: SalesByMonthFilterInterface): Promise<SalesByMonthReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await getSalesByMonthReport(requestPayload)

      reportData.value = response ?? null

      if (!response.isOK) {
        showError(response.errorMessages)
      }

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
  const refreshReport = async (filters: SalesByMonthFilterInterface): Promise<void> => {
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
