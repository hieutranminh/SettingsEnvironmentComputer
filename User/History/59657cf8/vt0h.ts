// import { ref, computed, readonly } from 'vue'
// import { apiService } from '@/services/api'
// import { API_ENDPOINTS } from '@/constants/API_ENDPOINTS'
// import type { User, LoginRequest, LoginResponse, CreateUserRequest } from '@/types/User'

// export const useAuth = () => {
//   const user = ref<User | null>(null)
//   const isLoading = ref(false)
//   const error = ref<string | null>(null)

//   const isAuthenticated = computed(() => !!user.value)
//   const isAdmin = computed(() => user.value?.role === 'admin')

//   const setUser = (userData: User | null) => {
//     user.value = userData
//   }

//   const setError = (errorMessage: string | null) => {
//     error.value = errorMessage
//   }

//   const clearError = () => {
//     error.value = null
//   }

//   const handleLogin = async (credentials: LoginRequest): Promise<boolean> => {
//     isLoading.value = true
//     clearError()

//     try {
//       const response = await apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)

//       if (response.success && response.data) {
//         const { user: userData, token, refreshToken } = response.data

//         // Store tokens
//         localStorage.setItem('auth_token', token)
//         localStorage.setItem('refresh_token', refreshToken)

//         // Set user
//         setUser(userData)
//         return true
//       } else {
//         setError(response.message || 'Login failed')
//         return false
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Login failed'
//       setError(errorMessage)
//       return false
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const handleLogout = async (): Promise<void> => {
//     isLoading.value = true
//     clearError()

//     try {
//       await apiService.post(API_ENDPOINTS.AUTH.LOGOUT)
//     } catch (err) {
//       // Continue with logout even if API call fails
//       console.warn('Logout API call failed:', err)
//     } finally {
//       // Clear local data
//       localStorage.removeItem('auth_token')
//       localStorage.removeItem('refresh_token')
//       setUser(null)
//       isLoading.value = false
//     }
//   }

//   const handleRegister = async (userData: CreateUserRequest): Promise<boolean> => {
//     isLoading.value = true
//     clearError()

//     try {
//       const response = await apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, userData)

//       if (response.success && response.data) {
//         const { user: newUser, token, refreshToken } = response.data

//         // Store tokens
//         localStorage.setItem('auth_token', token)
//         localStorage.setItem('refresh_token', refreshToken)

//         // Set user
//         setUser(newUser)
//         return true
//       } else {
//         setError(response.message || 'Registration failed')
//         return false
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Registration failed'
//       setError(errorMessage)
//       return false
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const checkAuthStatus = async (): Promise<void> => {
//     const token = localStorage.getItem('auth_token')
//     if (!token) {
//       setUser(null)
//       return
//     }

//     try {
//       const response = await apiService.get<User>(API_ENDPOINTS.USERS.PROFILE)
//       if (response.success && response.data) {
//         setUser(response.data)
//       } else {
//         // Token is invalid, clear it
//         localStorage.removeItem('auth_token')
//         localStorage.removeItem('refresh_token')
//         setUser(null)
//       }
//     } catch (err) {
//       // Token is invalid, clear it
//       localStorage.removeItem('auth_token')
//       localStorage.removeItem('refresh_token')
//       setUser(null)
//     }
//   }

//   return {
//     // State
//     user: readonly(user),
//     isLoading: readonly(isLoading),
//     error: readonly(error),

//     // Computed
//     isAuthenticated,
//     isAdmin,

//     // Methods
//     handleLogin,
//     handleLogout,
//     handleRegister,
//     checkAuthStatus,
//     setUser,
//     setError,
//     clearError
//   }
// }
