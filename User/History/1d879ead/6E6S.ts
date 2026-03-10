import { ref, type Ref } from 'vue'

import { useMessageDialog } from '@/composables/useMessageDialog'
import {
  productsReadService,
  type GetProductCategoriesRequest,
  type ProductCategory,
} from '@/services/goods/products/products.read'
import { extraErrorMessages } from '@/utils/common'

interface UseProductCategoryReturn {
  productCategory: Ref<ProductCategory[]>
  isLoading: Ref<boolean>
  fetchProductCategory: (request: GetProductCategoriesRequest) => Promise<void>
}

/**
 * Composable for managing product category
 * @returns Object with reactive state and methods for product category
 */
export const useProductCategory = (): UseProductCategoryReturn => {
  const productCategory = ref<ProductCategory[]>([])
  const isLoading = ref<boolean>(false)
  const { showError } = useMessageDialog()

  const fetchProductCategoryData = async (request: GetProductCategoriesRequest): Promise<void> => {
    try {
      isLoading.value = true

      const response = await productsReadService.getProductCategories(request)

      if (response.isOK && response.result) {
        productCategory.value = response.result.items || []
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
    productCategory,
    isLoading,
    fetchProductCategory: fetchProductCategoryData,
  }
}
