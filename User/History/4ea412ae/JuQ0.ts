import { ref, type Ref } from 'vue'

import { fetchBranchSalesTotalFilter } from '@/services/admins/admins.read'
import type { BranchSalesTotalFilterItem, BranchSalesTotalFilterRequest } from '@/types/admins/BranchSalesTotalFilter'
import type { ApiResponse } from '@/types/ApiResponse'

interface UseBranchSalesTotalFilterReturn {
  branchSalesTotalFilterItems: Ref<BranchSalesTotalFilterItem[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchBranchSalesTotalFilterData: (request: BranchSalesTotalFilterRequest) => Promise<void>
}

/**
 * Composable for managing branch sales total filter data
 * @returns Object with reactive state and methods for branch sales total filter
 */
export const useBranchSalesTotalFilter = (): UseBranchSalesTotalFilterReturn => {
  const branchSalesTotalFilterItems = ref<BranchSalesTotalFilterItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchBranchSalesTotalFilterData = async (request: BranchSalesTotalFilterRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<{ items: BranchSalesTotalFilterItem[] }> = await fetchBranchSalesTotalFilter(request)

      if (response.isOK && response.result) {
        branchSalesTotalFilterItems.value = response.result.items
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch branch sales total filter data'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    branchSalesTotalFilterItems,
    isLoading,
    error,
    fetchBranchSalesTotalFilterData,
  }
}
