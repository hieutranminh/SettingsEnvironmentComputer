import { ref, type Ref } from 'vue'

import { branchReadService } from '@/services/admins/branch/branch.read'
import type {
  IBranchGroup,
  IBranchGroupRequest,
  IBranchGroupResponse,
} from '@/types/admins/BranchGroup'
import type { IApiResponse } from '@/types/ApiResponse'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { extraErrorMessages } from '@/utils/common'

interface IUseBranchGroupsReturn {
  branchGroups: Ref<IBranchGroup[]>
  isLoading: Ref<boolean>
  error: Ref<string | string[] | null>
  fetchBranchGroups: (request: IBranchGroupRequest) => Promise<IApiResponse<IBranchGroupResponse>>
}

/**
 * Composable for managing branch groups
 * @returns Object with reactive state and methods for branch groups
 */
export const useBranchGroups = (): IUseBranchGroupsReturn => {
  const branchGroups = ref<IBranchGroup[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | string[] | null>(null)

  const { showError } = useMessageDialog()

  const fetchBranchGroupsData = async (
    request: IBranchGroupRequest,
  ): Promise<IApiResponse<IBranchGroupResponse>> => {
    try {
      isLoading.value = true
      error.value = null

      const response: IApiResponse<IBranchGroupResponse> =
        await branchReadService.getBranchGroups(request)

      if (!response.isOK) {
        showError(response.errorMessages)
        return response
      }

      branchGroups.value = response.result?.items ?? []
      return response
    } catch (err) {
      const errorMessage = extraErrorMessages(err)
      showError(errorMessage)
      // Return a default error response
      return {
        isOK: false,
        errorMessages: [],
        errors: Array.isArray(errorMessage) ? errorMessage : [errorMessage]
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    branchGroups,
    isLoading,
    error,
    fetchBranchGroups: fetchBranchGroupsData,
  }
}
