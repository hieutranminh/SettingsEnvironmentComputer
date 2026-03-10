import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User, UserRole } from '@/types'
import { STORAGE_KEYS, ROUTE_NAMES } from '@/constants'
import apiService from '@/services/api'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const useAuth = () => {
  const router = useRouter()
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === UserRole.ADMIN)
  const isModerator = computed(() => user.value?.role === UserRole.MODERATOR)
  const hasRole = computed(() => (role: UserRole) => user.value?.role === role)

  // Load user from localStorage on initialization
  const loadUserFromStorage = (): void => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    if (userData) {
      try {
        user.value = JSON.parse(userData)
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      }
    }
  }

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiService.post<{ user: User; token: string }>('/auth/login', credentials)

      if (response.success) {
        const { user: userData, token } = response.data

        // Store token and user data
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))

        user.value = userData

        // Redirect to dashboard
        await router.push({ name: ROUTE_NAMES.DASHBOARD })
        return true
      } else {
        error.value = response.message || 'Login failed'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred during login'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Register function
  const register = async (data: RegisterData): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiService.post<{ user: User; token: string }>('/auth/register', data)

      if (response.success) {
        const { user: userData, token } = response.data

        // Store token and user data
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))

        user.value = userData

        // Redirect to dashboard
        await router.push({ name: ROUTE_NAMES.DASHBOARD })
        return true
      } else {
        error.value = response.message || 'Registration failed'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred during registration'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint if available
      await apiService.post('/auth/logout')
    } catch {
      // Ignore logout API errors
    } finally {
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)

      // Reset user state
      user.value = null

      // Redirect to home
      await router.push({ name: ROUTE_NAMES.HOME })
    }
  }

  // Update user profile
  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiService.put<{ user: User }>('/auth/profile', profileData)

      if (response.success) {
        const updatedUser = response.data.user

        // Update localStorage
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))

        // Update user state
        user.value = updatedUser
        return true
      } else {
        error.value = response.message || 'Profile update failed'
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred while updating profile'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Check if user has required role
  const hasRequiredRole = (requiredRoles: UserRole[]): boolean => {
    if (!user.value) return false
    return requiredRoles.includes(user.value.role)
  }

  // Initialize auth state
  loadUserFromStorage()

  return {
    // State
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    isAuthenticated,
    isAdmin,
    isModerator,
    hasRole,

    // Methods
    login,
    register,
    logout,
    updateProfile,
    hasRequiredRole
  }
}
