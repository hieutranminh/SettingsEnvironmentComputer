import { ref, type Ref } from 'vue'

import {
  servicesReadService,
  type ServiceCategoryRequest,
  type ServiceCategoryItem,
  type ServiceCategoryResponse,
} from '@/services/goods/services/services.read'

interface UseServiceOptionsReturn {
  serviceOptions: Ref<ServiceCategoryItem[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchServiceOptions: (request: ServiceCategoryRequest) => Promise<void>
}

/**
 * Composable for managing service category
 * @returns Object with reactive state and methods for service category
 */
export const useServiceOptions = (): UseServiceOptionsReturn => {
  const serviceOptions = ref<ServiceCategoryItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchServiceOptionsData = async (request: ServiceCategoryRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ServiceCategoryResponse = await servicesReadService.getServiceOptions(request)

      if (response.isOK && response.result) {
        serviceOptions.value = response.result.items
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch service options'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    serviceOptions,
    isLoading,
    error,
    fetchServiceOptions: fetchServiceOptionsData,
  }
}
