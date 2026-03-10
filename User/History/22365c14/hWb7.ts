import { ref, computed } from 'vue'
import { apiRead } from '@/services/api'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import type { CustomBranchType, CustomBranchTypeResponse, CustomBranchTypeRequest } from '@/types/branch/CustomBranchType'
import type { ApiResponse } from '@/types/ApiResponse'

export const useCustomBranchTypes = () => {
  const customBranchTypes = ref<CustomBranchType[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCustomBranchTypes = async (chainId: number): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const requestPayload: CustomBranchTypeRequest = { chainId }
      
      const response: ApiResponse<CustomBranchTypeResponse> = await apiRead.post<CustomBranchTypeResponse>(
        API_ENDPOINTS.ADMINS.CUSTOM_BRANCH_TYPE,
        requestPayload
      )

      if (response.isOK && response.result) {
        customBranchTypes.value = response.result.items
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch custom branch types'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while fetching custom branch types'
    } finally {
      isLoading.value = false
    }
  }

  const branchTypeOptions = computed(() => {
    const options = [
      { label: 'All Types', value: -1 }
    ]
    
    customBranchTypes.value.forEach((branchType) => {
      options.push({
        label: branchType.name,
        value: branchType.id
      })
    })
    
    return options
  })

  const getBranchTypeById = (id: number): CustomBranchType | undefined => {
    return customBranchTypes.value.find((branchType) => branchType.id === id)
  }

  return {
    customBranchTypes,
    isLoading,
    error,
    fetchCustomBranchTypes,
    branchTypeOptions,
    getBranchTypeById
  }
}