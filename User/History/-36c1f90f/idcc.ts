import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  ServiceSalesFilterInterface,
  ServiceSalesReportItem,
  ServiceSalesReportRequest,
  ServiceSalesReportResponse,
} from '@/types/sales-report/ServiceSales'
// Utils
import { extraErrorMessages } from '@/utils/common'

export const useServiceSalesReport = () => {
  // State
  const filterData = ref<ServiceSalesFilterInterface | null>(null)
  const reportData = ref<ServiceSalesReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.serviceSalesItems?.length))
  const items = computed(() => (reportData.value?.result?.serviceSalesItems ?? []) as ServiceSalesReportItem[])

  /**
   * Convert ServiceSalesFilterInterface to ServiceSalesReportRequest
   * @param filters - The filters from ServiceSalesView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: ServiceSalesFilterInterface): ServiceSalesReportRequest => {
    filterData.value = filters

    return {
      dateType: filters.dateType,
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
      reportByType: filters.reportByType,
      staffId: filters.staffId,
    }
  }

  /**
   * Fetch service sales report data
   * @param filters - The filters from ServiceSalesView
   * @returns Promise containing the report data
   */
  const fetchReport = async (filters: ServiceSalesFilterInterface): Promise<ServiceSalesReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getServiceSalesReport(requestPayload)
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
  const refreshReport = async (filters: ServiceSalesFilterInterface): Promise<void> => {
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
