import { ref, computed, type ComputedRef, type Ref } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  IServiceSalesFilterInterface,
  IServiceSalesReportItem,
  IServiceSalesReportRequest,
  IServiceSalesReportResponse,
} from '@/types/sales-report/ServiceSales'
// Utils
import { extraErrorMessages } from '@/utils/common'
import { REPORT_BY_TYPE, type ReportByType } from '@/constants'

export interface IUseServiceSalesReportReturn {
  savedFilters: Ref<IServiceSalesFilterInterface | null>
  reportData: Ref<IServiceSalesReportResponse | null>
  error: Ref<string | null>
  hasData: ComputedRef<boolean>
  items: ComputedRef<IServiceSalesReportItem[]>
  reportByType: ComputedRef<ReportByType>
  fetchReport: (
    filters: IServiceSalesFilterInterface,
  ) => Promise<IServiceSalesReportResponse | null>
  clearReport: () => void
  refreshReport: (filters: IServiceSalesFilterInterface) => Promise<void>
  buildRequestPayload: (filters: IServiceSalesFilterInterface) => IServiceSalesReportRequest
}

export const useServiceSalesReport = (): IUseServiceSalesReportReturn => {
  // State
  const savedFilters = ref<IServiceSalesFilterInterface | null>(null)
  const reportData = ref<IServiceSalesReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(
    () => !!(reportData.value?.isOK && reportData.value?.result?.serviceSalesItems?.length),
  )
  const items = computed(
    () => (reportData.value?.result?.serviceSalesItems ?? []) as IServiceSalesReportItem[],
  )
  const reportByType = computed(
    (): ReportByType => reportData.value?.result?.reportByType ?? REPORT_BY_TYPE.STAFF,
  )

  /**
   * Convert ServiceSalesFilterInterface to ServiceSalesReportRequest
   * @param filters - The filters from ServiceSalesView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (
    filters: IServiceSalesFilterInterface,
  ): IServiceSalesReportRequest => {
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
  const fetchReport = async (
    filters: IServiceSalesFilterInterface,
  ): Promise<IServiceSalesReportResponse | null> => {
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
  const refreshReport = async (filters: IServiceSalesFilterInterface): Promise<void> => {
    await fetchReport(filters)
  }

  return {
    // State
    savedFilters,
    reportData,
    error,

    // Computed
    hasData,
    items,
    reportByType,

    // Methods
    fetchReport,
    clearReport,
    refreshReport,
    buildRequestPayload,
  }
}
