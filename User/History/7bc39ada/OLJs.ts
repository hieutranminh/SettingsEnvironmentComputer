import { ref, type Ref } from 'vue'
import type { ApiResponse, ApiError } from '@/api'

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  immediate?: boolean
}

export interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<ApiError | null>
  execute: (apiCall: () => Promise<ApiResponse<T>>) => Promise<T | null>
  reset: () => void
}

export function useApi<T = unknown>(options: UseApiOptions<T> = {}): UseApiReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const execute = async (apiCall: () => Promise<ApiResponse<T>>): Promise<T | null> => {
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
    }
  }

  const reset = (): void => {
    data.value = null
    loading.value = false
    error.value = null
  }

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}
