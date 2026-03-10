import { apiClient } from '../axios'
import type { ApiResponse, ApiRequestConfig, PaginatedResponse } from '@/types/api'
import { createRetryableRequest } from '../utils/retry'
import { RequestCancellation } from '../utils/cancellation'

export const apiService = {
  async get<T>(url: string, config?: ApiRequestConfig & { requestId?: string }): Promise<ApiResponse<T>> {
    const requestId = config?.requestId || RequestCancellation.generateRequestId('GET')
    const finalConfig = RequestCancellation.addSignalToConfig(config || {}, requestId)

    return createRetryableRequest(async () => {
      const response = await apiClient.get<ApiResponse<T>>(url, finalConfig)
      return response.data
    })
  },

  async post<T>(url: string, data?: unknown, config?: ApiRequestConfig & { requestId?: string }): Promise<ApiResponse<T>> {
    const requestId = config?.requestId || RequestCancellation.generateRequestId('POST')
    const finalConfig = RequestCancellation.addSignalToConfig(config || {}, requestId)

    return createRetryableRequest(async () => {
      const response = await apiClient.post<ApiResponse<T>>(url, data, finalConfig)
      return response.data
    })
  },

  async put<T>(url: string, data?: unknown, config?: ApiRequestConfig & { requestId?: string }): Promise<ApiResponse<T>> {
    const requestId = config?.requestId || RequestCancellation.generateRequestId('PUT')
    const finalConfig = RequestCancellation.addSignalToConfig(config || {}, requestId)

    return createRetryableRequest(async () => {
      const response = await apiClient.put<ApiResponse<T>>(url, data, finalConfig)
      return response.data
    })
  },

  async patch<T>(url: string, data?: unknown, config?: ApiRequestConfig & { requestId?: string }): Promise<ApiResponse<T>> {
    const requestId = config?.requestId || RequestCancellation.generateRequestId('PATCH')
    const finalConfig = RequestCancellation.addSignalToConfig(config || {}, requestId)

    return createRetryableRequest(async () => {
      const response = await apiClient.patch<ApiResponse<T>>(url, data, finalConfig)
      return response.data
    })
  },

  async delete<T>(url: string, config?: ApiRequestConfig & { requestId?: string }): Promise<ApiResponse<T>> {
    const requestId = config?.requestId || RequestCancellation.generateRequestId('DELETE')
    const finalConfig = RequestCancellation.addSignalToConfig(config || {}, requestId)

    return createRetryableRequest(async () => {
      const response = await apiClient.delete<ApiResponse<T>>(url, finalConfig)
      return response.data
    })
  },

  async getPaginated<T>(
    url: string,
    page = 1,
    limit = 10,
    config?: ApiRequestConfig & { requestId?: string }
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const requestId = config?.requestId || RequestCancellation.generateRequestId('GET_PAGINATED')
    const params = { page, limit, ...config?.params }
    const finalConfig = RequestCancellation.addSignalToConfig(
      { ...config, params } || {},
      requestId
    )

    return createRetryableRequest(async () => {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<T>>>(url, finalConfig)
      return response.data
    })
  },

  // Utility method to cancel requests
  cancelRequest(requestId: string): void {
    RequestCancellation.cancelRequest(requestId)
  },

  cancelAllRequests(): void {
    RequestCancellation.cancelAllRequests()
  },
}
