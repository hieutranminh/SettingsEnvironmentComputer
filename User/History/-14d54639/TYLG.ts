import { ref, type Ref } from 'vue'

import { useMessageDialog } from '@/composables/useMessageDialog'
import {
  getActiveStaffs,
  type IActiveStaffsItem,
  type IActiveStaffsRequest,
  type IActiveStaffsResponse,
} from '@/services/staffs/staffs.read'
import { extraErrorMessages } from '@/utils/common'

interface IUseActiveStaffsReturn {
  activeStaffs: Ref<IActiveStaffsItem[]>
  isLoading: Ref<boolean>
  fetchActiveStaffs: (request: IActiveStaffsRequest) => Promise<void>
}

/**
 * Composable for managing active staffs
 * @returns Object with reactive state and methods for active staffs
 */
export const useActiveStaffs = (): IUseActiveStaffsReturn => {
  const activeStaffs = ref<IActiveStaffsItem[]>([])
  const isLoading = ref<boolean>(false)
  const { showError } = useMessageDialog()

  const fetchActiveStaffsData = async (request: IActiveStaffsRequest): Promise<void> => {
    try {
      isLoading.value = true

      const response: IActiveStaffsResponse = await getActiveStaffs(request)

      if (response.isOK && response.result) {
        activeStaffs.value = response.result.items
      } else {
        showError(response.errorMessages?.join(', ') ?? 'Failed to fetch active staffs')
      }
    } catch (err) {
      const errorMessage = extraErrorMessages(err)
      showError(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  return {
    activeStaffs,
    isLoading,
    fetchActiveStaffs: fetchActiveStaffsData,
  }
}
