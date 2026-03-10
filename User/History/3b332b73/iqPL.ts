import type { ApiResponse } from '@/types/ApiResponse'
import { apiClient } from './interceptors'

// Generic HTTP methods using Axios
export const apiGet = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  const response = await apiClient.get<ApiResponse<T>>(endpoint)
  return response.data
}

export const apiPost = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await apiClient.post<ApiResponse<T>>(endpoint, data)
  return response.data
}

export const apiPut = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await apiClient.put<ApiResponse<T>>(endpoint, data)
  return response.data
}

export const apiPatch = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await apiClient.patch<ApiResponse<T>>(endpoint, data)
  return response.data
}

export const apiDelete = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  const response = await apiClient.delete<ApiResponse<T>>(endpoint)
  return response.data
}

// Export the axios client for direct use if needed
export { apiClient }
