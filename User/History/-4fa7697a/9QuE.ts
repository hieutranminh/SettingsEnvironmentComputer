import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  ServiceSalesBySalesTypeFilterInterface,
  ServiceSalesBySalesTypeReportItem,
  ServiceSalesBySalesTypeReportRequest,
  ServiceSalesBySalesTypeReportResponse,
} from '@/types/sales-report/ServiceSalesBySalesType'
// Utils
import { extraErrorMessages } from '@/utils/common'

/**
 * Composable for managing service sales by item report data and operations
 * Provides reactive state and methods for fetching and managing service sales by item report data
 * @returns Object containing reactive state and methods for service sales by item report operations
 */
export const useServiceSalesBySalesTypeReport = () => {
  // State
  const filterData = ref<ServiceSalesBySalesTypeFilterInterface | null>(null)
  const reportData = ref<ServiceSalesBySalesTypeReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.length))
  const items = computed(() => (reportData.value?.result ?? []) as ServiceSalesBySalesTypeReportItem[])

  /**
   * Convert ServiceSalesBySalesTypeFilterInterface to ServiceSalesBySalesTypeReportRequest
   * @param filters - The filters from ServiceSalesBySalesTypeView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (
    filters: ServiceSalesBySalesTypeFilterInterface,
  ): ServiceSalesBySalesTypeReportRequest => {
    filterData.value = filters

    return {
      dateType: filters.dateType,
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
      categoryId: filters.categoryId,
      serviceId: filters.serviceId,
      staffId: filters.staffId,
      isPointDeductionIncluded: filters.isPointDeductionIncluded,
      prepaidSalesCountingType: filters.prepaidSalesCountingType,
      salesTypeIds: filters.salesTypeIds,
    }
  }

  /**
   * Fetch service sales by sales type report data
   * @param filters - The filters from ServiceSalesBySalesTypeView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: ServiceSalesBySalesTypeFilterInterface,
  ): Promise<ServiceSalesBySalesTypeReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getServiceSalesBySalesTypeReport(requestPayload)
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
  const refreshReport = async (filters: ServiceSalesBySalesTypeFilterInterface): Promise<void> => {
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
