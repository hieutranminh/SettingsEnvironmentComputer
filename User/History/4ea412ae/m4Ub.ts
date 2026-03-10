import { ref, type Ref } from 'vue'

import { branchReadService } from '@/services/admins/branch/branch.read'
import type {
  IBranchSalesTotalFilterItem,
  IBranchSalesTotalFilterRequest,
} from '@/types/admins/BranchSalesTotalFilter'
import type { IApiResponse } from '@/types/ApiResponse'

interface IUseBranchSalesTotalFilterReturn {
  branchSalesTotalFilter: Ref<IBranchSalesTotalFilterItem[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchBranchSalesTotalFilter: (request: IBranchSalesTotalFilterRequest) => Promise<void>
}

/**
 * Composable for managing branch sales total filter data
 * @returns Object with reactive state and methods for branch sales total filter
 */
export const useBranchSalesTotalFilter = (): IUseBranchSalesTotalFilterReturn => {
  const branchSalesTotalFilter = ref<IBranchSalesTotalFilterItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchBranchSalesTotalFilter = async (
    request: IBranchSalesTotalFilterRequest,
  ): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: IApiResponse<{ items: IBranchSalesTotalFilterItem[] }> =
        await branchReadService.getBranchSalesTotalFilter(request)

      if (response.isOK && response.result) {
        branchSalesTotalFilter.value = response.result.items
      } else {
        error.value =
          response.errorMessages?.join(', ') ?? 'Failed to fetch branch sales total filter data'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    branchSalesTotalFilter,
    isLoading,
    error,
    fetchBranchSalesTotalFilter,
  }
}
