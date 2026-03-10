# API Structure Documentation

This document outlines the clean and scalable API handling structure implemented for the Vue 3 project using Axios, TypeScript, and functional programming principles.

## Architecture Overview

The API structure follows a modular, function-based approach with clear separation of concerns:

```
src/
├── api/
│   ├── axios.ts                 # Main Axios instance
│   ├── interceptors/
│   │   ├── request.ts          # Request interceptors (auth, logging)
│   │   └── response.ts         # Response interceptors (error handling, 401 redirect)
│   ├── services/
│   │   ├── base.ts             # Base API service functions
│   │   ├── auth.ts             # Authentication API
│   │   └── user.ts             # User management API
│   └── index.ts                # Main exports
├── types/
│   └── api.ts                  # API-related TypeScript interfaces
└── composables/
    └── useApi.ts               # Vue composable for API usage
```

## Key Features

### ✅ Function-Based Architecture

- No class-based wrappers
- Pure functions with clear input/output
- Easy to test and maintain

### ✅ Separated Interceptors

- **Request Interceptors**: Handle authentication tokens, logging
- **Response Interceptors**: Global error handling, 401 auto-redirect

### ✅ Type Safety

- Strict TypeScript interfaces
- Generic API responses
- Proper error typing

### ✅ Scalable Structure

- Modular service files for different endpoints
- Easy to add new API modules
- Consistent patterns across services

## Usage Examples

### 1. Using in Vue Components

```vue
<template>
  <div>
    <Button @click="handleLogin" :loading="loading"> Login </Button>
    <div v-if="error">{{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '@/composables/useApi'
import { authApi, type LoginCredentials } from '@/api'

const { loading, error, execute } = useApi({
  onSuccess: (data) => {
    console.log('Login successful:', data)
  },
  onError: (apiError) => {
    console.error('Login failed:', apiError.message)
  },
})

const handleLogin = async () => {
  const credentials: LoginCredentials = {
    email: 'user@example.com',
    password: 'password123',
  }

  await execute(() => authApi.login(credentials))
}
</script>
```

### 2. Using in Pinia Stores

```typescript
import { defineStore } from 'pinia'
import { authApi, type LoginCredentials } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    try {
      const response = await authApi.login(credentials)
      user.value = response.data.user
      return response.data
    } finally {
      loading.value = false
    }
  }

  return { user, loading, login }
})
```

### 3. Direct API Service Usage

```typescript
import { apiService } from '@/api'

// GET request
const users = await apiService.get<User[]>('/users')

// POST request
const newUser = await apiService.post<User>('/users', userData)

// PUT request
const updatedUser = await apiService.put<User>(`/users/${id}`, updateData)

// DELETE request
await apiService.delete(`/users/${id}`)

// Paginated request
const paginatedUsers = await apiService.getPaginated<User>('/users', 1, 10)
```

## API Service Structure

### Base Service (`src/api/services/base.ts`)

Provides common HTTP methods with consistent error handling:

- `get<T>(url, config?)` - GET requests
- `post<T>(url, data?, config?)` - POST requests
- `put<T>(url, data?, config?)` - PUT requests
- `patch<T>(url, data?, config?)` - PATCH requests
- `delete<T>(url, config?)` - DELETE requests
- `getPaginated<T>(url, page, limit, config?)` - Paginated GET requests

### Auth Service (`src/api/services/auth.ts`)

Authentication-specific API calls:

```typescript
export const authApi = {
  login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>>
  register(data: RegisterData): Promise<ApiResponse<LoginResponse>>
  logout(): Promise<ApiResponse<void>>
  forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>>
  resetPassword(data: ResetPasswordData): Promise<ApiResponse<void>>
  refreshToken(): Promise<ApiResponse<{ token: string }>>
  getProfile(): Promise<ApiResponse<User>>
}
```

### User Service (`src/api/services/user.ts`)

User management API calls:

```typescript
export const userApi = {
  getUsers(page, limit, filters?): Promise<ApiResponse<PaginatedResponse<User>>>
  getUser(id: string): Promise<ApiResponse<User>>
  createUser(data: CreateUserData): Promise<ApiResponse<User>>
  updateUser(id: string, data: UpdateUserData): Promise<ApiResponse<User>>
  deleteUser(id: string): Promise<ApiResponse<void>>
  updateProfile(data: UpdateUserData): Promise<ApiResponse<User>>
  changePassword(data: ChangePasswordData): Promise<ApiResponse<void>>
}
```

## Interceptors

### Request Interceptor (`src/api/interceptors/request.ts`)

- Automatically adds Bearer token to Authorization header
- Logs requests in development mode
- Handles request-level errors

### Response Interceptor (`src/api/interceptors/response.ts`)

- Global error handling for different HTTP status codes
- Automatic 401 redirect to login page
- Standardized error object creation
- Development logging

## Error Handling

The API structure provides comprehensive error handling:

```typescript
interface ApiError {
  message: string
  status: number
  code?: string
  details?: unknown
}
```

Common error scenarios handled:

- **401 Unauthorized**: Auto-redirect to login, clear token
- **403 Forbidden**: Log access denied
- **404 Not Found**: Log resource not found
- **422 Validation Errors**: Handle form validation errors
- **500+ Server Errors**: Log server issues

## Adding New API Services

To add a new API service (e.g., for products):

1. Create `src/api/services/product.ts`:

```typescript
import { apiService } from './base'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface Product {
  id: string
  name: string
  price: number
  // ... other properties
}

export const productApi = {
  async getProducts(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return apiService.getPaginated<Product>('/products', page, limit)
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiService.get<Product>(`/products/${id}`)
  },

  // ... other methods
}
```

2. Export from `src/api/index.ts`:

```typescript
export { productApi } from './services/product'
export type { Product } from './services/product'
```

## Best Practices

### ✅ Do's

- Use the `useApi` composable for component-level API calls
- Use typed interfaces for all API responses
- Handle loading and error states properly
- Use the `skipAuth` option for public endpoints
- Implement proper error boundaries

### ❌ Don'ts

- Don't use class-based API wrappers
- Don't ignore error handling
- Don't use `any` types for API responses
- Don't hardcode API URLs in components
- Don't forget to handle loading states

## Configuration

The API base URL is configured in `src/config/app.ts`:

```typescript
export const appConfig: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  // ... other config
}
```

Set the environment variable in your `.env` file:

```
VITE_API_BASE_URL=https://api.example.com
```

## Testing

The function-based architecture makes testing straightforward:

```typescript
import { authApi } from '@/api'
import { vi } from 'vitest'

// Mock the API client
vi.mock('@/api/axios', () => ({
  apiClient: {
    post: vi.fn(),
  },
}))

test('login should return user data', async () => {
  // Test implementation
})
```

This structure provides a solid foundation for building scalable, maintainable Vue 3 applications with robust API handling.
