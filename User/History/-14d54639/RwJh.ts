import { ref, type Ref } from 'vue'

import {
  getActiveStaffs,
  type ActiveStaffsItem,
  type ActiveStaffsRequest,
  type ActiveStaffsResult,
} from '@/services/staffs/staffs.read'
import type { ApiResponse } from '@/types/ApiResponse'

interface UseActiveStaffsReturn {
  activeStaffs: Ref<ActiveStaffsItem[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchActiveStaffs: (request: ActiveStaffsRequest) => Promise<void>
}

/**
 * Composable for managing branch groups
 * @returns Object with reactive state and methods for branch groups
 */
export const useActiveStaffs = (): UseActiveStaffsReturn => {
  const activeStaffs = ref<ActiveStaffsItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchBranchGroupsData = async (request: BranchGroupRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<{ items: BranchGroup[] }> = await branchReadService.getBranchGroups(request)

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
