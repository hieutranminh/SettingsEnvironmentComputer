import { ref, type Ref, onUnmounted } from 'vue'
import type { ApiResponse, ApiError } from '@/api'
import { RequestCancellation } from '@/api/utils/cancellation'

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  immediate?: boolean
  requestId?: string
  autoCancel?: boolean
}

export interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<ApiError | null>
  execute: (apiCall: () => Promise<ApiResponse<T>>, requestId?: string) => Promise<T | null>
  reset: () => void
  cancel: () => void
}

export function useApi<T = unknown>(options: UseApiOptions<T> = {}): UseApiReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const currentRequestId = ref<string | null>(null)

  const execute = async (apiCall: () => Promise<ApiResponse<T>>, requestId?: string): Promise<T | null> => {
    // Cancel previous request if auto-cancel is enabled
    if (options.autoCancel && currentRequestId.value) {
      RequestCancellation.cancelRequest(currentRequestId.value)
    }

    const requestIdToUse = requestId || options.requestId || RequestCancellation.generateRequestId('API')
    currentRequestId.value = requestIdToUse

    loading.value = true
    error.value = null

    try {
      const response = await apiCall()
      data.value = response.data

      if (options.onSuccess) {
        options.onSuccess(response.data)
      }

      return response.data
    } catch (err) {
      const apiError = err as ApiError
      error.value = apiError

      if (options.onError) {
        options.onError(apiError)
      }

      return null
    } finally {
      loading.value = false
      currentRequestId.value = null
    }
  }

  const reset = (): void => {
    data.value = null
    loading.value = false
    error.value = null
    currentRequestId.value = null
  }

  const cancel = (): void => {
    if (currentRequestId.value) {
      RequestCancellation.cancelRequest(currentRequestId.value)
      currentRequestId.value = null
    }
    loading.value = false
  }

  // Auto-cancel request on component unmount if enabled
  if (options.autoCancel) {
    onUnmounted(() => {
      cancel()
    })
  }

  return {
    data,
    loading,
    error,
    execute,
    reset,
    cancel,
  }
}
