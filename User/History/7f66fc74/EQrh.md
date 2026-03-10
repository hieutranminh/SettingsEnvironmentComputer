# Flexible API Guide

This guide explains how to use the new flexible API system that automatically handles API types (read, cmd, aggr) and versions (v1, v2, v3) dynamically.

## Overview

The flexible API system provides multiple ways to make API calls without manually specifying the type and version in every endpoint. Instead of writing:

```typescript
// Old way - manual specification
apiPost<Goods>('cmd/v1/goods', data)
```

You can now use:

```typescript
// New way - automatic type/version handling
apiCmd.post<Goods>('goods', data)
```

## API Types and Versions

### Supported API Types

- `read` - Read operations (default)
- `cmd` - Command operations
- `aggr` - Aggregate operations
- `auth` - Authentication operations
- `upload` - File upload operations

### Supported API Versions

- `v1` - Version 1 (default)
- `v2` - Version 2
- `v3` - Version 3

## Usage Methods

### Method 1: Convenience Objects (Recommended)

Use the convenience objects for specific API types:

```typescript
import { apiCmd, apiRead, apiAggr } from '@/services/api'

// Command operations
const createGoods = await apiCmd.post<Goods>('goods', goodsData)
const updateGoods = await apiCmd.put<Goods>(`goods/${id}`, updateData)
const deleteGoods = await apiCmd.delete<void>(`goods/${id}`)

// Read operations
const getGoods = await apiRead.get<Goods>(`goods/${id}`)
const listGoods = await apiRead.get<Goods[]>('goods')

// Aggregate operations
const aggregatedData = await apiAggr.get<AggregatedGoods>('goods/analytics')
```

### Method 2: Enhanced API Service with Configuration

Use the enhanced API service with explicit configuration:

```typescript
import { apiGet, apiPost } from '@/services/api'
import { API_TYPES, API_VERSIONS } from '@/constants/apiEndpoints'

// With explicit configuration
const response = await apiGet<Goods>('goods/123', {
  type: API_TYPES.COMMAND,
  version: API_VERSIONS.V2,
})

// With default configuration (read/v1)
const response = await apiGet<Goods>('goods/123')
```

### Method 3: Composable with Reactive Configuration

Use the `useApi` composable for reactive API configuration:

```typescript
import { useApi } from '@/composables/useApi'

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
  clearError,
} = useApi()

// Dynamic configuration
const response = await get<Goods>('goods/123') // Uses currentApiType and currentApiVersion

// Or use convenience objects
const response = await cmd.get<Goods>('goods/123') // Always uses cmd type
```

### Method 4: Updated Service Layer

Update your existing service files to use the new approach:

```typescript
// Before
import { apiPost, apiPut, apiPatch, apiDelete } from '../api'

export const goodsCmdService = {
  create: async (data: CreateGoodsRequest) => {
    return await apiPost<Goods>('/cmd/v1/goods', data)
  },
}

// After
import { apiCmd } from '../api'

export const goodsCmdService = {
  create: async (data: CreateGoodsRequest) => {
    return await apiCmd.post<Goods>('goods', data)
  },
}
```

## Migration Guide

### Step 1: Update API Service Imports

Replace your existing API imports:

```typescript
// Old
import { apiPost, apiPut, apiPatch, apiDelete } from '@/services/api'

// New
import { apiCmd, apiRead, apiAggr } from '@/services/api'
```

### Step 2: Update Service Method Calls

Update your service methods to use the new approach:

```typescript
// Old
create: async (data: CreateGoodsRequest) => {
  return await apiPost<Goods>('/cmd/v1/goods', data)
}

// New
create: async (data: CreateGoodsRequest) => {
  return await apiCmd.post<Goods>('goods', data)
}
```

### Step 3: Remove Manual Type/Version from Endpoints

Remove the manual type and version from your endpoints:

```typescript
// Old
'cmd/v1/goods'
'read/v2/goods/123'
'aggr/v3/goods/analytics'

// New
'goods'
'goods/123'
'goods/analytics'
```

## Benefits

