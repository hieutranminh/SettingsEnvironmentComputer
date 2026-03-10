import { ref, computed } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  ProductSalesByMonthFilterInterface,
  ProductSalesByMonthReportItem,
  ProductSalesByMonthReportRequest,
  ProductSalesByMonthReportResponse,
} from '@/types/sales-report/ProductSalesByMonth'
// Utils
import { extraErrorMessages } from '@/utils/common'

export const useProductSalesByMonthReport = () => {
  // State
  const filterData = ref<ProductSalesByMonthFilterInterface | null>(null)
  const reportData = ref<ProductSalesByMonthReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && reportData.value?.result?.productSalesByMonths?.length))
  const items = computed(
    () => (reportData.value?.result?.productSalesByMonths ?? []) as ProductSalesByMonthReportItem[],
  )

  /**
   * Convert ProductSalesByMonthFilterInterface to ProductSalesByMonthReportRequest
   * @param filters - The filters from ProductSalesByMonthView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: ProductSalesByMonthFilterInterface): ProductSalesByMonthReportRequest => {
    filterData.value = filters

    return {
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
      categoryId: filters.categoryId,
      productId: filters.productId,
      staffId: filters.staffId,
    }
  }

  /**
   * Fetch product sales by month report data
   * @param filters - The filters from ProductSalesByMonthView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: ProductSalesByMonthFilterInterface,
  ): Promise<ProductSalesByMonthReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getProductSalesByMonthReport(requestPayload)
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
  const refreshReport = async (filters: ProductSalesByMonthFilterInterface): Promise<void> => {
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
