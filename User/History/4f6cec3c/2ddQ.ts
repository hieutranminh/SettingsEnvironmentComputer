import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  SalesByDiscountCategoryFilterInterface,
  SalesByDiscountCategoryReportItem,
  SalesByDiscountCategoryReportRequest,
  SalesByDiscountCategoryReportResponse,
} from '@/types/sales-report/SalesByDiscountCategory'
// Utils
import { extraErrorMessages } from '@/utils/common'

/**
 * Composable for managing sales by discount category report data and operations
 * Provides reactive state and methods for fetching and managing sales by discount category report data
 * @returns Object containing reactive state and methods for sales by discount category report operations
 */
export const useSalesByDiscountCategoryReport = () => {
  // State
  const filterData = ref<SalesByDiscountCategoryFilterInterface | null>(null)
  const reportData = ref<SalesByDiscountCategoryReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.length))
  const items = computed<SalesByDiscountCategoryReportItem[]>(() => reportData.value?.result ?? [])

  /**
   * Convert SalesByDiscountCategoryFilterInterface to SalesByDiscountCategoryReportRequest
   * @param filters - The filters from SalesByDiscountCategoryView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (
    filters: SalesByDiscountCategoryFilterInterface,
  ): SalesByDiscountCategoryReportRequest => {
    filterData.value = filters

    return {
      dateType: filters.dateType,
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
      staffId: filters.staffId,
    }
  }

  /**
   * Fetch sales by discount category report data
   * @param filters - The filters from SalesByDiscountCategoryView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: SalesByDiscountCategoryFilterInterface,
  ): Promise<SalesByDiscountCategoryReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getSalesByDiscountCategoryReport(requestPayload)

      if (!response.isOK) {
        showError(response.errorMessages)
        return response
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
  const refreshReport = async (filters: SalesByDiscountCategoryFilterInterface): Promise<void> => {
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
