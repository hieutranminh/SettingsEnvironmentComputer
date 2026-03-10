import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status?: number
}

export const useApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()

  const request = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    loading.value = true
    error.value = null

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers
      }

      // Add auth token if available
      if (authStore.token) {
        headers.Authorization = `Bearer ${authStore.token}`
      }

      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const get = <T>(url: string): Promise<ApiResponse<T>> => {
    return request<T>(url, { method: 'GET' })
  }

  const post = <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  const put = <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  const del = <T>(url: string): Promise<ApiResponse<T>> => {
    return request<T>(url, { method: 'DELETE' })
  }

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del
  }
}
