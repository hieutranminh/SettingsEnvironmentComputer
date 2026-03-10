<template>
  <div class="api-usage-example">
    <h2>Flexible API Usage Examples</h2>

    <!-- API Configuration -->
    <div class="api-config">
      <h3>API Configuration</h3>
      <div class="config-controls">
                <label>
          API Type:
          <select v-model="currentApiType">
            <option value="read">Read</option>
            <option value="cmd">Command</option>
            <option value="aggr">Aggregate</option>
          </select>
        </label>

        <label>
          API Version:
          <select v-model="currentApiVersion">
            <option value="v1">v1</option>
            <option value="v2">v2</option>
            <option value="v3">v3</option>
          </select>
        </label>
      </div>

      <p>Current endpoint pattern: <code>/{{ currentApiType }}/{{ currentApiVersion }}/endpoint</code></p>
    </div>

    <!-- Method 1: Using the composable with dynamic configuration -->
    <div class="method-section">
      <h3>Method 1: Dynamic Configuration</h3>
      <p>Uses the composable with reactive API type and version</p>

      <div class="button-group">
        <button @click="handleGetGoods" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Get Goods (Dynamic)' }}
        </button>
        <button @click="handleCreateGoods" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Create Goods (Dynamic)' }}
        </button>
      </div>
    </div>

    <!-- Method 2: Using convenience objects -->
    <div class="method-section">
      <h3>Method 2: Convenience Objects</h3>
      <p>Direct access to specific API types</p>

      <div class="button-group">
        <button @click="handleCmdGet" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Get Goods (CMD)' }}
        </button>
        <button @click="handleReadGet" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Get Goods (READ)' }}
        </button>
        <button @click="handleAggrGet" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Get Goods (AGGR)' }}
        </button>
      </div>
    </div>

    <!-- Method 3: Using the enhanced API service directly -->
    <div class="method-section">
      <h3>Method 3: Direct API Service</h3>
      <p>Using the enhanced API service with explicit configuration</p>

      <div class="button-group">
        <button @click="handleDirectApi" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Get Goods (Direct)' }}
        </button>
        <button @click="handleCustomConfig" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Get Goods (Custom Config)' }}
        </button>
      </div>
    </div>

    <!-- Method 4: Using the updated goods service -->
    <div class="method-section">
      <h3>Method 4: Updated Service Layer</h3>
      <p>Using the updated goods command service</p>

      <div class="button-group">
        <button @click="handleGoodsService" :disabled="isLoading">
          {{ isLoading ? 'Loading...' : 'Create Goods (Service)' }}
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-if="error" class="error">
      <h3>Error</h3>
      <p>{{ error }}</p>
      <button @click="clearError">Clear Error</button>
    </div>

    <div v-if="lastResponse" class="results">
      <h3>Last Response</h3>
      <pre>{{ JSON.stringify(lastResponse, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { apiGet } from '@/services/api'
import { goodsCmdService } from '@/services/goods/goods.cmd'
import { API_TYPES, API_VERSIONS } from '@/constants/apiEndpoints'
import type { ApiResponse } from '@/types/ApiResponse'

// Example data type
interface Goods {
  id: string
  name: string
  price: number
  category: string
}

// Use the API composable
const {
  isLoading,
  error,
  currentApiType,
  currentApiVersion,
  get,
  post,
  cmd,
  read,
  aggr,
  clearError
} = useApi()

// Local state
const lastResponse = ref<ApiResponse<Goods> | null>(null)

// Method 1: Dynamic configuration
const handleGetGoods = async () => {
  try {
    const response = await get<Goods>('goods/123')
    lastResponse.value = response
  } catch (err) {
    console.error('Error getting goods:', err)
  }
}

const handleCreateGoods = async () => {
  try {
    const goodsData = {
      name: 'Sample Product',
      price: 99.99,
      category: 'Electronics',
      stockQuantity: 10
    }
    const response = await post<Goods>('goods', goodsData)
    lastResponse.value = response
  } catch (err) {
    console.error('Error creating goods:', err)
  }
}

// Method 2: Convenience objects
const handleCmdGet = async () => {
  try {
    const response = await cmd.get<Goods>('goods/123')
    lastResponse.value = response
  } catch (err) {
    console.error('Error getting goods (CMD):', err)
  }
}

const handleReadGet = async () => {
  try {
    const response = await read.get<Goods>('goods/123')
    lastResponse.value = response
  } catch (err) {
    console.error('Error getting goods (READ):', err)
  }
}

const handleAggrGet = async () => {
  try {
    const response = await aggr.get<Goods>('goods/123')
    lastResponse.value = response
  } catch (err) {
    console.error('Error getting goods (AGGR):', err)
  }
}

// Method 3: Direct API service
const handleDirectApi = async () => {
  try {
    const response = await apiGet<Goods>('goods/123', {
      type: API_TYPES.COMMAND,
      version: API_VERSIONS.V2
    })
    lastResponse.value = response
  } catch (err) {
    console.error('Error getting goods (Direct):', err)
  }
}

const handleCustomConfig = async () => {
  try {
    const response = await apiGet<Goods>('goods/123', {
      type: API_TYPES.AGGREGATE,
      version: API_VERSIONS.V3
    })
    lastResponse.value = response
  } catch (err) {
    console.error('Error getting goods (Custom Config):', err)
  }
}

// Method 4: Updated service layer
const handleGoodsService = async () => {
  try {
    const goodsData = {
      name: 'Service Product',
      price: 149.99,
      category: 'Home & Garden',
      stockQuantity: 5
    }
    const response = await goodsCmdService.create(goodsData)
    lastResponse.value = response
  } catch (err) {
    console.error('Error creating goods (Service):', err)
  }
}
</script>

<style scoped>
.api-usage-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.api-config {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.config-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.config-controls label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.config-controls select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.method-section {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.results {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.results pre {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
}

code {
  background: #e9ecef;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}
</style>
