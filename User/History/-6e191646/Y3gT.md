# TypeScript Patterns

## Type Definition Guidelines

### Interface vs Type

```typescript
// Use INTERFACE for object shapes (extensible)
interface User {
  id: string
  name: string
  email: string
}

interface AdminUser extends User {
  permissions: string[]
}

// Use TYPE for unions, aliases, mapped types
type Status = 'pending' | 'active' | 'inactive'
type Nullable<T> = T | null
type UserRole = 'admin' | 'user' | 'guest'
```

### Discriminated Unions

```typescript
// ✅ GOOD: Discriminated unions for complex states
interface LoadingState {
  status: 'loading'
}

interface SuccessState<T> {
  status: 'success'
  data: T
}

interface ErrorState {
  status: 'error'
  error: Error
}

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState

// Usage with type narrowing
function handleState<T>(state: AsyncState<T>): void {
  switch (state.status) {
    case 'loading':
      // state is LoadingState
      showSpinner()
      break
    case 'success':
      // state is SuccessState<T>
      displayData(state.data)
      break
    case 'error':
      // state is ErrorState
      showError(state.error.message)
      break
  }
}
```

### Generic Constraints

```typescript
// ✅ GOOD: Constrained generics
interface HasId {
  id: string
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}

// ✅ GOOD: Multiple constraints
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b }
}
```

## Function Typing

### Explicit Return Types

```typescript
// ❌ BAD: Implicit return type
function calculate(a: number, b: number) {
  return a + b
}

// ✅ GOOD: Explicit return type
function calculate(a: number, b: number): number {
  return a + b
}

// ✅ GOOD: Async function
async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`)
  return response.data
}

// ✅ GOOD: Function that might return null
function findUser(id: string): User | null {
  return users.find((u) => u.id === id) ?? null
}
```

### Function Types

```typescript
// ✅ GOOD: Type alias for function signatures
type Predicate<T> = (item: T) => boolean
type Comparator<T> = (a: T, b: T) => number
type AsyncHandler<T, R> = (data: T) => Promise<R>

// Usage
const isActive: Predicate<User> = (user) => user.status === 'active'
```

### Callback Types

```typescript
// ✅ GOOD: Typed callbacks
interface FetchOptions<T> {
  onSuccess: (data: T) => void
  onError: (error: Error) => void
  onFinally?: () => void
}

function fetchData<T>(url: string, options: FetchOptions<T>): void {
  fetch(url)
    .then((res) => res.json())
    .then((data) => options.onSuccess(data as T))
    .catch((err) => options.onError(err))
    .finally(() => options.onFinally?.())
}
```

## Avoiding `any`

### Use `unknown` Instead

```typescript
// ❌ BAD: any disables type checking
function process(data: any) {
  return data.value // No type safety!
}

// ✅ GOOD: unknown requires narrowing
function process(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String((data as { value: unknown }).value)
  }
  throw new Error('Invalid data format')
}
```

### Type Guards

```typescript
// ✅ GOOD: Custom type guard
interface ApiError {
  code: string
  message: string
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as ApiError).code === 'string' &&
    typeof (error as ApiError).message === 'string'
  )
}

// Usage
try {
  await api.call()
} catch (error) {
  if (isApiError(error)) {
    console.log(error.code, error.message) // Type safe!
  }
}
```

### Assertion Functions

```typescript
// ✅ GOOD: Assertion function
function assertNonNull<T>(value: T | null | undefined, message: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message)
  }
}

// Usage
const user: User | null = getUser()
assertNonNull(user, 'User not found')
console.log(user.name) // user is User, not User | null
```

## Vue-Specific Patterns

### Ref Types

```typescript
import { ref, type Ref } from 'vue'

// ✅ GOOD: Explicit ref types
const count = ref<number>(0)
const user = ref<User | null>(null)
const items = ref<Item[]>([])

// For complex types in function returns
function useState(): { value: Ref<User | null> } {
  const value = ref<User | null>(null)
  return { value }
}
```

### Props Types

```typescript
// ✅ GOOD: Interface for props
interface Props {
  id: string
  name: string
  items: Item[]
  onSelect?: (item: Item) => void
  variant?: 'primary' | 'secondary'
}

const props = defineProps<Props>()
```

### Emits Types

```typescript
// ✅ GOOD: Typed emits
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string, oldValue: string): void
  (event: 'submit'): void
}>()
```

## API Response Types

```typescript
// ✅ GOOD: Generic API response
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Usage
async function getUsers(): Promise<ApiResponse<PaginatedResponse<User>>> {
  const response = await api.get('/users')
  return response.data
}
```

## Constants and Enums

```typescript
// ✅ GOOD: const assertions for literal types
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const

type Role = (typeof ROLES)[keyof typeof ROLES]
// Role = 'admin' | 'user' | 'guest'

// ✅ GOOD: String enums (when needed)
enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
}

// ❌ AVOID: Numeric enums (confusing reverse mapping)
enum Status {
  Pending, // 0
  Active, // 1
  Inactive, // 2
}
```

## Anti-Patterns

```typescript
// ❌ BAD: any everywhere
const data: any = await fetch(url)
const result: any = process(data)

// ❌ BAD: Type assertions without validation
const user = data as User // Might not be a User!

// ❌ BAD: Non-null assertion without checking
const name = user!.name // What if user is null?

// ❌ BAD: Implicit any in parameters
function handle(data) {
  // data is implicitly any
  return data.value
}

// ❌ BAD: Object as type
const config: object = { key: 'value' } // Too loose
```
