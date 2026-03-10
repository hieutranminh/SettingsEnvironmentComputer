import { ref, type Ref } from 'vue'

import { useMessageDialog } from '@/composables/useMessageDialog'
import {
  getActiveStaffs,
  type ActiveStaffsItem,
  type ActiveStaffsRequest,
  type ActiveStaffsResponse,
} from '@/services/staffs/staffs.read'
import { extraErrorMessages } from '@/utils/common'

interface IUseActiveStaffsReturn {
  activeStaffs: Ref<ActiveStaffsItem[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  fetchActiveStaffs: (request: ActiveStaffsRequest) => Promise<void>
}

/**
 * Composable for managing active staffs
 * @returns Object with reactive state and methods for active staffs
 */
export const useActiveStaffs = (): IUseActiveStaffsReturn => {
  const activeStaffs = ref<ActiveStaffsItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const { showError } = useMessageDialog()

  const fetchActiveStaffsData = async (request: ActiveStaffsRequest): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const response: ActiveStaffsResponse = await getActiveStaffs(request)

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
    error,
    fetchActiveStaffs: fetchActiveStaffsData,
  }
}
