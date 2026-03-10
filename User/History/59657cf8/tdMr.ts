import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types/User'
import type { AuthTokens } from '@/services/auth'
import authService from '@/services/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const state = ref<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
})

export const useAuth = () => {
  const user = computed(() => state.value.user)
  const isAuthenticated = computed(() => state.value.isAuthenticated)
  const isLoading = computed(() => state.value.isLoading)
  const error = computed(() => state.value.error)

  const setLoading = (loading: boolean): void => {
    state.value.isLoading = loading
  }

  const setError = (errorMessage: string | null): void => {
    state.value.error = errorMessage
  }

  const setUser = (userData: User | null): void => {
    state.value.user = userData
    state.value.isAuthenticated = !!userData
  }

  const handleLogin = async (credentials: LoginCredentials): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      return response.user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (userData: RegisterData): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.register(userData)
      setUser(response.user)
      return response.user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await authService.logout()
      setUser(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshToken = async (): Promise<AuthTokens> => {
    try {
      return await authService.refreshToken()
    } catch (err) {
      setUser(null)
      throw err
    }
  }

  const loadUserProfile = async (): Promise<void> => {
    if (!authService.isAuthenticated()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userData = await authService.getProfile()
      setUser(userData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile'
      setError(errorMessage)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      const updatedUser = await authService.updateProfile(userData)
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (passwords: {
    currentPassword: string
    newPassword: string
  }): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await authService.changePassword(passwords)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await authService.forgotPassword(email)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await authService.resetPassword(token, newPassword)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = (): void => {
    setError(null)
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    handleLogin,
    handleRegister,
    handleLogout,
    handleRefreshToken,
    loadUserProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError
  }
}
