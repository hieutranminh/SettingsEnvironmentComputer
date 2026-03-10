import { ref, type Ref } from 'vue'

import type { CustomBranchType, CustomBranchTypeRequest } from '@/types/admins/CustomBranchType'
import type { ApiResponse } from '@/types/ApiResponse'

import { fetchCustomBranchTypes } from '@/services/admins'

interface UseCustomBranchTypesReturn {
  customBranchTypes: Ref<CustomBranchType[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchBranchTypes: (request: CustomBranchTypeRequest) => Promise<void>
}

/**
 * Composable for managing custom branch types
 * @returns Object with reactive state and methods for custom branch types
 */
export const useCustomBranchTypes = (): UseCustomBranchTypesReturn => {
  const customBranchTypes = ref<CustomBranchType[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchBranchTypes = async (request: CustomBranchTypeRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<{ items: CustomBranchType[] }> = await fetchCustomBranchTypes(request)

      if (response.isOK && response.result) {
        customBranchTypes.value = response.result.items
      } else {
        error.value = response.message || 'Failed to fetch custom branch types'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    customBranchTypes,
    isLoading,
    error,
    fetchBranchTypes,
  }
}
