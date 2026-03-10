import { ref, type Ref } from 'vue'

import { salesSetupReadService } from '@/services/sales/sales-setup.read'
import type { SalesTypeReportItem, SalesTypeReportRequest } from '@/types/sales-setup/SalesType'
import { extraErrorMessages } from '@/utils/common'

import { useMessageDialog } from './useMessageDialog'

interface UseSalesTypeReturn {
  salesType: Ref<SalesTypeReportItem[]>
  isLoading: Ref<boolean>
  fetchSalesType: (request: SalesTypeReportRequest) => Promise<void>
}

/**
 * Composable for managing sales type
 * @returns Object with reactive state and methods for sales type
 */
export const useSalesType = (): UseSalesTypeReturn => {
  const salesType = ref<SalesTypeReportItem[]>([])
  const isLoading = ref<boolean>(false)
  const { showError } = useMessageDialog()

  const fetchSalesTypeData = async (request: SalesTypeReportRequest): Promise<void> => {
    try {
      isLoading.value = true

      const response = await salesSetupReadService.getSalesType(request)

      if (response.isOK && response.result) {
        salesType.value = response.result.items || []
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
    salesType,
    isLoading,
    fetchSalesType: fetchSalesTypeData,
  }
}
