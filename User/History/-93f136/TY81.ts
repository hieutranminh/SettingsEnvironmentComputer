import { ref, type Ref } from 'vue'

import { fetchBranchGroups } from '@/services/admins/admins.read'
import type { BranchGroup, BranchGroupRequest } from '@/types/admins/BranchGroup'
import type { ApiResponse } from '@/types/ApiResponse'

interface UseBranchGroupsReturn {
  branchGroups: Ref<BranchGroup[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchBranchGroups: (request: BranchGroupRequest) => Promise<void>
}

/**
 * Composable for managing branch groups
 * @returns Object with reactive state and methods for branch groups
 */
export const useBranchGroups = (): UseBranchGroupsReturn => {
  const branchGroups = ref<BranchGroup[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchBranchGroupsData = async (request: BranchGroupRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<{ items: BranchGroup[] }> = await fetchBranchGroups(request)

      if (response.isOK && response.result) {
        branchGroups.value = response.result.items
      } else {
        error.value = response.message || 'Failed to fetch branch groups'
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
