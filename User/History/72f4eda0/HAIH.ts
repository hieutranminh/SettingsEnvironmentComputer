export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, any>
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
