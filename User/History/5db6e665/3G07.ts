import { ref, computed, type ComputedRef, type Ref } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
import type {
  IBranchPrepaidGoodsFilter,
  IBranchPrepaidGoodsReportItem,
  IBranchPrepaidGoodsReportRequest,
  IBranchPrepaidGoodsReportResponse,
} from '@/types/sales-report/BranchPrepaidGoods'
import { extraErrorMessages } from '@/utils/common'

interface IUseBranchPrepaidGoodsReturn {
  reportData: Ref<IBranchPrepaidGoodsReportResponse | null>
  error: Ref<string | null>
  hasData: ComputedRef<boolean>
  items: ComputedRef<IBranchPrepaidGoodsReportItem[]>
  fetchReport: (
    filters: IBranchPrepaidGoodsFilter,
  ) => Promise<IBranchPrepaidGoodsReportResponse | null>
  clearReport: () => void
  refreshReport: (filters: IBranchPrepaidGoodsFilter) => Promise<void>
  buildRequestPayload: (filters: IBranchPrepaidGoodsFilter) => IBranchPrepaidGoodsReportRequest
}

export const useBranchPrepaidGoods = (): IUseBranchPrepaidGoodsReturn => {
  // State
  const reportData = ref<IBranchPrepaidGoodsReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()
  // Computed
  const hasData = computed(
    () => !!(reportData.value?.isOK && (reportData.value?.result?.length ?? 0) > 0),
  )
  const items = computed(() => (reportData.value?.result ?? []) as IBranchPrepaidGoodsReportItem[])

  /**
   * Convert BranchPrepaidGoodsFilterInterface to BranchPrepaidGoodsReportRequest
   * @param filters - The filters from BranchPrepaidGoodsView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (
    filters: IBranchPrepaidGoodsFilter,
  ): IBranchPrepaidGoodsReportRequest => {
    return {
      isHeadquarterView: filters.isHeadquarterView,
      headquarterShopId: filters.headquarterShopId,
      branchName: filters.branchName,
      branchShopIds: filters.branchShopIds,
      branchGroupId: filters.branchGroupId,
      customBranchTypeId: filters.customBranchTypeId,
    }
  }

  /**
   * Fetch branch prepaid goods report data
   * @param filters - The filters from BranchPrepaidGoodsView
   * @returns Promise containing the report data
   */
  const fetchReport = async (
    filters: IBranchPrepaidGoodsFilter,
  ): Promise<IBranchPrepaidGoodsReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getBranchPrepaidGoodsReport(requestPayload)

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
  const refreshReport = async (filters: IBranchPrepaidGoodsFilter): Promise<void> => {
    await fetchReport(filters)
  }

  return {
    // State
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
