import { ref, computed, type ComputedRef, type Ref } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  IServiceSalesByItemFilterInterface,
  IServiceSalesByItemReportItem,
  IServiceSalesByItemReportRequest,
  IServiceSalesByItemReportResponse,
} from '@/types/sales-report/ServiceSalesByItem'
// Utils
import { extraErrorMessages } from '@/utils/common'

export interface IUseServiceSalesByItemReportReturn {
  filterData: Ref<IServiceSalesByItemFilterInterface | null>
  reportData: Ref<IServiceSalesByItemReportResponse | null>
  error: Ref<string | null>
  hasData: ComputedRef<boolean>
  items: ComputedRef<IServiceSalesByItemReportItem[]>
  fetchReport: (
    filters: IServiceSalesByItemFilterInterface,
  ) => Promise<IServiceSalesByItemReportResponse | null>
  clearReport: () => void
  refreshReport: (filters: IServiceSalesByItemFilterInterface) => Promise<void>
  buildRequestPayload: (
    filters: IServiceSalesByItemFilterInterface,
  ) => IServiceSalesByItemReportRequest
}

/**
 * Composable for managing service sales by item report data and operations
 * Provides reactive state and methods for fetching and managing service sales by item report data
 * @returns Object containing reactive state and methods for service sales by item report operations
 */
export const useServiceSalesByItemReport = (): IUseServiceSalesByItemReportReturn => {
  // State
  const filterData = ref<IServiceSalesByItemFilterInterface | null>(null)
  const reportData = ref<IServiceSalesByItemReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.length))
  const items = computed(() => (reportData.value?.result ?? []) as IServiceSalesByItemReportItem[])

  /**
   * Convert ServiceSalesByItemFilterInterface to ServiceSalesByItemReportRequest
   * @param filters - The filters from ServiceSalesByItemView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (
    filters: IServiceSalesByItemFilterInterface,
  ): IServiceSalesByItemReportRequest => {
    filterData.value = filters

    return {
      dateType: filters.dateType,
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
      reportByType: filters.reportByType,
      categoryId: filters.categoryId,
      serviceId: filters.serviceId,
    }
  }

  /**
   * Fetch service sales by item report data
   * @param filters - The filters from ServiceSalesByItemView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: IServiceSalesByItemFilterInterface,
  ): Promise<IServiceSalesByItemReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      console.log('requestPayload', requestPayload)
      const response = await salesReportsReadService.getServiceSalesByItemReport(requestPayload)
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
  const refreshReport = async (filters: IServiceSalesByItemFilterInterface): Promise<void> => {
    await fetchReport(filters)
  }

  return {
    // State
    filterData,
    reportData,
    error,

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
