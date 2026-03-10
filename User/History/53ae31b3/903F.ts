import { ref, computed } from 'vue'
import { adminsReadService } from '@/services/admins/admins.read'
import type { CustomBranchType, CustomBranchTypeFilter } from '@/types/branch/CustomBranchType'
import type { ApiResponse } from '@/types/ApiResponse'

export const useCustomBranchType = () => {
  // Reactive state
  const customBranchTypes = ref<CustomBranchType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)

  // Computed properties
  const activeCustomBranchTypes = computed(() => 
    customBranchTypes.value.filter(type => type.isActive)
  )

  const customBranchTypeOptions = computed(() => 
    customBranchTypes.value.map(type => ({
      label: type.name,
      value: type.id,
    }))
  )

  // Methods
  const fetchCustomBranchTypes = async (filter?: CustomBranchTypeFilter): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response: ApiResponse<{ customBranchTypes: CustomBranchType[], totalCount: number }> = 
        await adminsReadService.getCustomBranchTypes(filter)

      if (response.isOK && response.result) {
        customBranchTypes.value = response.result.customBranchTypes
        totalCount.value = response.result.totalCount
      } else {
        error.value = response.message || 'Failed to fetch custom branch types'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while fetching custom branch types'
    } finally {
      loading.value = false
    }
  }

  const fetchActiveCustomBranchTypes = async (): Promise<void> => {
    await fetchCustomBranchTypes({ isActive: true })
  }

  const getCustomBranchTypeById = async (id: number): Promise<CustomBranchType | null> => {
    try {
      loading.value = true
      error.value = null

      const response: ApiResponse<CustomBranchType> = await adminsReadService.getCustomBranchTypeById(id)

      if (response.isOK && response.result) {
        return response.result
      } else {
        error.value = response.message || 'Failed to fetch custom branch type'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while fetching custom branch type'
      return null
    } finally {
      loading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  const reset = (): void => {
    customBranchTypes.value = []
    loading.value = false
    error.value = null
    totalCount.value = 0
  }

  return {
    // State
    customBranchTypes,
    loading,
    error,
    totalCount,

    // Computed
    activeCustomBranchTypes,
    customBranchTypeOptions,

    // Methods
    fetchCustomBranchTypes,
    fetchActiveCustomBranchTypes,
    getCustomBranchTypeById,
    clearError,
    reset,
  }
}