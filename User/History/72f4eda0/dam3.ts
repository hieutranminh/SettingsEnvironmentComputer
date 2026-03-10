export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: unknown
}

export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  timeout?: number
  withCredentials?: boolean
}

export interface ApiRequestConfig extends RequestConfig {
  skipAuth?: boolean
  skipErrorHandling?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface EndpointConfig {
  method: HttpMethod
  url: string
  requiresAuth?: boolean
  timeout?: number
}
