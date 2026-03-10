import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type LoginCredentials, type LoginResponse, type User } from '@/api'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(Cookies.get(TOKEN_KEY) || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setToken = (newToken: string): void => {
    token.value = newToken
    Cookies.set(TOKEN_KEY, newToken)
  }

  const clearToken = (): void => {
    token.value = null
    Cookies.remove(TOKEN_KEY)
  }

  const setUser = (userData: User): void => {
    user.value = userData
  }

  const clearUser = (): void => {
    user.value = null
  }

    const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    loading.value = true

    try {
      const response = await authApi.login(credentials)
      const { token: newToken, user: userData } = response.data

      setToken(newToken)
      // Cast userData to User type since login response might not include timestamps
      setUser(userData as User)

      return response.data
    } finally {
      loading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    loading.value = true

    try {
      await authApi.logout()
    } catch {
      // Even if logout fails on server, clear local state
      console.warn('Logout failed on server, clearing local state')
    } finally {
      clearToken()
      clearUser()
      loading.value = false
    }
  }

  const loadProfile = async (): Promise<User | null> => {
    if (!token.value) {
      return null
    }

    loading.value = true

    try {
      const response = await authApi.getProfile()
      const userData = response.data
      setUser(userData)
      return userData
    } catch {
      // If profile load fails, clear token (might be expired)
      clearToken()
      clearUser()
      return null
    } finally {
      loading.value = false
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    if (!token.value) {
      return false
    }

    try {
      const response = await authApi.refreshToken()
      const { token: newToken } = response.data
      setToken(newToken)
      return true
    } catch {
      clearToken()
      clearUser()
      return false
    }
  }

  return {
    // State
    user,
    token,
    loading,

    // Computed
    isAuthenticated,

    // Actions
    login,
    logout,
    loadProfile,
    refreshToken,
    setToken,
    clearToken,
    setUser,
    clearUser,
  }
})
