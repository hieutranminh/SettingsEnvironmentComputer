# useConfig Composable

The `useConfig` composable provides reactive access to the application's runtime configuration. It loads configuration based on the current hostname and provides a clean API for accessing different configuration sections.

## Usage

```typescript
import { useConfig } from '@/composables/useConfig'

const {
  config,
  isLoading,
  error,
  isInitialized,
  isDevelopment,
  isStaging,
  isProduction,
  isDebugEnabled,
  initializeConfig,
  getApiConfig,
  getSecurityConfig,
  getThemeConfig,
  getFeatureFlags,
  getMonitoringConfig,
  getCustomizations,
} = useConfig()
```

## API

### Reactive State

- `config: ReadonlyRef<RuntimeConfig | null>` - The loaded configuration object
- `isLoading: ReadonlyRef<boolean>` - Whether configuration is currently loading
- `error: ReadonlyRef<string | null>` - Error message if configuration loading failed

### Computed Properties

- `isInitialized: ComputedRef<boolean>` - Whether configuration has been loaded
- `isDevelopment: ComputedRef<boolean>` - Whether running in development environment
- `isStaging: ComputedRef<boolean>` - Whether running in staging environment
- `isProduction: ComputedRef<boolean>` - Whether running in production environment
- `isDebugEnabled: ComputedRef<boolean>` - Whether debug mode is enabled

### Methods

- `initializeConfig(): Promise<boolean>` - Loads the runtime configuration
- `setConfig(configData: RuntimeConfig | null): void` - Manually set configuration
- `setError(errorMessage: string | null): void` - Set error message
- `clearError(): void` - Clear error message

### Getter Methods

- `getApiConfig(): RuntimeConfig['api'] | null` - Get API configuration
- `getSecurityConfig(): RuntimeConfig['security'] | null` - Get security configuration
- `getThemeConfig(): RuntimeConfig['theme'] | null` - Get theme configuration
- `getFeatureFlags(): RuntimeConfig['features'] | null` - Get feature flags
- `getMonitoringConfig(): RuntimeConfig['monitoring'] | null` - Get monitoring configuration
- `getCustomizations(): RuntimeConfig['customizations'] | null` - Get customizations

## Example

```vue
<template>
  <div>
    <div v-if="isLoading">Loading configuration...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="isInitialized">
      <h2>Configuration Loaded</h2>
      <p>Environment: {{ config?.environment }}</p>
      <p>API URL: {{ config?.api?.baseUrl }}</p>
      <p>Debug Mode: {{ isDebugEnabled ? 'Enabled' : 'Disabled' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from '@/composables/useConfig'

const { config, isLoading, error, isInitialized, isDebugEnabled } = useConfig()
</script>
```

## Initialization

The configuration is automatically initialized when the app starts in `main.ts`. The app waits for configuration to load before mounting.

## Error Handling

The composable provides comprehensive error handling:

- Loading states are properly managed
- Errors are captured and exposed reactively
- The app can gracefully handle configuration failures
- All methods return explicit types and handle null cases

## Functional Programming Approach

Following the project's functional programming principles:

- All functions have clear input/output contracts
- No hidden state changes
- Pure functions for configuration access
- Explicit error handling
- Immutable configuration access through readonly refs
