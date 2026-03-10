import { ref, type Ref } from 'vue'

import { servicesReadService, type GetServicesParams, type Service } from '@/services/goods/services/services.read'
import type { ApiResponse, ListResponse } from '@/types/ApiResponse'
import { extraErrorMessages } from '@/utils/common'

import { useMessageDialog } from './useMessageDialog'

interface UseServiceOptionsReturn {
  serviceOptions: Ref<Service[]>
  isLoading: Ref<boolean>
  fetchServiceOptions: (request: GetServicesParams) => Promise<void>
}

/**
 * Composable for managing service options
 * @returns Object with reactive state and methods for service options
 */
export const useServiceOptions = (): UseServiceOptionsReturn => {
  const serviceOptions = ref<Service[]>([])
  const isLoading = ref<boolean>(false)
  const { showError } = useMessageDialog()

  const fetchServiceOptionsData = async (request: GetServicesParams): Promise<void> => {
    try {
      isLoading.value = true

      const response: ApiResponse<ListResponse<Service>> = await servicesReadService.getServices(request)

      if (response.isOK && response.result) {
        serviceOptions.value = response.result.items || []
      } else {
        showError(extraErrorMessages(response.errorMessages ?? response.errors ?? response.message))
      }
    } catch (err) {
      showError(extraErrorMessages(err))
    } finally {
      isLoading.value = false
    }
  }

  return {
    serviceOptions,
    isLoading,
    fetchServiceOptions: fetchServiceOptionsData,
  }
}
