import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { UserRole } from '@/types'
import { STORAGE_KEYS } from '@/constants'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === UserRole.ADMIN)
  const isModerator = computed(() => user.value?.role === UserRole.MODERATOR)
  const hasRole = computed(() => (role: UserRole) => user.value?.role === role)

  // Actions
  const setUser = (userData: User | null): void => {
    user.value = userData
  }

  const setToken = (authToken: string | null): void => {
    token.value = authToken
    if (authToken) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken)
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    }
  }

  const setLoading = (loading: boolean): void => {
    isLoading.value = loading
  }

  const login = (userData: User, authToken: string): void => {
    user.value = userData
    token.value = authToken
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken)
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
  }

  const logout = (): void => {
    user.value = null
    token.value = null
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
  }

  const loadFromStorage = (): void => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA)

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch {
        logout()
      }
    }
  }

  const updateUser = (userData: Partial<User>): void => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user.value))
    }
  }

  return {
    // State
    user,
    token,
    isLoading,

    // Getters
    isAuthenticated,
    isAdmin,
    isModerator,
    hasRole,

    // Actions
    setUser,
    setToken,
    setLoading,
    login,
    logout,
    loadFromStorage,
    updateUser
  }
})
