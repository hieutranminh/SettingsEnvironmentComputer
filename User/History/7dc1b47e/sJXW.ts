import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add locale header
    const locale = localStorage.getItem('locale') || 'en'
    if (config.headers) {
      config.headers['Accept-Language'] = locale
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
          break
        case 403:
          // Handle forbidden
          console.error('Access forbidden')
          break
        case 404:
          // Handle not found
          console.error('Resource not found')
          break
        case 500:
          // Handle server error
          console.error('Server error')
          break
        default:
          console.error('API Error:', error.response.data)
      }
    } else if (error.request) {
      // Handle network errors
      console.error('Network error:', error.request)
    } else {
      // Handle other errors
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// API service methods
export const apiService = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.get<T>(url, config)
  },
  
  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.post<T>(url, data, config)
  },
  
  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.put<T>(url, data, config)
  },
  
  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.delete<T>(url, config)
  },
  
  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.patch<T>(url, data, config)
  }
}

export default api 