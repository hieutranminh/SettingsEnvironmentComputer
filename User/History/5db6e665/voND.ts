import { ref, computed, type ComputedRef, type Ref } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import {
  getBranchPrepaidGoodsReport,
  type IBranchPrepaidGoodsReportItem,
  type IBranchPrepaidGoodsReportRequest,
  type IBranchPrepaidGoodsReportResponse,
} from '@/services/sales/sales-reports/branch-prepaid-goods-report.read'
import type { BranchPrepaidGoodsFilterInterface } from '@/types/branch/BranchPrepaidGoodsFilter'
import { extraErrorMessages } from '@/utils/common'

interface IUseBranchPrepaidGoodsReturn {
  reportData: Ref<IBranchPrepaidGoodsReportResponse | null>
  error: Ref<string | null>
  hasData: ComputedRef<boolean>
  items: ComputedRef<IBranchPrepaidGoodsReportItem[]>
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
    filters: BranchPrepaidGoodsFilterInterface,
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
    filters: BranchPrepaidGoodsFilterInterface,
  ): Promise<IBranchPrepaidGoodsReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await getBranchPrepaidGoodsReport(requestPayload)

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
  const refreshReport = async (filters: BranchPrepaidGoodsFilterInterface): Promise<void> => {
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
