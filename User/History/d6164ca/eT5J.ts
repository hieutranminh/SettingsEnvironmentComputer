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

// Define the return type for better type safety
interface UseClientsByPeriodReportReturn {
  // State
  readonly filterData: Ref<ClientsByPeriodFilterInterface | null>
  readonly reportData: Ref<ClientsByPeriodReportResponse | null>
  readonly error: Ref<string | null>
  readonly isLoading: Ref<boolean>

  // Computed
  readonly clientSummary: ComputedRef<ClientSummary>
  readonly memberSummary: ComputedRef<MemberSummary>

  // Methods
  fetchReport: (filters: ClientsByPeriodFilterInterface) => Promise<ClientsByPeriodReportResponse | null>
  clearReport: () => void
  refreshReport: (filters: ClientsByPeriodFilterInterface) => Promise<void>
  buildRequestPayload: (filters: ClientsByPeriodFilterInterface) => ClientsByPeriodReportRequest
}

// Type guard functions for better type safety
const isValidClientSummary = (value: unknown): value is ClientSummary => {
  return typeof value === 'object' && value !== null
}

const isValidMemberSummary = (value: unknown): value is MemberSummary => {
  return typeof value === 'object' && value !== null
}

// Default empty objects that match the expected types
const defaultClientSummary = (): ClientSummary => ({}) as ClientSummary
const defaultMemberSummary = (): MemberSummary => ({}) as MemberSummary

export const useClientsByPeriodReport = (): UseClientsByPeriodReportReturn => {
  // State with explicit types
  const filterData: Ref<ClientsByPeriodFilterInterface | null> = ref<ClientsByPeriodFilterInterface | null>(null)
  const reportData: Ref<ClientsByPeriodReportResponse | null> = ref<ClientsByPeriodReportResponse | null>(null)
  const error: Ref<string | null> = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed with proper type safety and fallbacks
  const clientSummary: ComputedRef<ClientSummary> = computed(() => {
    const summary = reportData.value?.result?.clientSummary

    if (isValidClientSummary(summary)) {
      return summary
    }

    return defaultClientSummary()
  })

  const memberSummary: ComputedRef<MemberSummary> = computed(() => {
    const summary = reportData.value?.result?.memberSummary

    if (isValidMemberSummary(summary)) {
      return summary
    }

    return defaultMemberSummary()
  })

  /**
   * Convert ClientsByPeriodFilterInterface to ClientsByPeriodReportRequest
   * @param filters - The filters from ClientsByPeriodView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: ClientsByPeriodFilterInterface): ClientsByPeriodReportRequest => {
    // Validate required fields
    if (!filters.dateType || filters.fromDateTs === undefined || filters.toDateTs === undefined) {
      throw new Error('Missing required filter parameters: dateType, fromDateTs, or toDateTs')
    }

    filterData.value = { ...filters } // Create a copy to avoid mutation

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
   * @returns Promise containing the report data or null if error occurred
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
        const errorMessages = Array.isArray(response.errorMessages)
          ? response.errorMessages
          : [response.errorMessages || 'An unknown error occurred']

        showError(errorMessages)
        error.value = errorMessages.join(', ')
        return response
      }

      reportData.value = response
      return response
    } catch (err: unknown) {
      const errorMessage = extraErrorMessages(err)
      const errorMessages = Array.isArray(errorMessage) ? errorMessage : [errorMessage]

      error.value = errorMessages.join(', ')
      showError(errorMessages)
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
    filterData.value = null
  }

  /**
   * Refresh the report with current filters
   * @param filters - The current filters
   * @throws Error if no filters are provided
   */
  const refreshReport = async (filters: ClientsByPeriodFilterInterface): Promise<void> => {
    if (!filters) {
      throw new Error('Filters are required to refresh the report')
    }

    await fetchReport(filters)
  }

  return {
    // State (readonly to prevent external mutation)
    filterData: readonly(filterData),
    reportData: readonly(reportData),
    error: readonly(error),
    isLoading: readonly(isLoading),

    // Computed
    clientSummary,
    memberSummary,

    // Methods
    fetchReport,
    clearReport,
    refreshReport,
    buildRequestPayload,
  } as const
}
