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
  ISalesByDateReportResponse,
  ISalesByDateFilterInterface,
  ISalesByDateReportRequest,
  ISalesByDateReportItem,
} from '@/types/sales-report/SalesByDate'
// Utils
import { extraErrorMessages } from '@/utils/common'
import { fromUnixTimestamp } from '@/utils/dateUtils'

export interface IUseSalesByDateReportReturn {
  savedFilters: Ref<ISalesByDateFilterInterface | null>
  reportData: Ref<ISalesByDateReportResponse | null>
  hasData: ComputedRef<boolean>
  items: ComputedRef<ISalesByDateReportItem[]>
  fetchReport: (filters: ISalesByDateFilterInterface) => Promise<ISalesByDateReportResponse | null>
  clearReport: () => void
  refreshReport: (filters: ISalesByDateFilterInterface) => Promise<void>
  buildRequestPayload: (filters: ISalesByDateFilterInterface) => ISalesByDateReportRequest
}

export const useSalesByDateReport = (): IUseSalesByDateReportReturn => {
  // State
  const savedFilters = ref<ISalesByDateFilterInterface | null>(null)
  const reportData = ref<ISalesByDateReportResponse | null>(null)
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(
    () => !!(reportData.value?.isOK && reportData.value?.result?.reportItems?.length),
  )
  const items = computed(() => {
    const startDate = fromUnixTimestamp(savedFilters.value?.fromDateTs ?? 0)

    if (!reportData.value?.result?.reportItems?.length) return []

    return (reportData.value?.result?.reportItems ?? []).map((item, index) => {
      const total =
        item.serviceAmount + item.productAmount + item.prepaidCardAmount + item.prepaidServiceAmount
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
  const buildRequestPayload = (filters: ISalesByDateFilterInterface): ISalesByDateReportRequest => {
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
  const fetchReport = async (
    filters: ISalesByDateFilterInterface,
  ): Promise<ISalesByDateReportResponse | null> => {
    try {
      startLoading(true)

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getSalesByDateReport(requestPayload)
      if (!response?.isOK) {
        showError(response.errorMessages)
        return response ?? null
      }

      savedFilters.value = requestPayload
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
  }

  /**
   * Refresh the report with current filters
   * @param filters - The current filters
   */
  const refreshReport = async (filters: ISalesByDateFilterInterface): Promise<void> => {
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
