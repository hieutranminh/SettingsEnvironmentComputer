interface AppConfig {
  readonly name: string
  readonly version: string
  readonly isDevelopment: boolean
  readonly isProduction: boolean
  readonly apiBaseUrl: string
  readonly enableDevTools: boolean
}

export const appConfig: AppConfig = {
  name: import.meta.env.VITE_APP_NAME || 'LK Warehouse CMS',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  enableDevTools: import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
}
