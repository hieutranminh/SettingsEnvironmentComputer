import { ref } from 'vue'

import { salesSetupReadService } from '@/services/sales/sales-setup.read'
import type {
  SalesTypeReportItem,
  SalesTypeReportRequest,
  SalesTypeReportResponse,
} from '@/types/sales-setup/SalesType'

/**
 * Composable for managing sales type
 * @returns Object with reactive state and methods for sales type
 */
export const useSalesType = () => {
  const salesType = ref<SalesTypeReportItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchSalesTypeData = async (request: SalesTypeReportRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: SalesTypeReportResponse = await salesSetupReadService.getSalesType(request)

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
