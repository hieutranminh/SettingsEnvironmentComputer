import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import type { ApiError } from '@/types/api'

const TOKEN_KEY = 'auth_token'

export const setupResponseInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log successful responses in development
      if (import.meta.env.DEV) {
        console.log(`[API Response] ${response.status} ${response.config.url}`)
      }

      return response
    },
    (error: AxiosError) => {
      const status = error.response?.status
      const responseData = error.response?.data as { message?: string } | undefined
      const message = responseData?.message || error.message

      // Handle 401 Unauthorized - clear token and redirect to login
      if (status === 401) {
        Cookies.remove(TOKEN_KEY)

        // Use router to redirect to login
        const router = useRouter()
        router.push('/auth/login')

        console.warn('[API] Unauthorized access, redirected to login')
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error('[API] Access forbidden:', message)
      }

      // Handle 404 Not Found
      if (status === 404) {
        console.error('[API] Resource not found:', message)
      }

      // Handle 500+ Server Errors
      if (status && status >= 500) {
        console.error('[API] Server error:', message)
      }

      // Create standardized error object
      const apiError: ApiError = {
        message: message || 'An unexpected error occurred',
        status: status || 0,
        code: error.code,
        details: error.response?.data,
      }

      // Log error in development
      if (import.meta.env.DEV) {
        console.error('[API Error]', apiError)
      }

      return Promise.reject(apiError)
    }
  )
}
