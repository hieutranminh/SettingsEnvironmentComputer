import type { AxiosResponse, AxiosError } from 'axios'

import { API_ERROR_CODES, HTTP_STATUS } from '@/constants/index'
import type { ApiResponse, ApiError } from '@/types/ApiResponse'
import type { RefreshTokenConfig } from '@/types/auth/User'

import { getAuthToken, handleTokenRefresh } from './refreshTokenManager'

// Handle token refresh with concurrency control
const handleTokenRefreshForResponse = async (config: RefreshTokenConfig): Promise<AxiosResponse> => {
  try {
    const success = await handleTokenRefresh()

    if (!success) {
      throw new Error('Failed to refresh token')
    }

    // Retry the original request with new token
    const { apiClient } = await import('./index')
    const newAuthToken = getAuthToken()
    if (newAuthToken) {
      config.headers.Authorization = `Bearer ${newAuthToken}`
    }

    return await apiClient(config)
  } catch (refreshTokenError) {
    throw refreshTokenError
  }
}

// Handle service unauthorized errors from response data
const handleResponseServiceUnauthorization = async (
  response: AxiosResponse<ApiResponse>,
): Promise<AxiosResponse<ApiResponse>> => {
  if (response?.data?.isOK) return response

  const hasErrorUnAuthorized = response?.data?.errorMessages?.some((errorMessage) => {
    return errorMessage?.errorCode === API_ERROR_CODES.API_SERVICE_UNAUTHORIZED
  })

  if (!hasErrorUnAuthorized) return response

  try {
    return await handleTokenRefreshForResponse(response.config)
  } catch (error) {
    return Promise.reject(error)
  }
}

// Handle HTTP 401 unauthorized errors
const handleResponseUnauthorization = async (error: AxiosError<ApiError>): Promise<AxiosResponse> => {
  if (error?.response?.status === HTTP_STATUS.UNAUTHORIZED) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}')
    const refreshToken = currentUser?.user?.refreshToken

    // Don't try to refresh if no refresh token or if this is already a refresh token request
    if (!refreshToken || error?.config?.url?.includes('/auth/RefreshToken')) {
      const { useAuthStore } = await import('@/stores/auth/auth')
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
      return Promise.reject(new Error('Authentication failed. Please login again.'))
    }

    try {
      return await handleTokenRefreshForResponse(error?.config as RefreshTokenConfig)
    } catch (refreshTokenError) {
      return Promise.reject(refreshTokenError)
    }
  }

  return Promise.reject(error)
}

export const handleResponse = async (response: AxiosResponse<ApiResponse>): Promise<AxiosResponse<ApiResponse>> => {
  // Handle service unauthorized errors from response data
  return await handleResponseServiceUnauthorization(response)
}

export const handleResponseError = (error: AxiosError<ApiError>): Promise<never> => {
  // Handle HTTP 401 unauthorized errors
  if (error?.response?.status === HTTP_STATUS.UNAUTHORIZED) {
    return handleResponseUnauthorization(error) as Promise<never>
  }

  // Handle server errors (5xx)
  if (error?.response?.status && error.response.status >= 500) {
    return Promise.reject(new Error('Server error. Please try again later.'))
  }

  // Handle client errors (4xx)
  if (error?.response?.status && error.response.status >= 400) {
    const errorMessage = error.response.data?.errorMessages
    console.error('Client error:', errorMessage)
    return Promise.reject(errorMessage)
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
