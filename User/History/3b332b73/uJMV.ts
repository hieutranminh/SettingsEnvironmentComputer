import type { ApiResponse } from '@/types/ApiResponse'
import { apiClient } from '@/plugins/axios'
import { API_TYPES, API_VERSIONS, DEFAULT_API_CONFIG, type ApiConfig, type ApiType, type ApiVersion } from '@/constants/apiEndpoints'

// Helper function to build API endpoint with type and version
const buildEndpoint = (endpoint: string, config?: ApiConfig): string => {
  const { type = DEFAULT_API_CONFIG.type, version = DEFAULT_API_CONFIG.version } = config || {}

  // If endpoint already starts with a slash, remove it to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint

  // Build the full endpoint path
  return `/${type}/${version}/${cleanEndpoint}`
}

// Generic HTTP methods using Axios with dynamic endpoint construction
export const apiGet = async <T>(endpoint: string, config?: ApiConfig): Promise<ApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.get<ApiResponse<T>>(fullEndpoint)
  return response.data
}

export const apiPost = async <T>(endpoint: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.post<ApiResponse<T>>(fullEndpoint, data)
  return response.data
}

export const apiPut = async <T>(endpoint: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.put<ApiResponse<T>>(fullEndpoint, data)
  return response.data
}

export const apiPatch = async <T>(endpoint: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.patch<ApiResponse<T>>(fullEndpoint, data)
  return response.data
}

export const apiDelete = async <T>(endpoint: string, config?: ApiConfig): Promise<ApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.delete<ApiResponse<T>>(fullEndpoint)
  return response.data
}

// Convenience functions for specific API types
export const apiCmd = {
  get: <T>(endpoint: string) => apiGet<T>(endpoint, { type: API_TYPES.COMMAND }),
  post: <T>(endpoint: string, data?: any) => apiPost<T>(endpoint, data, { type: API_TYPES.COMMAND }),
  put: <T>(endpoint: string, data?: any) => apiPut<T>(endpoint, data, { type: API_TYPES.COMMAND }),
  patch: <T>(endpoint: string, data?: any) => apiPatch<T>(endpoint, data, { type: API_TYPES.COMMAND }),
  delete: <T>(endpoint: string) => apiDelete<T>(endpoint, { type: API_TYPES.COMMAND })
}

export const apiRead = {
  get: <T>(endpoint: string) => apiGet<T>(endpoint, { type: API_TYPES.READ }),
  post: <T>(endpoint: string, data?: any) => apiPost<T>(endpoint, data, { type: API_TYPES.READ }),
  put: <T>(endpoint: string, data?: any) => apiPut<T>(endpoint, data, { type: API_TYPES.READ }),
  patch: <T>(endpoint: string, data?: any) => apiPatch<T>(endpoint, data, { type: API_TYPES.READ }),
  delete: <T>(endpoint: string) => apiDelete<T>(endpoint, { type: API_TYPES.READ })
}

export const apiAggr = {
  get: <T>(endpoint: string) => apiGet<T>(endpoint, { type: API_TYPES.AGGREGATE }),
  post: <T>(endpoint: string, data?: any) => apiPost<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
  put: <T>(endpoint: string, data?: any) => apiPut<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
  patch: <T>(endpoint: string, data?: any) => apiPatch<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
  delete: <T>(endpoint: string) => apiDelete<T>(endpoint, { type: API_TYPES.AGGREGATE })
}

// Export the axios client for direct use if needed
export { apiClient }
