import { ref, type Ref } from 'vue'

import {
  servicesReadService,
  type ServiceCategoryRequest,
  type ServiceCategoryItem,
  type ServiceCategoryResponse,
} from '@/services/goods/services/services.read'
import { extraErrorMessages } from '@/utils/common'

import { useMessageDialog } from './useMessageDialog'

interface UseServiceCategoryReturn {
  serviceCategory: Ref<ServiceCategoryItem[]>
  isLoading: Ref<boolean>
  fetchServiceCategory: (request: ServiceCategoryRequest) => Promise<void>
}

/**
 * Composable for managing service category
 * @returns Object with reactive state and methods for service category
 */
export const useServiceCategory = (): UseServiceCategoryReturn => {
  const serviceCategory = ref<ServiceCategoryItem[]>([])
  const isLoading = ref<boolean>(false)
  const { showError } = useMessageDialog()

  const fetchServiceCategoryData = async (request: ServiceCategoryRequest): Promise<void> => {
    try {
      isLoading.value = true

      const response: ServiceCategoryResponse = await servicesReadService.getServiceCategory(request)

      if (response.isOK && response.result) {
        serviceCategory.value = response.result.items || []
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
    serviceCategory,
    isLoading,
    fetchServiceCategory: fetchServiceCategoryData,
  }
}
