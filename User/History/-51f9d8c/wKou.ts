import { ref, type Ref } from 'vue'

import { salesSetupReadService } from '@/services/sales/sales-setup.read'
import type { SalesTypeItem, SalesTypeRequest, SalesTypeResponse } from '@/types/sales-setup/SalesType'

interface UseSalesTypeReturn {
  salesType: Ref<SalesTypeItem[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchSalesType: (request: SalesTypeRequest) => Promise<void>
}

/**
 * Composable for managing sales type
 * @returns Object with reactive state and methods for sales type
 */
export const useSalesType = (): UseSalesTypeReturn => {
  const salesType = ref<SalesTypeItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchSalesTypeData = async (request: SalesTypeRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: SalesTypeResponse = await salesSetupReadService.getSalesType(request)

      if (response.isOK && response.result) {
        salesType.value = response.result.items
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch sales type'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  return {
    salesType,
    isLoading,
    error,
    fetchSalesType: fetchSalesTypeData,
  }
}
