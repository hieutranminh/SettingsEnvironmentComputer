# Flexible API Endpoint System

This guide explains how to use the new flexible API endpoint system that allows you to dynamically specify API types (read, aggr, cmd, auth, upload) and versions (v1, v2, v3) when making API calls.

## Overview

The system provides multiple ways to construct API endpoints with different types and versions:

1. **Pre-configured builders** - Easy-to-use methods for common API patterns
2. **Enhanced API methods** - Methods that accept type and version parameters
3. **Endpoint builder composable** - Flexible composable for dynamic endpoint construction

## Quick Start

### Method 1: Using Pre-configured Builders (Recommended)

```typescript
import { apiRead, apiAggr, apiCmd } from '@/services/api'

// Read operations (defaults to v1)
const goods = await apiRead.get<Goods[]>('goods')
const goodsV2 = await apiRead.get<Goods[]>('goods', 'v2')

// Aggregate operations
const stats = await apiAggr.get<{ total: number }>('goods/stats')

// Command operations
const newGoods = await apiCmd.post<Goods>('goods', { name: 'Product' })
const updatedGoods = await apiCmd.put<Goods>('goods/123', { name: 'Updated Product' })
const deletedGoods = await apiCmd.delete<void>('goods/123')
```

### Method 2: Using Enhanced API Methods

```typescript
import { apiPostWithType, apiGetWithType } from '@/services/api'

// Explicitly specify type and version
const goods = await apiPostWithType<Goods>('goods', data, 'cmd', 'v1')
const goodsList = await apiGetWithType<Goods[]>('goods', 'read', 'v2')
```

### Method 3: Using the Endpoint Builder

```typescript
import { apiEndpoint } from '@/services/api'

// Build endpoint with specific type and version
const endpoint = apiEndpoint.withType('cmd').withVersion('v1').build('goods')
// Result: '/api/cmd/v1/goods'

// Use with existing API methods
const response = await apiPost<Goods>(endpoint, data)
```

## API Types

- **`read`** - Read operations (GET, POST for search)
- **`aggr`** - Aggregate operations (statistics, summaries)
- **`cmd`** - Command operations (CREATE, UPDATE, DELETE)
- **`auth`** - Authentication operations
- **`upload`** - File upload operations

## API Versions

- **`v1`** - Version 1 (default)
- **`v2`** - Version 2
- **`v3`** - Version 3

## Usage Examples

### In Vue Components

```vue
<script setup lang="ts">
import { apiCmd, apiRead } from '@/services/api'
import type { Goods } from '@/services/goods/goods.read'

const handleCreateGoods = async (data: CreateGoodsRequest) => {
  try {
    const response = await apiCmd.post<Goods>('goods', data)
    return response.data
  } catch (error) {
    console.error('Failed to create goods:', error)
  }
}

const handleGetGoods = async () => {
  try {
    const response = await apiRead.get<Goods[]>('goods', 'v2')
    return response.data
  } catch (error) {
    console.error('Failed to get goods:', error)
  }
}
</script>
```

### In Service Files

```typescript
// src/services/goods/goods.cmd.ts
import { apiCmd } from '../api'

export const goodsCmdService = {
  create: async (data: CreateGoodsRequest): Promise<ApiResponse<Goods>> => {
    return await apiCmd.post<Goods>('goods', data)
  },

  update: async (id: string, data: UpdateGoodsRequest): Promise<ApiResponse<Goods>> => {
    return await apiCmd.put<Goods>(`goods/${id}`, data)
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return await apiCmd.delete<void>(`goods/${id}`)
  },
}
```

### Dynamic Configuration

```typescript
import { apiEndpoint } from '@/services/api'

// Change default configuration
apiEndpoint.setConfig({ type: 'read', version: 'v2' })

// All subsequent calls will use read/v2
const endpoint = apiEndpoint.build('goods') // '/api/read/v2/goods'

// Reset to defaults
apiEndpoint.resetConfig()
```

## Migration from Old System

### Before (Manual path construction)

```typescript
// Old way
const response = await apiPost<Goods>('/api/cmd/v1/goods', data)
```

### After (Using new system)

```typescript
// New way - Option 1: Pre-configured builder
const response = await apiCmd.post<Goods>('goods', data)

// New way - Option 2: Enhanced method
const response = await apiPostWithType<Goods>('goods', data, 'cmd', 'v1')

// New way - Option 3: Endpoint builder
const endpoint = apiEndpoint.withType('cmd').withVersion('v1').build('goods')
const response = await apiPost<Goods>(endpoint, data)
```

## Benefits

1. **Type Safety** - TypeScript support for API types and versions
2. **Consistency** - Standardized endpoint construction across the application
3. **Flexibility** - Easy to switch between different API types and versions
4. **Maintainability** - Centralized endpoint configuration
5. **Developer Experience** - IntelliSense support and autocomplete

## Best Practices

1. **Use pre-configured builders** for common operations (apiRead, apiCmd, apiAggr)
2. **Use enhanced methods** when you need explicit control over type and version
3. **Use the endpoint builder** for complex or dynamic endpoint construction
4. **Set default configuration** at the application level if needed
5. **Keep service files organized** by API type (cmd, read, aggr)

## Configuration

The default configuration can be modified:

```typescript
import { apiEndpoint } from '@/services/api'

// Set global defaults
apiEndpoint.setConfig({
  type: 'read',
  version: 'v2',
  basePath: '/api',
})
```

This configuration will be used for all subsequent API calls unless overridden.
