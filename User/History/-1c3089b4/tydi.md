# API Structure Optimizations

This document outlines the optimizations and improvements made to the API handling structure for better efficiency and maintainability.

## 🔴 Critical Issues Fixed

### 1. Router Usage in Response Interceptor

**Problem**: Using `useRouter()` in Axios interceptors caused runtime errors.

**Solution**:

- Created a router instance that can be set from the app
- Added fallback to `window.location.href` for navigation
- Set up router instance in `src/plugins/index.ts`

```typescript
// Before (❌ Broken)
const router = useRouter()
router.push('/auth/login')

// After (✅ Fixed)
let routerInstance: { push: (path: string) => void } | null = null
export const setRouterInstance = (router: { push: (path: string) => void }): void => {
  routerInstance = router
}
```

## 🟡 Performance Optimizations

### 2. Request Cancellation Support

**Added**: Automatic request cancellation to prevent race conditions and improve UX.

```typescript
// Usage in components
const { execute, cancel } = useApi({ autoCancel: true })

// Cancel specific request
apiService.cancelRequest('user-list-request')

// Cancel all requests
apiService.cancelAllRequests()
```

### 3. Automatic Retry Logic

**Added**: Exponential backoff retry for failed requests.

```typescript
// Automatically retries on 408, 429, 500, 502, 503, 504
// Configurable retry settings
const retryConfig = {
  maxRetries: 3,
  delay: 1000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
}
```

### 4. Centralized Loading State Management

**Added**: Global loading state manager to avoid duplicate loading states.

```typescript
// Before: Multiple loading states
const loading1 = ref(false)
const loading2 = ref(false)

// After: Centralized loading
const { setLoading, isLoading } = useLoadingState()
setLoading('auth', true)
const isAuthLoading = isLoading('auth')
```

## 🟢 Maintainability Improvements

### 5. Enhanced Error Handling

**Improved**: Better error typing and handling throughout the system.

```typescript
// Standardized error object
interface ApiError {
  message: string
  status: number
  code?: string
  details?: unknown
}
```

### 6. Simplified Service Structure

**Improved**: Cleaner base service with built-in retry and cancellation.

```typescript
// Enhanced base service with utilities
export const apiService = {
  get<T>(url, config?) { /* with retry and cancellation */ },
  post<T>(url, data?, config?) { /* with retry and cancellation */ },
  // ... other methods
  cancelRequest(requestId: string): void,
  cancelAllRequests(): void,
}
```

### 7. Enhanced useApi Composable

**Improved**: Added request cancellation and better lifecycle management.

```typescript
const { execute, cancel, reset } = useApi({
  autoCancel: true, // Auto-cancel on component unmount
  requestId: 'unique-request-id',
})
```

## 📊 Performance Benefits

### Before vs After Comparison

| Aspect               | Before       | After            | Improvement              |
| -------------------- | ------------ | ---------------- | ------------------------ |
| Request Cancellation | ❌ None      | ✅ Automatic     | Prevents race conditions |
| Retry Logic          | ❌ Manual    | ✅ Automatic     | Better reliability       |
| Loading States       | ❌ Duplicate | ✅ Centralized   | Cleaner state management |
| Error Handling       | ❌ Basic     | ✅ Comprehensive | Better UX                |
| Memory Leaks         | ⚠️ Possible  | ✅ Prevented     | Auto-cancellation        |

## 🚀 Usage Examples

### Optimized Component Usage

```vue
<template>
  <div>
    <Button @click="loadUsers" :loading="loading"> Load Users </Button>
    <Button @click="cancel">Cancel</Button>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import { userApi } from '@/api'

const { loading, error, execute, cancel } = useApi({
  autoCancel: true,
  onSuccess: (data) => console.log('Users loaded:', data),
  onError: (error) => console.error('Failed to load users:', error),
})

const loadUsers = () => {
  execute(() => userApi.getUsers())
}
</script>
```

### Optimized Store Usage

```typescript
import { useLoadingState } from '@/composables/useLoadingState'

export const useUserStore = defineStore('user', () => {
  const { setLoading, isLoading } = useLoadingState()

  const loading = computed(() => isLoading('users'))

  const loadUsers = async () => {
    setLoading('users', true)
    try {
      // API call
    } finally {
      setLoading('users', false)
    }
  }
})
```

## 🔧 Configuration Options

### Retry Configuration

```typescript
// Custom retry settings
const customRetry = createRetryableRequest(apiCall, {
  maxRetries: 5,
  delay: 2000,
  backoffMultiplier: 1.5,
  retryableStatuses: [500, 502, 503],
})
```

### Request Cancellation

```typescript
// Manual request ID
const requestId = 'user-profile-123'
const response = await apiService.get('/users/profile', { requestId })

// Cancel specific request
apiService.cancelRequest(requestId)
```

## 📈 Best Practices

### ✅ Do's

- Use `autoCancel: true` for component-level API calls
- Use centralized loading states for stores
- Implement proper error boundaries
- Use request IDs for complex operations
- Leverage retry logic for unreliable endpoints

### ❌ Don'ts

- Don't ignore request cancellation in long-running operations
- Don't create multiple loading states for the same operation
- Don't forget to handle component unmount scenarios
- Don't use router composables in interceptors

## 🔄 Migration Guide

### For Existing Components

1. Replace individual loading states with `useLoadingState()`
2. Add `autoCancel: true` to `useApi()` calls
3. Use request IDs for complex operations
4. Update error handling to use new `ApiError` interface

### For Existing Stores

1. Replace `ref(false)` loading states with `useLoadingState()`
2. Use computed properties for loading states
3. Implement proper cleanup in store actions

## 🎯 Future Enhancements

### Planned Improvements

1. **Request Caching**: Add intelligent caching for frequently accessed data
2. **Request Queuing**: Implement request queuing for rate limiting
3. **Offline Support**: Add offline request queuing and sync
4. **Performance Monitoring**: Add request timing and performance metrics
5. **GraphQL Support**: Add GraphQL client integration

### Monitoring and Analytics

```typescript
// Future: Request performance monitoring
const metrics = {
  requestTime: 150,
  retryCount: 2,
  cacheHit: false,
  status: 200,
}
```

This optimized structure provides a solid foundation for scalable, maintainable, and performant API handling in Vue 3 applications.
