import { ref, type Ref } from 'vue'

import { useMessageDialog } from '@/composables/useMessageDialog'
import { branchReadService } from '@/services/admins/branch/branch.read'
import type {
  IBranchSalesTotalFilterItem,
  IBranchSalesTotalFilterRequest,
} from '@/types/admins/BranchSalesTotalFilter'
import type { IApiResponse } from '@/types/ApiResponse'
import { extraErrorMessages } from '@/utils/common'

interface IUseBranchSalesTotalFilterReturn {
  branchSalesTotalFilter: Ref<IBranchSalesTotalFilterItem[]>
  isLoading: Ref<boolean>
  fetchBranchSalesTotalFilter: (request: IBranchSalesTotalFilterRequest) => Promise<void>
}

/**
 * Composable for managing branch sales total filter data
 * @returns Object with reactive state and methods for branch sales total filter
 */
export const useBranchSalesTotalFilter = (): IUseBranchSalesTotalFilterReturn => {
  const branchSalesTotalFilter = ref<IBranchSalesTotalFilterItem[]>([])
  const isLoading = ref<boolean>(false)

  const { showError } = useMessageDialog()

  const fetchBranchSalesTotalFilter = async (
    request: IBranchSalesTotalFilterRequest,
  ): Promise<void> => {
    try {
      isLoading.value = true

      const response: IApiResponse<{ items: IBranchSalesTotalFilterItem[] }> =
        await branchReadService.getBranchSalesTotalFilter(request)

      if (response.isOK && response.result) {
        branchSalesTotalFilter.value = response.result.items
      } else {
        showError(
          response.errorMessages?.join(', ') ?? 'Failed to fetch branch sales total filter data',
        )
      }
    } catch (err) {
      const errorMessage = extraErrorMessages(err)
      showError(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  return {
    branchSalesTotalFilter,
    isLoading,
    fetchBranchSalesTotalFilter,
  }
}
