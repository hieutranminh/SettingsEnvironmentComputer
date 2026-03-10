import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { clientReportReadService } from '@/services/sales/client-report.read'
// Types
import type {
  ClientsByTypeFilterInterface,
  ClientsByTypeReportItem,
  ClientsByTypeReportRequest,
  ClientsByTypeReportResponse,
} from '@/types/client-report/ClientsByType'
// Utils
import { extraErrorMessages } from '@/utils/common'

export const useClientsByTypeReport = () => {
  // State
  const filterData = ref<ClientsByTypeFilterInterface | null>(null)
  const reportData = ref<ClientsByTypeReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.shopId))
  const items = computed(() => (reportData.value?.result?.reportItems ?? []) as ClientsByTypeReportItem[])

  /**
   * Convert ClientsByTypeFilterInterface to ClientsByTypeReportRequest
   * @param filters - The filters from ClientsByTypeView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: ClientsByTypeFilterInterface): ClientsByTypeReportRequest => {
    filterData.value = filters

    return {
      reportType: filters.reportType,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
    }
  }

  /**
   * Fetch clients by type report data
   * @param filters - The filters from ClientsByTypeView
   * @returns Promise containing the report data
   */
  const fetchReport = async (filters: ClientsByTypeFilterInterface): Promise<ClientsByTypeReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await clientReportReadService.getClientsByTypeReport(requestPayload)

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
  const refreshReport = async (filters: ClientsByTypeFilterInterface): Promise<void> => {
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
