/**
 * Environment Configuration Module
 *
 * This module provides:
 * - Runtime validation of required environment variables
 * - Typed access to environment variables
 * - Environment detection utilities
 *
 * @module config/env
 */

// ============================================================
// TYPES
// ============================================================

type AppMode = 'development' | 'staging' | 'production'

interface IEnvConfig {
  // App Mode
  mode: AppMode
  isDev: boolean
  isStaging: boolean
  isProd: boolean

  // Solution
  solutionId: string

  // Gateway
  gatewayBaseUrl: string
  gatewayVersion: string

  // Notification
  notificationUrl: string

  // Login URLs
  loginUrlDefault: string
  loginUrlKR: string

  // Services
  services: {
    admins: IServiceConfig
    identities: IServiceConfig
    goods: IServiceConfig
    boards: IServiceConfig
    adminSales: IServiceConfig
    bookings: IServiceConfig
    sales: IServiceConfig
    staffs: IServiceConfig
    clients: IServiceConfig
  }

  // Storage
  storage: {
    boardUrl: string
    clientUrl: string
    adminsUrl: string
  }

  // External Services
  iamportKey: string
  sentryDsn: string
}

interface IServiceConfig {
  name: string
  readVersion: string
  cmdVersion: string
}

// ============================================================
// REQUIRED ENVIRONMENT VARIABLES
// ============================================================

const REQUIRED_ENV_VARS = [
  'VITE_HEADQUARTERADMIN_GATEWAY_BASEURL',
  'VITE_NOTIFICATION_READ_API_BASEURL',
  'VITE_LOGIN_URL_DEFAULT',
  'VITE_LOGIN_URL_KR',
] as const

// ============================================================
// VALIDATION
// ============================================================

/**
 * Validates that all required environment variables are present
 * @throws Error if any required variable is missing
 */
