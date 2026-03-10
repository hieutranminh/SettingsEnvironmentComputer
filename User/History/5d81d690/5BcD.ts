import { ref, type Ref } from 'vue'

// Composables
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { branchReadService } from '@/services/admins/branch/branch.read'
// Types
import type { IBranchSales, IBranchSalesRequest } from '@/types/admins/BranchSales'
import type { ApiResponse } from '@/types/ApiResponse'
// Utils
import { extraErrorMessages } from '@/utils/common'

interface IUseBranchSalesReturn {
  branchSales: Ref<IBranchSales[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchBranchSales: (request: IBranchSalesRequest) => Promise<void>
}

/**
 * Composable for managing branch sales
 * @returns Object with reactive state and methods for branch sales
 */
export const useBranchSales = (): IUseBranchSalesReturn => {
  // Composables
  const { showError } = useMessageDialog()
  // State
  const branchSales = ref<IBranchSales[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchBranchSalesData = async (request: IBranchSalesRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<{ items: IBranchSales[] }> =
        await branchReadService.getBranchSales(request)

      if (response.isOK && response.result) {
        branchSales.value = response.result.items
      } else {
        showError(response.errorMessages)
      }
    } catch (err) {
      const errorMessage = extraErrorMessages(err)
      showError(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  return {
    branchSales,
    isLoading,
    error,
    fetchBranchSales: fetchBranchSalesData,
  }
}
