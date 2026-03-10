import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  ServiceSalesByMonthFilterInterface,
  ServiceSalesByMonthReportItem,
  ServiceSalesByMonthReportRequest,
  ServiceSalesByMonthReportResponse,
} from '@/types/sales-report/ServiceSalesByMonth'
// Utils
import { extraErrorMessages } from '@/utils/common'

/**
 * Composable for managing service sales by month report data and operations
 * Provides reactive state and methods for fetching and managing service sales by month report data
 * @returns Object containing reactive state and methods for service sales by month report operations
 */
export const useServiceSalesByMonthReport = () => {
  // State
  const filterData = ref<ServiceSalesByMonthFilterInterface | null>(null)
  const reportData = ref<ServiceSalesByMonthReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.serviceSalesByMonths?.length))
  const items = computed(
    () => (reportData.value?.result?.serviceSalesByMonths ?? []) as ServiceSalesByMonthReportItem[],
  )

  /**
   * Convert ServiceSalesByMonthFilterInterface to ServiceSalesByMonthReportRequest
   * @param filters - The filters from ServiceSalesByMonthView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: ServiceSalesByMonthFilterInterface): ServiceSalesByMonthReportRequest => {
    filterData.value = filters

    return {
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
      categoryId: filters.categoryId,
      serviceId: filters.serviceId,
      staffId: filters.staffId,
    }
  }

  /**
   * Fetch service sales by month report data
   * @param filters - The filters from ServiceSalesByMonthView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: ServiceSalesByMonthFilterInterface,
  ): Promise<ServiceSalesByMonthReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getServiceSalesByMonthReport(requestPayload)

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
  const refreshReport = async (filters: ServiceSalesByMonthFilterInterface): Promise<void> => {
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
