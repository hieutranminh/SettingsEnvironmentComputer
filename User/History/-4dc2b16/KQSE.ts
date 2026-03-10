import { ref, type Ref, readonly } from 'vue'
import { shopReadService } from '@/services/shop/shop.read'
import type { CustomBranchType, CustomBranchTypeResponse } from '@/types/shop/shop'
import type { ApiResponse } from '@/types/ApiResponse'

/**
 * Composable for shop-related operations
 */
export const useShop = () => {
  const customBranchTypes: Ref<CustomBranchType[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  /**
   * Fetch custom branch types from the API
   */
  const fetchCustomBranchTypes = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<CustomBranchTypeResponse> = await shopReadService.getCustomBranchTypes()
      
      if (response.success && response.data?.data) {
        customBranchTypes.value = response.data.data
      } else {
        throw new Error(response.message || 'Failed to fetch custom branch types')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      error.value = errorMessage
      console.error('Error fetching custom branch types:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get custom branch type by ID
   */
  const getCustomBranchTypeById = (id: number): CustomBranchType | undefined => {
    return customBranchTypes.value.find(type => type.id === id)
  }

  /**
   * Get active custom branch types only
   */
  const getActiveCustomBranchTypes = (): CustomBranchType[] => {
    return customBranchTypes.value.filter(type => type.isActive)
  }

  return {
    // State
    customBranchTypes: readonly(customBranchTypes),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchCustomBranchTypes,
    getCustomBranchTypeById,
    getActiveCustomBranchTypes,
  }
}