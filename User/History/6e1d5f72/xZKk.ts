import { ref, computed } from 'vue'

import { getBranchSalesTotalReport, type BranchSalesTotalReportRequest, type BranchSalesTotalReportResponse } from '@/services/sales/sales-reports/branch-sales-total-report.read'
import type { BranchSalesFilterInterface } from '@/types/branch/BranchSalesFilter'

import { useLoading } from './useLoading'

export const useBranchSalesTotalReport = () => {
  // State
  const reportData = ref<BranchSalesTotalReportResponse | null>(null)
  const error = ref<string | null>(null)
  const { isLoading, startLoading } = useLoading()

  // Computed
  const hasData = computed(() => reportData.value !== null)
  const items = computed(() => reportData.value?.items || [])
  const pagingInfo = computed(() => reportData.value?.pagingInfo)

  /**
   * Convert BranchSalesFilterInterface to BranchSalesTotalReportRequest
   * @param filters - The filters from BranchSalesView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: BranchSalesFilterInterface): BranchSalesTotalReportRequest => {
    return {
      pageSize: filters.pageSize,
      isHeadquarterView: filters.isHeadquarterView,
      dateType: filters.dateType,
      toDateTs: filters.toDateTs,
      pageNumber: filters.pageNumber,
      headquarterShopId: filters.headquarterShopId,
      fromDateTs: filters.fromDateTs,
      branchName: filters.branchName,
      branchShopIds: filters.branchShopIds,
      branchGroupId: filters.branchGroupId,
      customBranchTypeId: filters.customBranchTypeId,
    }
  }

  /**
   * Fetch branch sales total report data
   * @param filters - The filters from BranchSalesView
   * @returns Promise containing the report data
   */
  const fetchReport = async (filters: BranchSalesFilterInterface): Promise<BranchSalesTotalReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await getBranchSalesTotalReport(requestPayload)

      reportData.value = response
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch branch sales total report'
      error.value = errorMessage
      console.error('Error fetching branch sales total report:', err)
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
  const refreshReport = async (filters: BranchSalesFilterInterface): Promise<void> => {
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
    pagingInfo,

    // Methods
    fetchReport,
    clearReport,
    refreshReport,
    buildRequestPayload,
  }
}