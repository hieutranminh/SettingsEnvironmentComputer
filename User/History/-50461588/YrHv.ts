export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },

  // Admin endpoints
  ADMINS: {
    CUSTOM_BRANCH_TYPE: '/admins/CustomBranchType',
  },

  // Common endpoints
  COMMON: {
    UPLOAD: '/upload',
    HEALTH_CHECK: '/health',
  },
} as const

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

// API Types
export const API_TYPES = {
  AGGREGATE: 'aggr',
  READ: 'read',
  COMMAND: 'cmd',
  AUTH: 'auth',
  UPLOAD: 'upload',
} as const

// API Versions
export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
  V3: 'v3',
} as const

// Default API configuration
export const DEFAULT_API_CONFIG = {
  type: API_TYPES.READ,
  version: API_VERSIONS.V1,
} as const

// Type definitions
export type ApiType = (typeof API_TYPES)[keyof typeof API_TYPES]
export type ApiVersion = (typeof API_VERSIONS)[keyof typeof API_VERSIONS]

export interface ApiConfig {
  type?: ApiType
  version?: ApiVersion
}
