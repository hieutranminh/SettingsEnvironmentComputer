import type { LoginCredentials, RegisterData, User } from '@/types/User'
import type { ApiResponse } from '@/types/ApiResponse'
import { API_ENDPOINTS } from '@/constants/API_ENDPOINTS'
import { STORAGE_KEYS } from '@/constants/APP_CONSTANTS'
import apiClient from './api'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )

    if (response.success && response.data) {
      this.setTokens(response.data.tokens)
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
    }

    return response.data
  }

  async register(userData: RegisterData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    )

    if (response.success && response.data) {
      this.setTokens(response.data.tokens)
    }

    return response.data
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {})
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearTokens()
      this.clearUserData()
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<AuthTokens>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    )

    if (response.success && response.data) {
      this.setTokens(response.data)
    }

    return response.data
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.USERS.PROFILE)
    return response.data
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      userData
    )
    return response.data
  }

  async changePassword(passwords: {
    currentPassword: string
    newPassword: string
  }): Promise<void> {
    await apiClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, passwords)
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword
    })
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    return !!token && !this.isTokenExpired(token)
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
  }

  private clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  private clearUserData(): void {
    localStorage.removeItem('rememberMe')
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expirationTime = payload.exp * 1000
      return Date.now() >= expirationTime
    } catch {
      return true
    }
  }
}

export const authService = new AuthService()
export default authService
