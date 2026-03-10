import { ref, computed, type Ref, type ComputedRef } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { clientReportReadService } from '@/services/sales/client-report.read'
// Types
import type {
  ClientsByPeriodFilterInterface,
  ClientsByPeriodReportRequest,
  ClientsByPeriodReportResponse,
  ClientSummary,
  MemberSummary,
} from '@/types/client-report/ClientsByPeriod'
// Utils
import { extraErrorMessages } from '@/utils/common'

export const useClientsByPeriodReport = (): {
  filterData: Ref<ClientsByPeriodFilterInterface | null>
  reportData: Ref<ClientsByPeriodReportResponse | null>
  error: Ref<string | null>
  isLoading: Ref<boolean>
  clientSummary: ComputedRef<ClientSummary>
  memberSummary: ComputedRef<MemberSummary>
} => {
  // State
  const filterData = ref<ClientsByPeriodFilterInterface | null>(null)
  const reportData = ref<ClientsByPeriodReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const clientSummary = computed(() => (reportData.value?.result?.clientSummary ?? {}) as ClientSummary)
  const memberSummary = computed(() => (reportData.value?.result?.memberSummary ?? {}) as MemberSummary)

  /**
   * Convert ClientsByPeriodFilterInterface to ClientsByPeriodReportRequest
   * @param filters - The filters from ClientsByPeriodView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: ClientsByPeriodFilterInterface): ClientsByPeriodReportRequest => {
    filterData.value = filters

    return {
      dateType: filters.dateType,
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
      chainId: filters.chainId,
    }
  }

  /**
   * Fetch clients by period report data
   * @param filters - The filters from ClientsByPeriodView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: ClientsByPeriodFilterInterface,
  ): Promise<ClientsByPeriodReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await clientReportReadService.getClientsByPeriodReport(requestPayload)
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
  const refreshReport = async (filters: ClientsByPeriodFilterInterface): Promise<void> => {
    await fetchReport(filters)
  }

  return {
    // State
    filterData,
    reportData,
    error,
    isLoading: isLoading as Ref<boolean>,

    // Computed
    clientSummary,
    memberSummary,

    // Methods
    fetchReport,
    clearReport,
    refreshReport,
    buildRequestPayload,
  }
}