1. **Cleaner Code**: No need to repeat type/version in every endpoint
2. **Type Safety**: TypeScript ensures correct API type usage
3. **Consistency**: Standardized approach across the application
4. **Flexibility**: Easy to switch between API types and versions
5. **Maintainability**: Centralized configuration management

## Examples

### Complete Service Example

```typescript
import { apiCmd, apiRead, apiAggr } from '@/services/api'
import type { ApiResponse } from '@/types/ApiResponse'
import type { Goods } from './goods.read'

export interface CreateGoodsRequest {
  name: string
  price: number
  category: string
  stockQuantity: number
}

export const goodsService = {
  // Command operations
  create: async (data: CreateGoodsRequest): Promise<ApiResponse<Goods>> => {
    return await apiCmd.post<Goods>('goods', data)
  },

  update: async (id: string, data: Partial<CreateGoodsRequest>): Promise<ApiResponse<Goods>> => {
    return await apiCmd.put<Goods>(`goods/${id}`, data)
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return await apiCmd.delete<void>(`goods/${id}`)
  },

  // Read operations
  getById: async (id: string): Promise<ApiResponse<Goods>> => {
    return await apiRead.get<Goods>(`goods/${id}`)
  },

  getList: async (): Promise<ApiResponse<Goods[]>> => {
    return await apiRead.get<Goods[]>('goods')
  },

  // Aggregate operations
  getAnalytics: async (): Promise<ApiResponse<GoodsAnalytics>> => {
    return await apiAggr.get<GoodsAnalytics>('goods/analytics')
  },
}
```

### Component Usage Example

```typescript
<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { goodsService } from '@/services/goods/goods.service'

const { isLoading, error, cmd, read } = useApi()
const goods = ref<Goods[]>([])

const loadGoods = async () => {
  try {
    const response = await read.get<Goods[]>('goods')
    goods.value = response.data
  } catch (err) {
    console.error('Failed to load goods:', err)
  }
}

const createGoods = async (goodsData: CreateGoodsRequest) => {
  try {
    const response = await cmd.post<Goods>('goods', goodsData)
    await loadGoods() // Reload the list
    return response
  } catch (err) {
    console.error('Failed to create goods:', err)
  }
}
</script>
```

## Configuration

### Default Configuration

The default API configuration is:

- Type: `read`
- Version: `v1`

You can change this in `src/constants/apiEndpoints.ts`:

```typescript
export const DEFAULT_API_CONFIG = {
  type: API_TYPES.READ,
  version: API_VERSIONS.V1,
} as const
```

### Environment-Specific Configuration

You can set different defaults based on environment:

```typescript
// In your API service
const getDefaultConfig = (): ApiConfig => {
  if (import.meta.env.PROD) {
    return { type: API_TYPES.READ, version: API_VERSIONS.V2 }
  }
  return { type: API_TYPES.READ, version: API_VERSIONS.V1 }
}
```

## Best Practices

1. **Use Convenience Objects**: Prefer `apiCmd`, `apiRead`, `apiAggr` over manual configuration
2. **Keep Endpoints Simple**: Don't include type/version in endpoint strings
3. **Use TypeScript**: Leverage TypeScript for type safety
4. **Consistent Naming**: Use consistent naming patterns across your services
5. **Error Handling**: Always handle errors appropriately
6. **Loading States**: Use the composable's loading state for better UX

## Troubleshooting

### Common Issues

1. **Endpoint Not Found**: Make sure you're using the correct API type for your endpoint
2. **Version Mismatch**: Ensure the API version exists on the backend
3. **Type Errors**: Check that your TypeScript types match the API response

### Debugging

Enable debug logging to see the full endpoint being constructed:

```typescript
// Add this to your API service for debugging
const buildEndpoint = (endpoint: string, config?: ApiConfig): string => {
  const { type = DEFAULT_API_CONFIG.type, version = DEFAULT_API_CONFIG.version } = config || {}
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  const fullEndpoint = `/${type}/${version}/${cleanEndpoint}`

  console.log('API Call:', fullEndpoint) // Debug log
  return fullEndpoint
}
```
