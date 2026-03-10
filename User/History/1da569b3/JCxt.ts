import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'auth_token'

export const setupRequestInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      // Add authentication token if available
      const token = Cookies.get(TOKEN_KEY)
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add request timestamp for debugging
      if (import.meta.env.DEV) {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
      }

      return config
    },
    (error) => {
      console.error('[API Request Error]', error)
      return Promise.reject(error)
    }
  )
}
