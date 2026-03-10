import { ref, computed, type ComputedRef, type Ref } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Constants
import { STANDARD_DATE_FORMAT } from '@/constants'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  ISalesByMonthFilterInterface,
  ISalesByMonthReportResponse,
  ISalesByMonthReportRequest,
  ISalesByMonthReportItem,
} from '@/types/sales-report/SalesByMonth'
// Utils
import { extraErrorMessages } from '@/utils/common'
import { fromUnixTimestamp } from '@/utils/dateUtils'

export interface IUseSalesByMonthReportReturn {
  savedFilters: Ref<ISalesByMonthFilterInterface | null>
  reportData: Ref<ISalesByMonthReportResponse | null>
  hasData: ComputedRef<boolean>
  items: ComputedRef<ISalesByMonthReportItem[]>
  fetchReport: (
    filters: ISalesByMonthFilterInterface,
  ) => Promise<ISalesByMonthReportResponse | null>
  clearReport: () => void
  refreshReport: (filters: ISalesByMonthFilterInterface) => Promise<void>
  buildRequestPayload: (filters: ISalesByMonthFilterInterface) => ISalesByMonthReportRequest
}

export const useSalesByMonthReport = (): IUseSalesByMonthReportReturn => {
  // State
  const savedFilters = ref<ISalesByMonthFilterInterface | null>(null)
  const reportData = ref<ISalesByMonthReportResponse | null>(null)
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(
    () => !!(reportData.value?.isOK && reportData.value?.result?.reportItems?.length),
  )
  const items = computed<ISalesByMonthReportItem[]>(() => {
    const startDate = fromUnixTimestamp(savedFilters.value?.fromDateTs ?? 0)

    if (!reportData.value?.result?.reportItems?.length) return []

    return (reportData.value?.result?.reportItems ?? []).map((item, index) => {
      const total =
        item.serviceAmount + item.productAmount + item.prepaidCardAmount + item.prepaidServiceAmount
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
  const buildRequestPayload = (
    filters: ISalesByMonthFilterInterface,
  ): ISalesByMonthReportRequest => {
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
  const fetchReport = async (
    filters: ISalesByMonthFilterInterface,
  ): Promise<ISalesByMonthReportResponse | null> => {
    try {
      startLoading(true)

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getSalesByMonthReport(requestPayload)
      if (!response.isOK) {
        showError(response.errorMessages)
        return response ?? null
      }

      savedFilters.value = requestPayload
      reportData.value = response ?? null
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
  }

  /**
   * Refresh the report with current filters
   * @param filters - The current filters
   */
  const refreshReport = async (filters: ISalesByMonthFilterInterface): Promise<void> => {
    await fetchReport(filters)
  }

  return {
    // State
    savedFilters,
    reportData,

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
