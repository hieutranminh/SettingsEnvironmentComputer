import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { appConfig } from '@/config/app'
import { setupRequestInterceptors } from './interceptors/request'
import { setupResponseInterceptors } from './interceptors/response'

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: appConfig.apiBaseUrl,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })

  // Setup interceptors
  setupRequestInterceptors(instance)
  setupResponseInterceptors(instance)

  return instance
}

export const apiClient = createAxiosInstance()

// Export types for convenience
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse }
