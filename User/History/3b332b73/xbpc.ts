import type { ApiResponse, ApiError } from '@/types/ApiResponse'
import { API_BASE_URL, HTTP_METHODS, HTTP_STATUS } from '@/constants/API_ENDPOINTS'
import { STORAGE_KEYS } from '@/constants/APP_CONSTANTS'

interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
  signal?: AbortSignal
}

interface ApiClientConfig {
  baseURL: string
  timeout?: number
}

class ApiClient {
  private config: ApiClientConfig

  constructor(config: ApiClientConfig) {
    this.config = config
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers
    }

    const config: RequestInit = {
      method: options.method || HTTP_METHODS.GET,
      headers,
      signal: options.signal
    }

    if (options.body && options.method !== HTTP_METHODS.GET) {
      config.body = JSON.stringify(options.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'Request failed',
          status: response.status,
          code: data.code
        }
        throw error
      }

      return data
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was aborted')
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Network error occurred')
    }
  }

  async get<T>(endpoint: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: HTTP_METHODS.GET, signal })
  }

  async post<T>(
    endpoint: string,
    data: any,
    signal?: AbortSignal
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.POST,
      body: data,
      signal
    })
  }

  async put<T>(
    endpoint: string,
    data: any,
    signal?: AbortSignal
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.PUT,
      body: data,
      signal
    })
  }

  async patch<T>(
    endpoint: string,
    data: any,
    signal?: AbortSignal
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.PATCH,
      body: data,
      signal
    })
  }

  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: HTTP_METHODS.DELETE, signal })
  }
}

export const apiClient = new ApiClient({
  baseURL: API_BASE_URL,
  timeout: 10000
})

export default apiClient
