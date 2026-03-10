import { ref, type Ref } from 'vue'

import { salesSetupReadService } from '@/services/sales/sales-setup.read'
import type { SalesTypeReportItem, SalesTypeReportRequest } from '@/types/sales-setup/SalesType'

interface UseSalesTypeReturn {
  salesType: Ref<SalesTypeReportItem[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchSalesType: (request: SalesTypeReportRequest) => Promise<void>
}

/**
 * Composable for managing sales type
 * @returns Object with reactive state and methods for sales type
 */
export const useSalesType = (): UseSalesTypeReturn => {
  const salesType = ref<SalesTypeReportItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchSalesTypeData = async (request: SalesTypeReportRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await salesSetupReadService.getSalesType(request)

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
