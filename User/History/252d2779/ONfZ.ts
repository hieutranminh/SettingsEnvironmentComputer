import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthState } from '@/router/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const initializeAuth = async (): Promise<void> => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Failed to parse stored auth data:', error)
        clearAuth()
      }
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      const response = await mockLoginApi(email, password)

      user.value = response.user
      token.value = response.token

      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const logout = (): void => {
    clearAuth()
  }

  const clearAuth = (): void => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      const response = await mockRegisterApi(email, password, name)

      user.value = response.user
      token.value = response.token

      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))
    } catch (error) {
      throw new Error('Registration failed')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    initializeAuth,
    login,
    logout,
    register,
    clearAuth
  }
})

// Mock API functions - replace with actual API calls
const mockLoginApi = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  if (email === 'test@example.com' && password === 'password') {
    return {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['user']
      },
      token: 'mock-jwt-token'
    }
  }

  throw new Error('Invalid credentials')
}

const mockRegisterApi = async (email: string, password: string, name: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    user: {
      id: '1',
      email,
      name,
      roles: ['user']
    },
    token: 'mock-jwt-token'
  }
}
