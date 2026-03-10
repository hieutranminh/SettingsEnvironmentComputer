import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type LoginCredentials, type LoginResponse, type User } from '@/api'
import { useLoadingState } from '@/composables/useLoadingState'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(Cookies.get(TOKEN_KEY) || null)
  const { setLoading, isLoading } = useLoadingState()

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const loading = computed(() => isLoading('auth'))

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
    setLoading('auth', true)

    try {
      const response = await authApi.login(credentials)
      const { token: newToken, user: userData } = response.data

      setToken(newToken)
      setUser(userData as User)

      return response.data
    } finally {
      setLoading('auth', false)
    }
  }

  const logout = async (): Promise<void> => {
    setLoading('auth', true)

    try {
      await authApi.logout()
    } catch {
      console.warn('Logout failed on server, clearing local state')
    } finally {
      clearToken()
      clearUser()
      setLoading('auth', false)
    }
  }

  const loadProfile = async (): Promise<User | null> => {
    if (!token.value) {
      return null
    }

    setLoading('auth', true)

    try {
      const response = await authApi.getProfile()
      const userData = response.data
      setUser(userData)
      return userData
    } catch {
      clearToken()
      clearUser()
      return null
    } finally {
      setLoading('auth', false)
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
