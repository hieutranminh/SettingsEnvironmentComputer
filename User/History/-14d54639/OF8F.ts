import { ref, type Ref } from 'vue'

import { getActiveStaffs, type ActiveStaffsItem, type ActiveStaffsRequest } from '@/services/staffs/staffs.read'
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

  const fetchActiveStaffsData = async (request: ActiveStaffsRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<{ items: ActiveStaffsItem[] }> = await getActiveStaffs(request)

      if (response.isOK && response.result) {
        activeStaffs.value = response.result.items
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch active staffs'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    activeStaffs,
    isLoading,
    error,
    fetchActiveStaffs: fetchActiveStaffsData,
  }
}
