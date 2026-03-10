# Custom Branch Type API Integration

## Overview

This document describes the integration of the new Custom Branch Type API endpoint (`/api/read/v1/admins/CustomBranchType`) into the Vue.js application.

## API Endpoint

- **URL**: `/api/read/v1/admins/CustomBranchType`
- **Method**: POST
- **Request Payload**: `{"chainId": number}`
- **Response**: Array of custom branch types with `id`, `name`, and `chainId` properties

## Implementation Details

### 1. Types (`src/types/branch/CustomBranchType.ts`)

```typescript
export interface CustomBranchType {
  id: number
  name: string
  chainId: number
}

export interface CustomBranchTypeResponse {
  items: CustomBranchType[]
}

export interface CustomBranchTypeRequest {
  chainId: number
}
```

### 2. Composable (`src/composables/useCustomBranchTypes.ts`)

The `useCustomBranchTypes` composable provides:

- `fetchCustomBranchTypes(chainId: number)`: Fetches custom branch types from the API
- `branchTypeOptions`: Computed property that returns formatted options for Select components
- `isLoading`: Loading state indicator
- `error`: Error state for handling API errors
- `getBranchTypeById(id: number)`: Helper function to find a branch type by ID

### 3. Component Integration (`src/views/branch/branch-sales/partials/BranchSalesFilter.vue`)

The BranchSalesFilter component now:

- Accepts a `chainId` prop
- Uses the `useCustomBranchTypes` composable
- Automatically fetches custom branch types on component mount
- Displays loading state in the Select component
- Provides "All Types" option with value -1

### 4. Parent Component (`src/views/branch/branch-sales/BranchSalesView.vue`)

The parent component:

- Imports the auth store to get the current `chainId`
- Passes the `chainId` prop to the BranchSalesFilter component

## Usage Example

```vue
<template>
  <BranchSalesFilter 
    v-model="filters" 
    :chainId="shop.chainId" 
  />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth/auth'

const authStore = useAuthStore()
const { shop } = authStore
</script>
```

## API Constants

The endpoint is defined in `src/constants/apiEndpoints.ts`:

```typescript
export const API_ENDPOINTS = {
  ADMINS: {
    CUSTOM_BRANCH_TYPE: '/admins/CustomBranchType',
  },
  // ... other endpoints
}
```

## Error Handling

The integration includes comprehensive error handling:

- Network errors are caught and displayed
- API response errors are handled gracefully
- Loading states are properly managed
- Error messages are user-friendly

## Testing

To test the integration:

1. Ensure the user is authenticated and has a valid `chainId`
2. Navigate to the Branch Sales page
3. The Branch Type dropdown should populate with data from the API
4. Verify that the "All Types" option is available
5. Test the loading state by checking the network tab

## Future Enhancements

Potential improvements:

- Add caching for custom branch types
- Implement retry logic for failed requests
- Add unit tests for the composable
- Consider implementing optimistic updates