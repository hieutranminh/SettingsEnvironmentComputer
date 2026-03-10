import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterData } from '@/types/User'
import type { AuthTokens } from '@/services/auth'
import authService from '@/services/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  getters: {
    userFullName: (state): string => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`.trim()
    },

    userInitials: (state): string => {
      if (!state.user) return ''
      const { firstName, lastName } = state.user
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    },

    isAdmin: (state): boolean => {
      return state.user?.role === 'admin'
    },

    isModerator: (state): boolean => {
      return state.user?.role === 'moderator'
    }
  },

  actions: {
    setLoading(loading: boolean): void {
      this.isLoading = loading
    },

    setError(errorMessage: string | null): void {
      this.error = errorMessage
    },

    setUser(userData: User | null): void {
      this.user = userData
      this.isAuthenticated = !!userData
    },

    async login(credentials: LoginCredentials): Promise<User> {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await authService.login(credentials)
        this.setUser(response.user)
        return response.user
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed'
        this.setError(errorMessage)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async register(userData: RegisterData): Promise<User> {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await authService.register(userData)
        this.setUser(response.user)
        return response.user
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registration failed'
        this.setError(errorMessage)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async logout(): Promise<void> {
      this.setLoading(true)
      this.setError(null)

      try {
        await authService.logout()
        this.setUser(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Logout failed'
        this.setError(errorMessage)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async refreshToken(): Promise<AuthTokens> {
      try {
        return await authService.refreshToken()
      } catch (err) {
        this.setUser(null)
        throw err
      }
    },

    async loadUserProfile(): Promise<void> {
      if (!authService.isAuthenticated()) {
        return
      }

      this.setLoading(true)
      this.setError(null)

      try {
        const userData = await authService.getProfile()
        this.setUser(userData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile'
        this.setError(errorMessage)
        this.setUser(null)
      } finally {
        this.setLoading(false)
      }
    },

    async updateProfile(userData: Partial<User>): Promise<User> {
      this.setLoading(true)
      this.setError(null)

      try {
        const updatedUser = await authService.updateProfile(userData)
        this.setUser(updatedUser)
        return updatedUser
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Profile update failed'
        this.setError(errorMessage)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async changePassword(passwords: {
      currentPassword: string
      newPassword: string
    }): Promise<void> {
      this.setLoading(true)
      this.setError(null)

      try {
        await authService.changePassword(passwords)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Password change failed'
        this.setError(errorMessage)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async forgotPassword(email: string): Promise<void> {
      this.setLoading(true)
      this.setError(null)

      try {
        await authService.forgotPassword(email)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
        this.setError(errorMessage)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async resetPassword(token: string, newPassword: string): Promise<void> {
      this.setLoading(true)
      this.setError(null)

      try {
        await authService.resetPassword(token, newPassword)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
        this.setError(errorMessage)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    clearError(): void {
      this.setError(null)
    }
  }
})
