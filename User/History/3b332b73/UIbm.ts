import type { ApiResponse } from '@/types/ApiResponse'
import { apiClient } from '@/plugins/axios'
import { apiEndpoint, type ApiType, type ApiVersion } from '@/composables/useApiEndpoint'

// Generic HTTP methods using Axios
export const apiGet = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  const response = await apiClient.get<ApiResponse<T>>(endpoint)
  return response.data
}

export const apiPost = async <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
  const response = await apiClient.post<ApiResponse<T>>(endpoint, data)
  return response.data
}

export const apiPut = async <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
  const response = await apiClient.put<ApiResponse<T>>(endpoint, data)
  return response.data
}

export const apiPatch = async <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
  const response = await apiClient.patch<ApiResponse<T>>(endpoint, data)
  return response.data
}

export const apiDelete = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  const response = await apiClient.delete<ApiResponse<T>>(endpoint)
  return response.data
}

// Enhanced API methods with dynamic endpoint building
export const apiGetWithType = async <T>(path: string, type: ApiType = 'read', version: ApiVersion = 'v1'): Promise<ApiResponse<T>> => {
  const endpoint = apiEndpoint.withType(type).withVersion(version).build(path)
  return await apiGet<T>(endpoint)
}

export const apiPostWithType = async <T>(path: string, data?: unknown, type: ApiType = 'cmd', version: ApiVersion = 'v1'): Promise<ApiResponse<T>> => {
  const endpoint = apiEndpoint.withType(type).withVersion(version).build(path)
  return await apiPost<T>(endpoint, data)
}

export const apiPutWithType = async <T>(path: string, data?: unknown, type: ApiType = 'cmd', version: ApiVersion = 'v1'): Promise<ApiResponse<T>> => {
  const endpoint = apiEndpoint.withType(type).withVersion(version).build(path)
  return await apiPut<T>(endpoint, data)
}

export const apiPatchWithType = async <T>(path: string, data?: unknown, type: ApiType = 'cmd', version: ApiVersion = 'v1'): Promise<ApiResponse<T>> => {
  const endpoint = apiEndpoint.withType(type).withVersion(version).build(path)
  return await apiPatch<T>(endpoint, data)
}

export const apiDeleteWithType = async <T>(path: string, type: ApiType = 'cmd', version: ApiVersion = 'v1'): Promise<ApiResponse<T>> => {
  const endpoint = apiEndpoint.withType(type).withVersion(version).build(path)
  return await apiDelete<T>(endpoint)
}

// Convenience methods for common API patterns
export const apiRead = {
  get: <T>(path: string, version: ApiVersion = 'v1') => apiGetWithType<T>(path, 'read', version),
  post: <T>(path: string, data?: unknown, version: ApiVersion = 'v1') => apiPostWithType<T>(path, data, 'read', version)
}

export const apiAggr = {
  get: <T>(path: string, version: ApiVersion = 'v1') => apiGetWithType<T>(path, 'aggr', version),
  post: <T>(path: string, data?: unknown, version: ApiVersion = 'v1') => apiPostWithType<T>(path, data, 'aggr', version)
}

export const apiCmd = {
  post: <T>(path: string, data?: unknown, version: ApiVersion = 'v1') => apiPostWithType<T>(path, data, 'cmd', version),
  put: <T>(path: string, data?: unknown, version: ApiVersion = 'v1') => apiPutWithType<T>(path, data, 'cmd', version),
  patch: <T>(path: string, data?: unknown, version: ApiVersion = 'v1') => apiPatchWithType<T>(path, data, 'cmd', version),
  delete: <T>(path: string, version: ApiVersion = 'v1') => apiDeleteWithType<T>(path, 'cmd', version)
}

// Export the axios client for direct use if needed
export { apiClient }

// Export the endpoint builder for direct use
export { apiEndpoint } from '@/composables/useApiEndpoint'
