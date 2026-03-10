import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { clientReportReadService } from '@/services/sales/client-report.read'
// Types
import type {
  NewClientRepeatFilterInterface,
  NewClientRepeatReportItem,
  NewClientRepeatReportRequest,
  NewClientRepeatReportResponse,
} from '@/types/client-report/NewClientRepeat'
// Utils
import { extraErrorMessages } from '@/utils/common'

/**
 * Composable for managing new client repeat report data and operations
 * Provides reactive state and methods for fetching and managing new client repeat report data
 * @returns Object containing reactive state and methods for service sales by item report operations
 */
export const useNewClientRepeatReport = () => {
  // State
  const filterData = ref<NewClientRepeatFilterInterface | null>(null)
  const reportData = ref<NewClientRepeatReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.reportItems?.length))
  const items = computed(() => (reportData.value?.result ?? []) as NewClientRepeatReportItem[])

  /**
   * Convert NewClientRepeatFilterInterface to NewClientRepeatReportRequest
   * @param filters - The filters from NewClientRepeatView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: NewClientRepeatFilterInterface): NewClientRepeatReportRequest => {
    filterData.value = filters

    return {
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
    }
  }

  /**
   * Fetch new client repeat report data
   * @param filters - The filters from NewClientRepeatView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: NewClientRepeatFilterInterface,
  ): Promise<NewClientRepeatReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await clientReportReadService.getNewClientRepeatReport(requestPayload)

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
  const refreshReport = async (filters: NewClientRepeatFilterInterface): Promise<void> => {
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
