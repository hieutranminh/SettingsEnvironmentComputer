// Core API exports
export { apiClient, createAxiosInstance } from './axios'
export { apiService } from './services/base'

// Service exports
export { authApi } from './services/auth'
export { userApi } from './services/user'

// Type exports
export type {
  ApiResponse,
  ApiError,
  RequestConfig,
  ApiRequestConfig,
  PaginatedResponse,
  HttpMethod,
  EndpointConfig,
} from '@/types/api'

export type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
} from './services/auth'

export type {
  User,
  CreateUserData,
  UpdateUserData,
  UserFilters,
} from './services/user'
