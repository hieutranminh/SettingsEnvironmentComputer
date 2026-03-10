import { ref, computed, readonly } from 'vue'
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/services/api'
import { API_TYPES, API_VERSIONS, type ApiConfig, type ApiType, type ApiVersion } from '@/constants/apiEndpoints'
import type { ApiResponse } from '@/types/ApiResponse'

export const useApi = () => {
  // Reactive state for API configuration
  const currentApiType = ref<ApiType>(API_TYPES.READ)
  const currentApiVersion = ref<ApiVersion>(API_VERSIONS.V1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed API config
  const apiConfig = computed<ApiConfig>(() => ({
    type: currentApiType.value,
    version: currentApiVersion.value
  }))

  // Set API type
  const setApiType = (type: ApiType) => {
    currentApiType.value = type
  }

  // Set API version
  const setApiVersion = (version: ApiVersion) => {
    currentApiVersion.value = version
  }

  // Generic API methods with dynamic configuration
  const get = async <T>(endpoint: string, config?: ApiConfig): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiGet<T>(endpoint, config || apiConfig.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const post = async <T>(endpoint: string, data?: unknown, config?: ApiConfig): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiPost<T>(endpoint, data, config || apiConfig.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const put = async <T>(endpoint: string, data?: unknown, config?: ApiConfig): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiPut<T>(endpoint, data, config || apiConfig.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const patch = async <T>(endpoint: string, data?: unknown, config?: ApiConfig): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiPatch<T>(endpoint, data, config || apiConfig.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const del = async <T>(endpoint: string, config?: ApiConfig): Promise<ApiResponse<T>> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiDelete<T>(endpoint, config || apiConfig.value)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Convenience methods for specific API types
  const cmd = {
    get: <T>(endpoint: string) => get<T>(endpoint, { type: API_TYPES.COMMAND }),
    post: <T>(endpoint: string, data?: unknown) => post<T>(endpoint, data, { type: API_TYPES.COMMAND }),
    put: <T>(endpoint: string, data?: unknown) => put<T>(endpoint, data, { type: API_TYPES.COMMAND }),
    patch: <T>(endpoint: string, data?: unknown) => patch<T>(endpoint, data, { type: API_TYPES.COMMAND }),
    delete: <T>(endpoint: string) => del<T>(endpoint, { type: API_TYPES.COMMAND })
  }

  const read = {
    get: <T>(endpoint: string) => get<T>(endpoint, { type: API_TYPES.READ }),
    post: <T>(endpoint: string, data?: unknown) => post<T>(endpoint, data, { type: API_TYPES.READ }),
    put: <T>(endpoint: string, data?: unknown) => put<T>(endpoint, data, { type: API_TYPES.READ }),
    patch: <T>(endpoint: string, data?: unknown) => patch<T>(endpoint, data, { type: API_TYPES.READ }),
    delete: <T>(endpoint: string) => del<T>(endpoint, { type: API_TYPES.READ })
  }

  const aggr = {
    get: <T>(endpoint: string) => get<T>(endpoint, { type: API_TYPES.AGGREGATE }),
    post: <T>(endpoint: string, data?: unknown) => post<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
    put: <T>(endpoint: string, data?: unknown) => put<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
    patch: <T>(endpoint: string, data?: unknown) => patch<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
    delete: <T>(endpoint: string) => del<T>(endpoint, { type: API_TYPES.AGGREGATE })
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentApiType: readonly(currentApiType),
    currentApiVersion: readonly(currentApiVersion),

    // Methods
    setApiType,
    setApiVersion,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError,

    // Convenience objects
    cmd,
    read,
    aggr
  }
}
