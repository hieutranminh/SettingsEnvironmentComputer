import { ref, computed } from 'vue'

// API endpoint types
export type ApiType = 'read' | 'aggr' | 'cmd' | 'auth' | 'upload'

// API versions
export type ApiVersion = 'v1' | 'v2' | 'v3'

// API endpoint configuration
export interface ApiEndpointConfig {
  type: ApiType
  version: ApiVersion
  basePath?: string
}

// Default configuration
const defaultConfig = ref<ApiEndpointConfig>({
  type: 'cmd',
  version: 'v1',
  basePath: '/api'
})

// Composable for building API endpoints
export const useApiEndpoint = () => {
  // Current configuration
  const config = ref<ApiEndpointConfig>({ ...defaultConfig.value })

  // Update configuration
  const setConfig = (newConfig: Partial<ApiEndpointConfig>) => {
    config.value = { ...config.value, ...newConfig }
  }

  // Reset to default configuration
  const resetConfig = () => {
    config.value = { ...defaultConfig.value }
  }

  // Build endpoint with current configuration
  const buildEndpoint = (path: string): string => {
    const { type, version, basePath } = config.value
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${basePath}/${type}/${version}/${cleanPath}`
  }

  // Convenience methods for different API types
  const withType = (type: ApiType) => {
    setConfig({ type })
    return {
      build: buildEndpoint,
      withVersion: (version: ApiVersion) => {
        setConfig({ version })
        return { build: buildEndpoint }
      }
    }
  }

  const withVersion = (version: ApiVersion) => {
    setConfig({ version })
    return {
      build: buildEndpoint,
      withType: (type: ApiType) => {
        setConfig({ type })
        return { build: buildEndpoint }
      }
    }
  }

  // Pre-configured builders for common patterns
  const read = (version: ApiVersion = 'v1') => withType('read').withVersion(version)
  const aggr = (version: ApiVersion = 'v1') => withType('aggr').withVersion(version)
  const cmd = (version: ApiVersion = 'v1') => withType('cmd').withVersion(version)
  const auth = (version: ApiVersion = 'v1') => withType('auth').withVersion(version)
  const upload = (version: ApiVersion = 'v1') => withType('upload').withVersion(version)

  return {
    // Configuration management
    config: computed(() => config.value),
    setConfig,
    resetConfig,

    // Core building function
    build: buildEndpoint,

    // Type-based builders
    withType,
    withVersion,

    // Pre-configured builders
    read,
    aggr,
    cmd,
    auth,
    upload
  }
}

// Global API endpoint builder instance
export const apiEndpoint = useApiEndpoint()