const validateEnv = (): void => {
  const missing: string[] = []

  for (const key of REQUIRED_ENV_VARS) {
    const value = import.meta.env[key]
    if (value === undefined || value === '') {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables:\n${missing.map((v) => `  - ${v}`).join('\n')}`
    console.error(`❌ ${message}`)

    // Only throw in production to avoid breaking development
    if (import.meta.env.MODE === 'production') {
      throw new Error(message)
    } else {
      console.warn('⚠️ Continuing in development mode with missing variables...')
    }
  }
}

// ============================================================
// ENVIRONMENT CONFIG
// ============================================================

/**
 * Creates the environment configuration object
 */
const createEnvConfig = (): IEnvConfig => {
  const mode = (import.meta.env.MODE || 'development') as AppMode

  return {
    // App Mode
    mode,
    isDev: mode === 'development',
    isStaging: mode === 'staging',
    isProd: mode === 'production',

    // Solution
    solutionId: import.meta.env.VITE_SALONADMIN_SOLUTION_ID || '',

    // Gateway
    gatewayBaseUrl: import.meta.env.VITE_HEADQUARTERADMIN_GATEWAY_BASEURL || '',
    gatewayVersion: import.meta.env.VITE_HEADQUARTERADMIN_GATEWAY_VERSION || '1',

    // Notification
    notificationUrl: import.meta.env.VITE_NOTIFICATION_READ_API_BASEURL || '',

    // Login URLs
    loginUrlDefault: import.meta.env.VITE_LOGIN_URL_DEFAULT || '',
    loginUrlKR: import.meta.env.VITE_LOGIN_URL_KR || '',

    // Services
    services: {
      admins: {
        name: import.meta.env.VITE_ADMINS_SERVICE_NAME || 'admins',
        readVersion: import.meta.env.VITE_ADMINS_READ_API_VERSION || '1',
        cmdVersion: import.meta.env.VITE_ADMINS_CMD_API_VERSION || '1',
      },
      identities: {
        name: import.meta.env.VITE_IDENTITIES_SERVICE_NAME || 'identities',
        readVersion: import.meta.env.VITE_IDENTITIES_READ_API_VERSION || '1',
        cmdVersion: import.meta.env.VITE_IDENTITIES_CMD_API_VERSION || '1',
      },
      goods: {
        name: import.meta.env.VITE_GOODS_SERVICE_NAME || 'goods',
        readVersion: import.meta.env.VITE_GOODS_READ_API_VERSION || '1',
        cmdVersion: import.meta.env.VITE_GOODS_CMD_API_VERSION || '1',
      },
      boards: {
        name: import.meta.env.VITE_BOARDS_SERVICE_NAME || 'boards',
        readVersion: import.meta.env.VITE_BOARDS_READ_API_VERSION || '1',
        cmdVersion: import.meta.env.VITE_BOARDS_CMD_API_VERSION || '1',
      },
      adminSales: {
        name: import.meta.env.VITE_ADMIN_SALES_SERVICE_NAME || 'adminsales',
        readVersion: import.meta.env.VITE_ADMIN_SALES_READ_API_VERSION || '1',
        cmdVersion: import.meta.env.VITE_ADMIN_SALES_CMD_API_VERSION || '1',
      },
      bookings: {
        name: import.meta.env.VITE_BOOKINGS_SERVICE_NAME || 'bookings',
        readVersion: import.meta.env.VITE_BOOKINGS_READ_API_VERSION || '1',
        cmdVersion: import.meta.env.VITE_BOOKINGS_CMD_API_VERSION || '1',
      },
      sales: {
        name: import.meta.env.VITE_SALES_SERVICE_NAME || 'sales',
        readVersion: import.meta.env.VITE_SALES_READ_API_VERSION || '1',
        cmdVersion: import.meta.env.VITE_SALES_CMD_API_VERSION || '1',
      },
      staffs: {
        name: import.meta.env.VITE_STAFFS_SERVICE_NAME || 'staffs',
        readVersion: import.meta.env.VITE_STAFFS_READ_API_VERSION || '1',
        cmdVersion: import.meta.env.VITE_STAFFS_CMD_API_VERSION || '1',
      },
      clients: {
        name: import.meta.env.VITE_CLIENTS_SERVICE_NAME || 'clients',
        readVersion: import.meta.env.VITE_CLIENTS_READ_API_VERSION || '1',
        cmdVersion: import.meta.env.VITE_CLIENTS_CMD_API_VERSION || '1',
      },
    },

    // Storage
    storage: {
      boardUrl: import.meta.env.VITE_AZURE_STORAGE_BOARD_URL || '',
      clientUrl: import.meta.env.VITE_AZURE_STORAGE_CLIENT_URL || '',
      adminsUrl: import.meta.env.VITE_AZURE_STORAGE_ADMINS_URL || '',
    },

    // External Services
    iamportKey: import.meta.env.VITE_IAMPORT_KEY || '',
    sentryDsn: import.meta.env.VITE_HEADQUARTER_ADMIN_SENTRY_DSN || '',
  }
}

// ============================================================
// INITIALIZATION
// ============================================================

// Validate environment on module load
validateEnv()

// Create and export the configuration
export const env = createEnvConfig()

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Logs current environment information (for debugging)
 */
export const logEnvInfo = (): void => {
  console.group('🔧 Environment Configuration')
  console.log(`Mode: ${env.mode}`)
  console.log(`Gateway: ${env.gatewayBaseUrl}`)
  console.log(`Is Development: ${env.isDev}`)
  console.log(`Is Staging: ${env.isStaging}`)
  console.log(`Is Production: ${env.isProd}`)
  console.groupEnd()
}

/**
 * Gets a raw environment variable value
 * @param key - The environment variable key (without VITE_ prefix)
 */
export const getEnvVar = (key: keyof ImportMetaEnv): string => {
  return import.meta.env[key] || ''
}

// Export types
export type { IEnvConfig, IServiceConfig, AppMode }
