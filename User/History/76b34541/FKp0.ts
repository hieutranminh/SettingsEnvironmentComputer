import { ref, computed, type ComputedRef, type Ref } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  IProductSalesByItemFilterInterface,
  IProductSalesByItemReportItem,
  IProductSalesByItemReportRequest,
  IProductSalesByItemReportResponse,
} from '@/types/sales-report/ProductSalesByItem'
// Utils
import { extraErrorMessages } from '@/utils/common'

export interface IUseProductSalesByItemReportReturn {
  savedFilters: Ref<IProductSalesByItemFilterInterface | null>
  reportData: Ref<IProductSalesByItemReportResponse | null>
  error: Ref<string | null>
  hasData: ComputedRef<boolean>
  items: ComputedRef<IProductSalesByItemReportItem[]>
  fetchReport: (
    filters: IProductSalesByItemFilterInterface,
  ) => Promise<IProductSalesByItemReportResponse | null>
  clearReport: () => void
  refreshReport: (filters: IProductSalesByItemFilterInterface) => Promise<void>
  buildRequestPayload: (
    filters: IProductSalesByItemFilterInterface,
  ) => IProductSalesByItemReportRequest
}

export const useProductSalesByItemReport = (): IUseProductSalesByItemReportReturn => {
  // State
  const savedFilters = ref<IProductSalesByItemFilterInterface | null>(null)
  const reportData = ref<IProductSalesByItemReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(
    () => !!(reportData.value?.isOK && reportData.value?.result?.productSalesByItems?.length),
  )
  const items = computed(
    () => (reportData.value?.result?.productSalesByItems ?? []) as IProductSalesByItemReportItem[],
  )

  /**
   * Convert ProductSalesByItemFilterInterface to ProductSalesByItemReportRequest
   * @param filters - The filters from ProductSalesByItemView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (
    filters: IProductSalesByItemFilterInterface,
  ): IProductSalesByItemReportRequest => {
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
   * Fetch product sales by item report data
   * @param filters - The filters from ProductSalesByItemView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: IProductSalesByItemFilterInterface,
  ): Promise<IProductSalesByItemReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getProductSalesByItemReport(requestPayload)
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
  const refreshReport = async (filters: IProductSalesByItemFilterInterface): Promise<void> => {
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

    // Methods
    fetchReport,
    clearReport,
    refreshReport,
    buildRequestPayload,
  }
}
