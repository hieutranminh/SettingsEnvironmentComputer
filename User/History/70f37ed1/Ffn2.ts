import { ref, type Ref } from 'vue'

import { productsReadService, type GetProductsRequest, type Product } from '@/services/goods/products/products.read'

interface UseProductOptionsReturn {
  productOptions: Ref<Product[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchProductOptions: (request: GetProductsRequest) => Promise<void>
}

/**
 * Composable for managing product options
 * @returns Object with reactive state and methods for product options
 */
export const useProductOptions = (): UseProductOptionsReturn => {
  const productOptions = ref<Product[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchProductOptionsData = async (request: GetProductsRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await productsReadService.getProducts(request)

      if (response.isOK && response.result) {
        productOptions.value = response.result.items || []
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch product options'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    productOptions,
    isLoading,
    error,
    fetchProductOptions: fetchProductOptionsData,
  }
}
