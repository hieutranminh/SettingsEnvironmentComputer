import { useConfigStore } from '@/stores/config'

export const useConfig = () => {
  const configStore = useConfigStore()

  return {
    // State
    config: configStore.config,
    isLoading: configStore.isLoading,
    error: configStore.error,

    // Computed
    isInitialized: configStore.isInitialized,
    isDevelopment: configStore.isDevelopment,
    isStaging: configStore.isStaging,
    isProduction: configStore.isProduction,
    isDebugEnabled: configStore.isDebugEnabled,

    // Methods
    initializeConfig: configStore.initializeConfig,
    setConfig: configStore.setConfig,
    setError: configStore.setError,
    clearError: configStore.clearError,
    getApiConfig: configStore.getApiConfig,
    getSecurityConfig: configStore.getSecurityConfig,
    getThemeConfig: configStore.getThemeConfig,
    getFeatureFlags: configStore.getFeatureFlags,
    getMonitoringConfig: configStore.getMonitoringConfig,
    getCustomizations: configStore.getCustomizations
  }
}
