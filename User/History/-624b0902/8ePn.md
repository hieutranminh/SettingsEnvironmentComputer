# CustomBranchType API Integration

This document describes the integration of the new `/api/read/v1/admins/CustomBranchType` endpoint into the Vue.js application.

## Overview

The CustomBranchType API has been integrated following the established patterns in the codebase:

- **API Type**: `read` (from `/api/read/v1/`)
- **Domain**: `admins` (from the third path segment)
- **Endpoint**: `CustomBranchType`

## Files Created/Modified

### 1. Types (`src/types/branch/CustomBranchType.ts`)
```typescript
export interface CustomBranchType {
  id: number
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomBranchTypeListResponse {
  customBranchTypes: CustomBranchType[]
  totalCount: number
}

export interface CustomBranchTypeFilter {
  isActive?: boolean
  search?: string
}
```

### 2. Service (`src/services/admins/admins.read.ts`)
```typescript
import { apiRead } from '@/services/api'
import type { ApiResponse } from '@/types/ApiResponse'
import type { CustomBranchType, CustomBranchTypeListResponse, CustomBranchTypeFilter } from '@/types/branch/CustomBranchType'

export const adminsReadService = {
  getCustomBranchTypes: async (filter?: CustomBranchTypeFilter): Promise<ApiResponse<CustomBranchTypeListResponse>> => {
    // Implementation
  },
  
  getCustomBranchTypeById: async (id: number): Promise<ApiResponse<CustomBranchType>> => {
    // Implementation
  },
  
  getActiveCustomBranchTypes: async (): Promise<ApiResponse<CustomBranchTypeListResponse>> => {
    // Implementation
  },
}
```

### 3. Composable (`src/composables/useCustomBranchType.ts`)
```typescript
export const useCustomBranchType = () => {
  // Reactive state
  const customBranchTypes = ref<CustomBranchType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Computed properties
  const activeCustomBranchTypes = computed(() => 
    customBranchTypes.value.filter(type => type.isActive)
  )
  
  const customBranchTypeOptions = computed(() => 
    customBranchTypes.value.map(type => ({
      label: type.name,
      value: type.id,
    }))
  )
  
  // Methods
  const fetchCustomBranchTypes = async (filter?: CustomBranchTypeFilter): Promise<void> => {
    // Implementation
  }
  
  // ... other methods
  
  return {
    customBranchTypes,
    loading,
    error,
    activeCustomBranchTypes,
    customBranchTypeOptions,
    fetchCustomBranchTypes,
    // ... other exports
  }
}
```

### 4. API Endpoints (`src/constants/apiEndpoints.ts`)
```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  
  ADMINS: {
    CUSTOM_BRANCH_TYPE: '/admins/CustomBranchType',
    CUSTOM_BRANCH_TYPE_BY_ID: (id: number) => `/admins/CustomBranchType/${id}`,
  },
  
  // ... other endpoints
}
```

### 5. Component Integration (`src/views/branch/branch-sales/partials/BranchSalesFilter.vue`)
The BranchSalesFilter component has been updated to use the real API instead of hardcoded options.

## Usage Examples

### Basic Usage in a Component
```vue
<template>
  <div>
    <Select
      v-model="selectedBranchType"
      :options="branchTypeOptions"
      placeholder="Select Branch Type"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import { useCustomBranchType } from '@/composables/useCustomBranchType'

const {
  customBranchTypeOptions,
  loading,
  error,
  fetchActiveCustomBranchTypes,
} = useCustomBranchType()

const selectedBranchType = ref(-1)

// Load data on component mount
onMounted(async () => {
  await fetchActiveCustomBranchTypes()
})
</script>
```

### Direct Service Usage
```typescript
import { adminsReadService } from '@/services/admins/admins.read'

// Get all custom branch types
const response = await adminsReadService.getCustomBranchTypes()

// Get active custom branch types only
const activeResponse = await adminsReadService.getActiveCustomBranchTypes()

// Get specific branch type by ID
const branchType = await adminsReadService.getCustomBranchTypeById(1)
```

### With Filtering
```typescript
import { useCustomBranchType } from '@/composables/useCustomBranchType'

const { fetchCustomBranchTypes } = useCustomBranchType()

// Fetch with filters
await fetchCustomBranchTypes({
  isActive: true,
  search: 'salon'
})
```

## API Endpoint Details

- **URL**: `/api/read/v1/admins/CustomBranchType`
- **Method**: GET
- **Authentication**: Required
- **Response Format**: Standard API response with `isOK`, `result`, and `message` fields

### Query Parameters
- `isActive` (boolean, optional): Filter by active status
- `search` (string, optional): Search by name or description

### Response Structure
```typescript
{
  isOK: boolean
  result: {
    customBranchTypes: CustomBranchType[]
    totalCount: number
  }
  message?: string
}
```

## Error Handling

The integration includes comprehensive error handling:

1. **Service Level**: API errors are caught and returned with proper error messages
2. **Composable Level**: Loading states and error states are managed reactively
3. **Component Level**: Loading indicators and error displays are supported

## Testing

To test the integration:

1. Ensure the backend API endpoint is available
2. Check that authentication is properly configured
3. Verify the response format matches the expected structure
4. Test error scenarios (network errors, invalid responses, etc.)

## Future Enhancements

Potential improvements for the future:

1. Add caching for frequently accessed data
2. Implement pagination for large datasets
3. Add real-time updates using WebSocket
4. Create additional CRUD operations (create, update, delete)
5. Add bulk operations support