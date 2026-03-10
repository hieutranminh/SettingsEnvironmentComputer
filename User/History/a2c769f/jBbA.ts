import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadRuntimeConfig } from '@/config/runtime-config'
import type { RuntimeConfig } from '@/types/config'

export const useConfigStore = defineStore('config', () => {
  const config = ref<RuntimeConfig | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isInitialized = computed(() => config.value !== null)
  const isDevelopment = computed(() => config.value?.environment === 'development')
  const isStaging = computed(() => config.value?.environment === 'staging')
  const isProduction = computed(() => config.value?.environment === 'production')
  const isDebugEnabled = computed(() => config.value?.debug === true)
  const isSourceMapEnabled = computed(() => config.value?.sourceMap === true)

  const setConfig = (configData: RuntimeConfig | null): void => {
    config.value = configData
    console.log('config', config.value)
  }

  const setError = (errorMessage: string | null): void => {
    error.value = errorMessage
  }

  const clearError = (): void => {
    error.value = null
  }

  const initializeConfig = async (): Promise<boolean> => {
    isLoading.value = true
    clearError()

    try {
      const runtimeConfig = await loadRuntimeConfig()
      setConfig(runtimeConfig)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load configuration'
      setError(errorMessage)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getApiConfig = (): RuntimeConfig['api'] | null => {
    return config.value?.api ?? null
  }

  const getSecurityConfig = (): RuntimeConfig['security'] | null => {
    return config.value?.security ?? null
  }

  const getThemeConfig = (): RuntimeConfig['theme'] | null => {
    return config.value?.theme ?? null
  }

  const getFeatureFlags = (): RuntimeConfig['features'] | null => {
    return config.value?.features ?? null
  }

  const getMonitoringConfig = (): RuntimeConfig['monitoring'] | null => {
    return config.value?.monitoring ?? null
  }

  const getCustomizations = (): RuntimeConfig['customizations'] | null => {
    return config.value?.customizations ?? null
  }

  return {
    // State
    config,
    isLoading,
    error,

    // Computed
    isInitialized,
    isDevelopment,
    isStaging,
    isProduction,
    isDebugEnabled,

    // Methods
    initializeConfig,
    setConfig,
    setError,
    clearError,
    getApiConfig,
    getSecurityConfig,
    getThemeConfig,
    getFeatureFlags,
    getMonitoringConfig,
    getCustomizations
  }
})
