import { ref, type Ref } from 'vue'

import { branchReadService } from '@/services/admins/branch/branch.read'
import type { IBranchGroup, IBranchGroupRequest } from '@/types/admins/BranchGroup'
import type { ApiResponse } from '@/types/ApiResponse'

interface IUseBranchGroupsReturn {
  branchGroups: Ref<IBranchGroup[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchBranchGroups: (request: IBranchGroupRequest) => Promise<void>
}

/**
 * Composable for managing branch groups
 * @returns Object with reactive state and methods for branch groups
 */
export const useBranchGroups = (): IUseBranchGroupsReturn => {
  const branchGroups = ref<IBranchGroup[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchBranchGroupsData = async (request: IBranchGroupRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<{ items: IBranchGroup[] }> =
        await branchReadService.getBranchGroups(request)

      if (response.isOK && response.result) {
        branchGroups.value = response.result.items
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch branch groups'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    branchGroups,
    isLoading,
    error,
    fetchBranchGroups: fetchBranchGroupsData,
  }
}
