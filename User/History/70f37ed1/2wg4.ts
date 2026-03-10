import { ref, type Ref } from 'vue'

import { productsReadService, type GetProductsRequest, type Product } from '@/services/goods/products/products.read'
import { extraErrorMessages } from '@/utils/common'

import { useMessageDialog } from './useMessageDialog'

interface UseProductOptionsReturn {
  productOptions: Ref<Product[]>
  isLoading: Ref<boolean>
  fetchProductOptions: (request: GetProductsRequest) => Promise<void>
}

/**
 * Composable for managing product options
 * @returns Object with reactive state and methods for product options
 */
export const useProductOptions = (): UseProductOptionsReturn => {
  const productOptions = ref<Product[]>([])
  const isLoading = ref<boolean>(false)
  const { showError } = useMessageDialog()

  const fetchProductOptionsData = async (request: GetProductsRequest): Promise<void> => {
    try {
      isLoading.value = true

      const response = await productsReadService.getProducts(request)

      if (response.isOK && response.result) {
        productOptions.value = response.result.items || []
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
    productOptions,
    isLoading,
    fetchProductOptions: fetchProductOptionsData,
  }
}
