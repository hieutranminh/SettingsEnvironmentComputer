import { ref, type Ref } from 'vue'

import { branchReadService } from '@/services/admins/branch/branch.read'
import type {
  IBranchGroup,
  IBranchGroupRequest,
  IBranchGroupResponse,
} from '@/types/admins/BranchGroup'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { extraErrorMessages } from '@/utils/common'

interface IUseBranchGroupsReturn {
  branchGroups: Ref<IBranchGroup[]>
  isLoading: Ref<boolean>
  error: Ref<string | string[] | null>
  fetchBranchGroups: (request: IBranchGroupRequest) => Promise<IBranchGroupResponse | null>
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
  ): Promise<IBranchGroupResponse | null> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await branchReadService.getBranchGroups(request)

      if (!response.isOK) {
        showError(response.errorMessages)
        return response
      }

      branchGroups.value = response.result?.items ?? []
      return response
    } catch (error) {
      showError(extraErrorMessages(error))
      return null
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
