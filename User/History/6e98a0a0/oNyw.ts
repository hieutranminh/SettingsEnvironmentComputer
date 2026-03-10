import { apiService } from './base'
import type { ApiResponse } from '@/types/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>('/auth/login', credentials, { skipAuth: true })
  },

  async register(data: RegisterData): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>('/auth/register', data, { skipAuth: true })
  },

  async logout(): Promise<ApiResponse<void>> {
    return apiService.post<void>('/auth/logout')
  },

  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>> {
    return apiService.post<void>('/auth/forgot-password', data, { skipAuth: true })
  },

  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<void>> {
    return apiService.post<void>('/auth/reset-password', data, { skipAuth: true })
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiService.post<{ token: string }>('/auth/refresh', undefined, { skipAuth: true })
  },

  async getProfile(): Promise<ApiResponse<LoginResponse['user']>> {
    return apiService.get<LoginResponse['user']>('/auth/profile')
  },
}
