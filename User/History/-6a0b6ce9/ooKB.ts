import type { InternalAxiosRequestConfig } from 'axios'

export const handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Add authentication token if available
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Set default content type
  config.headers['Content-Type'] = 'application/json'

  return config
}

export const handleRequestError = (error: any): Promise<never> => {
  console.error('Request interceptor error:', error)
  return Promise.reject(error)
}
