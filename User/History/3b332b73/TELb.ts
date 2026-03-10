import { API_TYPES, DEFAULT_API_CONFIG, type ApiConfig } from '@/constants/apiEndpoints'
import { apiClient } from '@/plugins/axios'
import type { IApiResponse } from '@/types/ApiResponse'

// Helper function to build API endpoint with type and version
const buildEndpoint = (endpoint: string, config?: ApiConfig): string => {
  const { type = DEFAULT_API_CONFIG.type, version = DEFAULT_API_CONFIG.version } = config ?? {}

  // If endpoint already starts with a slash, remove it to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint

  // Build the full endpoint path
  return `/${type}/${version}/${cleanEndpoint}`
}

// Generic HTTP methods using Axios with dynamic endpoint construction
export const apiGet = async <T>(endpoint: string, config?: ApiConfig): Promise<IApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.get<IApiResponse<T>>(fullEndpoint)
  return response.data
}

export const apiPost = async <T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig,
): Promise<IApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.post<IApiResponse<T>>(fullEndpoint, data)
  return response.data
}

export const apiPut = async <T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig & { headers?: Record<string, string> },
): Promise<IApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const axiosConfig = config?.headers ? { headers: config.headers } : {}
  const response = await apiClient.put<IApiResponse<T>>(fullEndpoint, data, axiosConfig)
  return response.data
}

export const apiPatch = async <T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig,
): Promise<IApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.patch<IApiResponse<T>>(fullEndpoint, data)
  return response.data
}

export const apiDelete = async <T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig,
): Promise<IApiResponse<T>> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.delete<IApiResponse<T>>(fullEndpoint, { data })
  return response.data
}

export const apiDownload = async (
  endpoint: string,
  data?: unknown,
  config?: ApiConfig,
): Promise<Blob> => {
  const fullEndpoint = buildEndpoint(endpoint, config)
  const response = await apiClient.post(fullEndpoint, data, {
    responseType: 'blob',
  })
  return response.data as Blob
}

// Convenience functions for specific API types
export const apiCmd = {
  get: <T>(endpoint: string): Promise<IApiResponse<T>> => 
    apiGet<T>(endpoint, { type: API_TYPES.COMMAND }),
  post: <T>(endpoint: string, data?: unknown): Promise<IApiResponse<T>> =>
    apiPost<T>(endpoint, data, { type: API_TYPES.COMMAND }),
  put: <T>(endpoint: string, data?: unknown, config?: { headers?: Record<string, string> }): Promise<IApiResponse<T>> =>
    apiPut<T>(endpoint, data, { type: API_TYPES.COMMAND, ...config }),
  patch: <T>(endpoint: string, data?: unknown): Promise<IApiResponse<T>> =>
    apiPatch<T>(endpoint, data, { type: API_TYPES.COMMAND }),
  delete: <T>(endpoint: string, data?: unknown): Promise<IApiResponse<T>> =>
    apiDelete<T>(endpoint, data, { type: API_TYPES.COMMAND }),
}

export const apiRead = {
  get: <T>(endpoint: string): Promise<IApiResponse<T>> => 
    apiGet<T>(endpoint, { type: API_TYPES.READ }),
  post: <T>(endpoint: string, data?: unknown): Promise<IApiResponse<T>> =>
    apiPost<T>(endpoint, data, { type: API_TYPES.READ }),
  put: <T>(endpoint: string, data?: unknown): Promise<IApiResponse<T>> => 
    apiPut<T>(endpoint, data, { type: API_TYPES.READ }),
  patch: <T>(endpoint: string, data?: unknown): Promise<IApiResponse<T>> =>
    apiPatch<T>(endpoint, data, { type: API_TYPES.READ }),
  delete: <T>(endpoint: string, data?: unknown): Promise<IApiResponse<T>> =>
    apiDelete<T>(endpoint, data, { type: API_TYPES.READ }),
  download: (endpoint: string, data?: unknown): Promise<Blob> =>
    apiDownload(endpoint, data, { type: API_TYPES.READ }),
}

export const apiAggr = {
  get: <T>(endpoint: string) => apiGet<T>(endpoint, { type: API_TYPES.AGGREGATE }),
  post: <T>(endpoint: string, data?: unknown) =>
    apiPost<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
  put: <T>(endpoint: string, data?: unknown) =>
    apiPut<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
  patch: <T>(endpoint: string, data?: unknown) =>
    apiPatch<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
  delete: <T>(endpoint: string, data?: unknown) =>
    apiDelete<T>(endpoint, data, { type: API_TYPES.AGGREGATE }),
}

// Export the axios client for direct use if needed
export { apiClient }
