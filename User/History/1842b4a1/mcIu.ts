import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { clientReportReadService } from '@/services/sales/client-report.read'
// Types
import type {
  PrepaidGoodsRepurchaseFilterInterface,
  PrepaidGoodsRepurchaseReportItem,
  PrepaidGoodsRepurchaseReportRequest,
  PrepaidGoodsRepurchaseReportResponse,
} from '@/types/client-report/PrepaidGoodsRepurchase'
// Utils
import { extraErrorMessages } from '@/utils/common'

/**
 * Composable for managing prepaid goods repurchase report data and operations
 * Provides reactive state and methods for fetching and managing prepaid goods repurchase report data
 * @returns Object containing reactive state and methods for prepaid goods repurchase report operations
 */
export const usePrepaidGoodsRepurchaseReport = () => {
  // State
  const filterData = ref<PrepaidGoodsRepurchaseFilterInterface | null>(null)
  const reportData = ref<PrepaidGoodsRepurchaseReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.reportItems?.length))
  const items = computed(() => (reportData.value?.result?.reportItems ?? []) as PrepaidGoodsRepurchaseReportItem[])

  /**
   * Convert PrepaidGoodsRepurchaseFilterInterface to PrepaidGoodsRepurchaseReportRequest
   * @param filters - The filters from PrepaidGoodsRepurchaseView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: PrepaidGoodsRepurchaseFilterInterface): PrepaidGoodsRepurchaseReportRequest => {
    filterData.value = filters

    return {
      dateType: filters.dateType,
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
      staffId: filters.staffId,
      reportByType: filters.reportByType,
    }
  }

  /**
   * Fetch prepaid goods repurchase report data
   * @param filters - The filters from PrepaidGoodsRepurchaseView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: PrepaidGoodsRepurchaseFilterInterface,
  ): Promise<PrepaidGoodsRepurchaseReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await clientReportReadService.getPrepaidGoodsRepurchaseReport(requestPayload)

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
  const refreshReport = async (filters: PrepaidGoodsRepurchaseFilterInterface): Promise<void> => {
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
