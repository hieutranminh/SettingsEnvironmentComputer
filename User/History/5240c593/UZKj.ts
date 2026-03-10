import type { AxiosResponse, AxiosError } from 'axios'

import type { ApiResponse, ApiError } from '@/types/ApiResponse'

export const handleResponse = (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => {
  // You can add global response processing here
  // For example, logging, data transformation, etc.
  return response
}

export const handleResponseError = (error: AxiosError<ApiError>): Promise<never> => {
  // Handle authentication errors (401)
  if (error.response?.status === 401) {
    // Clear auth token and redirect to login
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
    return Promise.reject(new Error('Authentication failed. Please login again.'))
  }

  // Handle server errors (5xx)
  if (error.response?.status && error.response.status >= 500) {
    console.error('Server error:', error.response.data)
    return Promise.reject(new Error('Server error. Please try again later.'))
  }

  // Handle client errors (4xx)
  if (error.response?.status && error.response.status >= 400) {
    const errorMessage = error.response.data?.message || 'Request failed'
    console.error('Client error:', errorMessage)
    return Promise.reject(new Error(errorMessage))
  }

  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
    console.error('Network error:', error.message)
    return Promise.reject(new Error('Network error. Please check your connection.'))
  }

  // Handle other errors
  console.error('Unexpected error:', error)
  return Promise.reject(new Error('An unexpected error occurred.'))
}
