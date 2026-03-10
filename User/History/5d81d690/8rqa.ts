import { ref, type Ref } from 'vue'

import { branchReadService } from '@/services/admins/branch/branch.read'
import type { BranchSales, BranchSalesRequest } from '@/types/admins/BranchSales'
import type { ApiResponse } from '@/types/ApiResponse'

interface UseBranchSalesReturn {
  branchSales: Ref<BranchSales[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchBranchSales: (request: BranchSalesRequest) => Promise<void>
}

/**
 * Composable for managing branch groups
 * @returns Object with reactive state and methods for branch groups
 */
export const useBranchSales = (): UseBranchSalesReturn => {
  const branchSales = ref<BranchSales[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchBranchSalesData = async (request: BranchSalesRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ApiResponse<{ items: BranchSales[] }> = await branchReadService.getBranchSales(request)

      if (response.isOK && response.result) {
        branchSales.value = response.result.items
      } else {
        error.value = response.errorMessages?.join(', ') || 'Failed to fetch branch sales'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
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
