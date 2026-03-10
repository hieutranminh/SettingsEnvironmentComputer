// import { defineStore } from 'pinia'
// import { ref, computed, readonly } from 'vue'
// import type { User, LoginRequest, CreateUserRequest } from '@/types/User'
// import { useAuth } from '@/composables/useAuth'

// export const useAuthStore = defineStore('auth', () => {
//   const {
//     handleLogin: loginUser,
//     handleLogout: logoutUser,
//     handleRegister: registerUser,
//     checkAuthStatus,
//     setUser,
//     setError,
//     clearError
//   } = useAuth()

//   const user = ref<User | null>(null)
//   const isLoading = ref(false)
//   const error = ref<string | null>(null)

//   const isAuthenticated = computed(() => !!user.value)
//   const isAdmin = computed(() => user.value?.role === 'admin')
//   const userFullName = computed(() => {
//     if (!user.value) return ''
//     return `${user.value.firstName} ${user.value.lastName}`
//   })

//   const login = async (credentials: LoginRequest): Promise<boolean> => {
//     isLoading.value = true
//     clearError()

//     try {
//       const success = await loginUser(credentials)
//       if (success) {
//         // Update store state from composable
//         const authComposable = useAuth()
//         user.value = authComposable.user.value
//       }
//       return success
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Login failed'
//       setError(errorMessage)
//       return false
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const logout = async (): Promise<void> => {
//     isLoading.value = true
//     clearError()

//     try {
//       await logoutUser()
//       user.value = null
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Logout failed'
//       setError(errorMessage)
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const register = async (userData: CreateUserRequest): Promise<boolean> => {
//     isLoading.value = true
//     clearError()

//     try {
//       const success = await registerUser(userData)
//       if (success) {
//         // Update store state from composable
//         const authComposable = useAuth()
//         user.value = authComposable.user.value
//       }
//       return success
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Registration failed'
//       setError(errorMessage)
//       return false
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const initializeAuth = async (): Promise<void> => {
//     await checkAuthStatus()
//     const authComposable = useAuth()
//     user.value = authComposable.user.value
//   }

//   const updateUser = (userData: User | null) => {
//     user.value = userData
//   }

//   const setAuthError = (errorMessage: string | null) => {
//     error.value = errorMessage
//   }

//   const clearAuthError = () => {
//     error.value = null
//   }

//   return {
//     // State
//     user: readonly(user),
//     isLoading: readonly(isLoading),
//     error: readonly(error),

//     // Computed
//     isAuthenticated,
//     isAdmin,
//     userFullName,

//     // Actions
//     login,
//     logout,
//     register,
//     initializeAuth,
//     updateUser,
//     setAuthError,
//     clearAuthError
//   }
// })
