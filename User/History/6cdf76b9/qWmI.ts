import { ref, computed } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import {
  getSalesByDateReport,
  type SalesByDateReportItem,
  type SalesByDateReportRequest,
  type SalesByDateReportResponse,
} from '@/services/sales/sales-reports/sales-by-date-report.read'
import type { SalesByDateFilterInterface } from '@/types/sales-report/SalesByDateFilter'
import { extraErrorMessages } from '@/utils/common'

export const useSalesByDateReport = () => {
  // State
  const reportData = ref<SalesByDateReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()
  // Computed
  const hasData = computed(() => !!(reportData.value?.isOK && (reportData.value?.result?.length ?? 0) > 0))
  const items = computed(() => (reportData.value?.result ?? []) as SalesByDateReportItem[])

  /**
   * Convert SalesByDateFilterInterface to SalesByDateReportRequest
   * @param filters - The filters from SalesByDateView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: SalesByDateFilterInterface): SalesByDateReportRequest => {
    return {
      isHeadquarterView: filters.isHeadquarterView,
      headquarterShopId: filters.headquarterShopId,
      shopId: filters.shopId,
      toDateTs: filters.toDateTs,
      fromDateTs: filters.fromDateTs,
      prepaidSalesCountingType: filters.prepaidSalesCountingType,
    }
  }

  /**
   * Fetch sales by date report data
   * @param filters - The filters from SalesByDateView
   * @returns Promise containing the report data
   */
  const fetchReport = async (filters: SalesByDateFilterInterface): Promise<SalesByDateReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await getSalesByDateReport(requestPayload)

      reportData.value = response

      if (!response.isOK) {
        showError(response.errorMessages)
      }

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
  const refreshReport = async (filters: SalesByDateFilterInterface): Promise<void> => {
    await fetchReport(filters)
  }

  return {
    // State
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
