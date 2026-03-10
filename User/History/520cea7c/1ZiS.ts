import axios from 'axios'
import { handleRequest, handleRequestError } from './request'
import { handleResponse, handleResponseError } from './response'

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor
apiClient.interceptors.request.use(handleRequest, handleRequestError)

// Add response interceptor
apiClient.interceptors.response.use(handleResponse, handleResponseError)
