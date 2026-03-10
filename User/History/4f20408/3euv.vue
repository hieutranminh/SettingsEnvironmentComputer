<template>
  <div class="config-status">
    <div v-if="isLoading" class="loading">
      Loading configuration...
    </div>

    <div v-else-if="error" class="error">
      Configuration Error: {{ error }}
    </div>

    <div v-else-if="isInitialized" class="config-info">
      <h3>Configuration Status</h3>
      <div class="config-details">
        <p><strong>Environment:</strong> {{ config?.environment }}</p>
        <p><strong>Debug Mode:</strong> {{ isDebugEnabled ? 'Enabled' : 'Disabled' }}</p>
        <p><strong>API Base URL:</strong> {{ config?.api?.baseUrl }}</p>
        <p><strong>API Timeout:</strong> {{ config?.api?.timeout }}ms</p>
        <p><strong>JWT Expiration:</strong> {{ config?.security?.jwtExpiration }}s</p>
      </div>
    </div>

    <div v-else class="not-initialized">
      Configuration not initialized
      <pre>{{  config  }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from '@/composables/useConfig'

const {
  config,
  isLoading,
  error,
  isInitialized,
  isDebugEnabled
} = useConfig()

console.log('config', isInitialized.value)
</script>

<style scoped>
.config-status {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 1rem 0;
}

.loading {
  color: #666;
  font-style: italic;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.5rem;
  border-radius: 4px;
}

.config-info {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
}

.config-info h3 {
  margin-top: 0;
  color: #333;
}

.config-details p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.not-initialized {
  color: #666;
  font-style: italic;
}
</style>
