// Gateway service (public API for all domain services)
export { gatewayService } from './services/base'

// Domain API modules
export { authApi } from './services/auth'

// Domain types re-exported for consumer convenience
export type { LoginCredentials, LoginResponse } from '@/types/auth'

// Core API types
export type { ApiResponse, PaginatedApiResponse, ApiError, ApiRequestConfig } from '@/types/api'
