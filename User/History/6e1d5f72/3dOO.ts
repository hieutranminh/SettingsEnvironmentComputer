import { ref, computed, type Ref, type ComputedRef } from 'vue'

import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { salesReportsReadService } from '@/services/sales/sales-reports.read'
// Types
import type {
  IBranchSalesTotalReportRequest,
  IBranchSalesTotalReportResponse,
  IBranchSalesFilterInterface,
  IBranchSalesTotalReportItem,
} from '@/types/sales-report/BranchSales'
import { extraErrorMessages } from '@/utils/common'

import { useLoading } from './useLoading'

// Types
interface IUseBranchSalesTotalReportReturn {
  // State
  data: Ref<IBranchSalesTotalReportResponse | null>
  error: Ref<string | null>
  isLoading: unknown

  // Computed
  hasData: ComputedRef<boolean>
  items: ComputedRef<IBranchSalesTotalReportItem[]>
  pagingInfo: ComputedRef<{ pageNumber: number; pageSize: number; totalItems: number } | undefined>

  // Methods
  fetchData: (
    filters: IBranchSalesFilterInterface,
    append?: boolean,
  ) => Promise<IBranchSalesTotalReportResponse | null>
  clearData: () => void
  refreshData: (filters: IBranchSalesFilterInterface) => Promise<void>
  buildRequestPayload: (filters: IBranchSalesFilterInterface) => IBranchSalesTotalReportRequest
}

export const useBranchSalesTotalReport = (): IUseBranchSalesTotalReportReturn => {
  // State
  const data = ref<IBranchSalesTotalReportResponse | null>(null)
  const error = ref<string | null>(null)
  // Composables
  const { isLoading, startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const hasData = computed(() => (data.value?.result?.items?.length ?? 0) > 0)
  const items = computed(() => data.value?.result?.items ?? [])
  const pagingInfo = computed(() => data.value?.result?.pagingInfo)

  /**
   * Merges new items with existing items for append functionality
   * @param existingData - Current data in state
   * @param newResponse - New response from API
   * @returns Merged data structure
   */
  const mergeData = (
    existingData: IBranchSalesTotalReportResponse,
    newResponse: IBranchSalesTotalReportResponse,
  ): IBranchSalesTotalReportResponse => {
    const existingItems = existingData.result?.items ?? []
    const newItems = newResponse.result?.items ?? []

    return {
      ...newResponse,
      result: {
        ...newResponse.result!,
        items: [...existingItems, ...newItems],
        pagingInfo: newResponse.result?.pagingInfo,
      },
    }
  }

  /**
   * Convert BranchSalesFilterInterface to BranchSalesTotalReportRequest
   * @param filters - The filters from BranchSalesView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (
    filters: IBranchSalesFilterInterface,
  ): IBranchSalesTotalReportRequest => {
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
   * Fetches branch sales total report data
   * @param filters - The filters from BranchSalesView
   * @param append - Whether to append new data to existing data (for load more)
   * @returns Promise containing the report data
   */
  const fetchData = async (
    filters: IBranchSalesFilterInterface,
    append = false,
  ): Promise<IBranchSalesTotalReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await salesReportsReadService.getBranchSalesTotalReport(requestPayload)

      if (!response.isOK) {
        showError(response.errorMessages)
        return response
      }

      if (append && data.value?.result) {
        data.value = mergeData(data.value, response)
      } else {
        data.value = response
      }

      return response
    } catch (err) {
      const errorMessage = extraErrorMessages(err)
      showError(errorMessage)
      return null
    } finally {
      startLoading(false)
    }
  }

  /**
   * Clears the current data and error state
   */
  const clearData = (): void => {
    data.value = null
    error.value = null
  }

  /**
   * Refreshes the data with current filters
   * @param filters - The current filters
   */
  const refreshData = async (filters: IBranchSalesFilterInterface): Promise<void> => {
    await fetchData(filters)
  }

  return {
    // State
    data,
    error,
    isLoading,

    // Computed
    hasData,
    items,
    pagingInfo,

    // Methods
    fetchData,
    clearData,
    refreshData,
    buildRequestPayload,
  }
}
