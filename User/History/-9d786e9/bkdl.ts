import { ref, type Ref } from 'vue'

import { servicesReadService, type GetServicesParams, type Service } from '@/services/goods/services/services.read'
import type { ApiResponse, ListResponse } from '@/types/ApiResponse'

interface UseServiceOptionsReturn {
  serviceOptions: Ref<Service[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchServiceOptions: (request: GetServicesParams) => Promise<void>
}

/**
 * Composable for managing service options
 * @returns Object with reactive state and methods for service options
 */
export const useServiceOptions = (): UseServiceOptionsReturn => {
  const serviceOptions = ref<Service[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchServiceOptionsData = async (request: GetServicesParams): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<ListResponse<Service>> = await servicesReadService.getServices(request)

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
