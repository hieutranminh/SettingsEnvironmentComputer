import { ref, computed } from 'vue'

import { useLoading } from '@/composables/useLoading'
import {
  getBranchPrepaidGoodsReport,
  type BranchPrepaidGoodsReportRequest,
  type BranchPrepaidGoodsReportResponse,
} from '@/services/sales/sales-reports/branch-prepaid-goods-report.read'
import type { BranchPrepaidGoodsFilterInterface } from '@/types/branch/BranchPrepaidGoodsFilter'
// Utils
import { extraErrorMessages } from '@/utils/common'

export const useBranchPrepaidGoods = () => {
  // State
  const reportData = ref<BranchPrepaidGoodsReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()

  // Computed
  const hasData = computed(() => reportData.value !== null)
  const items = computed(() => reportData.value || [])

  /**
   * Convert BranchPrepaidGoodsFilterInterface to BranchPrepaidGoodsReportRequest
   * @param filters - The filters from BranchPrepaidGoodsView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: BranchPrepaidGoodsFilterInterface): BranchPrepaidGoodsReportRequest => {
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
  ): Promise<BranchPrepaidGoodsReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await getBranchPrepaidGoodsReport(requestPayload)

      console.log('response', response)
      reportData.value = response

      return response
    } catch (err) {
      error.value = extraErrorMessages(err)
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
