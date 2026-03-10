import { ref, type Ref } from 'vue'

import {
  servicesReadService,
  type ServiceCategoryRequest,
  type ServiceCategoryItem,
  type ServiceCategoryResponse,
} from '@/services/goods/services/services.read'

interface UseServiceCategoryReturn {
  serviceCategory: Ref<ServiceCategoryItem[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchServiceCategory: (request: ServiceCategoryRequest) => Promise<void>
}

/**
 * Composable for managing service category
 * @returns Object with reactive state and methods for service category
 */
export const useServiceCategory = (): UseServiceCategoryReturn => {
  const serviceCategory = ref<ServiceCategoryItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchServiceCategoryData = async (request: ServiceCategoryRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ServiceCategoryResponse = await servicesReadService.getServiceCategory(request)

      console.log('response', response)
      if (response.isOK && response.result) {
        serviceCategory.value = response.result.items
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch service category'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    serviceCategory,
    isLoading,
    error,
    fetchServiceCategory: fetchServiceCategoryData,
  }
}
