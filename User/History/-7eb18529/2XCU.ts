import { apiClient } from '../axios'
import type { ApiResponse, ApiRequestConfig, PaginatedResponse } from '@/types/api'

export const apiService = {
  async get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(url, config)
    return response.data
  },

  async post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config)
    return response.data
  },

  async put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config)
    return response.data
  },

  async patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config)
    return response.data
  },

  async delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(url, config)
    return response.data
  },

  async getPaginated<T>(
    url: string,
    page = 1,
    limit = 10,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const params = { page, limit, ...config?.params }
    const response = await apiClient.get<ApiResponse<PaginatedResponse<T>>>(url, {
      ...config,
      params,
    })
    return response.data
  },
}
