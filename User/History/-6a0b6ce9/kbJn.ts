import type { InternalAxiosRequestConfig } from 'axios'

import { getAuthToken, checkTokenExpiration, handleTokenRefresh } from './refreshTokenManager'

export const handleRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  // Add authentication token if available
  const authToken = getAuthToken()
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  // Set default content type only for JSON data, not for FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }

  // Check if token needs refresh before sending request
  const needsRefresh = checkTokenExpiration()
  if (!needsRefresh) {
    return config
  }

  const success = await handleTokenRefresh()
  if (!success) {
    return config
  }

  // Update config with new token
  const newAuthToken = getAuthToken()
  if (newAuthToken) {
    config.headers.Authorization = `Bearer ${newAuthToken}`
  }

  return config
}

export const handleRequestError = (error: Error): Promise<never> => {
  return Promise.reject(error)
}
