export const APP_NAME = 'AhaPlus Headquarters'

export const SUPPORTED_LANGUAGES = {
  KO: 'ko',
  EN: 'en'
} as const

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.KO

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
} as const

export const DEFAULT_THEME = THEMES.LIGHT

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 100
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  LANGUAGE: 'language',
  THEME: 'theme'
} as const

export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  SETTINGS: 'settings',
  ADMIN: 'admin',
  ADMIN_USERS: 'admin-users',
  ADMIN_DASHBOARD: 'admin-dashboard'
} as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
} as const
