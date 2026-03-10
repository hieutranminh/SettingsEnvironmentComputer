import { ref, type Ref } from 'vue'

import {
  productsReadService,
  type GetProductCategoriesRequest,
  type ProductCategory,
} from '@/services/goods/products/products.read'

interface UseProductCategoryReturn {
  productCategory: Ref<ProductCategory[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchProductCategory: (request: GetProductCategoriesRequest) => Promise<void>
}

/**
 * Composable for managing product category
 * @returns Object with reactive state and methods for product category
 */
export const useProductCategory = (): UseProductCategoryReturn => {
  const productCategory = ref<ProductCategory[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchProductCategoryData = async (request: GetProductCategoriesRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await productsReadService.getProductCategories(request)

      if (response.isOK && response.result) {
        productCategory.value = response.result.items || []
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch product category'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    productCategory,
    isLoading,
    error,
    fetchProductCategory: fetchProductCategoryData,
  }
}
